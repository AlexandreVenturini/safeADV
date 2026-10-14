# Roteiro da apresentação · SafeADV

Site: **https://safe-adv.vercel.app**

## Na véspera

- [ ] Entrar no [painel do Supabase](https://supabase.com/dashboard) e conferir se o projeto **safeADV** está ativo. No plano gratuito ele pausa após 7 dias sem uso; se estiver pausado, clicar em **Restore** (leva alguns minutos).
- [ ] Abrir https://safe-adv.vercel.app/demonstracao e clicar em **Zerar demonstração**.
- [ ] Banner: abrir https://safe-adv.vercel.app/painel/SADV-7K3P9, clicar em **Baixar QR Code** e usar essa imagem. Testar o QR impresso com a câmera de pelo menos dois celulares.
- [ ] Separar uma foto para o cadastro ao vivo (ou usar a câmera do celular na hora).
- [ ] Tirar prints das telas principais (plano B se a internet do local falhar).

## No dia, antes de começar

- [ ] Notebook conectado à internet, com duas abas abertas: a página inicial e `/demonstracao`.
- [ ] Celular carregado, com a câmera pronta para ler QR Code.

## Demonstração (~5 minutos)

**1. O problema** (página inicial)
Mostrar o topo e a seção "O golpe do falso advogado".

**2. O cliente verifica** (banner)
Pedir para alguém da plateia escanear o QR do banner → aparece **Advogado verificado**, com selo dourado e contato oficial. Destacar o aviso "o contato que você recebeu deve ser exatamente este".

**3. Quando é golpe**
Em "Verificar advogado", digitar:
- `B4X2N` → **Identificador bloqueado** (possível fraude)
- `FALSO` → **Código não encontrado** (possível perfil falso)

Mostrar o guia "O que fazer agora".

**4. O advogado se cadastra** (ao vivo)
"Sou advogado" → preencher → **Consultando OAB...** → **Inscrição validada** → **Acessar meu painel**.
Mostrar o QR na tela e pedir para alguém escanear: o cadastro recém-feito já aparece como verificado no celular.

> Para mostrar uma recusa da OAB, use o número `000000`.

**5. Segurança: outro dispositivo e bloqueio**
No painel, **Simular acesso de outro dispositivo** → explicar o código por e-mail → clicar em **Não fui eu, bloquear identificador**.
Pedir para a mesma pessoa **recarregar** a página no celular → agora aparece o **alerta de fraude**.
Voltar ao painel e **Reativar**.

**6. Fechamento**
- O que é simulado: consulta à OAB, envio de e-mail e identificação do aparelho.
- Próximos passos: integração com o Cadastro Nacional dos Advogados, login dos advogados, envio real de e-mail, testes com usuários.

## Se algo der errado

| Situação | O que fazer |
|---|---|
| Consulta mostra "Não foi possível consultar agora" | Banco fora do ar ou internet fraca. Os códigos fictícios (`7K3P9`, `R8M4T`, `B4X2N`) continuam funcionando; seguir com eles. |
| Cadastro diz que a OAB já existe | Usar outro número ou zerar em `/demonstracao`. |
| Internet do local caiu | Usar os prints e o roteiro acima. |

## Perguntas prováveis

**A validação na OAB é real?**
Não. No protótipo é simulada; num sistema real seria uma consulta ao Cadastro Nacional dos Advogados.

**O que impede um golpista de copiar o QR Code de um advogado?**
O QR leva para a página oficial do SafeADV, que mostra os contatos oficiais do advogado. Se o golpista usar o QR verdadeiro, o cliente vê o telefone e o e-mail reais, diferentes dos do golpista. Se criar um QR falso, ele não leva ao SafeADV ou leva a um código inexistente.

**E se o advogado perder o celular?**
Ele bloqueia o identificador, e qualquer consulta passa a mostrar o alerta de fraude até a reativação.

**Onde ficam os dados?**
Num banco de dados PostgreSQL (Supabase), com regras de acesso que impedem alterar nome, OAB e contatos pelo site.
