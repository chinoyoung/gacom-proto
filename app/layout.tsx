import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoAbroad Prototype",
  description: "Study abroad program listings prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0875A7", // cobalt-300
          colorPrimaryOffset: "#0A5E85", // cobalt-500
          colorText: "#171717",
          colorBackground: "#ffffff",
          colorDanger: "#DC625A", // roman-500
          colorSuccess: "#68AF74", // fern-500
          colorWarning: "#FAA929", // sun-500
          fontFamily: "var(--font-geist-sans), sans-serif",
          borderRadius: "0.5rem",
        },
        elements: {
          cardBox: "shadow-xl border border-gray-100/50",
          card: "rounded-2xl",
          formButtonPrimary:
            "bg-cobalt-500 hover:bg-cobalt-600 shadow-sm border-0 font-semibold transition-all",
          socialButtonsBlockButton:
            "border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-700",
          footerActionLink: "text-cobalt-600 hover:text-cobalt-700 font-medium",
          headerTitle: "text-2xl font-bold text-gray-900",
          headerSubtitle: "text-gray-500",
          dividerLine: "bg-gray-100",
          dividerText: "text-gray-400 font-medium",
          formFieldLabel: "text-gray-700 font-medium",
          formFieldInput:
            "border-gray-200 focus:border-cobalt-500 focus:ring-cobalt-500 transition-shadow rounded-lg",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <Header />
            {children}
            <Footer />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
