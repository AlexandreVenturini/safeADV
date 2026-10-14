import { useEffect } from 'react'

export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · SafeADV` : 'SafeADV · Verificação de Advogados'
  }, [titulo])
}
