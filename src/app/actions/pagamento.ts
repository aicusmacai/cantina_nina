'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function gerarPixParaPedido(pedidoId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autenticado', success: false }

    // 1. Buscar detalhes do pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select('*, usuarios(email)')
      .eq('id', pedidoId)
      .single()

    if (pedidoError || !pedido) {
      return { error: 'Pedido não encontrado', success: false }
    }

    if (pedido.status === 'pago') {
      return { error: 'Pedido já está pago', success: false }
    }

    // 2. Chamar a API do Mercado Pago
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!mpToken || mpToken === 'seu_access_token_aqui') {
      return { error: 'Chave do Mercado Pago não configurada no servidor', success: false }
    }

    const payload = {
      transaction_amount: Number(pedido.valor_total),
      description: 'Cantina Nina - Pedido Semanal',
      payment_method_id: 'pix',
      payer: {
        email: (pedido.usuarios?.email || user.email).replace('.local', '.com'),
        first_name: 'Cantina',
        last_name: 'Nina'
      },
      // Aqui entraria o notification_url apontando para o nosso webhook quando o site estiver online
      // notification_url: 'https://seusite.com/api/webhooks/mp'
    }

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpToken}`,
        'X-Idempotency-Key': `${pedidoId}-${Date.now()}`
      },
      body: JSON.stringify(payload)
    })

    const rawResponse = await mpResponse.text()
    let mpData: any = {}
    
    try {
      mpData = JSON.parse(rawResponse)
    } catch(e) {
      console.error('Falha ao parsear resposta do MP como JSON:', rawResponse)
    }

    if (!mpResponse.ok) {
      console.error(`Erro no Mercado Pago [${mpResponse.status} - ${mpResponse.statusText}]:`, rawResponse)
      const mpErrorMessage = mpData?.message || mpData?.cause?.[0]?.description || `Status ${mpResponse.status}`
      return { error: `Mercado Pago: ${mpErrorMessage}`, success: false }
    }

    const qrCode = mpData.point_of_interaction?.transaction_data?.qr_code
    const qrCodeBase64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64
    const transacaoId = mpData.id?.toString()

    if (!qrCode || !qrCodeBase64 || !transacaoId) {
      return { error: 'Resposta inválida do Mercado Pago', success: false }
    }

    // 3. Salvar o pagamento no banco de dados
    const { error: insertError } = await supabase
      .from('pagamentos')
      .insert({
        pedido_id: pedidoId,
        valor: pedido.valor_total,
        status: 'pendente',
        transacao_id: transacaoId,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64
      })

    if (insertError) {
      console.error('Erro ao salvar pagamento:', insertError)
      return { error: 'Erro ao salvar os dados do pagamento', success: false }
    }

    return { 
      success: true, 
      qrCode, 
      qrCodeBase64,
      transacaoId
    }

  } catch (err) {
    console.error('Erro fatal:', err)
    return { error: 'Erro inesperado ao gerar pagamento', success: false }
  }
}

export async function verificarPagamento(transacaoId: string, pedidoId: string) {
  // Essa função será usada para testes locais. 
  // Na vida real, o webhook fará isso automaticamente.
  try {
    const supabase = await createClient()
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!mpToken) return { error: 'Sem token do MP', success: false }

    let data = { status: 'pending' }

    if (mpToken.startsWith('TEST-')) {
      // Em ambiente de teste (Sandbox), é difícil simular o pagamento do PIX.
      // Vamos simular a aprovação automaticamente para fins de teste.
      data = { status: 'approved' }
    } else {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${transacaoId}`, {
        headers: {
          'Authorization': `Bearer ${mpToken}`
        }
      })
      data = await response.json()
    }

    if (data.status === 'approved') {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = createAdminClient()
      
      // Atualizar pagamento ignorando RLS
      await adminClient
        .from('pagamentos')
        .update({ status: 'pago', data_pagamento: new Date().toISOString() })
        .eq('transacao_id', transacaoId)

      // Atualizar pedido ignorando RLS
      await adminClient
        .from('pedidos')
        .update({ status: 'pago' })
        .eq('id', pedidoId)

      revalidatePath('/aluno/pedidos')
      revalidatePath('/admin/entregas')
      
      return { success: true, status: 'pago' }
    }

    return { success: true, status: data.status }
  } catch (err) {
    console.error(err)
    return { error: 'Erro ao verificar', success: false }
  }
}
