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
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-nina-red-600">Cantina NINA</h2>
            
            <nav className="hidden md:flex space-x-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      isActive 
                        ? 'bg-nina-red-50 text-nina-red-600' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Sair</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-10">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 w-full transition-colors ${
                isActive 
                  ? 'text-nina-red-600' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
