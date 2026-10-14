import { createClient } from '@supabase/supabase-js'

// Conexão com o banco de dados (Supabase).
// A URL e a chave vêm do arquivo .env.local (no computador) ou das
// variáveis de ambiente da Vercel (no site publicado).
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !chave) {
  console.warn('Supabase não configurado: usando apenas os advogados fixos. Veja o arquivo .env.example.')
}

// Se não estiver configurado, fica null e o armazenamento usa o plano B.
export const supabase = url && chave ? createClient(url, chave, { auth: { persistSession: false } }) : null
