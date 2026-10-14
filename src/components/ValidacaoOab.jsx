import { useEffect, useState } from 'react'
import { DURACAO_CONSULTA_MS } from '../data/validacaoOab'
import { LogoIcone } from './Logo'

// Tela de espera exibida durante a consulta (simulada) à OAB.
// As etapas vão sendo marcadas como concluídas ao longo da consulta.
const ETAPAS = [
  'Conectando ao Cadastro Nacional dos Advogados',
  'Localizando a inscrição',
  'Confirmando situação regular',
]

export default function ValidacaoOab({ oab, uf }) {
  const [concluidas, setConcluidas] = useState(0)

  useEffect(() => {
    const intervalo = DURACAO_CONSULTA_MS / ETAPAS.length
    const timers = ETAPAS.map((_, i) => setTimeout(() => setConcluidas(i + 1), intervalo * (i + 1) - 150))
    return () => timers.forEach(clearTimeout) // limpa os timers se a tela for fechada antes
  }, [])

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-marinho px-6 py-10 text-center text-branco shadow-lg" aria-live="polite">
      <LogoIcone className="mx-auto h-20 w-20 animate-pulse" />
      <h1 className="mt-6 text-2xl font-bold">Consultando OAB...</h1>
      <p className="mt-1 text-white/70">
        Inscrição <span className="font-mono">{oab}/{uf}</span>
      </p>

      <ul className="mt-8 space-y-3 text-left">
        {ETAPAS.map((etapa, i) => {
          const feita = i < concluidas
          return (
            <li key={etapa} className={`flex items-center gap-3 transition ${feita ? 'text-branco' : 'text-white/70'}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${feita ? 'bg-dourado text-marinho' : 'border border-white/30'}`}
              >
                {feita ? '✓' : ''}
              </span>
              {etapa}
            </li>
          )
        })}
      </ul>

      <p className="mt-8 text-xs text-white/70">Consulta simulada para fins de demonstração.</p>
    </section>
  )
}
