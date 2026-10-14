function iniciais(nome) {
  const partes = nome
    .replace(/^Dra?\.\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
  if (partes.length === 0) return '?'
  const primeira = partes[0][0]
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

export default function Avatar({ nome, foto, className = 'h-24 w-24 text-3xl' }) {
  if (foto) {
    return <img src={foto} alt={`Foto de ${nome}`} className={`${className} shrink-0 rounded-full object-cover`} />
  }
  return (
    <span
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-marinho font-bold text-dourado`}
      aria-label={`Iniciais de ${nome}`}
    >
      {iniciais(nome)}
    </span>
  )
}
