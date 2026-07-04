'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ReceiptText, LogOut, UserCircle } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/aluno', label: 'Cardápio', icon: Utensils },
    { href: '/aluno/pedidos', label: 'Meus Pedidos', icon: ReceiptText },
    { href: '/aluno/perfil', label: 'Meu Perfil', icon: UserCircle },
  ]

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {/* Top Navigation */}
      <header className="glass sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nina-red-500 to-red-400 drop-shadow-sm">
              Cantina NINA
            </h2>
            
            <nav className="hidden md:flex space-x-2">
              {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-semibold relative overflow-hidden ${
                      isActive 
                        ? 'text-nina-red-400 bg-nina-red-900/30 shadow-sm border border-nina-red-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-nina-red-500' : ''} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-300 text-sm font-semibold"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Sair</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 py-8 relative z-10 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden glass fixed bottom-0 left-0 right-0 flex justify-around p-2 pb-safe z-30 rounded-t-3xl border-t border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-3 w-full transition-all duration-300 rounded-2xl ${
                isActive 
                  ? 'text-nina-red-400 bg-nina-red-900/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={24} className={isActive ? 'scale-110 transition-transform text-nina-red-500' : ''} />
              <span className="text-[10px] font-bold">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
