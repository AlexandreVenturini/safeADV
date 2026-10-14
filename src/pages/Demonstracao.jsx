import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { limparDemonstracao, listarTodos } from '../data/armazenamento'
import useTitulo from '../utils/useTitulo'

function SeloStatus({ status }) {
  return status === 'ativo' ? (
    <span className="rounded-full bg-dourado px-2.5 py-0.5 text-xs font-bold">Ativo</span>
  ) : (
    <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">Bloqueado</span>
  )
}

function ListaAdvogados({ advogados }) {
  return (
    <ul className="mt-4 divide-y divide-marinho/10 rounded-2xl border border-marinho/10">
      {advogados.map((adv) => (
        <li key={adv.codigo} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{adv.nome}</p>
            <p className="flex items-center gap-2 text-sm text-marinho/70">
              <span className="font-mono">{adv.codigo}</span>
              <SeloStatus status={adv.status} />
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/painel/${adv.codigo}`} className="btn-secundario flex-1 px-4 py-2 text-sm">
              Painel
            </Link>
            <Link to={`/verificar/${adv.codigo}`} className="btn-secundario flex-1 px-4 py-2 text-sm">
              Consulta
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Demonstracao() {
  useTitulo('Área da demonstração')
  const [advogados, setAdvogados] = useState(null)
  const [erro, setErro] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [zerando, setZerando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    listarTodos()
      .then((lista) => ativo && setAdvogados(lista))
      .catch(
        () =>
          ativo &&
          setErro('Não foi possível carregar os dados do banco. Verifique a conexão e se o projeto no Supabase está ativo.'),
      )
    return () => {
      ativo = false
    }
  }, [versao])

  async function zerar() {
    setZerando(true)
    setErro('')
    try {
      await limparDemonstracao()
      setAviso('Demonstração zerada: cadastros de teste apagados e advogados fictícios no status original.')
      setConfirmando(false)
      setVersao((v) => v + 1)
    } catch {
      setErro('Não foi possível zerar agora. Tente novamente.')
    } finally {
      setZerando(false)
    }
  }

  const fixos = advogados?.filter((adv) => adv.fixo) ?? []
  const cadastrados = advogados?.filter((adv) => !adv.fixo) ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Área da demonstração</h1>
        <p className="mt-2 text-marinho/70">
          Página de apoio para quem apresenta. Ela não aparece no menu do site.
        </p>
      </header>

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </p>
      )}
      {aviso && (
        <p role="status" className="rounded-xl border border-dourado/40 bg-dourado/10 p-4">
          {aviso}
        </p>
      )}

      {advogados === null && !erro && <p className="text-marinho/70">Carregando...</p>}

      {advogados && (
        <>
          <section>
            <h2 className="text-xl font-bold">Advogados fictícios</h2>
            <p className="mt-1 text-sm text-marinho/70">
              Sempre disponíveis, inclusive para o QR Code impresso no banner.
            </p>
            <ListaAdvogados advogados={fixos} />
          </section>

          <section>
            <h2 className="text-xl font-bold">Cadastros feitos na demonstração ({cadastrados.length})</h2>
            {cadastrados.length > 0 ? (
              <ListaAdvogados advogados={cadastrados} />
            ) : (
              <p className="mt-2 text-marinho/70">Nenhum cadastro de teste no momento.</p>
            )}
          </section>
        </>
      )}

      <section className="rounded-3xl border border-red-200 p-6">
        <h2 className="text-xl font-bold">Zerar demonstração</h2>
        <p className="mt-2 text-sm text-marinho/80">
          Apaga todos os cadastros de teste e devolve os advogados fictícios ao status original. Use antes de
          apresentar.
        </p>
        {confirmando ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={zerar}
              disabled={zerando}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {zerando ? 'Zerando...' : 'Sim, apagar os cadastros de teste'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              disabled={zerando}
              className="btn-secundario flex-1 px-4"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 border-red-600 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 sm:w-auto"
          >
            Zerar demonstração
          </button>
        )}
      </section>
    </div>
  )
}
