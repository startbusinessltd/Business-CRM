import type { LegalSection } from "@/components/site/LegalDocument";
import { CONTACT } from "@/lib/site-content";

/** Legal page structure mirrors Website Admin “Content & legal” in startbusinessltd-ui (`/privacy`, `/terms`, `/refund` slugs in website-admin-section-bundles.forms). */
export const LEGAL_LAST_UPDATED = "28 May 2026";

export const PRIVACY_INTRO =
  "This Privacy Policy describes how Business CRM (“we”, “us”, or “our”) collects, uses, shares, and protects information when you use our website, mobile app, and related services.";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "Information We Collect",
    paragraphs: [
      "We collect information that you provide directly to us, including your name, email address, phone number, and any other information you choose to provide. We also automatically collect certain information about your device when you use our website, including your IP address, browser type, operating system, and browsing behavior.",
    ],
  },
  {
    heading: "How We Use Your Information",
    paragraphs: [
      "We use the information we collect to provide, maintain, and improve our services, to communicate with you, to monitor and analyze trends and usage, to personalize your experience, and to protect against fraudulent or illegal activity. We may also use your information to send you promotional communications, though you can opt out at any time.",
    ],
  },
  {
    heading: "Information Sharing and Disclosure",
    paragraphs: [
      "We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who perform services on our behalf, with your consent, to comply with legal obligations, or to protect our rights and safety. Any third parties we work with are required to maintain the confidentiality of your information.",
    ],
  },
  {
    id: "data-security",
    heading: "Data Security",
    paragraphs: [
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and Tracking Technologies",
    paragraphs: [
      "We use cookies and similar tracking technologies to collect information about your browsing activities. Cookies are small data files stored on your device that help us improve our services and your experience. You can control cookies through your browser settings, though disabling cookies may limit your ability to use certain features of our website.",
    ],
  },
  {
    heading: "Your Rights and Choices",
    paragraphs: [
      "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us. To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.",
    ],
  },
  {
    heading: "Children's Privacy",
    paragraphs: [
      "Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will take steps to delete that information as soon as possible.",
    ],
  },
  {
    heading: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page and updating the effective date. Your continued use of our website after any changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have any questions or concerns about this privacy policy or our data practices, please contact us at ${CONTACT.supportEmail} or visit ${CONTACT.website}, or through the Contact page on this website.`,
      `Registered office: ${CONTACT.office.replace(/\n/g, ", ")}.`,
      "We are committed to addressing your concerns and protecting your privacy.",
    ],
  },
  {
    heading: "Information Collected Through Our Mobile App",
    paragraphs: [
      "We only access the device microphone when necessary to provide specific features of the app. Audio data is processed for functionality purposes and is not stored or shared with third parties unless explicitly stated.",
    ],
  },
];

export const TERMS_INTRO =
  "These Terms of Service apply to your access and use of this website and the Business CRM service. Please read them carefully before you continue.";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "Agreement to Terms",
    paragraphs: [
      "By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.",
    ],
  },
  {
    heading: "Use License",
    paragraphs: [
      "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on our website; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or mirror the materials on any other server.",
    ],
  },
  {
    heading: "Disclaimer",
    paragraphs: [
      "The materials on our website are provided on an “as is” basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    ],
  },
  {
    heading: "Limitations",
    paragraphs: [
      "In no event shall Business CRM or its suppliers be liable for any damages including, without limitation, damages for loss of data or profit, or due to business interruption arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.",
    ],
  },
  {
    heading: "Accuracy of Materials",
    paragraphs: [
      "The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.",
    ],
  },
  {
    heading: "Links",
    paragraphs: [
      "We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user’s own risk.",
    ],
  },
  {
    heading: "Modifications",
    paragraphs: [
      "We may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
    ],
  },
  {
    heading: "Governing Law",
    paragraphs: [
      "These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.",
    ],
  },
];

export const REFUND_INTRO =
  "We strive to ensure your satisfaction with our products and services. If you are not completely satisfied with your purchase, we offer a refund policy subject to the terms and conditions outlined below.";

export const REFUND_SECTIONS: LegalSection[] = [
  {
    heading: "Eligibility for Refunds",
    paragraphs: [
      "Refunds are available for purchases made within the last 7 days. To be eligible for a refund, the product or service must be unused, in its original condition, and accompanied by proof of purchase. Certain products or services may be non-refundable as specified at the time of purchase.",
    ],
  },
  {
    heading: "Refund Process",
    paragraphs: [
      "To request a refund, please contact our customer support team with your order details and reason for the refund. Once your request is received and approved, we will process the refund within 7–10 business days. Refunds will be issued to the original payment method used for the purchase.",
    ],
  },
  {
    heading: "Non-Refundable Items",
    paragraphs: [
      "Certain items and services are non-refundable, including but not limited to: digital downloads after access has been granted, customized or personalized products, services that have been fully rendered, and promotional or discounted items marked as final sale.",
    ],
  },
  {
    heading: "Partial Refunds",
    paragraphs: [
      "In some cases, partial refunds may be granted for products or services that have been partially used or consumed. The amount of the partial refund will be determined on a case-by-case basis and at our sole discretion.",
    ],
  },
  {
    heading: "Exchanges",
    paragraphs: [
      "If you would like to exchange a service for a different item, please contact our customer support team. Exchanges are subject to availability and may require additional payment if the new item is of greater value.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have any questions about our refund policy or need assistance with a refund request, please contact our customer support team at ${CONTACT.supportEmail} or visit ${CONTACT.website}. You can also reach us through the Contact page on this website.`,
    ],
  },
];
