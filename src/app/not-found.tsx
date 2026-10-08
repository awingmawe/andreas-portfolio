import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";

// Without this route Next's built-in 404 inherits the root metadata wholesale,
// including `canonical: "/"` — so every mistyped or retired URL would
// canonicalise itself to the homepage.
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for is not here.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

// Rendered with the normal header and footer: on its own the page had no
// navigation and left a blank white band below the cream panel.
export default function NotFound() {
  return (
    <>
      <Header variant="solid" />
      <main className="bg-cream-2 min-h-[60vh] flex items-center">
        <div className="container py-section-y">
          <p className="text-eyebrow uppercase text-gold tabular">404</p>
          <h1 className="mt-6 font-serif text-display-md md:text-[3rem] text-navy leading-[1.05] tracking-[-0.015em] max-w-[18ch]">
            That page is not here.
          </h1>
          <p className="mt-8 max-w-prose text-body-lg text-slate">
            The link may be out of date, or the page may have moved. You can start again from the
            homepage, or write directly if you were looking for something specific.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy font-medium">
            <Link href="/" className="link-underline link-underline-out">
              Back to the homepage
            </Link>
            <Link href="/experiences" className="link-underline link-underline-out">
              Explore experiences
            </Link>
            <Link href="/contact" className="link-underline link-underline-out">
              Contact
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
