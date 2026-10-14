import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !chave) {
  console.warn('Supabase não configurado: usando apenas os advogados fixos. Veja o arquivo .env.example.')
}

export const supabase = url && chave ? createClient(url, chave, { auth: { persistSession: false } }) : null
