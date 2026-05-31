import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Vibe Analytics",
  description: "Read the Terms of Service governing your use of the Vibe Analytics platform.",
  openGraph: {
    title: "Terms of Service | Vibe Analytics",
    description: "Read the Terms of Service governing your use of the Vibe Analytics platform.",
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
