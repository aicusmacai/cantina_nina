import { createClient } from '@/lib/supabase/server'
import { Flame, Star, Gift, Trophy } from 'lucide-react'

export default async function ClubeNinaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*')
    .eq('usuario_id', user?.id)
    .in('status', ['pago', 'entregue'])

  // Calculate Loyalty Points: 5 points per order
  const pedidosPagos = pedidos || []
  const pontos = pedidosPagos.length * 5
  const pontosParaRecompensa = 100
  const progresso = Math.min(100, (pontos / pontosParaRecompensa) * 100)
  const nivel = Math.floor(pontos / 50) + 1

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight flex items-center justify-center gap-3">
          Clube Nina <Flame className="text-nina-red-500 w-8 h-8 md:w-10 md:h-10" />
        </h1>
        <p className="text-stone-500 font-medium">Seu programa de fidelidade. Coma bem e ganhe recompensas!</p>
      </div>

      <div className="glass-sand rounded-3xl p-8 relative overflow-hidden border border-nina-red-200 shadow-[0_10px_40px_rgba(225,29,72,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nina-red-100 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60 -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nina-red-100 to-white flex items-center justify-center mb-6 shadow-soft-warm border-4 border-white">
            <Trophy className="w-10 h-10 text-nina-red-500 drop-shadow-sm" />
          </div>
          
          <h2 className="text-2xl font-black text-stone-900 mb-1">Nível {nivel}</h2>


          <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden shadow-inner border border-stone-200/50 mb-4 relative">
            <div 
              className="bg-gradient-to-r from-nina-red-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: `${progresso}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-sm font-bold text-stone-600">
            <span>{pontos} PTS</span>
            <span>{pontosParaRecompensa} PTS</span>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-200/50 w-full flex flex-col items-center">
            {pontos >= pontosParaRecompensa ? (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
                  <Gift size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Recompensa Desbloqueada!</h3>
                <p className="text-stone-500">Apresente-se na cantina para retirar sua refeição grátis. Aproveite!</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-stone-700 font-bold mb-1">
                  Faltam apenas <span className="text-nina-red-600 font-black text-xl">{pontosParaRecompensa - pontos}</span> pontos!
                </p>
                <p className="text-stone-500 text-sm">Cada refeição comprada vale 5 pontos.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-soft-warm flex items-start gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
            <Star size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">Como Funciona?</h4>
            <p className="text-sm text-stone-500">Ao realizar qualquer pedido e ter o pagamento confirmado, você acumula automaticamente 5 pontos na sua conta.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-soft-warm flex items-start gap-4 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl shrink-0">
            <Gift size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">A Recompensa</h4>
            <p className="text-sm text-stone-500">Acumule 100 pontos e ganhe uma refeição totalmente de graça em qualquer dia da semana na Cantina Nina!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
