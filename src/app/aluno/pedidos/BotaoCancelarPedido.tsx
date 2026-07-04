'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cancelarPedido } from '@/app/actions/aluno'
import { useRouter } from 'next/navigation'
import ModalConfirmacao from '@/components/ModalConfirmacao'

export default function BotaoCancelarPedido({ pedidoId }: { pedidoId: string }) {
  const [isCancelando, setIsCancelando] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleConfirmar = async () => {
    setIsCancelando(true)
    const result = await cancelarPedido(pedidoId)
    if (result.success) {
      setShowModal(false)
      router.refresh()
    } else {
      alert(result.error || 'Erro ao cancelar pedido')
      setIsCancelando(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowModal(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 z-10 relative hover:scale-110 active:scale-95"
        title="Cancelar pedido"
      >
        <X size={20} />
      </button>

      <ModalConfirmacao
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmar}
        isConfirming={isCancelando}
        title="Cancelar Pedido"
        message="Tem certeza que deseja cancelar este pedido? Ele será permanentemente excluído."
      />
    </>
  )
}
