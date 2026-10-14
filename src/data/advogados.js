// Advogados FICTÍCIOS fixos da demonstração.
// Eles também estão no banco (supabase/schema.sql). Esta cópia no código é o
// plano B: se o banco não responder, a consulta usa esta lista, e o QR Code
// impresso no banner continua funcionando em qualquer celular.
// Nomes, OABs e contatos são inventados.

export const ADVOGADOS_FIXOS = [
  {
    codigo: 'SADV-7K3P9',
    nome: 'Dra. Mariana Lopes Ferreira',
    oab: '123456',
    uf: 'ES',
    email: 'mariana.ferreira@exemplo.adv.br',
    telefone: '(27) 90000-1234',
    foto: null, // sem foto: a tela mostra as iniciais
    status: 'ativo',
    fixo: true,
  },
  {
    codigo: 'SADV-R8M4T',
    nome: 'Dr. Carlos Eduardo Nogueira',
    oab: '654321',
    uf: 'SP',
    email: 'carlos.nogueira@exemplo.adv.br',
    telefone: '(11) 90000-5678',
    foto: null,
    status: 'ativo',
    fixo: true,
  },
  {
    // Identificador bloqueado: simula um advogado que perdeu o celular
    // ou suspeita de uso indevido do seu perfil.
    codigo: 'SADV-B4X2N',
    nome: 'Dr. Ricardo Almeida Santos',
    oab: '987654',
    uf: 'ES',
    email: 'ricardo.santos@exemplo.adv.br',
    telefone: '(27) 90000-9876',
    foto: null,
    status: 'bloqueado',
    fixo: true,
  },
]
