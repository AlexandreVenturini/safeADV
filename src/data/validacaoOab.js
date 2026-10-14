// ⚠️ SIMULAÇÃO: este protótipo NÃO consulta a OAB de verdade.
// Num sistema real, aqui seria feita uma consulta ao Cadastro Nacional dos
// Advogados (CNA) para confirmar que a inscrição existe e está regular.
// Para a demonstração, qualquer número é aceito após ~2 segundos,
// exceto 000000, que simula uma inscrição inexistente (para mostrar uma recusa).

export const DURACAO_CONSULTA_MS = 2100

export function simularConsultaOab(oab, uf) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (oab === '000000') {
        reject(new Error(`Inscrição ${oab}/${uf} não encontrada no Cadastro Nacional dos Advogados.`))
      } else {
        resolve({ oab, uf, situacao: 'regular' })
      }
    }, DURACAO_CONSULTA_MS)
  })
}
