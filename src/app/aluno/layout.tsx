'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ReceiptText, LogOut, UserCircle, Home, Flame } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/aluno', label: 'Início', icon: Home },
    { href: '/aluno/pedidos', label: 'Meus Pedidos', icon: ReceiptText },
    { href: '/aluno/clube', label: 'Clube Nina', icon: Flame },
    { href: '/aluno/perfil', label: 'Meu Perfil', icon: UserCircle },
  ]

  return (
    <div className="min-h-screen bg-pattern-warm pb-20 md:pb-0 relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-stone-100/30 blur-3xl -z-10 pointer-events-none rounded-b-[100%]"></div>
      
      {/* Desktop/Tablet Header */}
      <header className="glass-sand sticky top-0 z-20 shadow-soft-warm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-nina-red-600 to-red-400 drop-shadow-sm tracking-tight text-2xl hidden md:inline-block">
              Cantina Nina
            </span>
            
            <nav className="hidden md:flex space-x-2">
              {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold ${
                      isActive 
                        ? 'bg-nina-red-50 text-nina-red-600 border border-nina-red-100' 
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/50'
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
              className="flex items-center gap-2 text-stone-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-all duration-300 border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Sair</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-6 md:py-8 px-4 max-w-4xl mx-auto min-h-[calc(100vh-160px)]">
        {children}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden glass-sand fixed bottom-0 left-0 right-0 flex justify-around p-2 pb-safe z-50 rounded-t-3xl border-t border-stone-200/50 shadow-[0_-8px_30px_rgba(139,115,85,0.1)] overflow-x-auto gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[72px] transition-all duration-300 rounded-2xl ${
                isActive 
                  ? 'text-nina-red-600 bg-nina-red-50 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'
              }`}
            >
              <Icon size={22} className={isActive ? 'scale-110 drop-shadow-sm transition-transform text-nina-red-500' : ''} />
              <span className="text-[10px] font-bold text-center leading-tight whitespace-nowrap">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
