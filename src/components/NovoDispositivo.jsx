import { useEffect, useState } from 'react'

// ⚠️ SIMULAÇÃO: nenhum e-mail é enviado de verdade.
// Num sistema real, o identificador ficaria vinculado ao aparelho do advogado
// e, ao detectar um aparelho novo, o servidor enviaria o código por e-mail.
// Aqui o "e-mail" aparece na própria tela para a demonstração.

const TENTATIVAS_MAX = 3

// Aparelho fictício que "tentou" acessar
const DISPOSITIVO = { aparelho: 'Celular Android · Chrome', local: 'Vitória, ES (aproximado)' }

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// mariana.ferreira@exemplo.adv.br -> m****@exemplo.adv.br
function mascararEmail(email) {
  const [usuario, dominio] = email.split('@')
  return `${usuario[0]}****@${dominio}`
}

function IconeCelular() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" strokeLinecap="round" />
    </svg>
  )
}

export default function NovoDispositivo({ advogado, onBloquear, onSair }) {
  const [codigoEnviado, setCodigoEnviado] = useState(gerarCodigo)
  const [emailChegou, setEmailChegou] = useState(false)
  const [digitado, setDigitado] = useState('')
  const [erros, setErros] = useState(0)
  // 'verificando' | 'autorizado' | 'bloqueado'
  const [fase, setFase] = useState('verificando')
  const [motivoBloqueio, setMotivoBloqueio] = useState('')
  const [bloqueando, setBloqueando] = useState(false)
  const [falha, setFalha] = useState('')

  // O "e-mail" chega ~1,2 s depois de cada envio
  useEffect(() => {
    const timer = setTimeout(() => setEmailChegou(true), 1200)
    return () => clearTimeout(timer)
  }, [codigoEnviado])

  function reenviar() {
    setEmailChegou(false)
    setDigitado('')
    setCodigoEnviado(gerarCodigo())
  }

  async function bloquear(motivo) {
    setBloqueando(true)
    setFalha('')
    try {
      await onBloquear()
      setMotivoBloqueio(motivo)
      setFase('bloqueado')
    } catch {
      setFalha('Não foi possível bloquear agora. Verifique a conexão e tente novamente.')
    } finally {
      setBloqueando(false)
    }
  }

  function confirmar(evento) {
    evento.preventDefault()
    if (digitado === codigoEnviado) {
      setFase('autorizado')
      return
    }
    const totalErros = erros + 1
    setErros(totalErros)
    setDigitado('')
    if (totalErros >= TENTATIVAS_MAX) {
      bloquear('tentativas')
    }
  }

  if (fase === 'autorizado') {
    return (
      <section className="mx-auto max-w-md rounded-3xl border border-marinho/10 px-6 py-10 text-center shadow-lg">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dourado text-3xl font-bold">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-bold">Novo dispositivo autorizado</h1>
        <p className="mt-2 text-marinho/70">
          Este aparelho agora pode acessar o painel de {advogado.nome}. Num sistema real, o aparelho anterior receberia
          um aviso deste acesso.
        </p>
        <button type="button" onClick={onSair} className="btn-primario mt-8 w-full">
          Voltar ao painel
        </button>
      </section>
    )
  }

  if (fase === 'bloqueado') {
    return (
      <section className="mx-auto max-w-md overflow-hidden rounded-3xl border-2 border-red-600 text-center shadow-lg">
        <div className="bg-red-600 px-6 py-6 text-white">
          <h1 className="text-2xl font-bold">Identificador bloqueado</h1>
          <p className="text-sm text-white/90">Medida de segurança</p>
        </div>
        <div className="px-6 py-6">
          <p className="text-marinho/80">
            {motivoBloqueio === 'tentativas'
              ? `Foram digitados ${TENTATIVAS_MAX} códigos incorretos. Por segurança, o identificador foi bloqueado.`
              : 'Você informou que não reconhece este acesso. O identificador foi bloqueado.'}{' '}
            Quem consultar o código {advogado.codigo} verá um alerta de possível fraude.
          </p>
          <button type="button" onClick={onSair} className="btn-primario mt-6 w-full">
            Voltar ao painel
          </button>
        </div>
      </section>
    )
  }

  const restantes = TENTATIVAS_MAX - erros

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-3xl bg-marinho px-6 py-8 text-center text-branco shadow-lg">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dourado text-marinho">
          <IconeCelular />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Novo dispositivo detectado</h1>
        <p className="mt-2 text-sm text-white/80">
          O identificador SafeADV fica vinculado ao seu aparelho. Para usá-lo em outro dispositivo, é preciso uma nova
          validação.
        </p>
        <dl className="mt-5 space-y-1 rounded-2xl bg-white/10 p-4 text-left text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-white/60">Aparelho</dt>
            <dd className="text-right">{DISPOSITIVO.aparelho}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/60">Local</dt>
            <dd className="text-right">{DISPOSITIVO.local}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/60">Quando</dt>
            <dd>Agora</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-5">
        <p className="text-center text-sm text-marinho/80">
          Enviamos um código de 6 dígitos para <strong className="break-all">{mascararEmail(advogado.email)}</strong>
        </p>

        {/* "E-mail" simulado, exibido na tela para a demonstração */}
        <div className="rounded-2xl border-2 border-dashed border-dourado/60 p-4 text-sm" aria-live="polite">
          <p className="text-xs font-semibold tracking-wide text-dourado-escuro uppercase">
            📧 Simulação de e-mail recebido
          </p>
          {emailChegou ? (
            <div className="mt-2">
              <p className="text-marinho/60">De: SafeADV &lt;nao-responda@safeadv&gt;</p>
              <p className="mt-2">
                Seu código de verificação é{' '}
                <span className="font-mono text-lg font-bold tracking-widest">{codigoEnviado}</span>. Se não foi você,
                bloqueie seu identificador.
              </p>
            </div>
          ) : (
            <p className="mt-2 animate-pulse text-marinho/60">Enviando código...</p>
          )}
        </div>

        <form onSubmit={confirmar} className="space-y-3">
          <label htmlFor="codigo-email" className="block text-sm font-semibold">
            Código recebido por e-mail
          </label>
          <input
            id="codigo-email"
            className="campo text-center font-mono text-2xl tracking-[0.5em]"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value.replace(/\D/g, ''))}
            aria-invalid={erros > 0 ? true : undefined}
            disabled={bloqueando}
          />
          {erros > 0 && (
            <p role="alert" className="text-sm text-red-600">
              Código incorreto. {restantes > 0 ? `Restam ${restantes} tentativa${restantes > 1 ? 's' : ''}.` : ''}
            </p>
          )}
          {falha && (
            <p role="alert" className="text-sm text-red-600">
              {falha}
            </p>
          )}
          <button type="submit" className="btn-primario w-full" disabled={digitado.length !== 6 || bloqueando}>
            {bloqueando ? 'Bloqueando...' : 'Confirmar'}
          </button>
        </form>

        <div className="flex flex-col gap-2 text-sm">
          <button type="button" onClick={reenviar} disabled={bloqueando} className="font-semibold text-marinho underline">
            Reenviar código
          </button>
          <button
            type="button"
            onClick={() => bloquear('nao-fui-eu')}
            disabled={bloqueando}
            className="rounded-xl border-2 border-red-600 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            Não fui eu, bloquear identificador
          </button>
          <button type="button" onClick={onSair} disabled={bloqueando} className="py-2 text-marinho/60 underline">
            Cancelar
          </button>
        </div>
      </div>
    </section>
  )
}
