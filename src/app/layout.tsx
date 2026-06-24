import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Frugal Studio | Operational Intelligence Diagnostic",
  description:
    "Identify operational waste, workflow friction, founder dependency, and automation opportunities. A Frugal Studio diagnostic powered by Mindful Tech.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
