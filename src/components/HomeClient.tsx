'use client'

import { useActionState, useEffect, useState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Utensils, QrCode, Clock, ArrowRight } from 'lucide-react'

const initialState = { error: '', success: false }

export default function HomeClient() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/')
    }
  }, [state, router])

  return (
    <div className="min-h-screen bg-[#f4f0e6] flex flex-col font-sans">

      {/* Top Half - Olive */}
      <div className="bg-nina-olive-600 text-[#f4f0e6] relative overflow-hidden pb-32">
        {/* Navbar */}
        <header className="max-w-6xl mx-auto px-4 h-24 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-nina-gold-400 font-bold text-xl">
            <div className="bg-nina-gold-400 text-nina-olive-900 rounded-md p-1.5">
              <Utensils size={20} />
            </div>
            <span className="text-[#f4f0e6]">Cantina Nina</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsOpen(true)}
              className="text-nina-olive-200 hover:text-[#f4f0e6] font-medium text-sm transition-colors"
            >
              Entrar
            </button>
            <Link
              href="/cadastro"
              className="border border-[#f4f0e6]/20 hover:bg-[#f4f0e6]/10 text-[#f4f0e6] px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="w-full max-w-6xl mx-auto px-4 pt-12 pb-20 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-nina-gold-400/30 bg-nina-gold-400/10 rounded-sm">
              <span className="text-nina-gold-400 text-[10px] font-black uppercase tracking-widest">
                Sistema de Pedidos Online
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#f4f0e6] tracking-tight leading-[1.1] mb-6">
              Chegou a hora do almoço?<br />
              <span className="text-nina-gold-400">Pule a fila.</span>
            </h1>

            <p className="text-lg text-nina-olive-200 mb-10 font-medium leading-relaxed max-w-lg">
              Planeje suas refeições da semana, pague via Pix e retire seu prato diretamente no balcão, sem complicação e sem atrasos.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/cadastro"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-nina-gold-400 hover:bg-nina-gold-500 text-nina-olive-900 font-bold py-3.5 px-8 rounded-lg transition-all duration-300 shadow-md"
              >
                Começar Agora <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#f4f0e6]/30 hover:bg-[#f4f0e6]/10 text-[#f4f0e6] font-bold py-3.5 px-8 rounded-lg transition-all duration-300"
              >
                Já tenho conta
              </button>
            </div>
          </div>
        </main>

        {/* Floating card */}
        <div className="absolute right-[10%] top-[25%] hidden lg:block shadow-2xl animate-float transition-all duration-500 hover:scale-105 z-20">
          <div className="bg-[#f4f0e6] text-[#383b32] p-8 rounded-xl border-t-8 border-nina-gold-400 w-72">
            <h3 className="font-black text-lg mb-4 text-nina-olive-800">Cardápio do dia</h3>
            <div className="space-y-3 text-sm font-medium border-b border-dashed border-[#c9cebf] pb-4 mb-4">
              <div className="flex justify-between items-center"><span className="text-nina-olive-700">Feijoada</span><span className="font-bold">R$ 18</span></div>
              <div className="flex justify-between items-center"><span className="text-nina-olive-700">Grelhado</span><span className="font-bold">R$ 16</span></div>
              <div className="flex justify-between items-center"><span className="text-nina-olive-700">Vegetariano</span><span className="font-bold">R$ 15</span></div>
              <div className="flex justify-between items-center"><span className="text-nina-olive-700">Suco natural</span><span className="font-bold">R$ 6</span></div>
            </div>
            <div className="text-[10px] text-nina-olive-400 uppercase tracking-wider font-bold text-center">
              Pedido nº 042 · Pronto às 12h20
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Beige */}
      <section className="bg-[#f4f0e6] flex-grow -mt-16 relative z-20 pt-10 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-10 text-center lg:text-left">
            <span className="text-nina-gold-500 font-bold text-[10px] uppercase tracking-widest block mb-2">Como funciona</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#383b32]">Do pedido à mesa em três passos simples</h2>
          </div>
          <div className="space-y-4">
            <div className="solid-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#e8e3d5] text-[#383b32] flex items-center justify-center shrink-0"><Utensils size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-[#383b32] mb-1">Cardápio Inteligente</h3>
                <p className="text-[#383b32]/70 text-sm font-medium leading-relaxed">Visualize o prato principal da semana e escolha exatamente em quais dias você vai comer na cantina.</p>
              </div>
            </div>
            <div className="solid-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#e8e3d5] text-[#383b32] flex items-center justify-center shrink-0"><QrCode size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-[#383b32] mb-1">Pagamento via Pix</h3>
                <p className="text-[#383b32]/70 text-sm font-medium leading-relaxed">Feche seu pedido e pague na hora usando o QR Code do Mercado Pago. Aprovação em segundos.</p>
              </div>
            </div>
            <div className="solid-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#e8e3d5] text-[#383b32] flex items-center justify-center shrink-0"><Clock size={20} /></div>
              <div>
                <h3 className="text-lg font-black text-[#383b32] mb-1">Fila Zero</h3>
                <p className="text-[#383b32]/70 text-sm font-medium leading-relaxed">Quando bater o sinal do almoço, seu pedido já estará registrado. É só chegar no balcão e retirar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-nina-olive-400 font-medium text-sm border-t border-[#e8e3d5] bg-[#f4f0e6]">
        &copy; {new Date().getFullYear()} Cantina Nina. Todos os direitos reservados.
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-nina-olive-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
              className="solid-card p-8 md:p-10 w-full max-w-md relative z-10"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-nina-gold-400/10 rounded-full blur-2xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-nina-olive-400 hover:text-nina-olive-900 bg-[#f5f3ed] hover:bg-[#e8e6de] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8 mt-2">
                <div className="w-16 h-16 bg-[#f5f3ed] text-nina-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-[#e8e6de]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                </div>
                <h2 className="text-2xl font-black text-[#2d2f27] tracking-tight">Bem-vindo de volta</h2>
                <p className="text-nina-olive-400 mt-2 font-medium">Faça login para continuar</p>
              </div>

              <form action={formAction} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-[#2d2f27] mb-2">Nome de Usuário</label>
                  <input name="username" type="text" required className="appearance-none relative block w-full px-4 py-3 bg-[#fdfcfa] border border-[#e8e6de] placeholder-nina-olive-300 text-[#2d2f27] font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-nina-gold-400/50 focus:border-nina-gold-400 focus:bg-white transition-all shadow-sm" placeholder="Ex: joao123" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d2f27] mb-2">Senha</label>
                  <input name="password" type="password" required className="appearance-none relative block w-full px-4 py-3 bg-[#fdfcfa] border border-[#e8e6de] placeholder-nina-olive-300 text-[#2d2f27] font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-nina-gold-400/50 focus:border-nina-gold-400 focus:bg-white transition-all shadow-sm" placeholder="Sua senha" />
                </div>
                {state?.error && (
                  <div className="text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-center justify-center">{state.error}</div>
                )}
                <button type="submit" disabled={isPending || state?.success} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-nina-gold-400 text-nina-olive-900 font-bold text-sm uppercase tracking-wide rounded-xl hover:bg-nina-gold-500 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nina-gold-400 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2">
                  {isPending || state?.success ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-nina-olive-500 font-medium relative z-10">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="text-nina-gold-600 hover:text-nina-gold-700 font-bold underline decoration-2 decoration-nina-gold-400/30 underline-offset-4">
                  Cadastre-se
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
