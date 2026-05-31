import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Vibe Analytics",
  description: "Learn how Vibe Analytics collects, uses, and secures your business data.",
  openGraph: {
    title: "Privacy Policy | Vibe Analytics",
    description: "Learn how Vibe Analytics collects, uses, and secures your business data.",
  }
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
