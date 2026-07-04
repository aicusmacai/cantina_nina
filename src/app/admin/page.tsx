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
        <h1 className="text-3xl font-black text-white tracking-tight">Visão Geral</h1>
        <p className="text-slate-400 mt-1">Bem-vindo ao centro de comando da cantina.</p>
      </div>
      
      <MotionDiv 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/usuarios" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 shadow-xl shadow-black/40 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-bold tracking-wider text-xs uppercase mb-2">Total de Alunos</p>
                  <p className="text-5xl font-black tracking-tighter text-slate-100">{usuariosCount || 0}</p>
                </div>
                <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
                  <Users size={32} className="text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>

        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/pedidos" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-nina-red-900/80 to-slate-900 border border-nina-red-500/30 rounded-3xl p-8 shadow-xl shadow-nina-red-900/20 text-white relative overflow-hidden group transition-all hover:scale-[1.02] neon-border">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-nina-red-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-nina-red-500/30 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-nina-red-300 font-bold tracking-wider text-xs uppercase mb-2">Faturamento (Pagos)</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamento)}
                  </p>
                </div>
                <div className="bg-nina-red-950/50 backdrop-blur-md p-4 rounded-2xl hidden sm:block border border-nina-red-500/20">
                  <DollarSign size={32} className="text-nina-red-400 group-hover:text-nina-red-300 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>
      </MotionDiv>

      <MotionDiv variants={slideUpItem} initial="hidden" animate="show" className="pt-4">
        <div className="glass-dark border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-xl shadow-black/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Vendas por Dia da Semana</h2>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-nina-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              <span className="text-sm font-semibold text-slate-400">Pedidos Pagos</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 md:gap-6 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-700/50 z-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-slate-800/50 h-0"></div>
              ))}
            </div>

            {/* Bars */}
            {[1, 2, 3, 4, 5].map((dia, idx) => {
              // Simulating data since we don't have a complex query ready
              const mockData = [25, 45, 30, 60, 50]
              const maxVal = Math.max(...mockData)
              const heightPercentage = (mockData[idx] / maxVal) * 100
              const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
              
              return (
                <div key={dia} className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="w-full max-w-[3rem] relative flex items-end justify-center h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg pointer-events-none border border-slate-700 shadow-lg whitespace-nowrap">
                      {mockData[idx]} pedidos
                    </div>
                    {/* Bar Fill */}
                    <div 
                      className="w-full bg-gradient-to-t from-nina-red-700 to-nina-red-500 rounded-t-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-700 ease-out group-hover:to-nina-red-400 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                      style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                    ></div>
                  </div>
                  <span className="text-slate-400 font-bold mt-4 text-xs md:text-sm uppercase tracking-wider">{dias[idx]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </MotionDiv>
    </div>
  )
}

