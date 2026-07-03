import { createClient } from '@/lib/supabase/server'
import { DollarSign, ShoppingBag, Users } from 'lucide-react'
import Link from 'next/link'
import { MotionDiv, staggerContainer, slideUpItem } from '@/components/Motion'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Buscar estatísticas básicas
  const { count: usuariosCount } = await supabase
    .from('usuarios')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'aluno')

  const { data: pedidosData } = await supabase
    .from('pedidos')
    .select('valor_total, status')

  const faturamento = pedidosData
    ?.filter((p) => p.status === 'pago' || p.status === 'entregue')
    .reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Bem-vindo ao painel de gestão da cantina.</p>
      </div>
      
      <MotionDiv 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/usuarios" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium tracking-wide text-sm uppercase mb-2">Total de Alunos</p>
                  <p className="text-5xl font-black tracking-tighter">{usuariosCount || 0}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <Users size={32} className="text-white" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>

        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/pedidos" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-nina-red-600 to-orange-500 rounded-3xl p-8 shadow-xl shadow-nina-red-900/20 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-nina-red-100 font-medium tracking-wide text-sm uppercase mb-2">Faturamento (Pagos)</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamento)}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl hidden sm:block">
                  <DollarSign size={32} className="text-white" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>
      </MotionDiv>
    </div>
  )
}

