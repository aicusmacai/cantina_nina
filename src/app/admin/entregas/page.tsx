import { createClient } from '@/lib/supabase/server'
import { Calendar, AlertCircle } from 'lucide-react'
import BotaoEntregar from './BotaoEntregar'
import BotaoImprimir from './BotaoImprimir'
import FiltroDias from './FiltroDias'

export default async function FuncionarioDashboard(
  props: { searchParams: Promise<{ dia?: string }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  // Determinar o fuso horário de Brasília
  const agoraBRT = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  const diaSemanaAtual = agoraBRT.getDay()
  
  // Pegar o dia selecionado via URL ou usar o dia de hoje (Brasília)
  const diaQuery = searchParams.dia
  let diaSemana = diaQuery ? parseInt(diaQuery) : diaSemanaAtual
  
  // Se for fim de semana e não tiver selecionado dia, mostra a segunda-feira por padrão
  if (!diaQuery && (diaSemana === 0 || diaSemana === 6)) {
    diaSemana = 1
  }

  const nomesDias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

  // Buscar todos os pedidos ativos onde o array dias_semana contém o dia selecionado
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select(`
      id,
      status,
      usuarios ( nome_completo, turma, turno )
    `)
    .contains('dias_semana', [diaSemana])
    .eq('status', 'pago')
    .order('created_at', { ascending: true })

  // Buscar o prato do dia selecionado
  const { data: cardapioHoje } = await supabase
    .from('cardapios')
    .select('prato_principal')
    .eq('dia_semana', diaSemana)
    .single()
    
  const pratoHoje = cardapioHoje?.prato_principal || 'Prato não definido'

  return (
    <div className="print:bg-white print:p-0">
      <div className="flex flex-col gap-6 mb-8 print:mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1 print:text-xl">Lista de Entregas</h1>
            <p className="text-slate-500 print:hidden">
              Acompanhe os alunos que devem retirar refeições na cantina.
            </p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <BotaoImprimir />
          </div>
        </div>
        
        <FiltroDias diaAtual={diaSemanaAtual === 0 || diaSemanaAtual === 6 ? 1 : diaSemanaAtual} />
      </div>

      <div className="print:block">
        <h2 className="hidden print:block text-lg font-bold text-slate-800 mb-4 border-b pb-2">Prato do dia: {pratoHoje}</h2>
      </div>

      {diaSemana === 0 || diaSemana === 6 ? (
        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 text-center print:hidden flex flex-col items-center justify-center text-slate-500">
          <Calendar size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Fim de Semana</h2>
          <p className="text-slate-500">A cantina não opera aos fins de semana.</p>
        </div>
      ) : !pedidos || pedidos.length === 0 ? (
        <div className="bg-slate-50/50 p-12 rounded-3xl border border-dashed border-slate-300 text-center print:border-none print:p-0 flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-slate-300 mb-4 print:hidden" />
          <h2 className="text-xl font-bold text-slate-700 mb-2 print:text-base">Nenhuma entrega pendente</h2>
          <p className="text-slate-500 print:hidden max-w-sm">Nenhum aluno agendou refeição para este dia ou todas já foram entregues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:gap-2 print:grid-cols-1">
          {pedidos.map((pedido) => (
            <div 
              key={pedido.id} 
              className="p-6 rounded-2xl border flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white border-slate-200 print:border-b print:border-slate-300 print:rounded-none print:shadow-none print:p-2"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-nina-red-50 text-nina-red-600 flex items-center justify-center shrink-0 font-bold text-lg print:hidden">
                    {((pedido.usuarios as any)?.nome_completo || '?').charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg print:text-base line-clamp-1">
                    {(pedido.usuarios as any)?.nome_completo || 'Aluno Excluído'}
                  </h3>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-slate-500 print:text-slate-700 bg-slate-50 p-3 rounded-xl print:bg-transparent print:p-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Turma</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{(pedido.usuarios as any)?.turma || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center print:hidden">
                    <span className="font-medium text-slate-600">Prato</span>
                    <span className="text-slate-900 line-clamp-1 text-right ml-4">{pratoHoje}</span>
                  </div>
                </div>
              </div>

              <div className="print:hidden mt-auto">
                <BotaoEntregar pedidoId={pedido.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
