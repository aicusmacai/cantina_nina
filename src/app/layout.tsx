import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        {/* Navbar Simples */}
        <header className="bg-nina-red-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">NINA</h1>
            <nav className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
              Cantina Escolar
            </nav>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Cantina NINA. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
