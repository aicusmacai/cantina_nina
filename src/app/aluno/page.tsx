import { createClient } from '@/lib/supabase/server'
import FormularioPedido from './FormularioPedido'
import { UtensilsCrossed, Sparkles } from 'lucide-react'

export default async function AlunoDashboard() {
  const supabase = await createClient()

  // Busca o usuário logado primeiro para usar o ID
  const { data: { user } } = await supabase.auth.getUser()

  // Executar todas as queries em paralelo para melhorar muito a velocidade (Performance fix)
  const [
    { data: cardapios },
    { data: usuario },
    { data: config }
  ] = await Promise.all([
    supabase.from('cardapios').select('*').order('dia_semana', { ascending: true }),
    supabase.from('usuarios').select('nome_completo, turma').eq('id', user?.id).single(),
    supabase.from('configuracoes').select('desconto_professor_percentual').single()
  ])

  const primeiroNome = usuario?.nome_completo?.split(' ')[0] || 'Aluno'
  const isProfessor = usuario?.turma === 'Professor / Funcionário' || usuario?.turma === 'Professor'
    
  const descontoPercentual = isProfessor ? (config?.desconto_professor_percentual || 0) : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-sand p-8 md:p-10 rounded-[2rem] shadow-soft-warm relative overflow-hidden border border-stone-200/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nina-red-100 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60 -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-stone-200 shadow-sm mb-4">
            <Sparkles className="text-orange-400 w-4 h-4" />
            <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">Bem-vindo à Cantina</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-2">
            Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-nina-red-600 to-orange-500">{primeiroNome}</span>! 👋
          </h1>
          <p className="text-stone-500 text-lg font-medium max-w-xl">
            O que vamos comer hoje? Agende suas refeições da semana e evite filas.
          </p>
        </div>
      </div>

      {!cardapios || cardapios.length === 0 ? (
        <div className="bg-white/80 p-12 rounded-[2rem] shadow-sm border border-stone-100 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <UtensilsCrossed className="text-stone-400" size={40} />
          </div>
          <h2 className="text-2xl font-black text-stone-800 mb-2">Cardápio em construção</h2>
          <p className="text-stone-500 font-medium max-w-sm">
            Nossa equipe ainda está preparando as delícias desta semana. Volte daqui a pouco!
          </p>
        </div>
      ) : (
        <FormularioPedido cardapios={cardapios} descontoPercentual={descontoPercentual} />
      )}
    </div>
  )
}
