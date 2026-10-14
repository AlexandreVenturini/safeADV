import { useParams } from 'react-router-dom'
import EmConstrucao from '../components/EmConstrucao'

export default function Painel() {
  const { codigo } = useParams()
  return <EmConstrucao titulo={`Painel do advogado ${codigo}`}>Será construído na etapa 6.</EmConstrucao>
}
