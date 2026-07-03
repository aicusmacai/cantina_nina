'use client'

import { useActionState } from 'react'
import { criarCardapio } from '@/app/actions/admin'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const initialState = { error: '' }

export default function NovoCardapioPage() {
  const [state, formAction, isPending] = useActionState(criarCardapio, initialState)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/cardapios" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Novo Cardápio Semanal</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="data_inicio_semana" className="block text-sm font-medium text-slate-700 mb-1">
              Semana (Selecione a Segunda-feira)
            </label>
            <input
              type="date"
              id="data_inicio_semana"
              name="data_inicio_semana"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Este cardápio valerá para a semana toda a partir desta data.</p>
          </div>

          <div>
            <label htmlFor="prato_principal" className="block text-sm font-medium text-slate-700 mb-1">
              Prato Principal
            </label>
            <input
              type="text"
              id="prato_principal"
              name="prato_principal"
              required
              placeholder="Ex: Strogonoff de Frango"
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="acompanhamentos" className="block text-sm font-medium text-slate-700 mb-1">
              Acompanhamentos
            </label>
            <input
              type="text"
              id="acompanhamentos"
              name="acompanhamentos"
              placeholder="Ex: Arroz, feijão e batata palha"
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="imagem_url" className="block text-sm font-medium text-slate-700 mb-1">
              URL da Foto (Opcional)
            </label>
            <input
              type="url"
              id="imagem_url"
              name="imagem_url"
              placeholder="https://exemplo.com/foto.jpg"
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Cole o link de uma imagem para ilustrar o cardápio.</p>
          </div>

          <div>
            <label htmlFor="valor_diario" className="block text-sm font-medium text-slate-700 mb-1">
              Valor Diário (R$)
            </label>
            <input
              type="number"
              id="valor_diario"
              name="valor_diario"
              step="0.01"
              min="0"
              required
              defaultValue="15.00"
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
            />
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100">
              {state.error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/admin/cardapios"
              className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-nina-red-600 text-white font-medium rounded-lg hover:bg-nina-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nina-red-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isPending ? 'Salvando...' : 'Salvar Cardápio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
