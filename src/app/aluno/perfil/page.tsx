'use client'

import { useState, useTransition, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Apenas verifica se está logado
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (newPassword.length < 6) {
      setErrorMsg('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('Senha alterada com sucesso!')
        setNewPassword('')
        setConfirmPassword('')
      }
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-nina-red-50 text-nina-red-600 rounded-full flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Segurança da Conta</h2>
            <p className="text-sm text-slate-500">Gerencie sua senha de acesso.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nova Senha
            </label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900"
              placeholder="No mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Nova Senha
            </label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nina-red-500 focus:border-nina-red-500 outline-none transition-all text-slate-900"
              placeholder="Repita a senha"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 border border-red-100 font-medium">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-start gap-2 border border-green-100 font-medium">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-nina-red-600 hover:bg-nina-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-4 shadow-md shadow-nina-red-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><KeyRound size={20} /> Atualizar Senha</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
