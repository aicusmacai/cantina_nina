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
    .select('valor_total, status, dias_semana, created_at')

  const faturamento = pedidosData
    ?.filter((p) => p.status === 'pago' || p.status === 'entregue')
    .reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0

  // Obter o início da semana (Segunda-feira)
  const agora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  const startOfWeek = new Date(agora)
  const diaSemana = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1) // ajusta se for domingo
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  // Calcular pedidos da semana por dia
  const chartData = [0, 0, 0, 0, 0] // Seg, Ter, Qua, Qui, Sex
  pedidosData?.forEach(p => {
    if ((p.status === 'pago' || p.status === 'entregue') && new Date(p.created_at) >= startOfWeek) {
      if (Array.isArray(p.dias_semana)) {
        p.dias_semana.forEach(dia => {
          if (dia >= 1 && dia <= 5) {
            chartData[dia - 1]++
          }
        })
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Visão Geral</h1>
        <p className="text-stone-500 mt-1">Bem-vindo ao centro de comando da cantina.</p>
      </div>
      
      <MotionDiv 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/usuarios" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-white to-stone-100 border border-stone-200/60 rounded-3xl p-8 shadow-soft-warm relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-stone-200/50">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-stone-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-stone-200/50 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-stone-500 font-bold tracking-wider text-xs uppercase mb-2">Total de Alunos</p>
                  <p className="text-5xl font-black tracking-tighter text-stone-800">{usuariosCount || 0}</p>
                </div>
                <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/50 shadow-sm">
                  <Users size={32} className="text-stone-600 group-hover:text-nina-red-500 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>

        <MotionDiv variants={slideUpItem}>
          <Link href="/admin/pedidos" className="block cursor-pointer">
            <div className="bg-gradient-to-br from-nina-red-50 to-white border border-nina-red-100 rounded-3xl p-8 shadow-soft-warm relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-nina-red-100">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-nina-red-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-nina-red-200/50 transition-colors"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-nina-red-600 font-bold tracking-wider text-xs uppercase mb-2">Faturamento (Geral)</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter text-nina-red-950">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamento)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl hidden sm:block border border-nina-red-100 shadow-sm">
                  <DollarSign size={32} className="text-nina-red-500 group-hover:text-nina-red-600 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        </MotionDiv>
      </MotionDiv>

      <MotionDiv variants={slideUpItem} initial="hidden" animate="show" className="pt-4">
        <div className="glass-sand p-6 md:p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-stone-800 tracking-tight">Vendas da Semana</h2>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-200/50">
              <span className="w-3 h-3 rounded-full bg-nina-red-500"></span>
              <span className="text-sm font-bold text-stone-600">Refeições Agendadas</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 md:gap-6 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-b border-stone-200/50 z-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-stone-200/50 h-0"></div>
              ))}
            </div>

            {/* Bars */}
            {[1, 2, 3, 4, 5].map((dia, idx) => {
              // Now using real data calculated in the server component
              const maxVal = Math.max(...chartData, 1) // Prevent division by 0
              const heightPercentage = (chartData[idx] / maxVal) * 100
              const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
              
              return (
                <div key={dia} className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="w-full max-w-[3rem] relative flex items-end justify-center h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-stone-800 text-xs font-bold px-2 py-1 rounded-lg pointer-events-none border border-stone-200 shadow-md whitespace-nowrap">
                      {chartData[idx]} refeições
                    </div>
                    {/* Bar Fill */}
                    <div 
                      className="w-full bg-gradient-to-t from-nina-red-400 to-nina-red-500 rounded-t-xl shadow-sm transition-all duration-700 ease-out group-hover:to-nina-red-400 group-hover:shadow-md" 
                      style={{ height: `${Math.max(heightPercentage, 2)}%`, minHeight: '4px' }}
                    ></div>
                  </div>
                  <span className="text-stone-500 font-bold mt-4 text-xs md:text-sm uppercase tracking-wider">{dias[idx]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </MotionDiv>
    </div>
  )
}

