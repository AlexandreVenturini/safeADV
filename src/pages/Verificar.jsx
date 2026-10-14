import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LogoIcone } from '../components/Logo'
import ResultadoConsulta from '../components/ResultadoConsulta'
import { normalizarCodigo } from '../data/armazenamento'
import useTitulo from '../utils/useTitulo'

// Campo para digitar o código. Ao enviar, vai para /verificar/CODIGO.
function FormularioCodigo() {
  const [texto, setTexto] = useState('')
  const navigate = useNavigate()

  function enviar(evento) {
    evento.preventDefault()
    if (!texto.trim()) return
    navigate(`/verificar/${normalizarCodigo(texto)}`)
    setTexto('')
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="codigo" className="sr-only">
        Código SafeADV
      </label>
      <input
        id="codigo"
        className="campo font-mono tracking-wider uppercase"
        placeholder="SADV-XXXXX"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        maxLength={12}
      />
      <button type="submit" className="btn-primario shrink-0">
        Verificar
      </button>
    </form>
  )
}

// Atende duas rotas: /verificar (digitar o código) e /verificar/:codigo (vindo do QR Code).
export default function Verificar() {
  const { codigo } = useParams()

  if (codigo) {
    return (
      <div className="mx-auto max-w-xl space-y-10">
        {/* key={codigo}: ao consultar outro código, o resultado começa do zero */}
        <ResultadoConsulta key={codigo} codigo={normalizarCodigo(codigo)} />
        <div>
          <h2 className="mb-2 text-sm font-semibold text-marinho/70">Consultar outro código</h2>
          <FormularioCodigo />
        </div>
      </div>
    )
  }

  return <DigitarCodigo />
}

// Tela inicial da consulta, onde o cliente digita o código.
function DigitarCodigo() {
  useTitulo('Verificar advogado')

  return (
    <section className="mx-auto max-w-xl">
      <div className="text-center">
        <LogoIcone className="mx-auto h-16 w-16" />
        <h1 className="mt-4 text-3xl font-bold">Verificar advogado</h1>
        <p className="mt-2 text-marinho/70">
          Digite o código SafeADV informado pelo advogado ou escaneie o QR Code dele com a câmera do celular.
        </p>
      </div>

      <div className="mt-8">
        <FormularioCodigo />
      </div>

      <div className="mt-8 rounded-2xl bg-marinho/5 p-5 text-sm">
        <h2 className="font-semibold">Quando verificar?</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-marinho/80">
          <li>Antes de fazer qualquer pagamento pedido por mensagem.</li>
          <li>Quando receber contato de um número ou perfil novo.</li>
          <li>Antes de enviar documentos ou dados pessoais.</li>
        </ul>
      </div>
    </section>
  )
}
