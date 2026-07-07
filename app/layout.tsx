import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A calm, secure command center for ocean freight sales.",
};

// Apply saved theme (dark / compact) before paint to avoid a flash.
const themeScript = `(function(){try{var p=JSON.parse(localStorage.getItem('scc-prefs')||'{}');var c=document.documentElement.classList;if(p.dark)c.add('dark');if(p.compact)c.add('compact');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
