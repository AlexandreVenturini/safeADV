import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { alterarStatus, buscarPorCodigo } from '../data/armazenamento'
import { baixarQrCode, linkVerificacao } from '../utils/qrcode'

// Escudo do SafeADV no centro do QR Code. O nível de correção "H" permite
// cobrir até ~30% do QR Code e ele continua legível.
const LOGO_NO_QR = (tamanho) => ({ src: '/favicon.svg', width: tamanho, height: tamanho, excavate: true })

function SeloStatus({ status }) {
  const ativo = status === 'ativo'
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${ativo ? 'bg-dourado text-marinho' : 'bg-red-600 text-white'}`}
    >
      <span className={`h-2 w-2 rounded-full ${ativo ? 'bg-marinho' : 'bg-white'}`} />
      {ativo ? 'Ativo' : 'Bloqueado'}
    </span>
  )
}

export default function Painel() {
  const { codigo } = useParams()
  // undefined = carregando, null = não encontrado
  const [advogado, setAdvogado] = useState(undefined)
  const [confirmandoBloqueio, setConfirmandoBloqueio] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [erro, setErro] = useState('')
  const [falhaAoCarregar, setFalhaAoCarregar] = useState(false)
  // Referência ao QR Code grande (invisível) usado para gerar a imagem de download
  const qrParaDownload = useRef(null)

  useEffect(() => {
    let ativo = true // evita atualizar a tela se a pessoa já saiu da página
    buscarPorCodigo(codigo)
      .then((encontrado) => ativo && setAdvogado(encontrado))
      .catch(() => ativo && setFalhaAoCarregar(true))
    return () => {
      ativo = false
    }
  }, [codigo])

  async function mudarStatus(novoStatus) {
    setSalvando(true)
    setErro('')
    try {
      setAdvogado(await alterarStatus(advogado.codigo, novoStatus))
      setConfirmandoBloqueio(false)
    } catch {
      setErro('Não foi possível alterar o status. Verifique a conexão e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  function copiarCodigo() {
    navigator.clipboard
      ?.writeText(advogado.codigo)
      .then(() => {
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
      })
      .catch(() => {})
  }

  function baixar() {
    try {
      baixarQrCode(qrParaDownload.current, advogado.codigo)
    } catch {
      setErro('Não foi possível gerar a imagem do QR Code neste navegador.')
    }
  }

  if (falhaAoCarregar) {
    return (
      <p role="alert" className="py-20 text-center text-marinho/70">
        Não foi possível carregar o painel agora. Verifique a conexão e recarregue a página.
      </p>
    )
  }

  if (advogado === undefined) {
    return <p className="py-20 text-center text-marinho/60">Carregando painel...</p>
  }

  if (advogado === null) {
    return (
      <section className="mx-auto max-w-md py-10 text-center">
        <h1 className="text-2xl font-bold">Identificador não encontrado</h1>
        <p className="mt-2 text-marinho/70">
          Não existe cadastro com o código <span className="font-mono">{codigo}</span>.
        </p>
        <Link to="/cadastro" className="btn-primario mt-6">
          Fazer cadastro
        </Link>
      </section>
    )
  }

  const bloqueado = advogado.status === 'bloqueado'
  const link = linkVerificacao(advogado.codigo)

  return (
    <div className="space-y-6">
      {/* Cabeçalho com identificação e status */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar nome={advogado.nome} foto={advogado.foto} className="h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl" />
          <div>
            <p className="text-sm text-marinho/60">Painel do advogado</p>
            <h1 className="text-xl font-bold sm:text-2xl">{advogado.nome}</h1>
            <p className="text-marinho/70">
              OAB {advogado.oab}/{advogado.uf}
            </p>
          </div>
        </div>
        <div>
          <SeloStatus status={advogado.status} />
        </div>
      </header>

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code e código exclusivo */}
        <section className="rounded-3xl bg-marinho p-6 text-center text-branco shadow-lg">
          <h2 className="text-lg font-semibold">Seu QR Code de verificação</h2>

          <div className="relative mx-auto mt-4 w-fit rounded-2xl bg-branco p-4">
            <QRCodeCanvas
              value={link}
              size={220}
              level="H"
              fgColor="#142A46"
              imageSettings={LOGO_NO_QR(52)}
              className={bloqueado ? 'opacity-20 grayscale' : ''}
            />
            {bloqueado && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-lg bg-red-600 px-3 py-1 text-sm font-bold text-white">BLOQUEADO</span>
              </span>
            )}
          </div>

          <p className="mt-5 text-sm text-white/70">Código exclusivo</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-mono text-2xl font-bold tracking-wider text-dourado">{advogado.codigo}</span>
            <button
              type="button"
              onClick={copiarCodigo}
              className="rounded-lg border border-white/30 px-2 py-1 text-xs hover:bg-white/10"
            >
              {copiado ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={baixar} className="btn-primario">
              Baixar QR Code
            </button>
            <Link to={`/verificar/${advogado.codigo}`} target="_blank" className="btn-secundario text-branco">
              Ver página pública
            </Link>
          </div>

          <p className="mt-5 text-xs text-white/60">
            Divulgue no cartão de visita, na assinatura de e-mail e nas redes sociais. Quem escanear verá seus dados
            oficiais.
          </p>

          {/* Versão grande e invisível do QR Code, usada só para gerar a imagem baixada */}
          <QRCodeCanvas
            ref={qrParaDownload}
            value={link}
            size={800}
            level="H"
            fgColor="#142A46"
            imageSettings={LOGO_NO_QR(180)}
            style={{ display: 'none' }}
          />
        </section>

        <div className="space-y-6">
          {/* Contato oficial */}
          <section className="rounded-3xl border border-marinho/10 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Contato oficial</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-marinho/60">E-mail</dt>
                <dd className="font-medium break-all">{advogado.email}</dd>
              </div>
              <div>
                <dt className="text-marinho/60">Telefone</dt>
                <dd className="font-medium">{advogado.telefone}</dd>
              </div>
              {advogado.criadoEm && (
                <div>
                  <dt className="text-marinho/60">Cadastrado em</dt>
                  <dd className="font-medium">{new Date(advogado.criadoEm).toLocaleDateString('pt-BR')}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Status e bloqueio */}
          <section
            className={`rounded-3xl border p-6 shadow-sm ${bloqueado ? 'border-red-200 bg-red-50' : 'border-marinho/10'}`}
          >
            <h2 className="text-lg font-semibold">Segurança do identificador</h2>

            {bloqueado ? (
              <>
                <p className="mt-2 text-sm text-marinho/80">
                  Seu identificador está <strong>bloqueado</strong>. Quem consultar seu código verá um alerta de possível
                  fraude.
                </p>
                <button
                  type="button"
                  onClick={() => mudarStatus('ativo')}
                  disabled={salvando}
                  className="btn-primario mt-4 w-full"
                >
                  {salvando ? 'Reativando...' : 'Reativar identificador'}
                </button>
                <p className="mt-2 text-xs text-marinho/60">
                  Num sistema real, a reativação exigiria uma nova validação de identidade.
                </p>
              </>
            ) : confirmandoBloqueio ? (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">Bloquear seu identificador?</p>
                <p className="mt-1 text-sm text-red-700/80">
                  Clientes que consultarem seu código verão um alerta de possível fraude até você reativar.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => mudarStatus('bloqueado')}
                    disabled={salvando}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {salvando ? 'Bloqueando...' : 'Sim, bloquear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmandoBloqueio(false)}
                    disabled={salvando}
                    className="btn-secundario flex-1 px-4"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-marinho/80">
                  Seu identificador está <strong>ativo</strong>. Em caso de perda do celular ou suspeita de uso indevido,
                  bloqueie imediatamente.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmandoBloqueio(true)}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 border-red-600 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
                >
                  Bloquear identificador
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
