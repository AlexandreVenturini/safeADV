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
