import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Proteção de rotas
  if (path.startsWith('/api')) {
    return supabaseResponse
  }

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/cadastro')
  
  if (!user && !isAuthRoute && path !== '/') {
    // Redireciona para o login se tentar acessar área restrita sem estar logado
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Busca a role do usuário no banco (tabela usuarios)
    const { data: userData } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = userData?.role

    // Redirecionamentos baseados na role (se estiver na raiz ou tentar acessar rota de login)
    if (isAuthRoute || path === '/') {
      const url = request.nextUrl.clone()
      if (role === 'admin') url.pathname = '/admin'
      else if (role === 'funcionario') url.pathname = '/funcionario'
      else url.pathname = '/aluno'
      
      return NextResponse.redirect(url)
    }

    // Proteção rigorosa de rotas
    if (path.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/aluno' // ou tela de erro
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/funcionario') && role !== 'funcionario' && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/aluno'
      return NextResponse.redirect(url)
    }
    
    if (path.startsWith('/aluno') && role !== 'aluno' && role !== 'responsavel' && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin' // Se admin acessar /aluno, redireciona de volta ou permite? Permite se não houver conflito, mas por segurança vamos isolar.
      // Melhor apenas validar se não for admin:
      if(role !== 'admin') {
          return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
