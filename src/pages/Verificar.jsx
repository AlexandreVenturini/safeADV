import { useParams } from 'react-router-dom'
import EmConstrucao from '../components/EmConstrucao'

// Atende duas rotas: /verificar (digitar o código) e /verificar/:codigo (vindo do QR Code).
export default function Verificar() {
  const { codigo } = useParams()

  if (codigo) {
    return <EmConstrucao titulo={`Consultando ${codigo}`}>Resultado da verificação na etapa 7.</EmConstrucao>
  }
  return <EmConstrucao titulo="Verificar advogado">Campo para digitar o código na etapa 7.</EmConstrucao>
}
