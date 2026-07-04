import { createClient } from '@/lib/supabase/server'
import { ReceiptText, Search } from 'lucide-react'
import { MotionTr, staggerContainer, fadeItem } from '@/components/Motion'

export default async function AdminPedidosPage() {
  const supabase = await createClient()

  // Buscar todos os pedidos
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select(`
      id,
      status,
      valor_total,
      dias_semana,
      created_at,
      usuarios ( nome_completo, turma )
    `)
    .neq('status', 'pendente')
    .order('created_at', { ascending: false })

  const diasNomes: Record<number, string> = {
    1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex'
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Todos os Pedidos</h1>
          <p className="text-slate-500">Histórico completo de pedidos realizados na cantina.</p>
        </div>
      </div>

      <div className="glass bg-white/60 rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nina-red-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-400 font-black">
                <th className="p-5 pl-6">Data</th>
                <th className="p-5">Nome do Aluno</th>
                <th className="p-5 text-center">Turma</th>
                <th className="p-5">Dias</th>
                <th className="p-5 text-right">Valor</th>
                <th className="p-5 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {pedidos?.map((pedido, index) => (
                <MotionTr 
                  key={pedido.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-slate-100/50 hover:bg-white/80 transition-colors duration-300 group"
                >
                  <td className="p-5 pl-6 text-sm text-slate-500 font-medium">
                    {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-5 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-bold text-xs uppercase shadow-inner group-hover:bg-nina-red-100 group-hover:text-nina-red-600 transition-colors">
                        {((pedido.usuarios as any)?.nome_completo || '?').charAt(0)}
                      </div>
                      {(pedido.usuarios as any)?.nome_completo || 'Aluno Excluído'}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-slate-600 text-center">
                    <span className="bg-slate-100/80 px-3 py-1 rounded-lg font-bold border border-slate-200/50">
                      {(pedido.usuarios as any)?.turma || '-'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-1.5 flex-wrap">
                      {pedido.dias_semana?.map((d: number) => (
                        <span key={d} className="bg-slate-100 text-slate-600 text-xs px-2 py-1.5 rounded-lg font-bold border border-slate-200/50 group-hover:bg-nina-red-50 group-hover:text-nina-red-600 group-hover:border-nina-red-100 transition-colors shadow-sm">
                          {diasNomes[d]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 font-black text-slate-800 text-right">
                    R$ {Number(pedido.valor_total).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-5 pr-6 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border shadow-sm transition-transform group-hover:scale-105 ${
                      pedido.status === 'entregue' ? 'bg-green-50 text-green-600 border-green-200' :
                      pedido.status === 'pago' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      pedido.status === 'cancelado' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {pedido.status}
                    </span>
                  </td>
                </MotionTr>
              ))}

              {!pedidos?.length && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 font-medium bg-white/40">
                    <div className="flex flex-col items-center justify-center">
                      <ReceiptText size={48} className="text-slate-300 mb-3" />
                      Nenhum pedido encontrado.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
