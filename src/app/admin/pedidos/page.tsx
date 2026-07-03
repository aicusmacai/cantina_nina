import { createClient } from '@/lib/supabase/server'
import { ReceiptText, Search } from 'lucide-react'

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
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Todos os Pedidos</h1>
          <p className="text-slate-500">Histórico completo de pedidos realizados na cantina.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Data</th>
                <th className="p-4">Aluno</th>
                <th className="p-4">Turma</th>
                <th className="p-4">Dias Escolhidos</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pedidos?.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 font-medium text-slate-900">
                    {pedido.usuarios?.nome_completo}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {pedido.usuarios?.turma || '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {pedido.dias_semana?.map((d: number) => (
                        <span key={d} className="bg-nina-red-50 text-nina-red-700 text-xs px-2 py-1 rounded-md font-semibold">
                          {diasNomes[d]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    R$ {Number(pedido.valor_total).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pedido.status === 'entregue' ? 'bg-green-100 text-green-800' :
                      pedido.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}

              {!pedidos?.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum pedido encontrado.
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
