import { ADVOGADOS_FIXOS } from './advogados'

// Funções para salvar e buscar advogados.
// Não existe servidor: os cadastros feitos na demonstração ficam no localStorage,
// ou seja, só existem no navegador onde foram criados.

const CHAVE_CADASTROS = 'safeadv:advogados'
// Guarda bloqueios/reativações feitos nos advogados fixos durante a demonstração.
const CHAVE_STATUS_FIXOS = 'safeadv:status-fixos'

// Sem 0/O e 1/I, para o código não ser confundido ao ser digitado.
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function lerJSON(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao
  } catch {
    return padrao
  }
}

function salvarJSON(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

// Aceita "sadv-7k3p9", " SADV-7K3P9 " ou só "7K3P9" e devolve "SADV-7K3P9".
export function normalizarCodigo(texto) {
  const limpo = String(texto ?? '').toUpperCase().replace(/\s/g, '')
  return limpo.startsWith('SADV-') ? limpo : `SADV-${limpo}`
}

export function listarCadastrados() {
  return lerJSON(CHAVE_CADASTROS, [])
}

// Lista completa: fixos (com o status atualizado) + cadastrados na demonstração.
export function listarTodos() {
  const statusFixos = lerJSON(CHAVE_STATUS_FIXOS, {})
  const fixos = ADVOGADOS_FIXOS.map((adv) => ({
    ...adv,
    status: statusFixos[adv.codigo] ?? adv.status,
  }))
  return [...fixos, ...listarCadastrados()]
}

// Devolve o advogado ou null se o código não existir.
export function buscarPorCodigo(codigo) {
  const procurado = normalizarCodigo(codigo)
  return listarTodos().find((adv) => adv.codigo === procurado) ?? null
}

export function buscarPorOab(oab, uf) {
  return listarTodos().find((adv) => adv.oab === oab && adv.uf === uf) ?? null
}

// Gera um código no formato SADV-XXXXX que ainda não esteja em uso.
export function gerarCodigo() {
  let codigo
  do {
    let sufixo = ''
    for (let i = 0; i < 5; i++) {
      sufixo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
    }
    codigo = `SADV-${sufixo}`
  } while (buscarPorCodigo(codigo))
  return codigo
}

// Salva um novo advogado e devolve o registro completo (com código e status).
export function salvarAdvogado(dados) {
  const advogado = {
    ...dados,
    codigo: gerarCodigo(),
    status: 'ativo',
    fixo: false,
    criadoEm: new Date().toISOString(),
  }
  salvarJSON(CHAVE_CADASTROS, [...listarCadastrados(), advogado])
  return advogado
}

// Muda o status para "ativo" ou "bloqueado".
export function alterarStatus(codigo, status) {
  const procurado = normalizarCodigo(codigo)

  if (ADVOGADOS_FIXOS.some((adv) => adv.codigo === procurado)) {
    salvarJSON(CHAVE_STATUS_FIXOS, { ...lerJSON(CHAVE_STATUS_FIXOS, {}), [procurado]: status })
  } else {
    const atualizados = listarCadastrados().map((adv) =>
      adv.codigo === procurado ? { ...adv, status } : adv,
    )
    salvarJSON(CHAVE_CADASTROS, atualizados)
  }
  return buscarPorCodigo(procurado)
}

// Apaga tudo o que foi criado na demonstração (útil antes de apresentar).
export function limparDemonstracao() {
  localStorage.removeItem(CHAVE_CADASTROS)
  localStorage.removeItem(CHAVE_STATUS_FIXOS)
}
