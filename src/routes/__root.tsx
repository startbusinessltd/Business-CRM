import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="container-x" style={{ paddingBlock: 120, textAlign: "center" }}>
      <div className="num-tag">404</div>
      <h1 className="h-display" style={{ marginTop: 12 }}>Page not found</h1>
      <p className="lead" style={{ margin: "16px auto 28px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Return home</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="container-x" style={{ paddingBlock: 120, textAlign: "center" }}>
      <h1 className="h-section">This page didn't load</h1>
      <p className="lead" style={{ margin: "16px auto 28px" }}>
        Something went wrong on our end. Try refreshing or head home.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn btn-primary">Try again</button>
        <a href="/" className="btn btn-ghost">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StartBusiness.ltd — Run Your Entire Business Smarter" },
      { name: "description", content: "All-in-one CRM with 6 modules and 30+ AI-powered features: websites, leads, calls, social, employees and finance — one professional workspace." },
      { name: "author", content: "StartBusiness.ltd" },
      { property: "og:title", content: "StartBusiness.ltd — One Platform to Run Your Business" },
      { property: "og:description", content: "Six modules, thirty plus AI features, one professional workspace for modern teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
