'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Utensils, ReceiptText, Settings, LogOut, CheckSquare, User, Users } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/entregas', label: 'Entregas de Hoje', icon: CheckSquare },
    { href: '/admin/cardapios', label: 'Gerenciar Cardápios', icon: Utensils },
    { href: '/admin/usuarios', label: 'Todos os Usuários', icon: Users },
    { href: '/admin/pedidos', label: 'Todos os Pedidos', icon: ReceiptText },
    { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 gap-6">
      {/* Sidebar (Desktop only) */}
      <aside className="hidden md:flex w-64 bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-5 flex-col print:hidden sticky top-6 h-[calc(100vh-3rem)]">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-black text-nina-red-600 tracking-tight">Cantina NINA</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Gestão</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold ${
                  isActive 
                    ? 'bg-nina-red-600 text-white shadow-md shadow-nina-red-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-slate-100 pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-bold"
            >
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white md:shadow-xl md:shadow-slate-200/50 md:rounded-2xl p-4 md:p-8 pb-24 md:pb-8 print:p-0 print:shadow-none print:bg-transparent min-h-screen md:min-h-0">
        {children}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around p-2 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-x-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 p-2 min-w-[64px] transition-colors rounded-xl ${
                isActive 
                  ? 'text-nina-red-600 bg-nina-red-50' 
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon size={22} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] font-bold text-center leading-tight whitespace-nowrap">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
