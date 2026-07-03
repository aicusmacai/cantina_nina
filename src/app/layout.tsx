import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cantina NINA",
  description: "Sistema de pedidos para a cantina NINA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 select-none`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
