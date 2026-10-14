import { ADVOGADOS_FIXOS } from './advogados'
import { supabase } from './supabase'

const TABELA = 'advogados'

const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function doBanco({ criado_em, ...resto }) {
  return { ...resto, criadoEm: criado_em }
}

function exigirBanco() {
  if (!supabase) throw new Error('Supabase não configurado (veja o arquivo .env.example)')
}

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

export async function buscarPorCodigo(codigo) {
  const procurado = normalizarCodigo(codigo)
  try {
    exigirBanco()
    const { data, error } = await supabase.from(TABELA).select('*').eq('codigo', procurado).maybeSingle()
    if (error) throw error
    return data ? doBanco(data) : null
  } catch (erro) {
    console.warn('Banco indisponível, usando os advogados fixos:', erro.message)
    const fixo = ADVOGADOS_FIXOS.find((adv) => adv.codigo === procurado)
    if (fixo) return fixo
    throw new Error('Sem conexão com o banco de dados.', { cause: erro })
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

export async function salvarAdvogado({ nome, oab, uf, email, telefone, foto }) {
  exigirBanco()
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const novo = { codigo: gerarCodigo(), nome, oab, uf, email, telefone, foto }
    const { data, error } = await supabase.from(TABELA).insert(novo).select().single()

    if (!error) return doBanco(data)
    if (error.code === '23505' && error.message.includes('oab_uf')) {
      throw new Error(`Já existe um cadastro para a OAB ${oab}/${uf}.`)
    }
    if (error.code !== '23505') throw error
  }
  throw new Error('Não foi possível gerar um código único. Tente novamente.')
}

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

export async function limparDemonstracao() {
  exigirBanco()
  const { error } = await supabase.from(TABELA).delete().eq('fixo', false)
  if (error) throw error
  for (const adv of ADVOGADOS_FIXOS) {
    await alterarStatus(adv.codigo, adv.status)
  }
}
