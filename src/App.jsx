// Tela provisória só para conferir se o Tailwind e as cores estão funcionando.
// Na etapa 2 ela será substituída pelas rotas e pelo layout do SafeADV.
function App() {
  return (
    <main className="min-h-svh bg-marinho text-branco flex flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">
        Safe<span className="text-dourado">ADV</span>
      </h1>
      <p className="max-w-md text-white/80">
        Verificação de identidade de advogados. Configuração inicial concluída.
      </p>
      <button className="rounded-lg bg-dourado px-6 py-3 font-semibold text-marinho hover:bg-dourado-escuro">
        Botão de teste
      </button>
    </main>
  )
}

export default App
