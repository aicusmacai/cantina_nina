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
    { href: '/aluno', label: 'Simular Pedido (Aluno)', icon: User },
    { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md rounded-xl p-4 flex flex-col print:hidden">
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold text-slate-800">Painel Admin</h2>
          <p className="text-sm text-slate-500">Gestão NINA</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-nina-red-50 text-nina-red-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-slate-200 pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
            >
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-md rounded-xl p-6 md:p-8 print:p-0 print:shadow-none print:bg-transparent">
        {children}
      </main>
    </div>
  )
}
