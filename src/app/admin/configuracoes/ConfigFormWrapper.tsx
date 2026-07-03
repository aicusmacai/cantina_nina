'use client'

import { useState } from 'react'
import { salvarConfiguracoes } from '@/app/actions/admin'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ConfigFormWrapper({ config }: { config: any }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await salvarConfiguracoes(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Configurações salvas com sucesso!')
        router.refresh()
      }
    } catch (error) {
      toast.error('Erro inesperado ao salvar.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={config?.id || 1} />
      
      <div>
        <label htmlFor="preco_padrao" className="block text-sm font-medium text-slate-700 mb-1">
          Preço Padrão do Prato (R$)
        </label>
        <input
          type="number"
          id="preco_padrao"
          name="preco_padrao"
          step="0.01"
          min="0"
          required
          defaultValue={config?.preco_padrao || 15.00}
          className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Este valor será sugerido ao criar novos cardápios.</p>
      </div>

      <div>
        <label htmlFor="horario_limite_pedido" className="block text-sm font-medium text-slate-700 mb-1">
          Horário Limite para Pedidos
        </label>
        <input
          type="time"
          id="horario_limite_pedido"
          name="horario_limite_pedido"
          required
          defaultValue={config?.horario_limite_pedido || '08:00'}
          className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Até que horas do dia anterior ou do próprio dia o aluno pode fazer/cancelar o pedido.</p>
      </div>

      <div>
        <label htmlFor="dias_antecedencia" className="block text-sm font-medium text-slate-700 mb-1">
          Dias de Antecedência
        </label>
        <input
          type="number"
          id="dias_antecedencia"
          name="dias_antecedencia"
          min="0"
          required
          defaultValue={config?.dias_antecedencia || 1}
          className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Quantos dias de antecedência para o limite de horário. (1 = dia anterior, 0 = no mesmo dia).</p>
      </div>

      <div className="pt-4 border-t border-slate-100"></div>

      <div>
        <label htmlFor="desconto_professor_percentual" className="block text-sm font-medium text-slate-700 mb-1">
          Desconto para Professores e Funcionários (%)
        </label>
        <input
          type="number"
          id="desconto_professor_percentual"
          name="desconto_professor_percentual"
          step="0.01"
          min="0"
          max="100"
          required
          defaultValue={config?.desconto_professor_percentual || 0}
          className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-nina-red-500 focus:border-nina-red-500 sm:text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Porcentagem de desconto aplicada automaticamente nos pedidos de professores.</p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2 bg-nina-red-600 text-white font-medium rounded-lg hover:bg-nina-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nina-red-500 transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isPending ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </form>
  )
}
