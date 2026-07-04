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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0f1115] md:p-6 gap-6">
      {/* Sidebar (Desktop only) */}
      <aside className="hidden md:flex w-72 glass-dark shadow-xl shadow-black/50 rounded-3xl p-6 flex-col print:hidden sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
        <div className="mb-8 px-2 flex flex-col gap-1">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nina-red-500 to-red-400 drop-shadow-sm tracking-tight">Cantina Nina</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Painel de Gestão</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold relative overflow-hidden group ${
                  isActive 
                    ? 'bg-gradient-to-r from-nina-red-600 to-nina-red-500 text-white shadow-lg shadow-nina-red-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent hover:border-slate-700'
                }`}
              >
                <div className={`absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out ${isActive ? 'block' : 'hidden'}`}></div>
                <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-nina-red-400 transition-colors'}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-slate-800 pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-300 font-bold border border-transparent hover:border-red-500/30"
            >
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#15181e] md:shadow-xl md:shadow-black/50 md:rounded-3xl p-4 md:p-10 pb-24 md:pb-10 print:p-0 print:shadow-none print:bg-transparent min-h-screen md:min-h-0 border border-white/5 relative z-10">
        {children}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden glass-dark fixed bottom-0 left-0 right-0 flex justify-around p-2 pb-safe z-50 rounded-t-3xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] overflow-x-auto gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[72px] transition-all duration-300 rounded-2xl ${
                isActive 
                  ? 'text-nina-red-400 bg-nina-red-900/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
