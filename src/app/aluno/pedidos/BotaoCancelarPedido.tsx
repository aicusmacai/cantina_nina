'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cancelarPedido } from '@/app/actions/aluno'
import { useRouter } from 'next/navigation'

export default function BotaoCancelarPedido({ pedidoId }: { pedidoId: string }) {
  const [isCancelando, setIsCancelando] = useState(false)
  const router = useRouter()

  const handleCancelar = async (e: React.MouseEvent) => {
    e.preventDefault() // Impede a navegação do Link que envolve o card
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return
    
    setIsCancelando(true)
    const result = await cancelarPedido(pedidoId)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Erro ao cancelar pedido')
      setIsCancelando(false)
    }
  }

  return (
    <button
      onClick={handleCancelar}
      disabled={isCancelando}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10 relative"
      title="Cancelar pedido"
    >
      {isCancelando ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
    </button>
  )
}
