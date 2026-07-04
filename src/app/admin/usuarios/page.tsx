import { createClient } from '@/lib/supabase/server'
import { UserCircle } from 'lucide-react'
import BuscaUsuarios from './BuscaUsuarios'
import AcoesUsuario from './AcoesUsuario'
import { MotionDiv, staggerContainer, fadeItem } from '@/components/Motion'

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

      <MotionDiv 
        className="grid gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {usuarios && usuarios.length > 0 ? (
          usuarios.map((user) => {
            const isProfessor = user.turma === 'Professor / Funcionário' || user.turma === 'Professor'
            const displayRole = isProfessor ? 'professor' : user.role
            
            return (
            <MotionDiv key={user.id} variants={fadeItem}>
              <div className="glass bg-white/60 border border-slate-200/50 rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/80 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nina-red-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-white shadow-inner border border-slate-200/50 text-slate-400 flex items-center justify-center shrink-0 group-hover:from-nina-red-50 group-hover:to-white group-hover:text-nina-red-500 group-hover:border-nina-red-100 transition-all duration-300">
                    <UserCircle size={32} />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                      {user.nome_completo}
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${getRoleBadgeColor(displayRole)}`}>
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
            </MotionDiv>
            )
          })
        ) : (
          <div className="bg-slate-50/50 p-12 rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
            <UserCircle size={48} className="text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-700 mb-1">Nenhum usuário encontrado</p>
            <p className="text-slate-500">Tente ajustar o termo de pesquisa</p>
          </div>
        )}
      </MotionDiv>
    </div>
  )
}
