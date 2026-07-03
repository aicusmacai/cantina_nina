import { createClient } from '@supabase/supabase-js'

// Cria um cliente com a Service Role Key, que ignora as RLS (Row Level Security)
// ATENÇÃO: Nunca exporte ou use este cliente no navegador (client components). Apenas Server Actions.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('As variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas no .env.local para realizar ações de administração avançadas.')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
