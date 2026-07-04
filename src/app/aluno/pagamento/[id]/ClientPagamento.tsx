'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { verificarPagamento } from '@/app/actions/pagamento'
import { cancelarPedido } from '@/app/actions/aluno'

type Props = {
  pedidoId: string
  transacaoId: string
  qrCode: string
  qrCodeBase64: string
  valor: number
}

export default function ClientPagamento({ pedidoId, transacaoId, qrCode, qrCodeBase64, valor }: Props) {
  const router = useRouter()
  const [copiado, setCopiado] = useState(false)
  const [isVerificando, setIsVerificando] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const [isCancelando, setIsCancelando] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleCancelar = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return
    setIsCancelando(true)
    setStatusMsg('Cancelando pedido...')
    
    const result = await cancelarPedido(pedidoId)
    
    if (result.success) {
      setStatusMsg('Pedido cancelado com sucesso.')
      setTimeout(() => router.push('/aluno/pedidos'), 1500)
    } else {
      setStatusMsg(result.error || 'Erro ao cancelar pedido.')
      setIsCancelando(false)
    }
  }

  const handleVerificar = async () => {
    setIsVerificando(true)
    setStatusMsg('Verificando com o Mercado Pago...')
    
    const result = await verificarPagamento(transacaoId, pedidoId)
    
    if (result.success) {
      if (result.status === 'pago') {
        setStatusMsg('Pagamento aprovado! Redirecionando...')
        setTimeout(() => router.push('/aluno/pedidos'), 1500)
      } else {
        setStatusMsg(`Pagamento ainda não aprovado (Status: ${result.status}). Tente novamente em instantes.`)
        setIsVerificando(false)
      }
    } else {
      setStatusMsg(result.error || 'Erro ao verificar pagamento.')
      setIsVerificando(false)
    }
  }

  return (
    <div className="max-w-md mx-auto relative z-10">
      <div className="glass bg-white/60 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Enfeite de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-nina-red-50 rounded-full blur-3xl opacity-60 -z-10 -translate-y-1/2 translate-x-1/4"></div>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-nina-red-100 to-nina-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-nina-red-200/50">
            <CheckCircle2 size={36} className="text-nina-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pedido Recebido!</h2>
          <p className="text-slate-500 font-medium mt-2">Realize o pagamento via Pix para confirmar seu pedido.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 flex flex-col items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-nina-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {qrCodeBase64 ? (
            <img 
              src={`data:image/png;base64,${qrCodeBase64}`} 
              alt="QR Code Pix" 
              className="w-48 h-48 rounded-xl shadow-sm border border-slate-100 relative z-10 group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="w-48 h-48 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <span className="text-slate-400">QR Code indisponível</span>
            </div>
          )}
        </div>

        <div className="mb-8 relative">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Código Pix Copia e Cola</label>
          <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-nina-red-500/20 focus-within:border-nina-red-300 transition-all">
            <input 
              type="text" 
              readOnly 
              value={qrCode} 
              className="flex-1 p-4 bg-transparent text-sm text-slate-600 outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="bg-slate-50 hover:bg-nina-red-50 px-5 text-slate-600 hover:text-nina-red-600 font-bold flex items-center gap-2 border-l border-slate-200 transition-colors"
            >
              <Copy size={18} />
              {copiado ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 space-y-3">
          <button
            onClick={handleVerificar}
            disabled={isVerificando || isCancelando}
            className="w-full bg-gradient-to-r from-nina-red-600 to-nina-red-500 hover:from-nina-red-500 hover:to-nina-red-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-nina-red-500/30 hover:shadow-nina-red-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isVerificando ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
            Já paguei / Verificar Pagamento
          </button>

          <button
            onClick={handleCancelar}
            disabled={isVerificando || isCancelando}
            className="w-full bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 font-bold py-4 px-6 rounded-2xl border border-slate-200 hover:border-red-200 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isCancelando ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
            Cancelar Pedido
          </button>

          {statusMsg && (
            <div className={`p-4 rounded-xl text-sm font-bold text-center mt-4 transition-all animate-in fade-in slide-in-from-bottom-2 ${
              statusMsg.includes('sucesso') || (statusMsg.includes('aprovado') && !statusMsg.includes('não')) 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
