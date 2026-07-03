import Link from "next/link";
import { Utensils, QrCode, Clock, ArrowRight } from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (usuario) {
      if (usuario.role === 'admin') redirect('/admin')
      if (usuario.role === 'funcionario') redirect('/admin/entregas')
      if (usuario.role === 'aluno' || usuario.role === 'responsavel') redirect('/aluno')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-nina-red-600 font-bold text-xl">
            <Utensils size={24} />
            Cantina NINA
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/cadastro" 
              className="bg-nina-red-600 hover:bg-nina-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nina-red-400/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 py-12 lg:py-20 relative z-10">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-nina-red-100 shadow-sm text-nina-red-600 text-sm font-bold mb-8 hover:shadow-md transition-shadow cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nina-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nina-red-500"></span>
              </span>
              Sistema de Pedidos Online
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Chegou a hora do almoço? <span className="text-transparent bg-clip-text bg-gradient-to-r from-nina-red-600 to-orange-500">Pule a fila.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Planeje suas refeições da semana, pague via Pix e retire seu prato diretamente no balcão, sem complicação e sem atrasos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="/cadastro" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-nina-red-600 to-nina-red-500 hover:from-nina-red-700 hover:to-nina-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-nina-red-200 transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
              >
                Começar Agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-slate-700 font-bold py-4 px-8 rounded-2xl shadow-sm border border-slate-200 transition-all hover:-translate-y-1 hover:shadow-md duration-300 backdrop-blur-sm"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-full group">
            <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 relative overflow-hidden transition-all duration-500 hover:shadow-nina-red-100">
              <div className="absolute -top-16 -right-16 w-80 h-80 opacity-90 pointer-events-none group-hover:scale-105 group-hover:-rotate-3 transition-all duration-700">
                <img src="/hero.png" alt="Bandeja de almoço deliciosa" className="w-full h-full object-cover rounded-full shadow-2xl shadow-slate-200" />
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100/50">
                    <Utensils size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cardápio Inteligente</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">Visualize o prato principal da semana e escolha exatamente em quais dias você vai comer na cantina.</p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 text-green-600 flex items-center justify-center shrink-0 shadow-sm border border-green-100/50">
                    <QrCode size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pagamento Via Pix</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">Feche seu pedido e pague na hora usando o QR Code do Mercado Pago. Aprovação em segundos.</p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                    <Clock size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fila Zero</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">Quando bater o sinal do almoço, seu pedido já estará registrado. É só chegar no balcão e retirar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} Cantina NINA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
