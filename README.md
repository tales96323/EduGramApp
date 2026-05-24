# EduGram App — Plataforma Educacional Responsiva

Aplicação full-stack (Expo + React Native + Node/Express + PostgreSQL) que combina feed social, árvore do conhecimento e quiz interativo. Codebase única para **mobile** e **web**, com layout responsivo (sidebar no desktop, bottom tabs no mobile).

## 🚀 Funcionalidades

- **Tela de Boas-vindas**: hero adaptativo (stack vertical no mobile, 2 colunas no desktop)
- **Login/Cadastro**: card centralizado com layout split em desktop
- **Feed de Conteúdo**: posts em lista no mobile, grid de 2–3 colunas no desktop; modais convertidos em dialogs maiores em telas largas
- **Publicações científicas**: cada post é um artigo com `título`, `resumo (abstract)`, `palavras-chave`, `DOI`, `conteúdo`, `referências`, `categoria` + anexo PDF principal e material suplementar (qualquer arquivo)
- **Árvore do Conhecimento**: D3.js radial via WebView; em desktop o painel de artigos aparece ao lado da árvore (sem modal)
- **Quiz Interativo**: card central com geração via LLM (Gemini)
- **Perfil de Usuário**: stats e menu em layout 2-colunas no desktop; sessão persistente (AsyncStorage) que sobrevive ao refresh; logout apenas pelo botão "Sair"
- **Minhas Publicações**: o perfil lista todos os posts criados pelo usuário, com card científico (abstract, keywords, DOI, anexos) e visão completa em modal
- **Menu do perfil funcional**: 5 sub-telas navegáveis — Editar Perfil (form com PATCH real), Notificações (toggles), Salvos (artigos salvos), Configurações (tema/idioma/conta), Ajuda (FAQ + suporte)
- **Salvar artigos**: botão de bookmark no detalhe do post (Feed e Perfil); os salvos aparecem em Perfil → Salvos
- **Rede social entre cientistas (backend pronto)**: schema Prisma contempla `Follow`, `PostLike`, `SavedPost`, `QuizAttempt`, `RefreshToken` + contadores denormalizados no `User`

## 📱 Tecnologias Utilizadas

### Frontend
- **Expo SDK 54** + **React Native 0.79** + **react-native-web 0.20** — codebase única para iOS, Android e Web
- **NativeWind 4** + **TailwindCSS 3** — estilização com classes utilitárias e modifiers responsivos (`lg:`, `md:`)
- **React Navigation Bottom Tabs** (mobile) + **Sidebar custom** (desktop)
- **lucide-react-native** + **@expo/vector-icons** para ícones
- **expo-linear-gradient**, **expo-document-picker**, **react-native-webview** (árvore D3)

### Backend
- **Node 18 + Express 4** (API REST)
- **Prisma 5** + **PostgreSQL 15** (ORM + DB)
- **bcryptjs** + **jose** (auth: hash de senha + JWT — pronto para uso na próxima fase)
- **multer** (upload de PDFs)

### Infra
- **Docker Compose**: 3 containers (`postgres`, `backend`, `frontend`)
- **Prisma Migrate**: migrations versionadas em `backend/prisma/migrations/`

## 📁 Estrutura do Projeto

```
EduGramApp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # 7 models: User, Post, Follow, PostLike, SavedPost, QuizAttempt, RefreshToken
│   │   ├── migrations/          # _init + _user_profile_social
│   │   └── seed.js              # 6 users + 4 posts + 15 follows + 6 likes + 3 quiz attempts
│   ├── public/
│   │   ├── images/  pdfs/  files/   # estáticos: imagens, PDFs e anexos suplementares
│   ├── src/
│   │   ├── app.js, routes.js
│   │   └── ...
│   └── Dockerfile
├── frontend/
│   ├── assets/                  # imagens e logos
│   ├── components/
│   │   ├── AppShell.js          # decide Sidebar vs BottomTabs por breakpoint
│   │   ├── Sidebar.js           # navegação fixa para desktop
│   │   ├── ScreenHeader.js      # header com botão voltar (sub-telas)
│   │   └── ScientificPost.js    # card + visão completa de post científico
│   ├── hooks/
│   │   └── useBreakpoint.js     # { isMobile, isTablet, isDesktop } via useWindowDimensions
│   ├── lib/
│   │   ├── auth.js              # sessão persistente (AsyncStorage)
│   │   └── posts.js             # helpers de salvar/remover post
│   ├── screens/                 # telas com classes Tailwind responsivas
│   │   ├── WelcomePage.js
│   │   ├── LoginPage.js
│   │   ├── FeedPage.js
│   │   ├── KnowledgeTreePage.js
│   │   ├── QuizPage.js
│   │   ├── ProfilePage.js
│   │   └── profile/             # sub-telas do perfil
│   │       ├── EditProfilePage.js
│   │       ├── NotificationSettingsPage.js
│   │       ├── SavedPostsPage.js
│   │       ├── SettingsPage.js
│   │       └── HelpPage.js
│   ├── config/api.js
│   ├── App.js                   # entry point
│   ├── babel.config.js          # nativewind/babel
│   ├── metro.config.js          # withNativeWind
│   ├── tailwind.config.js       # paleta, breakpoints
│   ├── global.css               # @tailwind directives
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔌 API — Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/register` | Cadastro (senha hasheada com bcrypt) |
| `POST` | `/login` | Login — retorna o usuário + contadores |
| `PATCH` | `/users/:id` | Edita perfil (name, bio, institution, field, avatarUrl) |
| `GET` | `/posts` | Feed paginado |
| `GET` | `/posts/:id` | Detalhe de um post |
| `GET` | `/posts/by-category` | Posts agrupados por categoria/subcategoria |
| `POST` | `/posts/upload` | Cria post científico (multipart: campos + `pdf` + `supplementary`) |
| `GET` | `/users/:id/posts` | Todas as publicações de um usuário |
| `POST` / `DELETE` | `/posts/:id/save` | Salva / remove um post dos salvos do usuário |
| `GET` | `/users/:id/saved` | Posts salvos pelo usuário |

