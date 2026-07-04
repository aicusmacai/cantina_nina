'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'

type ModalConfirmacaoProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isConfirming?: boolean
}

export default function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isConfirming = false
}: ModalConfirmacaoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isConfirming ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 w-[90%] max-w-sm mx-auto flex flex-col items-center text-center transform scale-100 transition-transform relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 shadow-inner border border-red-100/50">
          <AlertTriangle size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">{message}</p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-md shadow-red-500/20 transition-all flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {isConfirming ? <Loader2 size={20} className="animate-spin" /> : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
