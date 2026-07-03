'use client'

import { useActionState, useEffect, useState } from 'react'
import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const initialState = { error: '', success: false }

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const [tipoConta, setTipoConta] = useState('aluno')
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/')
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <a href="/home" className="absolute top-6 left-6 text-slate-400 hover:text-nina-red-600 transition-colors text-sm font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar
        </a>
        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-nina-red-50 text-nina-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Conta</h1>
          <p className="text-slate-500 mt-2">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-nina-red-600 hover:text-nina-red-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <input 
              name="nome"
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
              placeholder="Ex: João da Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Você é aluno ou funcionário?
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 border p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${tipoConta === 'aluno' ? 'border-nina-red-500 bg-nina-red-50 text-nina-red-700 font-bold shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="tipoConta" value="aluno" className="hidden" checked={tipoConta === 'aluno'} onChange={() => setTipoConta('aluno')} />
                Sou Aluno
              </label>
              <label className={`flex-1 border p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${tipoConta === 'professor' ? 'border-nina-red-500 bg-nina-red-50 text-nina-red-700 font-bold shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="tipoConta" value="professor" className="hidden" checked={tipoConta === 'professor'} onChange={() => setTipoConta('professor')} />
                Sou Professor
              </label>
            </div>
          </div>

          {tipoConta === 'aluno' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Turma
              </label>
              <input 
                name="turma"
                type="text" 
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
                placeholder="Ex: 8º Ano A"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome de Usuário (Para Login)
            </label>
            <input 
              name="username"
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
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
              minLength={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900 bg-white"
              placeholder="Mínimo 6 caracteres"
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
            className="w-full bg-nina-red-600 hover:bg-nina-red-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isPending || state?.success ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
