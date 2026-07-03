import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { gerarPixParaPedido } from '@/app/actions/pagamento'
import ClientPagamento from './ClientPagamento'

export default async function PagamentoPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const pedidoId = params.id
  const supabase = await createClient()

  // Buscar pedido
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('status, valor_total')
    .eq('id', pedidoId)
    .single()

  if (!pedido) {
    redirect('/aluno')
  }

  // Se já estiver pago, vai pros pedidos
  if (pedido.status === 'pago') {
    redirect('/aluno/pedidos')
  }

  // Buscar se já tem um pagamento pendente gerado
  const { data: pagamentoExistente } = await supabase
    .from('pagamentos')
    .select('*')
    .eq('pedido_id', pedidoId)
    .eq('status', 'pendente')
    .single()

  let qrCode = pagamentoExistente?.qr_code
  let qrCodeBase64 = pagamentoExistente?.qr_code_base64
  let transacaoId = pagamentoExistente?.transacao_id

  // Se não tem pagamento pendente no banco, gera um novo via API do MP
  if (!qrCode || !qrCodeBase64) {
    const result = await gerarPixParaPedido(pedidoId)
    if (result.success) {
      qrCode = result.qrCode
      qrCodeBase64 = result.qrCodeBase64
      transacaoId = result.transacaoId
    } else {
      return (
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Erro ao gerar Pix</h2>
          <p>{result.error}</p>
        </div>
      )
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <ClientPagamento 
        pedidoId={pedidoId}
        transacaoId={transacaoId}
        qrCode={qrCode}
        qrCodeBase64={qrCodeBase64}
        valor={pedido.valor_total}
      />
    </div>
  )
}
