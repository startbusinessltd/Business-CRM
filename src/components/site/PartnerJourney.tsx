import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { crmAbsUrl, useCrmAppBase } from "@/lib/crm-parent-bridge";
import {
  PartnerJourneyCtx,
  usePartnerJourney,
  type PartnerJourneyApi,
  type PartnerJourneyStep as Step,
  type PartnerProgramCode as ProgramCode,
} from "@/lib/partner-journey-context";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  splitFullName,
  submitContactLead,
} from "@/lib/contact-lead-api";
import {
  encodeFullHandoffSession,
  encodePartnerHandoffSession,
  isPartnerPortalSession,
  registerPartnerAndSendOtp,
  sendLoginOtpToPhone,
  sendPartnerMobileOtp,
  verifyLoginOtpForPhone,
  verifyPartnerMobileOtp,
} from "@/lib/partner-otp-api";
import {
  EMPTY_LEAD,
  FALLBACK_PLANS,
  INDIAN_STATES,
  LEAD_STORAGE_KEY,
  PARTNER_SUPPORT,
  readStoredLead,
  storePartnerSession,
  readPartnerSession,
  associateOf,
  earningSplit,
  fetchPartnerPlans,
  franchiseOf,
  franchisePackages,
  gstOn,
  inr,
  leadMessage,
  multiplierLabel,
  prettyPhone,
  totalWithGst,
  type FranchisePackage,
  type PartnerLead,
  type PartnerPlan,
} from "@/lib/partner-program";

/* ------------------------------------------------------------------ *
 * Guided partner onboarding.
 *
 * The modal handles only the entry form and the checkout:
 *   details form → (unlocks the /partner page with the full program) →
 *   page CTAs → review → hand-off to secure payment → success.
 * The complete program content (plans, packages, calculations) lives on the
 * /partner page via <ProgramsSection>, revealed once the form is submitted.
 * ------------------------------------------------------------------ */

/** Progress rail — only the entry form step is shown in the modal header. */
const DETAILS_STEP_LABEL = "Your details";

/** Button that opens the guided flow. Use everywhere "Become a Partner" is offered. */
export function PartnerCta({
  label = "Become a Partner",
  className = "btn btn-primary",
  style,
  onClick,
}: {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Extra side-effect for the caller, e.g. closing the mobile nav panel. */
  onClick?: () => void;
}) {
  const { open } = usePartnerJourney();
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {label}
    </button>
  );
}

type Selection = { program: ProgramCode; packageId?: string };

export function PartnerJourneyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [selection, setSelection] = useState<Selection | null>(null);
  const crmBase = useCrmAppBase();

  const open = useCallback((to: Step = "details") => {
    setStep(to);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const openReview = useCallback((program: ProgramCode, packageId?: string) => {
    setSelection({ program, packageId });
    setStep("review");
    setIsOpen(true);
  }, []);
  const api = useMemo<PartnerJourneyApi>(
    () => ({ open, openReview, close }),
    [open, openReview, close],
  );

  // OTP verified and a login session issued → hand it to the CRM sign-in bridge
  // (/auth/partner-handoff), which routes by role: partners → /onboarding/welcome, any other
  // account (CRM/client whose mobile or email was already registered) → its own dashboard.
  // Partners travel slim (fragment stays small); non-partners travel FULL because a CRM session
  // needs fields the slim payload drops (website[], accessModules…).
  // Without a session at all (older backend / storage blocked) fall back to the login page.
  const handleUnlocked = useCallback(() => {
    setIsOpen(false);
    const session = readPartnerSession();
    if (typeof session?.token === "string" && session.token) {
      const encoded = isPartnerPortalSession(session)
        ? encodePartnerHandoffSession(session)
        : encodeFullHandoffSession(session);
      const url = `${crmAbsUrl("/auth/partner-handoff", crmBase)}#session=${encoded}`;
      try {
        (window.top ?? window).location.replace(url);
      } catch {
        window.location.replace(url);
      }
      return;
    }
    const lead = readStoredLead();
    const params = new URLSearchParams({ partner: "1", registered: "1" });
    const email = lead.email?.trim();
    if (email) params.set("email", email);
    window.location.replace(crmAbsUrl(`/auth/login?${params.toString()}`, crmBase));
  }, [crmBase]);

  // The CRM payment page returns to `…/partner?partner=success` — resume on the last step.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("partner") === "success") open("success");
  }, [open]);

  return (
    <PartnerJourneyCtx.Provider value={api}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="pj-overlay" />
          <Dialog.Content
            className={`pj-shell${step === "details" ? " pj-shell--form" : ""}`}
            aria-describedby={undefined}
          >
            <JourneyBody
              step={step}
              selection={selection}
              onUnlocked={handleUnlocked}
              onClose={close}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PartnerJourneyCtx.Provider>
  );
}

