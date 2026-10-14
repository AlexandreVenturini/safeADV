import { Link } from 'react-router-dom'

// Exibida quando o endereço digitado não corresponde a nenhuma rota.
export default function NaoEncontrada() {
  return (
    <section className="text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-dourado-escuro underline">
        Voltar ao início
      </Link>
    </section>
  )
}
