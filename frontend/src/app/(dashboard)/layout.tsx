import type { Metadata } from "next";
import { allFontVariables, fonts } from "@/lib/utils/fonts";
import "../globals.css";

import Providers from "@/Providers";
import BookingPopUp from "@/components/default/BookingPopUp";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "sonner";
import DashNavbar from "@/components/dashboard/DashNavBar";

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
            <AuthProvider>
                <header className="sticky top-0 z-50">
                    <DashNavbar />
                </header>
                <main>{children}</main>
                <footer></footer>
                <BookingPopUp></BookingPopUp>
            </AuthProvider>
            <Toaster />
            </body>
        </Providers>
        </html>
    );
}
