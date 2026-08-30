import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "./providers/QueryClientProvider";
import { Navbar } from "./components/layout/Navbar";
import { MobileNav } from "./components/layout/MobileNav";
import { Footer } from "./components/layout/Footer";
import { ToastContainer } from "./components/ui/ToastContainer";
import { WalletModal } from "./components/wallet/WalletModal";
import { StellarWalletKitProvider } from "./providers/StellarWalletKitProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LumenLock v2 — Decentralized Escrow Marketplace on Stellar Soroban",
  description:
    "Trustless peer-to-peer commerce and service agreements secured by Soroban smart contract escrows with bilateral confirmation and milestone payouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <QueryClientProvider>
          <StellarWalletKitProvider>
            <Navbar />
            <main className="flex-1 w-full pb-20 md:pb-8">{children}</main>
            <Footer />
            <MobileNav />
            <ToastContainer />
            <WalletModal />
          </StellarWalletKitProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
