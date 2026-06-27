import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Frugality Scanner | Frugal Studio powered by Mindful Tech Automations",
  description:
    "A 10-minute diagnostic to spot the hidden leaks draining your business. Identify workflow friction, revenue leakage, founder dependency, and automation opportunities.",
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
