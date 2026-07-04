import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cantina Nina",
  description: "Sistema de pedidos para a cantina Nina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-pattern-warm text-stone-800 antialiased min-h-screen select-none`}>
        <NextTopLoader color="#e3a74f" showSpinner={false} height={4} />
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
