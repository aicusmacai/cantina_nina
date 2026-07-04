'use client'

import { useState } from 'react'
import { Check, ShoppingBag, Loader2, Utensils } from 'lucide-react'
import { criarPedido } from '@/app/actions/aluno'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Cardapio = {
  id: string
  dia_semana: number
  prato_principal: string
  acompanhamentos: string
  valor_diario: number
  imagem_url?: string
}

const diasSemanaNomes = [
  { id: 1, label: 'Segunda', short: 'Seg' },
  { id: 2, label: 'Terça', short: 'Ter' },
  { id: 3, label: 'Quarta', short: 'Qua' },
  { id: 4, label: 'Quinta', short: 'Qui' },
  { id: 5, label: 'Sexta', short: 'Sex' },
]

export default function FormularioPedido({ cardapios, descontoPercentual = 0 }: { cardapios: Cardapio[], descontoPercentual?: number }) {
  const router = useRouter()
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([])
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const toggleDia = (diaId: number) => {
    if (diasSelecionados.includes(diaId)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== diaId))
    } else {
      setDiasSelecionados([...diasSelecionados, diaId])
    }
  }

  // Calculate total price by summing the valor_diario of each selected day
  const valorOriginal = diasSelecionados.reduce((total, diaId) => {
    const cardapioDia = cardapios.find(c => c.dia_semana === diaId)
    return total + (cardapioDia ? Number(cardapioDia.valor_diario) : 0)
  }, 0)

  const valorComDesconto = valorOriginal * (1 - descontoPercentual / 100)
  const temDesconto = descontoPercentual > 0 && diasSelecionados.length > 0

  const handleSubmit = async () => {
    if (diasSelecionados.length === 0) {
      setError('Selecione pelo menos um dia da semana')
      return
    }

    setIsPending(true)
    setError('')

    const result = await criarPedido(diasSelecionados, valorComDesconto)
    
    if (result.success && result.pedidoId) {
      router.push(`/aluno/pagamento/${result.pedidoId}`)
    } else {
      setError(result.error || 'Erro ao processar o pedido. Tente novamente.')
      setIsPending(false)
    }
  }

  return (
    <div className="mt-8 glass-dark rounded-3xl p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-nina-red-500/10 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <h3 className="text-2xl font-bold text-white mb-8">Em quais dias você vai comer na cantina?</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 relative z-10">
        {diasSemanaNomes.map((dia) => {
          const isSelected = diasSelecionados.includes(dia.id)
          const cardapioDia = cardapios.find(c => c.dia_semana === dia.id)
          const prato = cardapioDia?.prato_principal || 'Não definido'
          const preco = cardapioDia ? Number(cardapioDia.valor_diario) : 0
          const imagem_url = cardapioDia?.imagem_url
          
          const precoItemDesconto = preco * (1 - descontoPercentual / 100)
          const mostrarDescontoItem = descontoPercentual > 0

          return (
            <motion.button
              key={dia.id}
              onClick={() => toggleDia(dia.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative rounded-3xl border-2 text-left transition-all overflow-hidden flex flex-col group p-0
                ${isSelected 
                  ? 'border-nina-red-500 bg-gradient-to-br from-nina-red-900/40 to-slate-900/60 shadow-lg shadow-nina-red-900/20 neon-border' 
                  : 'border-slate-800 bg-slate-900/40 hover:border-nina-red-500/50 hover:bg-slate-800/60'
                }
              `}
            >
              {imagem_url && (
                <div 
                  className="w-full h-36 bg-cover bg-center border-b border-white/5 relative"
                  style={{ backgroundImage: `url(${imagem_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <span className="font-black text-2xl text-white drop-shadow-lg">
                      {dia.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Checkmark animado */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSelected ? 'bg-nina-red-500 text-white scale-100' : 'bg-stone-100 text-stone-300 scale-90'
              }`}>
                <Check size={14} className="stroke-[3]" />
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-2 ${
                    isSelected ? 'bg-nina-red-100 text-nina-red-700' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {dia.label}
                  </span>
                  <h3 className={`text-xl font-bold line-clamp-2 leading-tight ${
                    isSelected ? 'text-stone-900' : 'text-stone-700'
                  }`}>{prato}</h3>
                </div>
                
                <div className={`flex items-center gap-2 mt-4 font-bold text-lg ${
                  isSelected ? 'text-nina-red-600' : 'text-stone-600'
                }`}>
                  <Utensils size={18} />
                  R$ {preco.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.div 
        className="fixed bottom-[4.5rem] md:bottom-8 left-4 right-4 md:static md:left-auto md:right-auto z-40 md:mt-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className={`glass-sand p-5 md:p-6 rounded-3xl border border-stone-200 shadow-[0_10px_40px_rgba(139,115,85,0.15)] flex flex-row items-center justify-between gap-4 transition-all duration-300 ${
            diasSelecionados.length > 0 ? 'ring-2 ring-nina-red-200' : ''
          }`}>
            
            <div className="flex flex-col">
              <span className="text-stone-500 font-bold text-sm uppercase tracking-wider">Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-black text-stone-900 tracking-tighter">
                  R$ {valorComDesconto.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-stone-400 font-semibold text-xs ml-1 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                  {diasSelecionados.length} dia{diasSelecionados.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || diasSelecionados.length === 0}
              className="bg-gradient-to-r from-nina-red-600 to-nina-red-500 hover:from-nina-red-500 hover:to-nina-red-400 text-white font-black text-sm md:text-base py-3 md:py-4 px-6 md:px-10 rounded-2xl md:rounded-[1.25rem] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Confirmar
                </>
              )}
            </button>
            {error && (
              <p className="text-red-500 text-sm font-medium mt-2 w-full text-center">{error}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
