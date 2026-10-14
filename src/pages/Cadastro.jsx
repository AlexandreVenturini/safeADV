import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import ValidacaoOab from '../components/ValidacaoOab'
import { buscarPorOab, salvarAdvogado } from '../data/armazenamento'
import { UFS } from '../data/ufs'
import { simularConsultaOab } from '../data/validacaoOab'
import { formatarTelefone, reduzirImagem, validarCadastro } from '../utils/formulario'

const VAZIO = { nome: '', oab: '', uf: '', email: '', telefone: '', foto: null }

// Campo com rótulo e mensagem de erro, para não repetir esse trecho em todo campo.
function Campo({ id, rotulo, erro, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  )
}

// O cadastro passa por três fases: formulário → validando (consulta à OAB) → concluído.
export default function Cadastro() {
  const [dados, setDados] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [fase, setFase] = useState('formulario')
  const [advogado, setAdvogado] = useState(null)

  function alterar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function escolherFoto(evento) {
    const arquivo = evento.target.files[0]
    if (!arquivo) return
    try {
      alterar('foto', await reduzirImagem(arquivo))
    } catch (erro) {
      setErros((atual) => ({ ...atual, foto: erro.message }))
    }
  }

  async function enviar(evento) {
    evento.preventDefault() // impede o navegador de recarregar a página
    const encontrados = validarCadastro(dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setErroGeral('')
    setFase('validando')
    try {
      if (await buscarPorOab(dados.oab, dados.uf)) {
        throw new Error(`Já existe um identificador SafeADV para a OAB ${dados.oab}/${dados.uf}.`)
      }
      await simularConsultaOab(dados.oab, dados.uf)
      const salvo = await salvarAdvogado({ ...dados, nome: dados.nome.trim(), email: dados.email.trim() })
      setAdvogado(salvo)
      setFase('concluido')
    } catch (erro) {
      setErroGeral(erro.message)
      setFase('formulario')
    }
  }

  if (fase === 'validando') {
    return <ValidacaoOab oab={dados.oab} uf={dados.uf} />
  }

  if (fase === 'concluido') {
    return (
      <section className="mx-auto max-w-md rounded-3xl border border-marinho/10 px-6 py-10 text-center shadow-lg">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dourado text-3xl font-bold">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-bold">Inscrição validada</h1>
        <p className="mt-1 text-marinho/70">Seu identificador SafeADV foi criado.</p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Avatar nome={advogado.nome} foto={advogado.foto} />
          <p className="text-lg font-semibold">{advogado.nome}</p>
          <p className="text-marinho/70">
            OAB {advogado.oab}/{advogado.uf}
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-marinho/5 p-4">
          <p className="text-sm text-marinho/70">Seu código exclusivo</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider">{advogado.codigo}</p>
        </div>

        <Link to={`/painel/${advogado.codigo}`} className="btn-primario mt-8 w-full">
          Acessar meu painel
        </Link>
      </section>
    )
  }

  // Liga o campo à sua mensagem de erro (acessibilidade para leitores de tela).
  const props = (campo) => ({
    id: campo,
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `${campo}-erro` : undefined,
  })

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold">Cadastro do advogado</h1>
      <p className="mt-2 text-marinho/70">
        Preencha seus dados. Vamos confirmar sua inscrição na OAB e gerar seu QR Code e código exclusivo.
      </p>

      {erroGeral && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {erroGeral}
        </p>
      )}

      <form onSubmit={enviar} noValidate className="mt-8 space-y-5">
        {/* Foto */}
        <div className="flex items-center gap-4">
          {dados.foto ? (
            <Avatar nome={dados.nome || '?'} foto={dados.foto} className="h-20 w-20" />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-marinho/25 text-xs text-marinho/50">
              Foto
            </span>
          )}
          <div>
            <label htmlFor="foto" className="btn-secundario cursor-pointer px-4 py-2 text-sm">
              {dados.foto ? 'Trocar foto' : 'Escolher foto'}
            </label>
            {/* accept="image/*" faz o celular oferecer a câmera ou a galeria */}
            <input {...props('foto')} type="file" accept="image/*" onChange={escolherFoto} className="sr-only" />
            {erros.foto && (
              <p id="foto-erro" className="mt-1 text-sm text-red-600">
                {erros.foto}
              </p>
            )}
          </div>
        </div>

        <Campo id="nome" rotulo="Nome completo" erro={erros.nome}>
          <input
            {...props('nome')}
            className="campo"
            autoComplete="name"
            value={dados.nome}
            onChange={(e) => alterar('nome', e.target.value)}
          />
        </Campo>

        <div className="grid grid-cols-3 gap-4">
          <Campo id="oab" rotulo="Número da OAB" erro={erros.oab} className="col-span-2">
            <input
              {...props('oab')}
              className="campo"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={dados.oab}
              onChange={(e) => alterar('oab', e.target.value.replace(/\D/g, ''))}
            />
          </Campo>
          <Campo id="uf" rotulo="UF" erro={erros.uf}>
            <select {...props('uf')} className="campo" value={dados.uf} onChange={(e) => alterar('uf', e.target.value)}>
              <option value="">--</option>
              {UFS.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </select>
          </Campo>
        </div>

        <Campo id="email" rotulo="E-mail profissional" erro={erros.email}>
          <input
            {...props('email')}
            className="campo"
            type="email"
            autoComplete="email"
            placeholder="voce@escritorio.adv.br"
            value={dados.email}
            onChange={(e) => alterar('email', e.target.value)}
          />
        </Campo>

        <Campo id="telefone" rotulo="Telefone (WhatsApp oficial)" erro={erros.telefone}>
          <input
            {...props('telefone')}
            className="campo"
            type="tel"
            autoComplete="tel"
            placeholder="(27) 99999-1234"
            value={dados.telefone}
            onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))}
          />
        </Campo>

        <button type="submit" className="btn-primario w-full">
          Validar inscrição na OAB
        </button>
        <p className="text-center text-xs text-marinho/60">
          Protótipo acadêmico: a validação na OAB é simulada.
        </p>
      </form>
    </section>
  )
}
