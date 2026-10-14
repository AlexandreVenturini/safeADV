import { Link } from 'react-router-dom'
import { LogoIcone } from '../components/Logo'
import { ADVOGADOS_FIXOS } from '../data/advogados'
import useTitulo from '../utils/useTitulo'

const PASSOS = [
  {
    titulo: 'Cadastro com OAB validada',
    texto: 'O advogado se cadastra e o SafeADV confirma a inscrição na Ordem dos Advogados do Brasil.',
  },
  {
    titulo: 'QR Code e código exclusivo',
    texto: 'O profissional recebe um QR Code e um código no formato SADV-XXXXX para divulgar aos clientes.',
  },
  {
    titulo: 'Cliente confere em segundos',
    texto: 'Antes de pagar ou enviar documentos, o cliente escaneia o QR Code ou digita o código e vê os dados oficiais.',
  },
]

const SEGURANCA = [
  {
    titulo: 'Vinculado ao dispositivo',
    texto: 'O acesso fica ligado ao aparelho do advogado. Em outro dispositivo, é exigida nova validação.',
  },
  {
    titulo: 'Bloqueio imediato',
    texto: 'Em caso de perda do celular ou suspeita de uso indevido, o advogado bloqueia o identificador.',
  },
  {
    titulo: 'Alerta de fraude',
    texto: 'Códigos bloqueados ou inexistentes exibem um alerta claro para o cliente não seguir adiante.',
  },
]

export default function Inicio() {
  useTitulo()

  return (
    <div className="space-y-14">
      <section className="rounded-3xl bg-marinho px-6 py-10 text-center text-branco shadow-lg sm:px-12 sm:py-14">
        <LogoIcone className="mx-auto h-20 w-20 sm:h-24 sm:w-24" />
        <h1 className="mt-6 text-3xl leading-tight font-bold sm:text-5xl">
          Confirme se o advogado <span className="text-dourado">é quem diz ser</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
          O SafeADV verifica a identidade de advogados e ajuda a prevenir golpes com perfis falsos que usam nome, foto e
          dados de profissionais reais.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/cadastro" className="btn-primario">
            Sou advogado
          </Link>
          <Link to="/verificar" className="btn-secundario text-branco">
            Verificar advogado
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">O golpe do falso advogado</h2>
        <p className="mt-3 text-marinho/80">
          Golpistas criam perfis com o nome e a foto de advogados para entrar em contato com clientes, pedir pagamentos
          e obter informações sensíveis. Sem uma forma simples de conferir, fica difícil saber se o contato é legítimo.
        </p>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Como funciona</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="rounded-2xl border border-marinho/10 p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-dourado text-lg font-bold">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-marinho/75">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-marinho/5 px-6 py-10 sm:px-10">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Camadas extras de segurança</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {SEGURANCA.map((item) => (
            <li key={item.titulo} className="border-l-4 border-dourado pl-4">
              <h3 className="font-semibold">{item.titulo}</h3>
              <p className="mt-1 text-sm text-marinho/75">{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mx-auto max-w-3xl text-center text-sm text-marinho/70">
        O SafeADV não substitui os mecanismos oficiais de identificação profissional da OAB. É uma camada complementar
        de verificação para tornar o contato entre advogados e clientes mais seguro.
      </p>

      <section className="mx-auto max-w-3xl rounded-2xl border border-dashed border-marinho/25 p-5">
        <h2 className="text-sm font-semibold tracking-wide text-marinho/70 uppercase">Códigos para teste</h2>
        <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {ADVOGADOS_FIXOS.map((adv) => (
            <li key={adv.codigo}>
              <Link
                to={`/verificar/${adv.codigo}`}
                className="flex items-center gap-2 rounded-lg bg-marinho/5 px-3 py-2.5 text-sm hover:bg-marinho/10"
              >
                <span className="font-mono font-semibold">{adv.codigo}</span>
                <span className="text-marinho/70">· {adv.status === 'ativo' ? 'ativo' : 'bloqueado'}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/verificar/SADV-FALSO"
              className="flex items-center gap-2 rounded-lg bg-marinho/5 px-3 py-2.5 text-sm hover:bg-marinho/10"
            >
              <span className="font-mono font-semibold">SADV-FALSO</span>
              <span className="text-marinho/70">· não existe</span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
