'use client'

import { useState } from 'react'
import { Check, ShoppingBag, Loader2, Utensils } from 'lucide-react'
import { criarPedido } from '@/app/actions/aluno'
import { useRouter } from 'next/navigation'

type Cardapio = {
  id: string
  dia_semana: number
  prato_principal: string
  acompanhamentos: string
  valor_diario: number
}

const diasSemanaNomes = [
  { id: 1, label: 'Segunda', short: 'Seg' },
  { id: 2, label: 'Terça', short: 'Ter' },
  { id: 3, label: 'Quarta', short: 'Qua' },
  { id: 4, label: 'Quinta', short: 'Qui' },
  { id: 5, label: 'Sexta', short: 'Sex' },
]

export default function FormularioPedido({ cardapios }: { cardapios: Cardapio[] }) {
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
  const valorTotal = diasSelecionados.reduce((total, diaId) => {
    const cardapioDia = cardapios.find(c => c.dia_semana === diaId)
    return total + (cardapioDia ? Number(cardapioDia.valor_diario) : 0)
  }, 0)

  const handleSubmit = async () => {
    if (diasSelecionados.length === 0) {
      setError('Selecione pelo menos um dia da semana')
      return
    }

    setIsPending(true)
    setError('')

    const result = await criarPedido(diasSelecionados, valorTotal)
    
    if (result.success && result.pedidoId) {
      router.push(`/aluno/pagamento/${result.pedidoId}`)
    } else {
      setError(result.error || 'Erro ao processar o pedido. Tente novamente.')
      setIsPending(false)
    }
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Em quais dias você vai comer na cantina?</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {diasSemanaNomes.map((dia) => {
          const isSelected = diasSelecionados.includes(dia.id)
          const cardapioDia = cardapios.find(c => c.dia_semana === dia.id)
          const prato = cardapioDia?.prato_principal || 'Não definido'
          const preco = cardapioDia ? Number(cardapioDia.valor_diario) : 0

          return (
            <button
              key={dia.id}
              onClick={() => toggleDia(dia.id)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden flex flex-col justify-between
                ${isSelected 
                  ? 'border-nina-red-500 bg-nina-red-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold text-lg ${isSelected ? 'text-nina-red-700' : 'text-slate-700'}`}>
                  {dia.label}
                </span>
                <div className={`
                  w-6 h-6 rounded-full border flex items-center justify-center shrink-0
                  ${isSelected ? 'bg-nina-red-500 border-nina-red-500 text-white' : 'border-slate-300'}
                `}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              <div className="flex items-start gap-2 mb-3">
                <Utensils size={16} className={`shrink-0 mt-1 ${isSelected ? 'text-nina-red-500' : 'text-slate-400'}`} />
                <p className={`text-sm font-medium ${isSelected ? 'text-nina-red-900' : 'text-slate-600'}`}>
                  {prato}
                </p>
              </div>

              <div className={`mt-auto text-sm font-bold ${isSelected ? 'text-nina-red-600' : 'text-slate-500'}`}>
                R$ {preco.toFixed(2).replace('.', ',')}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Total do Pedido
          </p>
          <div className="text-4xl font-black text-slate-900">
            <span className="text-2xl text-slate-400 font-bold mr-1">R$</span>
            {valorTotal.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {diasSelecionados.length} {diasSelecionados.length === 1 ? 'dia selecionado' : 'dias selecionados'}
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-col items-center">
          <button
            onClick={handleSubmit}
            disabled={diasSelecionados.length === 0 || isPending}
            className="w-full sm:w-auto bg-nina-red-600 hover:bg-nina-red-700 text-white font-bold py-4 px-10 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-nina-red-600 flex items-center justify-center gap-2 shadow-lg shadow-nina-red-200"
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