function JourneyBody({
  step,
  selection,
  onUnlocked,
  onClose,
}: {
  step: Step;
  selection: Selection | null;
  onUnlocked: () => void;
  onClose: () => void;
}) {
  const [plans, setPlans] = useState<PartnerPlan[]>(FALLBACK_PLANS);
  const [lead, setLead] = useState<PartnerLead>(EMPTY_LEAD);
  const crmBase = useCrmAppBase();

  const associate = associateOf(plans);
  const franchise = franchiseOf(plans);
  const packages = useMemo(() => franchisePackages(franchise), [franchise]);

  useEffect(() => {
    const ac = new AbortController();
    fetchPartnerPlans(ac.signal).then(setPlans);
    return () => ac.abort();
  }, []);

  // Details survive the round-trip to the payment page so the success screen stays personal.
  useEffect(() => {
    setLead(readStoredLead());
  }, []);

  const program = selection?.program ?? null;
  const pkg =
    program === "FRANCHISE" && selection?.packageId
      ? (packages.find((p) => p.id === selection.packageId) ?? null)
      : null;
  const selectedPlan =
    program === "ASSOCIATE" ? associate : program === "FRANCHISE" ? franchise : null;
  const amount = program === "ASSOCIATE" ? associate.joiningFee : (pkg?.amount ?? 0);
  const selectionLabel = selectedPlan
    ? `${selectedPlan.name}${pkg ? ` — ${pkg.label} (${inr(pkg.amount)})` : ""}`
    : undefined;

  const goToPayment = () => {
    const params = new URLSearchParams({
      plan: selectedPlan?.code ?? "",
      amount: String(amount),
    });
    if (pkg) params.set("package", pkg.id);
    if (lead.email) params.set("email", lead.email.trim());

    const session = readPartnerSession();
    // OTP login succeeded → continue into the CRM partner activation / plan flow.
    const path = session?.token
      ? `/auth/partner-activate?${params.toString()}`
      : `/auth/partner-register?${params.toString()}`;
    const url = crmAbsUrl(path, crmBase);

    if (session && window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ action: "PARTNER_LOGIN", payload: session }, "*");
      } catch {
        /* cross-origin parent — fall through to navigation */
      }
    }

    try {
      (window.top ?? window).location.href = url;
    } catch {
      window.location.href = url;
    }
  };

  return (
    <>
      <header className="pj-head">
        <div>
          <p className="pj-kicker">B Soft Partner Program</p>
          <Dialog.Title className="pj-title">{titleFor(step, selectedPlan?.name)}</Dialog.Title>
        </div>
        <Dialog.Close className="pj-close" aria-label="Close">
          ✕
        </Dialog.Close>
      </header>

      {step === "details" ? <ProgressRail /> : null}

      <div className="pj-body">
        {step === "details" ? (
          <DetailsStep lead={lead} setLead={setLead} onDone={onUnlocked} />
        ) : null}

        {step === "review" && selectedPlan ? (
          <ReviewStep
            plan={selectedPlan}
            pkg={pkg}
            amount={amount}
            lead={lead}
            selectionLabel={selectionLabel}
            onBack={onClose}
            onPay={goToPayment}
          />
        ) : null}

        {step === "success" ? (
          <SuccessStep lead={lead} crmBase={crmBase} onClose={onClose} />
        ) : null}
      </div>
    </>
  );
}

function titleFor(step: Step, planName?: string): string {
  switch (step) {
    case "details":
      return "Become a B Soft Partner";
    case "review":
      return planName ? `Review — ${planName}` : "Review and confirm";
    case "success":
      return "Payment complete";
  }
}

/**
 * The lead API forwards raw gateway errors ("Connection refused: /127.0.0.1:8017"), which
 * mean nothing to a visitor. Only pass through short, human-looking messages.
 */
function friendlyError(message: string): string {
  const looksInternal =
    /https?:\/\/|\/\d{1,3}(\.\d{1,3}){3}|:\d{4,5}\b|refused|timeout|exception/i.test(message);
  return looksInternal || message.length > 140 ? "Our servers are busy right now." : message;
}

function ProgressRail() {
  return (
    <div className="pj-rail" role="status" aria-label={DETAILS_STEP_LABEL}>
      <div className="pj-rail__chip">
        <span className="pj-rail__dot" aria-hidden="true" />
        <span className="pj-rail__label">{DETAILS_STEP_LABEL}</span>
      </div>
      <p className="pj-rail__hint">Takes about two minutes</p>
    </div>
  );
}

/* ----------------------------- 01 details + OTP ----------------------------- */

