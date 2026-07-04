import { Loader2 } from 'lucide-react'

export default function AlunoLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <Loader2 className="w-12 h-12 text-[#e3a74f] animate-spin mb-4" />
      <p className="text-[#383b32] font-medium text-lg">Carregando...</p>
    </div>
  )
}
