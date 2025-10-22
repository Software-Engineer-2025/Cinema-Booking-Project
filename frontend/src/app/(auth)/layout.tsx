import type { Metadata } from "next";
import { allFontVariables, fonts } from "@/lib/utils/fonts";
import "../globals.css";

import AuthNavbar from "@/components/auth/AuthNavbar";
import Providers from "@/Providers";
import BookingPopUp from "@/components/default/BookingPopUp";

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
      <Providers>
        <body
          className={`${allFontVariables} ${fonts.body.className} antialiased bg-neutral-900`}
          suppressHydrationWarning={true}
        >
          <header className="sticky top-0 z-50">
            <AuthNavbar />
          </header>
          <main>{children}</main>
          <footer></footer>
          <BookingPopUp></BookingPopUp>
        </body>
      </Providers>
    </html>
  );
} 