function DetailsStep({
  lead,
  setLead,
  onDone,
}: {
  lead: PartnerLead;
  setLead: (l: PartnerLead) => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"form" | "otp" | "registered">("form");
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerLead, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  /**
   * 'register': fresh sign-up — email-keyed OTP from auth/partner/register.
   * 'phone-login': the mobile already belongs to an account, so the visitor chose "Send OTP &
   * sign in" — phone-keyed LOGIN OTP against that existing account instead of a dead-end error.
   */
  const [otpMode, setOtpMode] = useState<"register" | "phone-login">("register");
  /** Mobile already registered — offer OTP sign-in instead of an error. */
  const [mobileTaken, setMobileTaken] = useState(false);

  useEffect(() => {
    if (phase !== "otp" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, resendIn]);

  const set = (key: keyof PartnerLead) => (value: string) => {
    setLead({ ...lead, [key]: value });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof PartnerLead, string>> = {};
    if (lead.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email.trim()))
      next.email = "Enter a valid email address.";
    if (!isValidIndianMobile(lead.mobile))
      next.mobile = "Enter a valid 10-digit mobile number (starts with 6–9).";
    if (!lead.state) next.state = "Select your state.";
    const hasDistrict = lead.district.trim().length >= 2;
    const hasAddress = lead.address.trim().length >= 5;
    if (!hasDistrict && !hasAddress) {
      next.district = "Enter your district or business address.";
      next.address = "Enter your business address or district.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const persist = () => {
    try {
      sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch {
      /* storage unavailable — the flow still works in-memory */
    }
  };

  const sendOtp = async (): Promise<boolean> => {
    const { firstName, lastName } = splitFullName(lead.fullName);
    const phone = normalizeIndianMobile(lead.mobile);
    const email = lead.email.trim();

    const reg = await registerPartnerAndSendOtp({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      address: lead.address.trim() || lead.district.trim(),
      companyName: lead.companyName.trim(),
      state: lead.state,
      district: lead.district.trim(),
    });

    if (reg.ok) return true;

    // Only "email already exists" means we can OTP an existing account by email.
    // "Mobile number already exists" cannot fall through the same way — that email was never
    // created, so send-mobile-otp would return "User not found".
    const msg = reg.message || "";
    const emailTaken = /email.*(already|exist|registered|duplicate)|(already|exist|registered|duplicate).*email/i.test(
      msg,
    );
    if (emailTaken) {
      const resent = await sendPartnerMobileOtp(email);
      if (resent.ok) return true;
      setApiError(friendlyError(resent.message));
      return false;
    }

    // Mobile already belongs to an account → offer "Send OTP & sign in" for THAT account
    // (phone-keyed login OTP) instead of a dead-end "already registered" error.
    const takenByMobile =
      /(mobile|phone).*?(already|exist|registered|duplicate)|(already|exist|registered|duplicate).*?(mobile|phone)/i.test(
        msg,
      );
    if (takenByMobile) {
      setMobileTaken(true);
      return false;
    }

    setApiError(friendlyError(msg));
    return false;
  };

  /** "Send OTP & sign in" — logs the existing account in via its registered mobile. */
  const handleExistingMobileSignIn = async () => {
    if (submitting) return;
    setApiError(null);
    setSubmitting(true);
    try {
      const res = await sendLoginOtpToPhone(normalizeIndianMobile(lead.mobile));
      if (!res.ok) {
        setApiError(friendlyError(res.message));
        return;
      }
      persist();
      setOtpMode("phone-login");
      setOtp("");
      setOtpError(null);
      setPhase("otp");
      setResendIn(60);
    } catch {
      setApiError("Something went wrong while sending the OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setMobileTaken(false);
    setOtpMode("register");
    if (!validate()) return;

    setSubmitting(true);
    try {
      persist();
      const ok = await sendOtp();
      if (!ok) return;
      setOtp("");
      setOtpError(null);
      setPhase("otp");
      setResendIn(60);
    } catch {
      setApiError("Something went wrong while sending the OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(code)) {
      setOtpError("Enter the 6-digit OTP sent to your mobile.");
      return;
    }

    setSubmitting(true);
    try {
      const verified =
        otpMode === "phone-login"
          ? await verifyLoginOtpForPhone(normalizeIndianMobile(lead.mobile), code)
          : await verifyPartnerMobileOtp(lead.email.trim(), code);
      if (!verified.ok) {
        setOtpError(friendlyError(verified.message) || "Invalid OTP. Please try again.");
        return;
      }

      persist();

      // Only a fresh registration is a new lead; an existing account signing back in is not.
      if (otpMode === "register") {
        const { firstName, lastName } = splitFullName(lead.fullName);
        void submitContactLead({
          firstName,
          lastName,
          workEmail: lead.email.trim(),
          phoneNumber: normalizeIndianMobile(lead.mobile),
          businessName: lead.companyName.trim() || "Not provided",
          message: leadMessage(lead),
        });
      }

      if (verified.session?.token) {
        // Partner OR non-partner: store the session and continue. The CRM hand-off routes by
        // role — partners → /onboarding/welcome, everyone else → their own dashboard — so a
        // CRM/client account signing back in is welcomed, not shown a dead-end error.
        storePartnerSession(verified.session);
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { action: "PARTNER_LOGIN", payload: verified.session },
              "*",
            );
          } catch {
            /* ignore cross-origin */
          }
        }
      }

      // Registration done → success screen, then straight into the CRM
      // (/auth/partner-handoff → /onboarding/welcome; login page only as fallback).
      setPhase("registered");
    } catch {
      setOtpError("Something went wrong while verifying the OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || submitting) return;
    setOtpError(null);
    setApiError(null);
    setSubmitting(true);
    try {
      const res =
        otpMode === "phone-login"
          ? await sendLoginOtpToPhone(normalizeIndianMobile(lead.mobile))
          : await sendPartnerMobileOtp(lead.email.trim());
      if (!res.ok) {
        setOtpError(friendlyError(res.message));
        return;
      }
      setResendIn(60);
      setOtp("");
    } catch {
      setOtpError("Could not resend OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === "registered") {
    return (
      <RegistrationSuccess
        lead={lead}
        onContinue={onDone}
        existingAccount={otpMode === "phone-login"}
      />
    );
  }

  if (phase === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} noValidate>
        <p className="pj-lede">
          Enter the 6-digit OTP sent to <strong>+91 {normalizeIndianMobile(lead.mobile)}</strong>.
        </p>

        <div className="pj-field pj-field--wide">
          <label htmlFor="pj-otp">
            OTP <span className="pj-req">*</span>
          </label>
          <div className={`pj-inputwrap${otpError ? " has-error" : ""}`}>
            <input
              id="pj-otp"
              className="pj-input pj-input--otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              placeholder="Enter 6-digit OTP"
              aria-invalid={otpError ? true : undefined}
              aria-describedby={otpError ? "pj-otp-err" : undefined}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (otpError) setOtpError(null);
              }}
            />
          </div>
          {otpError ? (
            <p className="pj-err" id="pj-otp-err">
              {otpError}
            </p>
          ) : null}
        </div>

        <p className="pj-fineprint" style={{ marginTop: 14 }}>
          Didn’t get the code?{" "}
          {resendIn > 0 ? (
            <span>Resend OTP in {resendIn}s</span>
          ) : (
            <button type="button" className="pj-linkbtn" onClick={handleResend} disabled={submitting}>
              Resend OTP
            </button>
          )}
        </p>

        <div className="pj-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setPhase("form");
              setOtp("");
              setOtpError(null);
              setApiError(null);
              setOtpMode("register");
              setMobileTaken(false);
            }}
            disabled={submitting}
          >
            ← Edit details
          </button>
          <div className="pj-actions__buttons">
            <button type="submit" className="btn btn-primary" disabled={submitting || otp.length !== 6}>
              {submitting ? "Verifying…" : "Verify & continue"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="pj-lede">
        Tell us a little about yourself to explore the right B Soft Partner Program for you.
      </p>

      <div className="pj-grid">
        <Field
          label="Full name"
          required
          value={lead.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
          autoComplete="name"
        />
        <Field
          label="Company name"
          value={lead.companyName}
          onChange={set("companyName")}
          error={errors.companyName}
          autoComplete="organization"
        />
        <Field
          label="Email address"
          required
          type="email"
          value={lead.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          label="Mobile number"
          required
          type="tel"
          inputMode="numeric"
          prefix="+91"
          value={lead.mobile}
          onChange={(v) => set("mobile")(v.replace(/\D/g, "").slice(0, 10))}
          error={errors.mobile}
          autoComplete="tel-national"
        />
        <SelectField
          label="State"
          required
          value={lead.state}
          onChange={set("state")}
          error={errors.state}
          options={INDIAN_STATES as readonly string[]}
        />
        <Field
          label="District"
          value={lead.district}
          onChange={set("district")}
          error={errors.district}
          autoComplete="address-level2"
        />
        <Field
          label="Business address"
          placeholder="Street, area, landmark"
          value={lead.address}
          onChange={set("address")}
          error={errors.address}
          autoComplete="street-address"
          span2
        />
      </div>
      <p className="pj-fineprint" style={{ marginTop: 10 }}>
        Provide district or address (at least one).
      </p>

      {mobileTaken ? (
        <div className="pj-alert" role="alert">
          <strong>This mobile number is already registered.</strong> No problem — we can text a
          one-time password to <strong>+91 {normalizeIndianMobile(lead.mobile)}</strong> and sign
          you straight in.
          <div className="pj-actions__buttons" style={{ marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExistingMobileSignIn}
              disabled={submitting}
            >
              {submitting ? "Sending OTP…" : "Send OTP & sign in →"}
            </button>
          </div>
        </div>
      ) : null}

      {apiError ? (
        <div className="pj-alert" role="alert">
          <strong>Could not send OTP.</strong> {apiError}
        </div>
      ) : null}

      <div className="pj-actions">
        <p className="pj-fineprint">
          We will send a one-time password to your mobile number to verify it.
        </p>
        <div className="pj-actions__buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending OTP…" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------------------- 02 registration successful ---------------------- */

/** Seconds the success screen stays before moving on into the CRM. */
const REGISTERED_REDIRECT_SECONDS = 5;

/**
 * Shown right after OTP verification: registration confirmed, then hand-off to the CRM.
 * With an OTP session → signed in directly on /onboarding/welcome; otherwise → login page.
 */
function RegistrationSuccess({
  lead,
  onContinue,
  existingAccount = false,
}: {
  lead: PartnerLead;
  onContinue: () => void;
  /** True when an already-registered mobile signed in via OTP (no new account was created). */
  existingAccount?: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(REGISTERED_REDIRECT_SECONDS);
  const [signedIn] = useState(() => {
    const session = readPartnerSession();
    return typeof session?.token === "string" && !!session.token;
  });
  /** Non-partner (CRM/client) sign-in → the hand-off opens THEIR dashboard, not partner onboarding. */
  const [partnerAccount] = useState(() => isPartnerPortalSession(readPartnerSession()));
  const destination = partnerAccount ? "partner program" : "dashboard";

  useEffect(() => {
    if (secondsLeft <= 0) {
      onContinue();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, onContinue]);

  return (
    <div className="pj-success">
      <div className="pj-success__mark" aria-hidden="true">
        ✅
      </div>
      <h3 className="pj-success__h">
        {existingAccount ? "Welcome back!" : "Registration successful!"}
      </h3>
      <p className="pj-lede">
        {lead.fullName ? `Welcome, ${lead.fullName}. ` : ""}
        {existingAccount
          ? "Your mobile number is verified and you're signed in to your existing account. "
          : "Your mobile number is verified and your partner account has been created. "}
        {signedIn
          ? partnerAccount
            ? "We're signing you in and opening your partner program — compare Associate vs Franchise and complete payment there."
            : "We're signing you in and opening your dashboard."
          : "Sign in to compare Associate vs Franchise and complete payment."}
      </p>

      <div className="pj-creds">
        <h4 className="pj-h4">Your login details</h4>
        <dl className="pj-dl">
          <div>
            <dt>Name</dt>
            <dd>{lead.fullName || "—"}</dd>
          </div>
          {lead.companyName ? (
            <div>
              <dt>Company</dt>
              <dd>{lead.companyName}</dd>
            </div>
          ) : null}
          <div>
            <dt>Login email</dt>
            <dd className="pj-break">{lead.email || "—"}</dd>
          </div>
          <div>
            <dt>Registered mobile</dt>
            <dd>{lead.mobile ? `+91 ${lead.mobile}` : "—"}</dd>
          </div>
        </dl>
        <p className="pj-fineprint">
          {signedIn
            ? "Save these details — use this email whenever you sign in again, with your password or a one-time code sent to your registered mobile."
            : "Use this email on the login page. You can sign in with your password or a one-time code sent to your registered mobile."}
        </p>
      </div>

      <div className="pj-actions" style={{ justifyContent: "center" }}>
        <div className="pj-actions__buttons">
          <button type="button" className="btn btn-primary" onClick={onContinue}>
            {signedIn ? `Open my ${destination} →` : "Continue to login →"}
          </button>
        </div>
      </div>
      <p className="pj-fineprint" role="status">
        {signedIn
          ? `Opening your ${destination} in ${secondsLeft}s…`
          : `Taking you to the login page in ${secondsLeft}s…`}
      </p>
    </div>
  );
}

/** Registered user's name + details, confirmed above the program comparison. */
function RegisteredBanner({ lead }: { lead: PartnerLead }) {
  const firstName = splitFullName(lead.fullName).firstName;
  return (
    <div className="pj-registered" role="status">
      <span className="pj-registered__tick" aria-hidden="true">
        ✓
      </span>
      <div>
        <p className="pj-registered__title">
          {firstName ? `Welcome, ${firstName} — ` : "Welcome — "}you are registered as a B Soft
          partner
        </p>
        <p className="pj-registered__sub">
          {[
            lead.fullName,
            lead.companyName,
            lead.email,
            lead.mobile ? `+91 ${lead.mobile}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );
}

/* ------------------- the full program (page sections) ------------------- */

/**
 * Marketing site no longer reveals Associate vs Franchise after OTP.
 * Per product flow, plans/calculators/payment are only available after the partner
 * registers, then signs in on the CRM login page → /onboarding/welcome.
 * Kept as a no-op export so existing route imports keep compiling.
 */
export function PartnerProgramsBlock(_props?: { forceShow?: boolean }) {
  return null;
}

/**
 * The complete partner program: both plans with full benefits, the three Franchise
 * packages with their wallet-credit maths, the earning examples, the comparison table
 * and support. Used inside the payment-review modal when a plan is already chosen;
 * the public comparison lives on CRM /onboarding after login.
 */
export function ProgramsSection({
  associate,
  franchise,
  packages,
  lead,
  onPickAssociate,
  onPickPackage,
}: {
  associate: PartnerPlan;
  franchise: PartnerPlan;
  packages: FranchisePackage[];
  lead: PartnerLead;
  onPickAssociate: () => void;
  onPickPackage: (p: FranchisePackage) => void;
}) {
  return (
    <>
      <p className="pj-lede">
        Two ways to partner with B Soft. Everything is on this page — the plans, the packages, the
        money maths — so you can compare and decide.
      </p>

      <DifferenceGlance associate={associate} franchise={franchise} packages={packages} />

      {/* --- Associate --- */}
      <section className="pj-planblock">
        <div className="pj-planblock__head">
          <div>
            <span className="pj-badge">Low entry</span>
            <h3 className="pj-program__name">{associate.name}</h3>
          </div>
          <div className="pj-planblock__price">
            <p className="pj-program__price">{inr(associate.joiningFee)} + GST</p>
            <p className="pj-program__note">
              one-time joining fee · {inr(totalWithGst(associate.joiningFee))} incl. 18% GST
            </p>
          </div>
        </div>
        <p className="pj-program__blurb">
          Start your partnership with B Soft at a low entry cost and get access to the Associate
          Partner program.
        </p>
        <ul className="pj-checks pj-checks--grid">
          {[
            "Low initial investment",
            "Easy onboarding",
            "Full B Soft product access",
            "Dedicated partner support",
            "Sales assistance",
            "Marketing support",
            associate.maxCommissionPct
              ? `Earn up to ${associate.maxCommissionPct}% on every sale you introduce`
              : "Earn on every sale you introduce",
            "Partner resources & training",
          ].map((p) => (
            <li key={p}>
              <span aria-hidden="true" className="pj-check">
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
        <AssociateEarning marginPct={associate.maxCommissionPct ?? 30} />
        <div className="pj-planblock__cta">
          <button type="button" className="btn btn-primary" onClick={onPickAssociate}>
            Become an Associate Partner →
          </button>
          <p className="pj-fineprint">
            Best for individuals, freelancers and consultants who want to start small.
          </p>
        </div>
      </section>

      {/* --- Franchise --- */}
      <section className="pj-planblock pj-planblock--featured">
        <div className="pj-planblock__head">
          <div>
            <span className="pj-badge">Business scale</span>
            <h3 className="pj-program__name">{franchise.name}</h3>
          </div>
          <div className="pj-planblock__price">
            <p className="pj-program__price">{packages.length} packages</p>
            <p className="pj-program__note">
              from {inr(packages[0]?.amount ?? franchise.joiningFee)} + GST
            </p>
          </div>
        </div>
        <p className="pj-program__blurb">
          Become a full B Soft business owner. Your package amount is credited to your business
          wallet <strong>and</strong> B Soft adds a bonus on top — then you sell websites, CRM and
          AI products at your own price and keep the profit.
        </p>

        <h4 className="pj-h4">Choose your package</h4>
        <div className="pj-packages">
          {packages.map((p) => (
            <div key={p.id} className="pj-package">
              <span className="pj-package__label">{p.label}</span>
              <span className="pj-package__amount">{inr(p.amount)}</span>
              <span className="pj-package__note">+ GST · {inr(totalWithGst(p.amount))} total</span>
              <span className="pj-package__wallet">
                Wallet credited <strong>{inr(p.walletValue)}</strong>
                <em>
                  {inr(p.amount)} + {inr(p.bonusValue)} bonus
                </em>
              </span>
              <span className="pj-package__bestfor">{p.bestFor}</span>
              <button
                type="button"
                className="btn btn-primary pj-package__cta"
                onClick={() => onPickPackage(p)}
              >
                Choose {inr(p.amount)} →
              </button>
            </div>
          ))}
        </div>

        <WalletExample packages={packages} />
        <FranchiseEarning walletCost={franchise.websiteCost ?? 1000} packages={packages} />

        <ul className="pj-checks pj-checks--grid" style={{ marginTop: 22 }}>
          {franchise.features.map((f) => (
            <li key={f}>
              <span aria-hidden="true" className="pj-check">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <ComparisonTable associate={associate} franchise={franchise} packages={packages} />

      <SupportBlock lead={lead} />
    </>
  );
}

/**
 * The Associate vs Franchise difference in one glance — joining cost, earning model and
 * who each program is for — shown before the detailed plan blocks and comparison table.
 */
function DifferenceGlance({
  associate,
  franchise,
  packages,
}: {
  associate: PartnerPlan;
  franchise: PartnerPlan;
  packages: FranchisePackage[];
}) {
  const bonus = multiplierLabel(franchise);
  const cols: { name: string; tag: string; rows: [string, string][] }[] = [
    {
      name: associate.name,
      tag: "Low entry · earn per sale",
      rows: [
        ["Join with", `${inr(associate.joiningFee)} + GST — one-time`],
        [
          "You earn",
          associate.maxCommissionPct
            ? `Up to ${associate.maxCommissionPct}% reward on every sale you introduce`
            : "A reward on every sale you introduce",
        ],
        ["Business wallet", "Not needed — B Soft bills the customer"],
        ["Best for", "Individuals, freelancers and consultants starting small"],
      ],
    },
    {
      name: franchise.name,
      tag: "Business scale · own pricing",
      rows: [
        [
          "Join with",
          packages[0]
            ? `A package from ${inr(packages[0].amount)} + GST`
            : `${inr(franchise.joiningFee)} + GST`,
        ],
        ["You earn", "Sell at your own price and keep the full profit"],
        [
          "Business wallet",
          bonus ? `Your package amount + a ${bonus} bonus on top` : "Included with your package",
        ],
        ["Best for", "Agencies and business owners building a full operation"],
      ],
    },
  ];

  return (
    <div className="pj-diff">
      <h4 className="pj-h4">What is the difference?</h4>
      <div className="pj-diff__grid">
        {cols.map((c) => (
          <div key={c.name} className="pj-diff__card">
            <p className="pj-diff__name">{c.name}</p>
            <p className="pj-diff__tag">{c.tag}</p>
            <dl className="pj-dl">
              {c.rows.map(([dt, dd]) => (
                <div key={dt}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The wallet-credit example the sales team quotes: buy the first package and watch the
 * money land — package amount in, bonus on top, total spendable wallet out.
 */
function WalletExample({ packages }: { packages: FranchisePackage[] }) {
  const [pkg, setPkg] = useState<FranchisePackage | null>(null);
  const p = pkg ?? packages[0];
  if (!p) return null;

  return (
    <div className="pj-calc">
      <h4 className="pj-h4">How your wallet is credited</h4>
      <p className="pj-calc__intro">
        Example: you purchase the <strong>{inr(p.amount)}</strong> package — your wallet is credited{" "}
        <strong>{inr(p.walletValue)}</strong> in total.
      </p>

      <div className="pj-flow">
        <FlowRow label="You pay" value={inr(p.amount)} note={`${p.label} (+ GST)`} />
        <FlowArrow />
        <FlowRow
          label="Your package amount is credited"
          value={inr(p.amount)}
          note="goes straight into your business wallet"
        />
        <FlowArrow />
        <FlowRow
          label="B Soft adds a bonus"
          value={`+ ${inr(p.bonusValue)}`}
          note={`${p.multiplier}× your package, on top`}
          accent
        />
        <FlowArrow />
        <FlowRow
          label="Total wallet balance"
          value={inr(p.walletValue)}
          note={`${inr(p.amount)} + ${inr(p.bonusValue)} bonus`}
          strong
        />
      </div>

      <div className="pj-calc__controls">
        <label>
          <span>See the calculation for</span>
          <select
            value={p.id}
            onChange={(e) => setPkg(packages.find((x) => x.id === e.target.value) ?? null)}
            className="pj-input"
          >
            {packages.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label} — {inr(x.amount)}
              </option>
            ))}
          </select>
        </label>
        <div className="pj-calc__hint">
          <p>
            {packages.map((x, i) => (
              <span key={x.id}>
                {i > 0 ? <br /> : null}
                <strong>{inr(x.amount)}</strong> → wallet {inr(x.walletValue)} ({inr(x.amount)} +{" "}
                {inr(x.bonusValue)} bonus)
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({
  associate,
  franchise,
  packages,
}: {
  associate: PartnerPlan;
  franchise: PartnerPlan;
  packages: FranchisePackage[];
}) {
  const bonus = multiplierLabel(franchise);
  const rows: [string, ReactNode, ReactNode][] = [
    ["Joining fee", `${inr(associate.joiningFee)} + GST`, "Package based"],
    ["Entry level", "Low", "Business investment"],
    ["Product access", <Yes key="a" />, <Yes key="b" />],
    ["Partner support", <Yes key="a" />, <Yes key="b" />],
    ["Sales opportunity", <Yes key="a" />, <Yes key="b" />],
    [
      "How you earn",
      associate.maxCommissionPct
        ? `Up to ${associate.maxCommissionPct}% reward`
        : "Reward per sale",
      "Your own selling price",
    ],
    ["Business wallet", "—", bonus ? `Your package + ${bonus} bonus` : "Included"],
    ["Business growth benefits", "Basic", "Advanced"],
    ["Packages", "1", String(packages.length)],
    ["Best for", "Individuals / beginners", "Agencies / business owners"],
  ];

  return (
    <div className="pj-compare">
      <h4 className="pj-h4">Side by side</h4>
      <div className="pj-tablewrap">
        <table className="pj-table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">{associate.name}</th>
              <th scope="col">{franchise.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, a, b]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pj-which">
        <div className="pj-which__card">
          <p className="pj-which__q">Which one is right for me?</p>
          <p>
            <strong>{associate.name}</strong> — best for individuals, freelancers, consultants and
            anyone who wants to start with a low investment.
          </p>
          <p>
            <strong>{franchise.name}</strong> — best for agencies, entrepreneurs and businesses
            looking to build a larger B Soft business opportunity.
          </p>
        </div>
      </div>
    </div>
  );
}

function Yes() {
  return (
    <span className="pj-yes" aria-label="Included">
      ✓
    </span>
  );
}

const PRODUCT_VALUES = [10000, 15000, 25000, 50000];

/**
 * Associate maths: the plan carries a fixed partner margin. The partner chooses how much
 * of it becomes the customer's discount and how much stays as their own benefit — the two
 * always add back up to the margin, so no number on screen is invented.
 */
function AssociateEarning({ marginPct }: { marginPct: number }) {
  const [productValue, setProductValue] = useState(10000);
  // Default to an even split so the first render shows both a real discount and a real benefit.
  const [passOn, setPassOn] = useState(50);
  const s = earningSplit(productValue, marginPct, passOn);
  const margin = Math.round((productValue * marginPct) / 100);

  return (
    <div className="pj-calc">
      <h4 className="pj-h4">How your partnership works</h4>
      <p className="pj-calc__intro">
        Every B Soft plan carries a partner margin of up to {marginPct}%. You decide how much of it
        to pass on as a customer discount, and how much to keep.
      </p>

      <div className="pj-flow">
        <FlowRow label="Product value" value={inr(s.productValue)} note="e.g. a business website" />
        <FlowArrow />
        <FlowRow
          label={`${marginPct}% partner margin`}
          value={inr(margin)}
          note="yours on every sale"
          accent
        />
        <FlowArrow />
        <FlowRow
          label="Client pays"
          value={inr(s.clientPays)}
          note={
            s.customerDiscount > 0
              ? `after a ${inr(s.customerDiscount)} discount`
              : "no discount given"
          }
        />
        <FlowArrow />
        <FlowRow label="Your benefit" value={inr(s.partnerBenefit)} note="straight to you" strong />
      </div>

      <div className="pj-calc__controls">
        <label>
          <span>Product value</span>
          <select
            value={productValue}
            onChange={(e) => setProductValue(Number(e.target.value))}
            className="pj-input"
          >
            {PRODUCT_VALUES.map((v) => (
              <option key={v} value={v}>
                {inr(v)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            Discount you give the client: <strong>{Math.round((marginPct * passOn) / 100)}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={passOn}
            onChange={(e) => setPassOn(Number(e.target.value))}
          />
        </label>
      </div>
      <p className="pj-fineprint">
        Move the slider: give the whole margin away to win the deal, keep it all as your benefit, or
        split it. Discount + benefit always add up to your {inr(margin)} margin.
      </p>
    </div>
  );
}

/**
 * Franchise maths: the partner pays a fixed wallet cost per sale and sets their own price,
 * so the benefit is simply price − wallet cost. The hint shows roughly how many website
 * sales each package's wallet covers.
 */
function FranchiseEarning({
  walletCost,
  packages,
}: {
  walletCost: number;
  packages: FranchisePackage[];
}) {
  const [sellingPrice, setSellingPrice] = useState(10000);
  const benefit = Math.max(0, sellingPrice - walletCost);

  return (
    <div className="pj-calc">
      <h4 className="pj-h4">How you earn as a Franchise Partner</h4>
      <p className="pj-calc__intro">
        You sell at your own price. B Soft takes only a small fixed cost from your business wallet —
        everything above it is yours.
      </p>

      <div className="pj-flow">
        <FlowRow
          label="You sell a website at"
          value={inr(sellingPrice)}
          note="your price, your customer"
        />
        <FlowArrow />
        <FlowRow
          label="Wallet cost"
          value={`− ${inr(walletCost)}`}
          note="taken from your business wallet"
          accent
        />
        <FlowArrow />
        <FlowRow label="Your benefit" value={inr(benefit)} note="straight to you" strong />
      </div>

      <div className="pj-calc__controls">
        <label>
          <span>Your selling price</span>
          <select
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="pj-input"
          >
            {PRODUCT_VALUES.map((v) => (
              <option key={v} value={v}>
                {inr(v)}
              </option>
            ))}
          </select>
        </label>
        <div className="pj-calc__hint">
          <p>
            {packages.map((p, i) => (
              <span key={p.id}>
                {i > 0 ? <br /> : null}
                <strong>{p.label}</strong> wallet covers ~
                {Math.floor(p.walletValue / Math.max(walletCost, 1))} website sales
              </span>
            ))}
          </p>
        </div>
      </div>
      <p className="pj-fineprint">
        Wallet cost shown is the live B Soft rate for a website plan. Other products have their own
        rates, all visible in your partner panel.
      </p>
    </div>
  );
}

function FlowRow({
  label,
  value,
  note,
  accent,
  strong,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={`pj-flow__row${accent ? " is-accent" : ""}${strong ? " is-strong" : ""}`}>
      <div>
        <p className="pj-flow__label">{label}</p>
        <p className="pj-flow__note">{note}</p>
      </div>
      <p className="pj-flow__value">{value}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="pj-flow__arrow" aria-hidden="true">
      ↓
    </div>
  );
}

/* ------------------------- 03 review & pay ------------------------- */

function ReviewStep({
  plan,
  pkg,
  amount,
  lead,
  selectionLabel,
  onBack,
  onPay,
}: {
  plan: PartnerPlan;
  pkg: FranchisePackage | null;
  amount: number;
  lead: PartnerLead;
  selectionLabel?: string;
  onBack: () => void;
  onPay: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <p className="pj-lede">
        Check your selection before you pay. Nothing is charged until you confirm on the secure
        payment page.
      </p>

      <div className="pj-review">
        <div className="pj-review__card">
          <h4 className="pj-h4">Your selection</h4>
          <dl className="pj-dl">
            <div>
              <dt>Program</dt>
              <dd>{plan.name}</dd>
            </div>
            {pkg ? (
              <div>
                <dt>Package</dt>
                <dd>
                  {pkg.label} · {inr(pkg.amount)}
                </dd>
              </div>
            ) : null}
            {pkg ? (
              <div>
                <dt>Wallet credited</dt>
                <dd>
                  {inr(pkg.walletValue)}{" "}
                  <span className="pj-muted">
                    ({inr(pkg.amount)} + {inr(pkg.bonusValue)} bonus)
                  </span>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Amount</dt>
              <dd>{inr(amount)}</dd>
            </div>
            <div>
              <dt>GST (18%)</dt>
              <dd>{inr(gstOn(amount))}</dd>
            </div>
            <div className="pj-dl__total">
              <dt>Total payable</dt>
              <dd>{inr(totalWithGst(amount))}</dd>
            </div>
          </dl>
        </div>

        <div className="pj-review__card">
          <h4 className="pj-h4">Your details</h4>
          <dl className="pj-dl">
            <div>
              <dt>Name</dt>
              <dd>{lead.fullName || "—"}</dd>
            </div>
            <div>
              <dt>Mobile</dt>
              <dd>{lead.mobile ? `+91 ${lead.mobile}` : "—"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd className="pj-break">{lead.email || "—"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                {[lead.address, lead.district, lead.state].filter(Boolean).join(", ") || "—"}
              </dd>
            </div>
            {lead.companyName ? (
              <div>
                <dt>Company</dt>
                <dd>{lead.companyName}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      <SupportBlock selectionLabel={selectionLabel} lead={lead} />

      {confirming ? (
        <div className="pj-confirm" role="alertdialog" aria-label="Confirm payment">
          <p className="pj-confirm__line">
            You are about to pay <strong>{inr(totalWithGst(amount))}</strong> for{" "}
            <strong>{plan.name}</strong>
            {pkg ? ` — ${pkg.label}` : ""}.
          </p>
          <p className="pj-fineprint">
            We will take you to the secure B Soft payment page to complete this.
          </p>
          <div className="pj-actions__buttons">
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Not yet
            </button>
            <button type="button" className="btn btn-primary" onClick={onPay}>
              Pay {inr(totalWithGst(amount))} securely →
            </button>
          </div>
        </div>
      ) : (
        <div className="pj-actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            ← Back to programs
          </button>
          <div className="pj-actions__buttons">
            <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}>
              Proceed to payment →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function SupportBlock({
  selectionLabel,
  lead,
  variant = "modal",
}: {
  selectionLabel?: string;
  lead?: PartnerLead;
  variant?: "modal" | "page";
}) {
  const phone = PARTNER_SUPPORT.phone;
  const whatsapp = PARTNER_SUPPORT.whatsapp;

  const context = [
    "Hi B Soft, I have a question about the Partner Program.",
    selectionLabel ? `I am looking at: ${selectionLabel}.` : null,
    lead?.fullName ? `My name is ${lead.fullName}.` : null,
    lead?.district || lead?.state
      ? `I am from ${[lead?.district, lead?.state].filter(Boolean).join(", ")}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const mailto = `mailto:${PARTNER_SUPPORT.email}?subject=${encodeURIComponent(
    "Partner Program enquiry",
  )}&body=${encodeURIComponent(context)}`;

  return (
    <section className={`pj-support pj-support--${variant}`}>
      <h4 className="pj-h4">Need help before payment?</h4>
      <p className="pj-support__lede">
        Have questions about the Partner Program? Our team is here to help.
      </p>
      <div className="pj-support__grid">
        {phone ? (
          <a className="pj-support__tile" href={`tel:${phone}`}>
            <span className="pj-support__icon" aria-hidden="true">
              📞
            </span>
            <span className="pj-support__title">Call support</span>
            <span className="pj-support__sub">
              Talk to a B Soft partner specialist — {prettyPhone(phone)}
            </span>
          </a>
        ) : (
          <CallbackTile lead={lead} selectionLabel={selectionLabel} />
        )}
        {whatsapp ? (
          <a
            className="pj-support__tile"
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(context)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pj-support__icon" aria-hidden="true">
              💬
            </span>
            <span className="pj-support__title">WhatsApp</span>
            <span className="pj-support__sub">Chat with our team on WhatsApp</span>
          </a>
        ) : null}
        <a className="pj-support__tile" href={mailto}>
          <span className="pj-support__icon" aria-hidden="true">
            ✉️
          </span>
          <span className="pj-support__title">Contact support</span>
          <span className="pj-support__sub">Send us your query at {PARTNER_SUPPORT.email}</span>
        </a>
      </div>
      {selectionLabel ? (
        <p className="pj-fineprint">
          Your details and selected program ({selectionLabel}) travel with your message, so our team
          knows exactly what you are asking about.
        </p>
      ) : null}
    </section>
  );
}

/**
 * Shown when no direct support number is configured: one click books a call-back through
 * the same lead API, using the mobile number the visitor already gave us.
 */
function CallbackTile({ lead, selectionLabel }: { lead?: PartnerLead; selectionLabel?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const requestCallback = async () => {
    if (state === "sending" || state === "sent") return;
    // No mobile yet (landing page, before the form) — fall back to a call-me e-mail.
    if (!lead?.mobile || !isValidIndianMobile(lead.mobile)) {
      window.location.href = `mailto:${PARTNER_SUPPORT.email}?subject=${encodeURIComponent(
        "Call back request — Partner Program",
      )}&body=${encodeURIComponent("Please call me back about the B Soft Partner Program. My number: ")}`;
      return;
    }
    setState("sending");
    const { firstName, lastName } = splitFullName(lead.fullName || "Partner enquiry");
    try {
      const res = await submitContactLead({
        firstName,
        lastName,
        workEmail: lead.email.trim() || PARTNER_SUPPORT.email,
        phoneNumber: normalizeIndianMobile(lead.mobile),
        businessName: lead.companyName.trim() || "Not provided",
        message: `CALL BACK REQUEST — Partner Program.\n${leadMessage(lead, selectionLabel)}`,
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  };

  return (
    <button type="button" className="pj-support__tile" onClick={requestCallback}>
      <span className="pj-support__icon" aria-hidden="true">
        📞
      </span>
      <span className="pj-support__title">
        {state === "sent" ? "Call booked ✓" : "Talk to our team"}
      </span>
      <span className="pj-support__sub">
        {state === "idle" ? "Request a call from a B Soft partner specialist" : null}
        {state === "sending" ? "Booking your call…" : null}
        {state === "sent" ? `We will call you on +91 ${lead?.mobile ?? ""} shortly.` : null}
        {state === "failed"
          ? `Could not book the call — please email ${PARTNER_SUPPORT.email}.`
          : null}
      </span>
    </button>
  );
}

/* ---------------------------- 04 success ---------------------------- */

function SuccessStep({
  lead,
  crmBase,
  onClose,
}: {
  lead: PartnerLead;
  crmBase: string;
  onClose: () => void;
}) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const partnerId = params?.get("partnerId") ?? null;
  const planName = params?.get("plan") ?? null;
  const packageAmount = Number(params?.get("package")?.replace(/^PKG_/, "") ?? "") || null;

  return (
    <div className="pj-success">
      <div className="pj-success__mark" aria-hidden="true">
        🎉
      </div>
      <h3 className="pj-success__h">Welcome to the B Soft Partner Program</h3>
      <p className="pj-lede">
        {lead.fullName ? `${lead.fullName}, your` : "Your"} partner registration has been
        successfully completed.
      </p>

      <dl className="pj-dl pj-dl--success">
        {planName ? (
          <div>
            <dt>Partner program</dt>
            <dd>{planName}</dd>
          </div>
        ) : null}
        {packageAmount ? (
          <div>
            <dt>Selected package</dt>
            <dd>{inr(packageAmount)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Payment status</dt>
          <dd className="pj-ok">Successful</dd>
        </div>
        {partnerId ? (
          <div>
            <dt>Partner ID</dt>
            <dd>{partnerId}</dd>
          </div>
        ) : null}
      </dl>

      <div className="pj-next">
        <h4 className="pj-h4">Next steps</h4>
        <ol className="pj-ol">
          <li>Sign in to your partner dashboard and complete your profile.</li>
          <li>Download your marketing material and price list.</li>
          <li>Add your first customer — your partner manager will walk you through it.</li>
        </ol>
      </div>

      <div className="pj-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
        <div className="pj-actions__buttons">
          <a
            className="btn btn-ghost"
            href={`mailto:${PARTNER_SUPPORT.email}?subject=${encodeURIComponent("Partner support")}`}
          >
            Contact partner support
          </a>
          <a className="btn btn-primary" href={crmAbsUrl("/auth/login", crmBase)} target="_top">
            Go to partner dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- form bits ----------------------------- */

function Field({
  label,
  value,
  onChange,
  error,
  required,
  optional,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  prefix,
  span2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  prefix?: string;
  span2?: boolean;
}) {
  const id = `pj-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className={`pj-field${span2 ? " pj-field--wide" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="pj-req"> *</span> : null}
        {optional ? <span className="pj-opt"> (optional)</span> : null}
      </label>
      <div className={`pj-inputwrap${prefix ? " has-prefix" : ""}${error ? " has-error" : ""}`}>
        {prefix ? <span className="pj-prefix">{prefix}</span> : null}
        <input
          id={id}
          className="pj-input"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error ? (
        <p className="pj-err" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
}) {
  const id = `pj-${label.toLowerCase()}`;
  return (
    <div className="pj-field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="pj-req"> *</span> : null}
      </label>
      <div className={`pj-inputwrap${error ? " has-error" : ""}`}>
        <select
          id={id}
          className="pj-input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select your state</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p className="pj-err" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
