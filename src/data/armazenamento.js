import { ADVOGADOS_FIXOS } from './advogados'
import { supabase } from './supabase'

// Funções para salvar e buscar advogados no banco de dados (Supabase).
// Todas são assíncronas (async): a resposta vem pela internet, então
// quem chama precisa esperar com "await".

const TABELA = 'advogados'

// Sem 0/O e 1/I, para o código não ser confundido ao ser digitado.
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// No banco a coluna se chama criado_em; no JavaScript usamos criadoEm.
function doBanco({ criado_em, ...resto }) {
  return { ...resto, criadoEm: criado_em }
}

function exigirBanco() {
  if (!supabase) throw new Error('Supabase não configurado (veja o arquivo .env.example)')
}

// Aceita "sadv-7k3p9", " SADV-7K3P9 " ou só "7K3P9" e devolve "SADV-7K3P9".
export function normalizarCodigo(texto) {
  const limpo = String(texto ?? '').toUpperCase().replace(/\s/g, '')
  return limpo.startsWith('SADV-') ? limpo : `SADV-${limpo}`
}

export async function listarTodos() {
  exigirBanco()
  const { data, error } = await supabase.from(TABELA).select('*').order('criado_em')
  if (error) throw error
  return data.map(doBanco)
}

// Devolve o advogado ou null se o código não existir.
export async function buscarPorCodigo(codigo) {
  const procurado = normalizarCodigo(codigo)
  try {
    exigirBanco()
    const { data, error } = await supabase.from(TABELA).select('*').eq('codigo', procurado).maybeSingle()
    if (error) throw error
    return data ? doBanco(data) : null
  } catch (erro) {
    // Plano B: sem banco, consulta só os advogados fixos do código.
    console.warn('Banco indisponível, usando os advogados fixos:', erro.message)
    return ADVOGADOS_FIXOS.find((adv) => adv.codigo === procurado) ?? null
  }
}

export async function buscarPorOab(oab, uf) {
  exigirBanco()
  const { data, error } = await supabase.from(TABELA).select('*').eq('oab', oab).eq('uf', uf).maybeSingle()
  if (error) throw error
  return data ? doBanco(data) : null
}

export function gerarCodigo() {
  let sufixo = ''
  for (let i = 0; i < 5; i++) {
    sufixo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  }
  return `SADV-${sufixo}`
}

// Salva um novo advogado e devolve o registro completo (com código e status).
// O código é sorteado; se por acaso já existir, sorteia de novo.
export async function salvarAdvogado({ nome, oab, uf, email, telefone, foto }) {
  exigirBanco()
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const novo = { codigo: gerarCodigo(), nome, oab, uf, email, telefone, foto }
    const { data, error } = await supabase.from(TABELA).insert(novo).select().single()

    if (!error) return doBanco(data)
    // 23505 = valor repetido em um campo que deve ser único
    if (error.code === '23505' && error.message.includes('oab_uf')) {
      throw new Error(`Já existe um cadastro para a OAB ${oab}/${uf}.`)
    }
    if (error.code !== '23505') throw error
  }
  throw new Error('Não foi possível gerar um código único. Tente novamente.')
}

// Muda o status para "ativo" ou "bloqueado".
export async function alterarStatus(codigo, status) {
  exigirBanco()
  const { data, error } = await supabase
    .from(TABELA)
    .update({ status })
    .eq('codigo', normalizarCodigo(codigo))
    .select()
    .single()
  if (error) throw error
  return doBanco(data)
}

// Apaga os cadastros feitos na demonstração e devolve os fixos ao status original.
// Útil para "zerar" o sistema antes de apresentar.
export async function limparDemonstracao() {
  exigirBanco()
  const { error } = await supabase.from(TABELA).delete().eq('fixo', false)
  if (error) throw error
  for (const adv of ADVOGADOS_FIXOS) {
    await alterarStatus(adv.codigo, adv.status)
  }
}
