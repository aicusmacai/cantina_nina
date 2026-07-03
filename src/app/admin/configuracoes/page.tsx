import { createClient } from '@/lib/supabase/server'
import { salvarConfiguracoes } from '@/app/actions/admin'
import { Save } from 'lucide-react'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()

  // Buscar configurações atuais
  const { data: config } = await supabase
    .from('configuracoes')
    .select('*')
    .limit(1)
    .single()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Configurações do Sistema</h1>
        <p className="text-slate-500">Ajuste os parâmetros gerais da cantina.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
        <form action={salvarConfiguracoes} className="space-y-6">
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
              className="flex items-center gap-2 px-6 py-2 bg-nina-red-600 text-white font-medium rounded-lg hover:bg-nina-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nina-red-500 transition-colors"
            >
              <Save size={18} />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
