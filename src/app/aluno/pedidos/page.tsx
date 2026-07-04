import { createClient } from '@/lib/supabase/server'
import { Receipt, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import BotaoCancelarPedido from './BotaoCancelarPedido'

export default async function MeusPedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select(`
      *
    `)
    .eq('usuario_id', user?.id)
    .neq('status', 'cancelado')
    .order('created_at', { ascending: false })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente': return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock, label: 'Aguardando Pagamento' }
      case 'pago': return { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle2, label: 'Pago' }
      case 'cancelado': return { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: 'Cancelado' }
      case 'entregue': return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle2, label: 'Entregue' }
      default: return { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: Clock, label: status }
    }
  }

  const getDiasTexto = (dias: number[]) => {
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    return dias.map(d => nomes[d]).join(', ')
  }

  // Calculate Loyalty Points
  const pedidosPagos = pedidos?.filter(p => p.status === 'pago' || p.status === 'entregue') || []
  const pontos = pedidosPagos.length * 10
  const pontosParaRecompensa = 100
  const progresso = Math.min(100, (pontos / pontosParaRecompensa) * 100)

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-6 flex items-center gap-3 tracking-tight">
        <Receipt className="text-nina-red-500 w-8 h-8" />
        Meus Pedidos
      </h1>

      {/* Banner de Fidelidade */}
      <div className="mb-8 glass-dark rounded-3xl p-6 relative overflow-hidden border border-nina-red-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-nina-red-500/20 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              Clube Nina <span className="text-2xl">🔥</span>
            </h3>
            <p className="text-slate-400 text-sm">Coma bem e ganhe refeições grátis!</p>
          </div>
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
              <span>{pontos} pts</span>
              <span>{pontosParaRecompensa} pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-nina-red-600 to-orange-500 h-3 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
            <p className="text-xs text-nina-red-400 font-medium mt-2 text-right">
              {pontos >= pontosParaRecompensa ? 'Você ganhou uma refeição grátis! 🎉' : `Faltam ${pontosParaRecompensa - pontos} pontos para sua recompensa!`}
            </p>
          </div>
        </div>
      </div>

      {(!pedidos || pedidos.length === 0) ? (
        <div className="glass-dark p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px]">
          <Receipt className="text-slate-700 w-16 h-16 mb-4" />
          <p className="text-xl font-semibold text-slate-400">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const statusConfig = getStatusConfig(pedido.status)
            const StatusIcon = statusConfig.icon
            
            const cardContent = (
                <div className="w-full relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-100 text-lg tracking-tight">Refeições da Cantina</h3>
                    {pedido.status === 'pendente' && (
                      <BotaoCancelarPedido pedidoId={pedido.id} />
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-400 mb-3 bg-slate-900/50 inline-block px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-slate-500">Dias:</span> <span className="text-slate-200">{getDiasTexto(pedido.dias_semana)}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 pt-4 border-t border-slate-700/50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Criado em {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                        pedido.status === 'pendente' ? 'text-amber-400 bg-amber-950/50 border-amber-500/20' :
                        pedido.status === 'pago' ? 'text-green-400 bg-green-950/50 border-green-500/20' :
                        pedido.status === 'entregue' ? 'text-blue-400 bg-blue-950/50 border-blue-500/20' :
                        'text-slate-400 bg-slate-900 border-slate-700'
                      }`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </div>
                      <span className="font-black text-xl text-white">
                        R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              )
              
              if (pedido.status === 'pendente') {
                return (
                  <Link 
                    href={`/aluno/pagamento/${pedido.id}`}
                    key={pedido.id} 
                    className="block glass-card p-6 rounded-3xl flex flex-col justify-between gap-4 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 cursor-pointer relative overflow-hidden group border border-amber-500/30 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={pedido.id} className="glass-card p-6 rounded-3xl flex flex-col justify-between gap-4 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${pedido.status === 'pago' || pedido.status === 'entregue' ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-slate-600'}`}></div>
                  {cardContent}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
