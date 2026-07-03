'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function marcarComoEntregue(pedidoId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Usuário não autenticado', success: false }
    }

    // Verifica se é funcionário ou admin
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!usuario || (usuario.role !== 'funcionario' && usuario.role !== 'admin')) {
      return { error: 'Acesso negado', success: false }
    }

    const { error } = await supabase
      .from('pedidos')
      .update({ status: 'entregue' })
      .eq('id', pedidoId)
      .in('status', ['pago', 'pendente']) // Permite entregar mesmo pendente por flexibilidade

    if (error) {
      console.error('Erro ao marcar como entregue:', error)
      return { error: 'Falha ao atualizar pedido', success: false }
    }

    revalidatePath('/funcionario')
    return { success: true, error: '' }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { error: 'Erro inesperado', success: false }
  }
}
