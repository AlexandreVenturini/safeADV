import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Cadastro from './pages/Cadastro'
import Inicio from './pages/Inicio'
import NaoEncontrada from './pages/NaoEncontrada'
import Painel from './pages/Painel'
import Verificar from './pages/Verificar'

// Mapa de rotas: cada endereço aponta para uma página.
// Todas ficam dentro do Layout, então compartilham cabeçalho e rodapé.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/painel/:codigo" element={<Painel />} />
        <Route path="/verificar" element={<Verificar />} />
        <Route path="/verificar/:codigo" element={<Verificar />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
