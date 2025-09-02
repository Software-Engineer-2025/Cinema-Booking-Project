import type { Metadata } from "next";
import { allFontVariables, fonts } from "@/lib/utils/fonts";
import "../globals.css";

import Navbar from "@/components/default/Navbar";



export const metadata: Metadata = {
  title: "Cinema",
  description: "The top e-booking movie website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${allFontVariables} ${fonts.body.className} antialiased bg-red-900`}
      >
        <header>
          <Navbar />
        </header>
        <main>
            {children}
        </main>
        <footer>

        </footer>
      </body>
    </html>
  );
}
