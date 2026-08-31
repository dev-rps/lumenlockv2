import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "./providers/QueryClientProvider";
import { Navbar } from "./components/layout/Navbar";
import { MobileNav } from "./components/layout/MobileNav";
import { Footer } from "./components/layout/Footer";
import { ToastContainer } from "./components/ui/ToastContainer";
import { WalletModal } from "./components/wallet/WalletModal";
import { StellarWalletKitProvider } from "./providers/StellarWalletKitProvider";
import { FeedbackFAB } from "./components/feedback/FeedbackFAB";
import { AuthSessionProvider } from "./providers/AuthSessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "LumenLock v2 — Decentralized Escrow Marketplace on Stellar Soroban",
  description:
    "Trustless peer-to-peer commerce and service agreements secured by Soroban smart contract escrows with bilateral confirmation, milestone payouts, and monitoring.",
  keywords: [
    "Stellar",
    "Soroban",
    "Smart Contract",
    "Escrow",
    "Web3",
    "Decentralized Marketplace",
    "Milestone Payments",
    "XLM",
    "USDC",
  ],
  authors: [{ name: "LumenLock Architecture Team" }],
  openGraph: {
    title: "LumenLock v2 — Decentralized Escrow Marketplace on Stellar Soroban",
    description:
      "Trustless P2P commerce & milestone escrow agreements secured by Soroban smart contracts.",
    url: "https://lumenlock.app",
    siteName: "LumenLock v2",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LumenLock v2 — Stellar Soroban Escrow Protocol",
    description:
      "Trustless peer-to-peer commerce secured by Soroban smart contract escrows.",
  },
  metadataBase: new URL("https://lumenlock.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <QueryClientProvider>
          <StellarWalletKitProvider>
            <AuthSessionProvider />
            <Navbar />
            <main className="flex-1 w-full pb-12 md:pb-4">{children}</main>
            <Footer />
            <MobileNav />
            <ToastContainer />
            <WalletModal />
            <FeedbackFAB />
          </StellarWalletKitProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
