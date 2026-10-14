// Logo do SafeADV: escudo (segurança) com balança (justiça), desenhado em SVG.
// Prop "tema": "escuro" para usar sobre fundo azul-marinho, "claro" sobre fundo branco.
export function LogoIcone({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* Escudo */}
      <path
        d="M32 4 56 12v18c0 15-10.5 25.5-24 30C18.5 55.5 8 45 8 30V12Z"
        fill="#142A46"
        stroke="#C5A15B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Balança */}
      <g stroke="#C5A15B" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M32 19v26M25 45h14M18 23h28" />
        <path d="M20 23l-4 11M20 23l4 11M44 23l-4 11M44 23l4 11" />
      </g>
      <circle cx="32" cy="18" r="2.5" fill="#C5A15B" />
      <path d="M15 34q5 6 10 0Z" fill="#C5A15B" />
      <path d="M39 34q5 6 10 0Z" fill="#C5A15B" />
    </svg>
  )
}

export default function Logo({ tema = 'escuro', className = '' }) {
  const corTexto = tema === 'escuro' ? 'text-branco' : 'text-marinho'

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcone />
      <span className={`text-2xl font-bold tracking-tight ${corTexto}`}>
        Safe<span className="text-dourado">ADV</span>
      </span>
    </span>
  )
}
