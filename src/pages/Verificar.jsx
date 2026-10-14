import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmConstrucao from '../components/EmConstrucao'
import { buscarPorCodigo } from '../data/armazenamento'

// Atende duas rotas: /verificar (digitar o código) e /verificar/:codigo (vindo do QR Code).
// Por enquanto só mostra o resultado da busca em texto; o visual final vem na etapa 7.
export default function Verificar() {
  const { codigo } = useParams()
  const [resultado, setResultado] = useState('Consultando...')

  useEffect(() => {
    if (!codigo) return
    buscarPorCodigo(codigo).then((advogado) =>
      setResultado(
        advogado
          ? `Encontrado: ${advogado.nome} (OAB ${advogado.oab}/${advogado.uf}) - status: ${advogado.status}`
          : 'Código não encontrado',
      ),
    )
  }, [codigo])

  if (codigo) {
    return <EmConstrucao titulo={`Consultando ${codigo}`}>{resultado}</EmConstrucao>
  }
  return <EmConstrucao titulo="Verificar advogado">Campo para digitar o código na etapa 7.</EmConstrucao>
}