O `Post` carrega os campos de um artigo científico: `title`, `abstract`, `keywords` (lista), `doi`, `fullContent`, `references`, `category`/`subcategory`, anexo `pdf` e `supplementary` (qualquer arquivo).

## 📐 Sistema de Responsividade

Breakpoints definidos em `frontend/hooks/useBreakpoint.js`:

| Faixa | Largura | Layout |
|---|---|---|
| `isMobile` | < 768px | Stack vertical, bottom tabs, full-width |
| `isTablet` | 768–1023px | Grids 2 colunas onde faz sentido, ainda com bottom tabs |
| `isDesktop` | ≥ 1024px | Sidebar lateral, grids 3 colunas, max-width 6xl, layouts 2-colunas |

A troca de navegação acontece em `AppShell.js` — no desktop, a `Sidebar` substitui o `BottomTabNavigator` e o conteúdo é centralizado com `max-w-6xl`.

## 🛠️ Instalação e Execução com Docker (Recomendado)

```bash
docker compose up --build
```

Sobe 3 containers:
- `postgres` (porta 5432)
- `backend` Express (porta 3000) — roda `prisma db push` + `seed` + `npm start` automaticamente
- `frontend` Expo (portas 19006 web / 8081 metro)

Acesse:
- **Web (desktop responsivo):** `http://localhost:19006`
- **Mobile:** abra o Expo Go no celular e leia o QR Code dos logs do container `frontend`. Ajuste `frontend/config/api.js` se o IP da sua máquina não for o padrão.

## 🛠️ Execução Manual (Sem Docker)

```bash
# Backend
cd backend
npm install
npx prisma migrate deploy
npm run seed
npm start

# Frontend (em outro terminal)
cd frontend
npm install
npm start              # mobile
npm run web            # web responsivo
```

## 🔐 Credenciais de Teste

Todos os usuários do seed usam a senha `password` (hasheada com bcrypt).

| Email | Papel | Notas |
|---|---|---|
| `ana@example.com` | professor | Dra. Ana Silva — Física (USP), 2 posts, 3 seguidores |
| `carlos@example.com` | professor | Prof. Carlos Mendes — Biologia (UFRJ), 1 post, 2 seguidores |
| `revista@example.com` | revista | Revista BioTech — 1 post |
| `aluno1@example.com` | aluno | Bruno Costa — UNICAMP, 15 pts em quizzes |
| `aluno2@example.com` | aluno | Marina Lopes — UFMG, 9 pts em quizzes |
| `test@example.com` | aluno | Conta de teste manual |

## 🧪 Como Validar a Responsividade

1. Abra `http://localhost:19006` no navegador
2. Redimensione a janela ou use o devtools (Cmd/Ctrl+Shift+M)
3. Teste 3 larguras: **375px** (mobile), **900px** (tablet), **1440px** (desktop)
4. Observe que:
   - A **Sidebar** só aparece em ≥1024px
   - O Feed muda de **1 coluna → 2 → 3** conforme a largura
   - O painel de artigos da Árvore migra de modal (mobile) para coluna lateral (desktop)
   - Cards de Login e Quiz nunca esticam além de seu max-width

## 🐛 Solução de Problemas

### Tailwind não está aplicando classes
Verifique que `global.css` está importado em `App.js` (primeira linha). Se modificou `tailwind.config.js`, rebuilde a imagem: `docker compose build frontend`.

### Erro Prisma / OpenSSL no Docker
Garanta que o Dockerfile do backend usa `node:18-slim` com `openssl` e que `schema.prisma` inclui `debian-openssl-3.0.x` em `binaryTargets`.

### Conexão Frontend → Backend em mobile
Verifique `frontend/config/api.js`. Emuladores e dispositivos físicos precisam do IP da máquina host, não `localhost`.

### Sidebar não aparece no desktop
Largura da janela precisa ser ≥1024px. Em janelas menores o app usa bottom tabs (intencional).
