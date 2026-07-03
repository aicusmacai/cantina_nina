import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    
    // Mercado Pago envia notificações de duas formas (Webhooks antigos e novos)
    if (topic === 'payment') {
      const data = await req.json()
      const paymentId = data.data?.id
      
      if (paymentId) {
        // Inicializar Supabase Admin
        // Como o webhook é externo, não temos sessão, precisamos usar a Service Key para atualizar o banco
        // Se a Service Key não estiver disponível (ex: teste local), isso falhará silenciosamente no try-catch ou logará erro.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANTE: Configurar no painel de produção!
        
        if (!supabaseServiceKey) {
          console.error('SUPABASE_SERVICE_ROLE_KEY ausente! Impossível atualizar banco no webhook.')
          return NextResponse.json({ received: true })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Verificar status no MP
        const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN
        if (!mpToken) return NextResponse.json({ error: 'MP token missing' }, { status: 500 })

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { 'Authorization': `Bearer ${mpToken}` }
        })
        const paymentData = await response.json()

        if (paymentData.status === 'approved') {
          // Atualizar tabela de pagamentos
          const { data: pagamento } = await supabase
            .from('pagamentos')
            .update({ status: 'pago', data_pagamento: new Date().toISOString() })
            .eq('transacao_id', paymentId.toString())
            .select('pedido_id')
            .single()

          if (pagamento?.pedido_id) {
            // Atualizar status do pedido correspondente
            await supabase
              .from('pedidos')
              .update({ status: 'pago' })
              .eq('id', pagamento.pedido_id)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
