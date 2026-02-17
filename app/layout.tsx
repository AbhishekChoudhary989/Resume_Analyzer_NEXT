import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Resume Analyzer",
    description: "Analyze and optimize your resume with AI",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* Security Policy (Optional but good practice) */}
            <meta
                httpEquiv="Content-Security-Policy"
                content="default-src 'self' http://localhost:3000 http://localhost:5000; connect-src 'self' http://localhost:3000 http://localhost:5000; img-src 'self' data: blob: http://localhost:3000 http://localhost:5000; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
            />
        </head>
        <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Wrap children with the client-side logic */}
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
        </body>
        </html>
    );
}