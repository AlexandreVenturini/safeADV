// Bloco provisório usado pelas páginas que ainda serão construídas.
export default function EmConstrucao({ titulo, children }) {
  return (
    <section className="rounded-2xl border border-marinho/10 p-6 text-center shadow-sm">
      <h1 className="text-2xl font-bold">{titulo}</h1>
      <p className="mt-2 text-marinho/70">{children}</p>
    </section>
  )
}
