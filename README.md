# Cantina NINA 🍔

Um sistema completo de gestão de cantina escolar, construído com Next.js, Tailwind CSS e Supabase, projetado para oferecer uma experiência moderna, ágil e segura para alunos, funcionários e administradores.

## 🚀 Funcionalidades

### 👨‍🎓 Para o Aluno / Responsável
- **Painel Interativo:** Interface amigável para montar os pedidos semanais.
- **Visualização do Cardápio:** Saiba exatamente o que será servido em cada dia da semana.
- **Checkout com Pix:** Geração instantânea de QR Code e Pix "Copia e Cola" via Mercado Pago.
- **Acompanhamento:** Histórico completo dos pedidos e seus respectivos status.

### 👩‍🍳 Para o Funcionário da Cantina
- **Entregas do Dia:** Listagem focada e em tempo real dos alunos que já pagaram e têm direito à refeição no dia selecionado.
- **Navegação por Dia:** Botões fáceis para transitar entre os dias da semana (Segunda a Sexta).
- **Layout de Impressão:** Ao clicar no botão de imprimir, a interface gráfica desaparece e apenas a lista limpa com nomes e turmas é enviada para a impressora, economizando papel e tinta.
- **Controle de Fluxo:** Botão de um clique para marcar um prato como "Entregue".

### 👑 Para a Administração (Escola)
- **Gestão de Cardápio Fixo:** Defina o prato de cada dia da semana e o preço unitário. O sistema cuida do resto!
- **Painel de Pedidos:** Visão geral com todos os pedidos gerados no sistema, seus valores e turmas.
- **Gestão de Usuários:** Controle de contas, com opção de definir cargos (admin, funcionario, aluno).

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Pagamentos:** API do [Mercado Pago](https://www.mercadopago.com.br/developers/pt)

## 📦 Como Instalar e Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado.
- Uma conta no Supabase (com projeto criado).
- Uma conta no Mercado Pago (com credenciais de produção ativadas).

### Passo a Passo

1. **Clone ou baixe o repositório** para o seu computador.
2. Abra o terminal na pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo chamado `.env.local` na raiz do projeto (mesmo nível da pasta `src`) com as seguintes variáveis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=Sua_URL_do_Supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=Sua_Anon_Key_do_Supabase
   MERCADOPAGO_ACCESS_TOKEN=Seu_Token_De_Producao_Do_Mercado_Pago
   ```
4. **Configurando o Banco de Dados:**
   - Acesse o "SQL Editor" no painel do seu projeto no Supabase.
   - Copie o conteúdo dos arquivos da pasta `supabase/migrations/` e execute-os na ordem.
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse `http://localhost:3000` no seu navegador.

## 🤝 Dicas para Testes
- Quando você se cadastrar no sistema pela primeira vez, sua conta será de "aluno". Para acessar os menus da escola, mude o seu cargo na tabela `usuarios` do Supabase para `admin` ou `funcionario`.
- **Lembrete sobre o Mercado Pago:** A geração do QR Code do Pix só funciona utilizando o token de **Produção** (`APP_USR-...`) e o cadastro de ao menos uma Chave Pix no app recebedor.

---
*Desenvolvido com carinho para simplificar o intervalo. 🍎*
