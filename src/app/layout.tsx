import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RemindFlow — Never Chase a Late Payment Again",
  description: "Automated payment reminders that sound human. Connect your invoices, set your schedule, and watch late payments disappear. Join the waitlist for early access.",
  keywords: ["invoice follow-up", "freelancer tools", "payment reminders", "get paid faster", "invoice automation", "freelance invoicing"],
  openGraph: {
    title: "RemindFlow — Never Chase a Late Payment Again",
    description: "Automated payment reminders for freelancers. Get paid 3x faster without the awkward conversations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemindFlow — Never Chase a Late Payment Again",
    description: "Automated payment reminders for freelancers. Get paid 3x faster.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
