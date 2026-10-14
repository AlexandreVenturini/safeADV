// Endereço público de verificação de um código.
// Usa o endereço onde o site está aberto: no site publicado vira
// https://safe-adv.vercel.app/verificar/SADV-XXXXX
export function linkVerificacao(codigo) {
  return `${window.location.origin}/verificar/${codigo}`
}

// Monta uma imagem PNG com o QR Code, o código e o endereço do site embaixo,
// e faz o navegador baixar o arquivo.
export function baixarQrCode(canvasQr, codigo) {
  const margem = 60
  const lado = canvasQr.width
  const canvas = document.createElement('canvas')
  canvas.width = lado + margem * 2
  canvas.height = lado + margem * 2 + 150
  const g = canvas.getContext('2d')

  g.fillStyle = '#FFFFFF'
  g.fillRect(0, 0, canvas.width, canvas.height)
  g.drawImage(canvasQr, margem, margem)

  g.textAlign = 'center'
  g.fillStyle = '#142A46'
  g.font = 'bold 64px Consolas, ui-monospace, monospace'
  g.fillText(codigo, canvas.width / 2, lado + margem + 90)
  g.font = '34px system-ui, "Segoe UI", sans-serif'
  g.fillText(`Verifique este advogado em ${window.location.host}`, canvas.width / 2, lado + margem + 150)

  // Faixa dourada no rodapé
  g.fillStyle = '#C5A15B'
  g.fillRect(0, canvas.height - 24, canvas.width, 24)

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `safeadv-${codigo}.png`
  link.click()
}
