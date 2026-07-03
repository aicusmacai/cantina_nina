import { createClient } from '@/lib/supabase/server'
import { Receipt, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

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
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const statusConfig = getStatusConfig(pedido.status)
            const StatusIcon = statusConfig.icon
            
            const cardContent = (
                <>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Refeições da Cantina
                    </h3>
                    <div className="text-sm text-slate-500 mb-2">
                      Dias: <span className="font-medium text-slate-700">{getDiasTexto(pedido.dias_semana)}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Pedido feito em: {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <span className="font-bold text-lg text-slate-900">
                      R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </div>
                  </div>
                </>
              )
              
              if (pedido.status === 'pendente') {
                return (
                  <Link 
                    href={`/aluno/pagamento/${pedido.id}`}
                    key={pedido.id} 
                    className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={pedido.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {cardContent}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
