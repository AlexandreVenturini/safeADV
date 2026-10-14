export function formatarTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function validarCadastro({ nome, oab, uf, email, telefone, foto }) {
  const erros = {}
  if (nome.trim().split(/\s+/).length < 2) erros.nome = 'Informe o nome completo.'
  if (!/^\d{3,6}$/.test(oab)) erros.oab = 'Use de 3 a 6 dígitos.'
  if (!uf) erros.uf = 'Escolha a UF.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) erros.email = 'Informe um e-mail válido.'
  const digitos = telefone.replace(/\D/g, '').length
  if (digitos < 10 || digitos > 11) erros.telefone = 'Informe o telefone com DDD.'
  if (!foto) erros.foto = 'Envie uma foto de perfil.'
  return erros
}

export function reduzirImagem(arquivo, tamanho = 320) {
  return new Promise((resolve, reject) => {
    const endereco = URL.createObjectURL(arquivo)
    const imagem = new Image()
    imagem.onload = () => {
      const lado = Math.min(imagem.width, imagem.height)
      const canvas = document.createElement('canvas')
      canvas.width = tamanho
      canvas.height = tamanho
      canvas
        .getContext('2d')
        .drawImage(imagem, (imagem.width - lado) / 2, (imagem.height - lado) / 2, lado, lado, 0, 0, tamanho, tamanho)
      URL.revokeObjectURL(endereco)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    imagem.onerror = () => {
      URL.revokeObjectURL(endereco)
      reject(new Error('Não foi possível ler esta imagem.'))
    }
    imagem.src = endereco
  })
}
