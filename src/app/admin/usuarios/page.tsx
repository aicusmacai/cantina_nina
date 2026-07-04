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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 mb-8 print:mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight print:text-xl">Usuários e Alunos</h1>
            <p className="text-stone-500 mt-1 print:hidden">Gerencie o acesso e informações dos usuários.</p>
          </div>
        </div>
      </div>

      <MotionDiv 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-stone-200/50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
        {usuarios && usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <MotionDiv key={usuario.id} variants={fadeItem}>
              <div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl flex flex-col justify-between gap-6 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1 transition-all duration-300 border border-stone-200/50 print:border-b print:border-black print:border-dashed print:rounded-none print:shadow-none print:p-2 print:gap-1 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-stone-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4 print:mb-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 shadow-inner border border-stone-200/80 text-stone-500 flex items-center justify-center shrink-0 font-bold text-xl uppercase group-hover:from-nina-red-100 group-hover:to-white group-hover:text-nina-red-600 group-hover:border-nina-red-200 transition-all duration-300 print:hidden">
                      {(usuario.nome_completo || '?').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800 text-lg print:text-sm uppercase leading-tight line-clamp-1 group-hover:text-nina-red-600 transition-colors">
                        {usuario.nome_completo}
                      </h3>
                      <p className="text-stone-400 text-xs mt-0.5 print:hidden line-clamp-1">{usuario.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm text-stone-500 print:text-xs print:text-black bg-stone-50/80 p-4 rounded-2xl print:bg-transparent print:p-0 print:gap-0 border border-stone-100">
                    <div className="flex justify-between items-center print:justify-start print:gap-2">
                      <span className="font-semibold text-stone-400 print:hidden">Turma</span>
                      <span className="hidden print:inline font-bold">Turma:</span>
                      <span className="font-bold text-stone-700 bg-white shadow-sm px-3 py-1 rounded-lg border border-stone-200 print:border-none print:bg-transparent print:px-0 print:text-black">
                        {usuario.turma || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center print:hidden">
                      <span className="font-semibold text-stone-400">Turno</span>
                      <span className="text-stone-700 font-medium bg-stone-100 px-3 py-1 rounded-lg border border-stone-200 uppercase text-xs tracking-wider">
                        {usuario.turno || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center print:hidden mt-2 pt-2 border-t border-stone-200/50">
                      <span className="font-semibold text-stone-400">Tipo</span>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border shadow-sm ${
                        usuario.role === 'admin' 
                          ? 'bg-nina-red-50 text-nina-red-600 border-nina-red-200' 
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {usuario.role === 'admin' ? 'Administrador' : 'Aluno'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-100 print:hidden">
                  <AcoesUsuario userId={usuario.id} currentEmail={usuario.email} />
                </div>
              </div>
            </MotionDiv>
          ))
        ) : (
          <div className="col-span-full bg-stone-50/50 p-12 rounded-3xl border border-dashed border-stone-300 text-center flex flex-col items-center justify-center">
            <UserCircle size={48} className="text-stone-300 mb-4" />
            <p className="text-xl font-bold text-stone-700 mb-1">Nenhum usuário encontrado</p>
            <p className="text-stone-500">Tente ajustar o termo de pesquisa</p>
          </div>
        )}
      </MotionDiv>
    </div>
  )
}
