'use client'

import { Printer } from 'lucide-react'

export default function BotaoImprimir() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button 
      onClick={handlePrint}
      className="print:hidden flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
    >
      <Printer size={18} />
      Imprimir Lista
    </button>
  )
}
