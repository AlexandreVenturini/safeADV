import { Link, Outlet } from 'react-router-dom'
import Logo from './Logo'

// Estrutura comum a todas as páginas: cabeçalho, conteúdo e rodapé.
// O <Outlet /> é onde o React Router coloca a página da rota atual.
export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-marinho shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="SafeADV - página inicial">
            <Logo />
          </Link>
          <Link
            to="/verificar"
            className="rounded-lg border border-dourado px-3 py-2 text-sm font-semibold text-dourado transition hover:bg-dourado hover:text-marinho"
          >
            Verificar advogado
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-marinho/10 bg-marinho/5">
        <p className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-marinho/70">
          SafeADV · Protótipo acadêmico. Todos os dados são simulados.
        </p>
      </footer>
    </div>
  )
}
