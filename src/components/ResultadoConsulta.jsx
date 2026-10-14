import { useEffect, useState } from 'react'
import { buscarPorCodigo } from '../data/armazenamento'
import Avatar from './Avatar'

// Resultado da verificação de um código: Verificado, Bloqueado ou Não encontrado.
// Cada resultado tem cor e ícone próprios para ser entendido em um segundo.

function SeloVerificado({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#C5A15B" stroke="#FFFFFF" strokeWidth="3" />
      <path
        d="M14 24.5l6.5 6.5L34 17.5"
        fill="none"
        stroke="#142A46"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeAlerta({ tipo }) {
  return (
    <svg viewBox="0 0 48 48" className="mx-auto h-16 w-16" aria-hidden="true">
      {tipo === 'bloqueado' ? (
        <>
          <path d="M24 5 45 42H3Z" fill="#FFFFFF" strokeLinejoin="round" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M24 18v11" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="24" cy="35.5" r="2.6" fill="#DC2626" />
        </>
      ) : (
        <>
          <circle cx="24" cy="24" r="21" fill="#FFFFFF" />
          <path d="M16.5 16.5l15 15M31.5 16.5l-15 15" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

function DataConsulta({ quando }) {
  return (
    <p className="px-6 pb-5 text-center text-xs text-marinho/50">
      Consulta realizada em {quando.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
    </p>
  )
}

// Orientações para quando o resultado não é "verificado"
function OQueFazer({ conferirDigitacao }) {
  return (
    <div className="mt-5 rounded-2xl bg-red-50 p-5">
      <h3 className="font-semibold text-red-800">O que fazer agora</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-red-900/90">
        {conferirDigitacao && <li>Confira se o código foi digitado corretamente.</li>}
        <li>
          <strong>Não faça pagamentos</strong> nem transferências.
        </li>
        <li>Não envie documentos nem dados pessoais.</li>
        <li>
          Confirme a inscrição no{' '}
          <a href="https://cna.oab.org.br/" target="_blank" rel="noreferrer" className="font-semibold underline">
            Cadastro Nacional dos Advogados (OAB)
          </a>
          .
        </li>
        <li>Procure o advogado por um canal que você já conhece, como o telefone do escritório.</li>
      </ul>
    </div>
  )
}

function Verificado({ advogado, quando }) {
  const digitos = advogado.telefone.replace(/\D/g, '')
  return (
    <section className="overflow-hidden rounded-3xl border-2 border-dourado shadow-lg">
      <div className="bg-marinho px-6 py-6 text-center text-branco">
        <SeloVerificado className="mx-auto h-16 w-16" />
        <h1 className="mt-3 text-2xl font-bold text-dourado">Advogado verificado</h1>
        <p className="text-sm text-white/80">Identidade confirmada pelo SafeADV</p>
      </div>

      <div className="px-6 pt-6 text-center">
        <div className="relative mx-auto w-fit">
          <Avatar nome={advogado.nome} foto={advogado.foto} className="h-28 w-28 text-4xl ring-4 ring-dourado" />
          <SeloVerificado className="absolute -right-1 -bottom-1 h-10 w-10" />
        </div>
        <h2 className="mt-4 text-xl font-bold">{advogado.nome}</h2>
        <p className="text-marinho/80">
          OAB {advogado.oab}/{advogado.uf}
        </p>
        <p className="mt-1 font-mono text-sm text-marinho/60">{advogado.codigo}</p>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-sm font-semibold tracking-wide text-marinho/60 uppercase">Contato oficial</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-marinho/60">E-mail</dt>
            <dd className="text-right font-medium break-all">{advogado.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-marinho/60">Telefone</dt>
            <dd className="font-medium">{advogado.telefone}</dd>
          </div>
        </dl>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <a href={`mailto:${advogado.email}`} className="btn-secundario px-2 py-2">
            E-mail
          </a>
          <a href={`tel:+55${digitos}`} className="btn-secundario px-2 py-2">
            Ligar
          </a>
          <a href={`https://wa.me/55${digitos}`} target="_blank" rel="noreferrer" className="btn-secundario px-2 py-2">
            WhatsApp
          </a>
        </div>
      </div>

      <p className="mx-6 mb-4 rounded-xl bg-dourado/15 p-4 text-sm">
        <strong>Confira:</strong> o contato que você recebeu deve ser exatamente este. Pedidos de pagamento vindos de
        outro número ou e-mail podem ser golpe.
      </p>
      <DataConsulta quando={quando} />
    </section>
  )
}

function Bloqueado({ advogado, quando }) {
  return (
    <section className="overflow-hidden rounded-3xl border-2 border-red-600 shadow-lg">
      <div className="bg-red-600 px-6 py-6 text-center text-white">
        <IconeAlerta tipo="bloqueado" />
        <h1 className="mt-3 text-2xl font-bold">Identificador bloqueado</h1>
        <p className="text-sm font-semibold text-white/90">Atenção: possível fraude</p>
      </div>
      <div className="px-6 py-6">
        <p>
          O código <span className="font-mono font-semibold">{advogado.codigo}</span> pertence a{' '}
          <strong>{advogado.nome}</strong> (OAB {advogado.oab}/{advogado.uf}), mas foi <strong>bloqueado</strong> pelo
          próprio advogado, por exemplo por perda do celular ou suspeita de uso indevido.
        </p>
        <OQueFazer />
      </div>
      <DataConsulta quando={quando} />
    </section>
  )
}

function NaoEncontrado({ codigo, quando }) {
  return (
    <section className="overflow-hidden rounded-3xl border-2 border-red-600 shadow-lg">
      <div className="bg-red-600 px-6 py-6 text-center text-white">
        <IconeAlerta tipo="nao-encontrado" />
        <h1 className="mt-3 text-2xl font-bold">Código não encontrado</h1>
        <p className="text-sm font-semibold text-white/90">Atenção: possível perfil falso</p>
      </div>
      <div className="px-6 py-6">
        <p>
          Nenhum advogado está cadastrado no SafeADV com o código{' '}
          <span className="font-mono font-semibold break-all">{codigo}</span>. Se você recebeu este código de alguém que
          diz ser advogado, desconfie.
        </p>
        <OQueFazer conferirDigitacao />
      </div>
      <DataConsulta quando={quando} />
    </section>
  )
}

export default function ResultadoConsulta({ codigo }) {
  const [estado, setEstado] = useState({ fase: 'carregando' })
  const [quando] = useState(() => new Date())

  useEffect(() => {
    let ativo = true // evita atualizar a tela se a pessoa já saiu da página
    buscarPorCodigo(codigo)
      .then((advogado) => ativo && setEstado({ fase: 'pronto', advogado }))
      .catch(() => ativo && setEstado({ fase: 'erro' }))
    return () => {
      ativo = false
    }
  }, [codigo])

  if (estado.fase === 'carregando') {
    return (
      <div className="flex flex-col items-center py-16 text-marinho/70" aria-live="polite">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-marinho/15 border-t-dourado" />
        <p className="mt-4">
          Verificando <span className="font-mono">{codigo}</span>...
        </p>
      </div>
    )
  }

  if (estado.fase === 'erro') {
    return (
      <section role="alert" className="rounded-3xl border border-marinho/15 p-6 text-center">
        <h1 className="text-xl font-bold">Não foi possível consultar agora</h1>
        <p className="mt-2 text-marinho/70">Verifique sua conexão com a internet e tente novamente.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primario mt-5">
          Tentar novamente
        </button>
      </section>
    )
  }

  const { advogado } = estado
  if (!advogado) return <NaoEncontrado codigo={codigo} quando={quando} />
  if (advogado.status === 'bloqueado') return <Bloqueado advogado={advogado} quando={quando} />
  return <Verificado advogado={advogado} quando={quando} />
}
