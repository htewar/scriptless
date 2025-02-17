import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Script Less",
  description: "Script less automation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
