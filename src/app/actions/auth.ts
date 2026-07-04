'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  try {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
      return { error: 'Preencha todos os campos', success: false }
    }

    const email = `${username.trim().toLowerCase()}@nina.local`
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: 'Usuário ou senha incorretos', success: false }
    }
  } catch (err: any) {
    console.error('Login error:', err)
    return { error: 'Ocorreu um erro inesperado no login.', success: false }
  }
  
  return { success: true, error: '' }
}

export async function register(prevState: any, formData: FormData) {
  try {
    const nomeCompleto = formData.get('nome') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const tipoConta = formData.get('tipoConta') as string
    let turma = formData.get('turma') as string
    const role = 'aluno'

    if (tipoConta === 'professor') {
      turma = 'Professor / Funcionário'
    }

    console.log('--- NOVO CADASTRO TENTATIVA ---')
    console.log('Nome:', nomeCompleto)
    console.log('Username:', username)
    console.log('Tipo:', tipoConta)
    console.log('Role:', role)

    if (!nomeCompleto || !username || !password || (tipoConta === 'aluno' && !turma)) {
      console.log('ERRO: Faltam campos obrigatórios.')
      return { error: 'Preencha todos os campos obrigatórios, incluindo a Turma', success: false }
    }

    const email = `${username.trim().toLowerCase()}@nina.local`
    const supabase = await createClient()

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nomeCompleto,
          role: role,
        }
      }
    })

    if (error) {
      console.error('Supabase SignUp Error:', error)
      let msg = error.message || ''
      if (typeof msg !== 'string' || msg === '{}') {
        msg = `Name: ${error.name}, Message: ${error.message}, Status: ${error.status}`
      }
      
      if (error.status === 422 || msg.includes('already registered') || msg.includes('User already exists')) {
          return { error: 'Nome de usuário já existe. Escolha outro.', success: false }
      }
      return { error: msg || 'Erro ao criar conta no banco de dados.', success: false }
    }

    // Atualiza a turma usando o ID retornado pelo signUp
    // NOTA: Usamos o admin client porque o RLS bloqueia usuários recém-criados de editarem a própria linha imediatamente.
    if (signUpData?.user && role === 'aluno' && turma) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const adminClient = createAdminClient()
        const { error: updateError } = await adminClient.from('usuarios').update({ turma }).eq('id', signUpData.user.id)
        
        if (updateError) {
          console.error('Erro ao atualizar turma via adminClient:', updateError)
        }
      } catch (err) {
        console.warn('Admin Client indisponível para atualizar turma, tentando fallback normal:', err)
        const { error: fallbackError } = await supabase.from('usuarios').update({ turma }).eq('id', signUpData.user.id)
        if (fallbackError) {
          console.error('Fallback também falhou (Bloqueado por RLS):', fallbackError)
        }
      }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error('SignIn Error after SignUp:', signInError)
      return { error: 'Conta criada com sucesso! Vá para a tela de Login para entrar.', success: false }
    }
  } catch (err: any) {
    console.error('Register error:', err)
    return { error: 'Ocorreu um erro inesperado. Tente novamente.', success: false }
  }

  return { success: true, error: '' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/home?login=true')
}
