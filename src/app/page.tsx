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
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 py-12 lg:py-20">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nina-red-50 text-nina-red-600 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nina-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nina-red-500"></span>
              </span>
              Sistema de Pedidos Online
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Chegou a hora do intervalo? <span className="text-nina-red-600">Pule a fila.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Planeje suas refeições da semana, pague via Pix e retire seu prato diretamente no balcão, sem complicação e sem atrasos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="/cadastro" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-nina-red-600 hover:bg-nina-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-nina-red-200 transition-all hover:scale-105"
              >
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl shadow-sm border border-slate-200 transition-all"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-full">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-50 pointer-events-none">
                <Utensils size={200} />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Cardápio Inteligente</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Visualize o prato principal da semana e escolha exatamente em quais dias você vai comer na cantina.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Pagamento Via Pix</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Feche seu pedido e pague na hora usando o QR Code do Mercado Pago. Aprovação em segundos.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Fila Zero</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Quando bater o sino do intervalo, seu pedido já estará registrado. É só chegar no balcão e retirar.</p>
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
