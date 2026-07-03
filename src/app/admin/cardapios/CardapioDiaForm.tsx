'use client'

import { useState } from 'react'
import { atualizarCardapioDia } from '@/app/actions/cardapio'
import { Loader2, Save, Edit2 } from 'lucide-react'

type Cardapio = {
  dia_semana: number
  prato_principal: string
  acompanhamentos: string
  valor_diario: number
}

export default function CardapioDiaForm({ cardapio, nomeDia }: { cardapio: Cardapio, nomeDia: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  
  const [prato, setPrato] = useState(cardapio.prato_principal)
  const [acompanhamentos, setAcompanhamentos] = useState(cardapio.acompanhamentos || '')
  const [valor, setValor] = useState(cardapio.valor_diario.toString())

  const handleSave = async () => {
    setIsPending(true)
    const result = await atualizarCardapioDia(
      cardapio.dia_semana,
      prato,
      acompanhamentos,
      parseFloat(valor)
    )
    setIsPending(false)
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isEditing ? 'bg-white shadow-lg border-nina-red-200 ring-4 ring-nina-red-50' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-800">{nomeDia}</h3>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-nina-red-600 hover:bg-nina-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Edit2 size={16} /> Editar
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prato Principal</label>
          {isEditing ? (
            <input 
              value={prato}
              onChange={(e) => setPrato(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 outline-none text-slate-900 bg-white" 
            />
          ) : (
            <p className="text-slate-900 font-medium">{cardapio.prato_principal}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Acompanhamentos</label>
          {isEditing ? (
            <input 
              value={acompanhamentos}
              onChange={(e) => setAcompanhamentos(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 outline-none text-sm text-slate-900 bg-white" 
              placeholder="Ex: Arroz, Feijão, Salada"
            />
          ) : (
            <p className="text-slate-600 text-sm">{cardapio.acompanhamentos || 'Nenhum'}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor (R$)</label>
          {isEditing ? (
            <input 
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 outline-none text-slate-900 bg-white" 
            />
          ) : (
            <p className="text-slate-900 font-bold text-lg">
              R$ {Number(cardapio.valor_diario).toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
        
        {isEditing && (
          <div className="pt-2 flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 bg-nina-red-600 hover:bg-nina-red-700 text-white font-medium py-2 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Dia
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
