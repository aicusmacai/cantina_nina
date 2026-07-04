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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Receipt className="text-nina-red-600" />
        Meus Pedidos
      </h1>

      {(!pedidos || pedidos.length === 0) ? (
        <div className="glass p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px]">
          <Receipt className="text-slate-300 w-16 h-16 mb-4" />
          <p className="text-xl font-semibold text-slate-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const statusConfig = getStatusConfig(pedido.status)
            const StatusIcon = statusConfig.icon
            
            const cardContent = (
                <div className="w-full relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">Refeições da Cantina</h3>
                    {pedido.status === 'pendente' && (
                      <BotaoCancelarPedido pedidoId={pedido.id} />
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-500 mb-3 bg-slate-100/50 inline-block px-3 py-1.5 rounded-lg border border-slate-200/50">
                    <span className="text-slate-400">Dias:</span> <span className="text-slate-700">{getDiasTexto(pedido.dias_semana)}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 pt-4 border-t border-slate-100/80">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Criado em {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </div>
                      <span className="font-black text-xl text-slate-900">
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
                    className="block glass bg-white/60 p-6 rounded-3xl flex flex-col justify-between gap-4 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300 cursor-pointer relative overflow-hidden group border border-amber-200/50 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-300 to-amber-500"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={pedido.id} className="glass bg-white/60 p-6 rounded-3xl flex flex-col justify-between gap-4 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${pedido.status === 'pago' ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-slate-300'}`}></div>
                  {cardContent}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
