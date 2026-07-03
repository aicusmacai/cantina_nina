import { createClient } from '@/lib/supabase/server'
import { UserCircle } from 'lucide-react'

export default async function UsuariosPage() {
  const supabase = await createClient()

  // Lista todos os usuários, ordenados pelos mais recentes
  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false })

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'funcionario': return 'bg-blue-100 text-blue-700'
      case 'responsavel': return 'bg-orange-100 text-orange-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 font-semibold text-slate-600">Usuário</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Username (Login)</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Turma/Cargo</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Perfil</th>
            </tr>
          </thead>
          <tbody>
            {usuarios && usuarios.length > 0 ? (
              usuarios.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900 flex items-center gap-3">
                    <UserCircle className="text-slate-400" size={24} />
                    {user.nome_completo}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {user.email.split('@')[0]}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {user.turma || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
