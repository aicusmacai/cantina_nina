import { createClient } from '@/lib/supabase/server'
import { UserCircle } from 'lucide-react'
import BuscaUsuarios from './BuscaUsuarios'
import AcoesUsuario from './AcoesUsuario'

export default async function UsuariosPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const supabase = await createClient()

  // Lista todos os usuários
  let dbQuery = supabase.from('usuarios').select('*').order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`nome_completo.ilike.%${query}%,email.ilike.%${query}%`)
  }

  const { data: usuarios } = await dbQuery

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'funcionario': return 'bg-blue-100 text-blue-700'
      case 'aluno': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h1>
        <BuscaUsuarios />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm">
              <th className="py-4 px-6 font-semibold text-slate-600">Usuário</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Login</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Turma</th>
              <th className="py-4 px-6 font-semibold text-slate-600">Perfil</th>
              <th className="py-4 px-6 font-semibold text-slate-600 w-16 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios && usuarios.length > 0 ? (
              usuarios.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-900 flex items-center gap-3 font-medium">
                    <UserCircle className="text-slate-400" size={24} />
                    {user.nome_completo}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {user.email.split('@')[0]}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {user.turma || '-'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-center">
                    <AcoesUsuario userId={user.id} currentEmail={user.email} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <p className="text-lg font-medium text-slate-600 mb-1">Nenhum usuário encontrado</p>
                  <p className="text-sm">Tente ajustar o termo de pesquisa</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
