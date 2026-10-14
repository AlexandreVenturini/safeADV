import { Link } from 'react-router-dom'
import useTitulo from '../utils/useTitulo'

export default function NaoEncontrada() {
  useTitulo('Página não encontrada')

  return (
    <section className="text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link to="/" className="btn-primario mt-6">
        Voltar ao início
      </Link>
    </section>
  )
}
