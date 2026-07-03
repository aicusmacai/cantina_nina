import { createClient } from '@/lib/supabase/server'
import FormularioPedido from './FormularioPedido'
import { Calendar, UtensilsCrossed } from 'lucide-react'

export default async function AlunoDashboard() {
  const supabase = await createClient()

  // Busca o cardápio fixo
  const { data: cardapios } = await supabase
    .from('cardapios')
    .select('*')
    .order('dia_semana', { ascending: true })

  // Busca o nome do usuário
  const { data: { user } } = await supabase.auth.getUser()
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nome_completo')
    .eq('id', user?.id)
    .single()

  const primeiroNome = usuario?.nome_completo?.split(' ')[0] || 'Aluno'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Olá, {primeiroNome}! 👋</h1>
        <p className="text-slate-500">Faça seu pedido para a cantina.</p>
      </div>

      {!cardapios || cardapios.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
          <UtensilsCrossed className="mx-auto text-slate-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Cardápio em construção</h2>
          <p className="text-slate-500">
            O cardápio da cantina está sendo configurado. Volte mais tarde!
          </p>
        </div>
      ) : (
        <FormularioPedido cardapios={cardapios} />
      )}
    </div>
  )
}
