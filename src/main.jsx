import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import * as armazenamento from './data/armazenamento'

// Só no modo de desenvolvimento (npm run dev): deixa as funções de dados
// acessíveis no console do navegador como "safeadv", para testes.
if (import.meta.env.DEV) {
  window.safeadv = armazenamento
}

// BrowserRouter faz o React Router acompanhar o endereço da barra do navegador.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
