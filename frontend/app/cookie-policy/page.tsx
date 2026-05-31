import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | Vibe Analytics",
  description: "Learn how Vibe Analytics uses cookies and tracking technologies.",
  openGraph: {
    title: "Cookie Policy | Vibe Analytics",
    description: "Learn how Vibe Analytics uses cookies and tracking technologies.",
  }
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen font-sans bg-[#02040a] text-zinc-300">
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md border-zinc-800/50 bg-[#02040a]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Cookie className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white">Cookie Policy</h1>
        </div>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">1. What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us understand how you interact with our platform and enable core functionality such as user authentication and security.</p>
          </section>
          
          <section>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">2. How We Use Cookies</h2>
            <p>We use essential cookies strictly for the operation of Vibe Analytics, including maintaining your secure session, load balancing, and persisting your dark/light mode preferences. We do not use third-party tracking cookies for targeted advertising.</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Authentication Cookies:</strong> Required to keep you securely logged into your tenant.</li>
              <li><strong>Security Cookies:</strong> Used to detect and mitigate malicious activity, such as CSRF or XSS attacks.</li>
              <li><strong>Preference Cookies:</strong> Used to remember your dashboard layout and UI state (e.g., Theme preference).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">4. Managing Your Preferences</h2>
            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept essential cookies, you will not be able to log into the Vibe Analytics platform.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
