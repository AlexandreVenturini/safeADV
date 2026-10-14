# SafeADV

**Verificação de identidade de advogados para prevenir golpes com perfis falsos.**

🔗 **Site:** https://safe-adv.vercel.app

Protótipo acadêmico desenvolvido a partir da proposta *ID Advocacia: proposta de solução digital para verificação de identidade e prevenção de fraudes na advocacia* (16º Pulsare Summit · UniCB).

---

## O problema

Golpistas criam perfis com o nome e a foto de advogados reais para entrar em contato com clientes, pedir pagamentos e obter informações sensíveis. Sem uma forma simples de conferir, o cliente não sabe se o contato é legítimo.

## A solução

O advogado se cadastra, tem a inscrição na OAB validada e recebe um **QR Code** e um **código exclusivo** (`SADV-XXXXX`). O cliente escaneia o QR ou digita o código e vê na hora se o profissional é verificado, com os contatos oficiais.

O SafeADV **não substitui** os mecanismos oficiais da OAB: é uma camada complementar de verificação.

## Funcionalidades

**Advogado**
- Cadastro com nome, OAB, UF, e-mail, telefone e foto
- Validação da inscrição na OAB (simulada)
- Painel com QR Code, código exclusivo e download do QR em alta resolução
- Bloqueio e reativação do identificador
- Vínculo ao dispositivo: acesso de outro aparelho exige código enviado por e-mail (simulado); 3 erros bloqueiam o identificador

**Cliente**
- Consulta pelo QR Code ou digitando o código
- Três resultados: ✅ **Verificado** · ⚠️ **Bloqueado** (possível fraude) · ❌ **Não encontrado** (possível perfil falso)

## O que é simulado

| Parte | No protótipo | Num sistema real |
|---|---|---|
| Validação na OAB | Aceita qualquer número após ~2 s (exceto `000000`, que simula recusa) | Consulta ao Cadastro Nacional dos Advogados (CNA) |
| E-mail com código | Exibido na própria tela | Enviado ao e-mail do advogado |
| Vínculo ao dispositivo | Botão "Simular acesso de outro dispositivo" | Identificação do aparelho no login |
| Acesso ao painel | Qualquer pessoa com o código abre o painel | Login com senha e autenticação |

Os advogados cadastrados são **fictícios**.

## Códigos para teste

| Código | Advogado | Resultado |
|---|---|---|
| `SADV-7K3P9` | Dra. Mariana Lopes Ferreira | ✅ Verificado |
| `SADV-R8M4T` | Dr. Carlos Eduardo Nogueira | ✅ Verificado |
| `SADV-B4X2N` | Dr. Ricardo Almeida Santos | ⚠️ Bloqueado |
| `SADV-FALSO` | (não existe) | ❌ Não encontrado |

A página [`/demonstracao`](https://safe-adv.vercel.app/demonstracao) (fora do menu) reúne atalhos e o botão para apagar os cadastros de teste.

## Tecnologias

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) (cores em `src/index.css`)
- [React Router](https://reactrouter.com)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [Supabase](https://supabase.com) (banco de dados PostgreSQL)
- [Vercel](https://vercel.com) (hospedagem)

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais recente.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um projeto no [Supabase](https://supabase.com) e rode o arquivo [`supabase/schema.sql`](supabase/schema.sql) no **SQL Editor**. Ele cria a tabela, as regras de acesso e os advogados fictícios.
3. Copie `.env.example` para `.env.local` e preencha com a URL e a chave **publishable** do projeto (Project Settings > API Keys).
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   e abra http://localhost:5173. Para testar no celular (mesmo Wi-Fi), use `npm run dev -- --host`.

> No Windows, se o PowerShell bloquear o `npm`, use `npm.cmd` no lugar.

Sem o `.env.local`, o site funciona apenas com os advogados fictícios.

## Estrutura

```
src/
├── pages/           telas (Inicio, Cadastro, Painel, Verificar, Demonstracao, NaoEncontrada)
├── components/      partes reutilizáveis (Layout, Logo, Avatar, ResultadoConsulta, NovoDispositivo, ValidacaoOab)
├── data/            acesso aos dados: Supabase, advogados fictícios e simulação da OAB
└── utils/           funções de apoio (formulário, QR Code, título da aba)
supabase/schema.sql  estrutura do banco e regras de acesso
```

## Segurança e limitações

- O banco usa **Row Level Security**: a chave pública só consulta, cadastra novos advogados (sempre como ativos), altera o **status** e apaga cadastros de teste. Nome, OAB e contatos não podem ser alterados, e os advogados fictícios não podem ser apagados.
- Por ser um protótipo **sem login**, qualquer pessoa com um código pode abrir o painel correspondente.
- Se o banco estiver fora do ar, os advogados fictícios continuam sendo consultados a partir do próprio código do site.
