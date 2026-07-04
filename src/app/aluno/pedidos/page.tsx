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
      <h1 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3 tracking-tight">
        <Receipt className="text-nina-red-500 w-8 h-8" />
        Meus Pedidos
      </h1>

      {(!pedidos || pedidos.length === 0) ? (
        <div className="glass-sand p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px]">
          <Receipt className="text-stone-300 w-16 h-16 mb-4" />
          <p className="text-xl font-semibold text-stone-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const statusConfig = getStatusConfig(pedido.status)
            const StatusIcon = statusConfig.icon
            
            const cardContent = (
                <div className="w-full relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-stone-800 text-lg tracking-tight">Refeições da Cantina</h3>
                    {pedido.status === 'pendente' && (
                      <BotaoCancelarPedido pedidoId={pedido.id} />
                    )}
                  </div>
                  <div className="text-sm font-medium text-stone-500 mb-3 bg-stone-50 inline-block px-3 py-1.5 rounded-lg border border-stone-200/50">
                    <span className="text-stone-400">Dias:</span> <span className="text-stone-700">{getDiasTexto(pedido.dias_semana)}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 pt-4 border-t border-stone-100">
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      Criado em {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                        pedido.status === 'pendente' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        pedido.status === 'pago' ? 'text-green-700 bg-green-50 border-green-200' :
                        pedido.status === 'entregue' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        'text-stone-600 bg-stone-100 border-stone-200'
                      }`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </div>
                      <span className="font-black text-xl text-stone-900">
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
                    className="block bg-white/90 p-6 rounded-3xl flex flex-col justify-between gap-4 hover:shadow-soft-warm transition-all duration-300 cursor-pointer relative overflow-hidden group border border-amber-200 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-500"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-100 rounded-full blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={pedido.id} className="bg-white/90 border border-stone-200/50 p-6 rounded-3xl flex flex-col justify-between gap-4 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${pedido.status === 'pago' || pedido.status === 'entregue' ? 'bg-gradient-to-b from-green-400 to-green-500' : 'bg-stone-300'}`}></div>
                  {cardContent}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
