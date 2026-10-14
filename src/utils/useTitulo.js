import { useEffect } from 'react'

// Define o título da aba do navegador para a página atual.
// Ex: useTitulo('Cadastro') -> "Cadastro · SafeADV"
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · SafeADV` : 'SafeADV · Verificação de Advogados'
  }, [titulo])
}
