import { createClient } from '@/lib/supabase/server'
import { DollarSign, ShoppingBag, Users } from 'lucide-react'

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

  const pedidosPendentes = pedidosData?.filter((p) => p.status === 'pendente').length || 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Visão Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Alunos</p>
            <p className="text-2xl font-bold text-slate-900">{usuariosCount || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-nina-red-50 text-nina-red-600 p-4 rounded-full">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pedidos Pendentes</p>
            <p className="text-2xl font-bold text-slate-900">{pedidosPendentes}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-nina-green/10 text-nina-green p-4 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Faturamento (Pagos)</p>
            <p className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamento)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

