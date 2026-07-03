'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function deleteUserAccount(userId: string) {
  try {
    const adminAuthClient = createAdminClient()

    // 1. Deleta do Auth do Supabase
    const { error: authError } = await adminAuthClient.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Erro ao deletar do Auth:', authError)
      return { success: false, error: authError.message }
    }

    // O trigger CASCADE (se houver) apagaria do public.usuarios, 
    // mas se não houver, nós deletamos manualmente por segurança:
    const { error: dbError } = await adminAuthClient.from('usuarios').delete().eq('id', userId)
    if (dbError) {
      console.error('Erro ao deletar de public.usuarios:', dbError)
    }

    revalidatePath('/admin/usuarios')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado. Certifique-se de ter configurado a SUPABASE_SERVICE_ROLE_KEY.' }
  }
}

export async function updateUsuarioAuth(userId: string, data: { email?: string, password?: string }) {
  try {
    const adminAuthClient = createAdminClient()

    const { error } = await adminAuthClient.auth.admin.updateUserById(userId, data)
    
    if (error) {
      console.error('Erro ao atualizar usuário via Admin API:', error)
      return { success: false, error: error.message }
    }

    // Se o email foi alterado, precisamos refletir na tabela pública também
    if (data.email) {
      const { error: dbError } = await adminAuthClient.from('usuarios').update({ email: data.email }).eq('id', userId)
      if (dbError) {
        console.error('Erro ao atualizar email em public.usuarios:', dbError)
      }
    }

    revalidatePath('/admin/usuarios')
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro inesperado. Certifique-se de ter configurado a SUPABASE_SERVICE_ROLE_KEY.' }
  }
}
