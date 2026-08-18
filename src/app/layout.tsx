import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneDeck",
  description: "Control your Mac from your phone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
  data-scroll-behavior="smooth"
  className="h-full antialiased"
>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
