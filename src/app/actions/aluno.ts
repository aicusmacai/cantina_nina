'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarPedido(diasSemana: number[], valorTotal: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Usuário não autenticado', success: false }
    }

    if (!diasSemana.length || valorTotal <= 0) {
      return { error: 'Dados do pedido inválidos', success: false }
    }

    const { data: novoPedido, error } = await supabase
      .from('pedidos')
      .insert({
        usuario_id: user.id,
        dias_semana: diasSemana,
        valor_total: valorTotal,
        status: 'pendente'
      })
      .select('id')
      .single()

    if (error || !novoPedido) {
      console.error('Erro ao criar pedido:', error)
      return { error: 'Falha ao processar o pedido. Tente novamente.', success: false }
    }

    revalidatePath('/aluno')
    revalidatePath('/aluno/pedidos')
    return { success: true, error: '', pedidoId: novoPedido.id }
  } catch (err) {
    console.error('Erro inesperado em criarPedido:', err)
    return { error: 'Erro inesperado', success: false }
  }
}

export async function cancelarPedido(pedidoId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado', success: false }

    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('pedidos')
      .update({ status: 'cancelado' })
      .eq('id', pedidoId)
      .eq('usuario_id', user.id)
      .eq('status', 'pendente')

    if (error) {
      console.error('Erro ao cancelar pedido:', error)
      return { error: 'Falha ao cancelar o pedido', success: false }
    }

    revalidatePath('/aluno/pedidos')
    return { success: true }
  } catch (err) {
    console.error('Erro ao cancelar pedido:', err)
    return { error: 'Erro inesperado', success: false }
  }
}
