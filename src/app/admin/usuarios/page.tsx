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
      case 'professor': return 'bg-indigo-100 text-indigo-700'
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

      <div className="grid gap-4">
        {usuarios && usuarios.length > 0 ? (
          usuarios.map((user) => {
            const isProfessor = user.turma === 'Professor / Funcionário' || user.turma === 'Professor'
            const displayRole = isProfessor ? 'professor' : user.role
            
            return (
            <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 group">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-nina-red-50 group-hover:text-nina-red-600 transition-colors">
                  <UserCircle size={28} />
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                    {user.nome_completo}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(displayRole)}`}>
                      {displayRole}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-slate-400">Login:</span> 
                      {user.email.split('@')[0]}
                    </span>
                    {!isProfessor && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-slate-400">Turma:</span> 
                        {user.turma || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-2 sm:mt-0">
                <AcoesUsuario userId={user.id} currentEmail={user.email} />
              </div>
              
            </div>
            )
          })
        ) : (
          <div className="bg-slate-50/50 p-12 rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
            <UserCircle size={48} className="text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-700 mb-1">Nenhum usuário encontrado</p>
            <p className="text-slate-500">Tente ajustar o termo de pesquisa</p>
          </div>
        )}
      </div>
    </div>
  )
}
