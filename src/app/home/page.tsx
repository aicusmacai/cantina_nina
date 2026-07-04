import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (usuario) {
      if (usuario.role === 'admin') redirect('/admin')
      if (usuario.role === 'funcionario') redirect('/admin/entregas')
      if (usuario.role === 'aluno' || usuario.role === 'responsavel') redirect('/aluno')
    }
  }

  return <HomeClient />
}
