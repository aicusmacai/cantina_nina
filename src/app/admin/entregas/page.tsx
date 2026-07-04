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

      <div className="hidden print:flex flex-col items-center justify-center border-b border-black border-dashed pb-2 mb-2 text-center">
        <h2 className="font-bold text-lg uppercase">CANTINA NINA</h2>
        <div className="text-sm font-bold mt-1">LISTA DE ENTREGAS</div>
        <div className="text-xs mt-1">Dia: {agoraBRT.toLocaleDateString('pt-BR')}</div>
        <div className="text-xs mt-1 font-bold">Prato: {pratoHoje}</div>
      </div>

      {diaSemana === 0 || diaSemana === 6 ? (
        <div className="glass p-10 rounded-3xl text-center print:hidden flex flex-col items-center justify-center text-slate-500">
          <Calendar size={48} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Fim de Semana</h2>
          <p className="text-slate-500">A cantina não opera aos fins de semana.</p>
        </div>
      ) : !pedidos || pedidos.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center print:border-none print:p-0 flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-slate-300 mb-4 print:hidden" />
          <h2 className="text-xl font-bold text-slate-700 mb-2 print:text-sm">Nenhuma entrega pendente</h2>
          <p className="text-slate-500 print:hidden max-w-sm">Nenhum aluno agendou refeição para este dia ou todas já foram entregues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:gap-1 print:grid-cols-1 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nina-red-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>
          {pedidos.map((pedido) => (
            <div 
              key={pedido.id} 
              className="glass bg-white/60 p-6 rounded-3xl flex flex-col justify-between gap-6 hover:bg-white/90 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 print:border-b print:border-black print:border-dashed print:rounded-none print:shadow-none print:p-2 print:gap-1 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-nina-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 print:mb-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-white shadow-inner border border-slate-200/50 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xl uppercase group-hover:from-nina-red-50 group-hover:to-white group-hover:text-nina-red-600 transition-all duration-300 print:hidden">
                    {((pedido.usuarios as any)?.nome_completo || '?').charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg print:text-sm uppercase print:leading-tight">
                    {(pedido.usuarios as any)?.nome_completo || 'Aluno Excluído'}
                  </h3>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-slate-500 print:text-xs print:text-black bg-slate-50/50 p-4 rounded-2xl print:bg-transparent print:p-0 print:gap-0 border border-slate-100/50">
                  <div className="flex justify-between items-center print:justify-start print:gap-2">
                    <span className="font-semibold text-slate-500 print:hidden">Turma</span>
                    <span className="hidden print:inline font-bold">Turma:</span>
                    <span className="font-bold text-slate-700 bg-white shadow-sm px-3 py-1 rounded-lg border border-slate-200/50 print:border-none print:bg-transparent print:px-0 print:text-black">{(pedido.usuarios as any)?.turma || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center print:hidden">
                    <span className="font-semibold text-slate-500">Prato</span>
                    <span className="text-slate-800 font-medium line-clamp-1 text-right ml-4">{pratoHoje}</span>
                  </div>
                </div>
              </div>

              <div className="print:hidden mt-auto relative z-10">
                <BotaoEntregar pedidoId={pedido.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
