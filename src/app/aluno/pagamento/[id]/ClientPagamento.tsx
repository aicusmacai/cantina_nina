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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Pague com Pix</h1>
      <p className="text-slate-500 mb-6">
        Escaneie o QR Code abaixo com o aplicativo do seu banco para finalizar o pedido.
      </p>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block mb-6">
        {qrCodeBase64 ? (
          <img 
            src={`data:image/png;base64,${qrCodeBase64}`} 
            alt="QR Code Pix" 
            className="w-48 h-48 object-contain mx-auto"
          />
        ) : (
          <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
            Sem Imagem
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-slate-900 mb-8">
        R$ {Number(valor).toFixed(2).replace('.', ',')}
      </div>

      <div className="text-left mb-8">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
          Pix Copia e Cola
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={qrCode}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-600 outline-none truncate"
          />
          <button 
            onClick={handleCopy}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {copiado ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
            {copiado ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
        <button
          onClick={handleVerificar}
          disabled={isVerificando || isCancelando}
          className="w-full bg-nina-red-600 hover:bg-nina-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerificando ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
          Já paguei / Verificar Pagamento
        </button>

        <button
          onClick={handleCancelar}
          disabled={isVerificando || isCancelando}
          className="w-full bg-white hover:bg-slate-50 text-slate-500 font-bold py-4 px-6 rounded-xl border border-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCancelando ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
          Cancelar Pedido
        </button>

        {statusMsg && (
          <p className={`text-sm font-medium ${statusMsg.includes('sucesso') || (statusMsg.includes('aprovado') && !statusMsg.includes('não')) ? 'text-green-600' : 'text-amber-600'}`}>
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  )
}
