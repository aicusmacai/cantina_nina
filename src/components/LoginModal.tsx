'use client'

import { useActionState, useEffect } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const initialState = { error: '', success: false }

export default function LoginModal() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const isLoginOpen = searchParams.get('login') === 'true'

  useEffect(() => {
    if (state?.success) {
      router.push('/') // The redirect in page.tsx or auth will handle routing to /aluno or /admin
    }
  }, [state, router])

  const closeModal = () => {
    router.push('/home', { scroll: false })
  }

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur and dark tint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-slate-100"
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8 mt-2">
              <div className="w-16 h-16 bg-nina-red-50 text-nina-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
              <p className="text-slate-500 mt-2">Faça login para continuar</p>
            </div>

            <form action={formAction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome de Usuário
                </label>
                <input 
                  name="username"
                  type="text" 
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
                  placeholder="Ex: joao123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <input 
                  name="password"
                  type="password" 
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
                  placeholder="Sua senha"
                />
              </div>

              {state?.error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-md border border-red-100">
                  {state.error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isPending || state?.success}
                className="w-full bg-nina-red-600 hover:bg-nina-red-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isPending || state?.success ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="text-nina-red-600 hover:text-nina-red-700 font-bold">
                Cadastre-se
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
