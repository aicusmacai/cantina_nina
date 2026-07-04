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
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 shadow-md
                      ${isSelected ? 'bg-nina-red-500 border-nina-red-500 text-white scale-110' : 'border-white/30 bg-black/50 group-hover:border-white/80'}
                    `}>
                      {isSelected && <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-200" />}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col justify-between h-full flex-grow">
                {!imagem_url && (
                  <div className="flex justify-between items-start mb-4">
                    <span className={`font-black text-2xl transition-colors ${isSelected ? 'text-nina-red-400' : 'text-slate-300 group-hover:text-white'}`}>
                      {dia.label}
                    </span>
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300
                      ${isSelected ? 'bg-nina-red-500 border-nina-red-500 text-white scale-110' : 'border-slate-700 bg-slate-800 group-hover:border-nina-red-500/50'}
                    `}>
                      {isSelected && <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-200" />}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-5">
                  {!imagem_url && (
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isSelected ? 'bg-nina-red-900/50 text-nina-red-400' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                      <Utensils size={20} />
                    </div>
                  )}
                  <p className={`text-sm font-medium leading-relaxed mt-1 transition-colors ${isSelected ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {prato}
                  </p>
                </div>

              <div className="mt-auto pt-2 border-t border-white/5">
                {mostrarDescontoItem ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 line-through">R$ {preco.toFixed(2).replace('.', ',')}</span>
                    <span className={`text-lg font-black transition-colors ${isSelected ? 'text-nina-red-400' : 'text-slate-300 group-hover:text-white'}`}>
                      R$ {precoItemDesconto.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ) : (
                  <div className={`text-lg font-black transition-colors ${isSelected ? 'text-nina-red-400' : 'text-slate-300 group-hover:text-white'}`}>
                    R$ {preco.toFixed(2).replace('.', ',')}
                  </div>
                )}
              </div>
            </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
        {/* Elemento decorativo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-nina-red-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center sm:text-left mb-6 sm:mb-0 relative z-10 w-full sm:w-auto">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Total do Pedido
          </p>
          <div className="text-4xl md:text-5xl font-black text-white flex flex-wrap items-baseline justify-center sm:justify-start gap-3">
            <div className="flex items-baseline">
              <span className="text-2xl text-slate-400 font-bold mr-2">R$</span>
              <span className="tabular-nums tracking-tight">{valorComDesconto.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {temDesconto && (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-lg md:text-xl text-slate-500 font-medium line-through">
                  R$ {valorOriginal.toFixed(2).replace('.', ',')}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/30">
                  -{descontoPercentual}% OFF
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            {diasSelecionados.length} {diasSelecionados.length === 1 ? 'dia selecionado' : 'dias selecionados'} na semana
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-col items-center relative z-10">
          <button
            onClick={handleSubmit}
            disabled={diasSelecionados.length === 0 || isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-nina-red-600 to-nina-red-500 hover:from-nina-red-500 hover:to-nina-red-400 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 shadow-lg shadow-nina-red-900/50 hover:shadow-nina-red-500/40 hover:-translate-y-1 active:translate-y-0"
          >
            {isPending ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <ShoppingBag size={24} />
                Confirmar Pedido
              </>
            )}
          </button>
          {error && (
            <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
