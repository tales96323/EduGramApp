# EduGram — Documento de Requisitos e Especificação Técnica

> **Versão:** 1.0
> **Data:** 2026-05-16
> **Status:** Baseline para a reescrita profissional do produto
> **Audiência:** Equipe de produto, engenharia, design, QA e contratados externos (incl. assistentes LLM)

---

## Índice

1. [Visão geral do produto](#1-visão-geral-do-produto)
2. [Personas e papéis](#2-personas-e-papéis)
3. [Requisitos funcionais](#3-requisitos-funcionais)
4. [Requisitos não funcionais](#4-requisitos-não-funcionais)
5. [Arquitetura técnica](#5-arquitetura-técnica)
6. [Stack tecnológica recomendada](#6-stack-tecnológica-recomendada)
7. [Esquema de banco de dados](#7-esquema-de-banco-de-dados)
8. [Especificação de API](#8-especificação-de-api)
9. [Especificação de UI](#9-especificação-de-ui)
10. [Estratégia de testes](#10-estratégia-de-testes)
11. [DevOps, CI/CD e deploy](#11-devops-cicd-e-deploy)
12. [Observabilidade e segurança](#12-observabilidade-e-segurança)
13. [Roadmap por marcos](#13-roadmap-por-marcos)
14. [Divisão de tarefas LLM × humano](#14-divisão-de-tarefas-llm--humano)
15. [Glossário](#15-glossário)

---

## 1. Visão geral do produto

### 1.1 Conceito
**EduGram** é uma plataforma educacional que combina três paradigmas:

- **Feed social** (estilo Instagram/Twitter) para publicações curtas com mídia, voltadas para conteúdo científico e educacional.
- **Árvore do conhecimento** que organiza disciplinas, sub-áreas e artigos em uma hierarquia explorável visualmente.
- **Quiz interativo** para fixação e avaliação de conhecimento.

A diferenciação principal é a **simplificação automática de conteúdo** via LLM: usuários podem solicitar a versão simplificada de qualquer artigo técnico, tornando o conteúdo acadêmico acessível.

### 1.2 Plataformas-alvo
- **Mobile nativo**: Android (Google Play Store) e iOS (App Store) — distribuído como app instalável.
- **Web**: PWA responsiva em domínio próprio (`app.edugram.com`).
- **Codebase única** via Expo (React Native + React Native Web).

### 1.3 Objetivos de produto
| ID | Objetivo | Métrica de sucesso |
|----|----------|--------------------|
| OBJ-1 | Reduzir barreira de acesso ao conteúdo científico | Taxa de uso da função "simplificar" > 30% das visualizações de artigo |
| OBJ-2 | Engajar usuários em sessões frequentes | DAU/MAU ≥ 0.20 |
| OBJ-3 | Permitir descoberta estruturada de conteúdo | ≥ 40% das sessões usam a Árvore do Conhecimento |
| OBJ-4 | Atender múltiplos perfis (aluno, professor, revista) | Pelo menos 15% das publicações vindas de professores/revistas |

### 1.4 Fora de escopo (V1)
- Mensagens diretas entre usuários.
- Streaming de vídeo.
- Sistema de pagamento/assinatura.
- Versão desktop nativa (Electron/Tauri).
- Modo offline completo (apenas cache de leitura recente).

---

## 2. Personas e papéis

### 2.1 Personas
| Persona | Idade | Contexto | Necessidades-chave |
|---------|-------|----------|--------------------|
| **Aluno do ensino médio** | 14–18 | Estuda para vestibular, usa o app no celular | Conteúdo simplificado, quizzes, navegação rápida por disciplina |
| **Universitário** | 18–25 | Faz pesquisa e busca artigos | Conteúdo aprofundado, PDFs, autoria reconhecida |
| **Professor** | 30–60 | Compartilha materiais com turmas | Publicação facilitada, análise de engajamento |
| **Editor de revista científica** | 25–55 | Divulga publicações | Publicação em massa, atribuição de marca |

### 2.2 Papéis de sistema (roles)
| Role | Descrição | Permissões principais |
|------|-----------|-----------------------|
| `student` | Aluno (padrão para cadastros) | Ler, comentar, curtir, salvar, fazer quizzes |
| `teacher` | Professor verificado | Tudo de `student` + publicar posts, criar quizzes |
| `publisher` | Revista/instituição | Tudo de `teacher` + tag "verified", lote de publicações |
| `moderator` | Moderador interno | Editar/remover conteúdo, banir usuários |
| `admin` | Administração | Tudo |

**RF-AUTH-005**: A elevação de role acima de `student` exige aprovação manual via painel administrativo. Cadastro público sempre cria `student`.

---

## 3. Requisitos funcionais

### 3.1 Módulo: Autenticação e Conta

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-AUTH-001 | Cadastro com email, senha (≥ 8 caracteres) e nome | P0 |
| RF-AUTH-002 | Login com email + senha; retorno de access token (JWT, 15 min) e refresh token (30 dias) | P0 |
| RF-AUTH-003 | Recuperação de senha via email (token de uso único, expira em 1h) | P0 |
| RF-AUTH-004 | Verificação de email após cadastro (não bloqueante para uso inicial; bloqueante para publicação) | P1 |
| RF-AUTH-005 | Logout (invalida refresh token no servidor) | P0 |
| RF-AUTH-006 | Edição de perfil: nome, avatar, bio | P1 |
| RF-AUTH-007 | Exclusão de conta com soft-delete e janela de 30 dias para reversão (LGPD) | P1 |
| RF-AUTH-008 | OAuth social (Google, Apple) — **fora de escopo V1, planejar para V1.1** | P2 |

### 3.2 Módulo: Feed

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-FEED-001 | Listar posts em ordem cronológica reversa, paginação por cursor (20 por página) | P0 |
| RF-FEED-002 | Filtrar por categoria (nó da árvore) e subcategoria | P0 |
| RF-FEED-003 | Pull-to-refresh em mobile | P0 |
| RF-FEED-004 | Publicar post: título, conteúdo (markdown), imagem de capa, PDF opcional, categoria, subcategoria | P0 |
| RF-FEED-005 | Curtir/descurtir post (toggle); contagem real-time otimista | P0 |
| RF-FEED-006 | Comentar em post (suporte a 1 nível de respostas) | P1 |
| RF-FEED-007 | Salvar post para leitura posterior | P1 |
| RF-FEED-008 | Compartilhar post (link universal `app.edugram.com/p/:id`) | P1 |
| RF-FEED-009 | "Simplificar" conteúdo via LLM; armazenar versão simplificada para cache | P0 |
| RF-FEED-010 | Reportar post inadequado | P1 |
| RF-FEED-011 | Editar e excluir posts próprios (até 24h após publicação ou ilimitadamente para autor) | P1 |

### 3.3 Módulo: Árvore do Conhecimento

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-TREE-001 | Visualização hierárquica navegável (radial, expandir/colapsar nós) | P0 |
| RF-TREE-002 | Suporte a profundidade ilimitada (mínimo testado: 5 níveis) | P0 |
| RF-TREE-003 | Click em folha exibe artigos vinculados (modal ou tela dedicada) | P0 |
| RF-TREE-004 | Pesquisa textual sobre nós e artigos | P1 |
| RF-TREE-005 | Posts do feed marcados com categoria aparecem como artigos no nó correspondente | P0 |
| RF-TREE-006 | Admins podem criar/editar/reordenar nós via painel | P1 |
| RF-TREE-007 | Estrutura inicial pré-populada via seed (Física, Biologia, Química, Matemática, CC, História) | P0 |
| RF-TREE-008 | Renderização performática para 500+ nós (sem travar UI) | P1 |

### 3.4 Módulo: Quiz

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-QUIZ-001 | Listar quizzes por nó da árvore | P0 |
| RF-QUIZ-002 | Realizar quiz: perguntas múltipla escolha (1 ou várias corretas) | P0 |
| RF-QUIZ-003 | Feedback imediato por questão + score final | P0 |
| RF-QUIZ-004 | Histórico de tentativas do usuário | P1 |
| RF-QUIZ-005 | Geração de quizzes a partir de artigo via LLM (apenas teachers/publishers) | P1 |
| RF-QUIZ-006 | Editor de quiz manual (apenas teachers/publishers/admins) | P1 |
| RF-QUIZ-007 | Limite de 1 tentativa por hora por quiz (anti-spam) | P2 |

### 3.5 Módulo: Perfil

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-PROF-001 | Exibir foto, nome, papel, bio, estatísticas | P0 |
| RF-PROF-002 | Estatísticas diferenciadas por papel (alunos: posts lidos, quizzes; professores: posts publicados, alcance) | P1 |
| RF-PROF-003 | Listar posts publicados pelo usuário | P1 |
| RF-PROF-004 | Listar posts salvos | P1 |
| RF-PROF-005 | Configurações de notificação | P2 |
| RF-PROF-006 | Tema claro/escuro | P1 |
| RF-PROF-007 | Idioma do app (PT-BR, EN) | P2 |

### 3.6 Módulo: Notificações

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-NOTIF-001 | Notificação in-app quando usuário recebe like/comentário | P1 |
| RF-NOTIF-002 | Push notification mobile (FCM/APNs) | P1 |
| RF-NOTIF-003 | Preferências por tipo de notificação | P2 |

### 3.7 Módulo: Administração

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-ADM-001 | Painel web restrito para moderadores/admins | P1 |
| RF-ADM-002 | Aprovar solicitações de elevação de role | P1 |
| RF-ADM-003 | Revisar reports de conteúdo e tomar ação (remover/banir) | P1 |
| RF-ADM-004 | Gerenciar nós da árvore | P1 |
| RF-ADM-005 | Visualizar audit logs | P2 |

---

## 4. Requisitos não funcionais

### 4.1 Performance
- **RNF-PERF-001**: Time to Interactive na web ≤ 3s em conexão 4G simulada (Lighthouse Mobile).
- **RNF-PERF-002**: Cold start do app mobile ≤ 2s em dispositivo Android mid-range (ex: Pixel 5).
- **RNF-PERF-003**: P95 de resposta de API ≤ 300ms para reads, ≤ 800ms para writes.
- **RNF-PERF-004**: Feed carrega primeira página em ≤ 1s após autenticação.

### 4.2 Segurança
- **RNF-SEC-001**: Senhas armazenadas com bcrypt (cost ≥ 12) ou Argon2id.
- **RNF-SEC-002**: Toda comunicação cliente-servidor sob HTTPS (TLS 1.3).
- **RNF-SEC-003**: Tokens JWT assinados com algoritmo assimétrico (RS256 ou EdDSA). Chaves rotacionáveis.
- **RNF-SEC-004**: Rate limiting por IP e por usuário em endpoints de auth (10/min) e escrita (60/min).
- **RNF-SEC-005**: Validação de entrada com schema (zod) em **todos** os endpoints.
- **RNF-SEC-006**: Proteção CSRF para sessões web (double-submit cookie ou SameSite=strict).
- **RNF-SEC-007**: Headers de segurança (Helmet): CSP, HSTS, X-Frame-Options.
- **RNF-SEC-008**: Sanitização de markdown para evitar XSS no render (DOMPurify ou equivalente).
- **RNF-SEC-009**: Uploads validados por MIME e magic bytes; varredura antivírus opcional (ClamAV).
- **RNF-SEC-010**: Secrets nunca em código; usar gerenciador (Doppler/1Password/AWS Secrets Manager).

### 4.3 Acessibilidade
- **RNF-A11Y-001**: Conformidade WCAG 2.1 nível AA na web.
- **RNF-A11Y-002**: Contraste mínimo 4.5:1 para texto normal.
- **RNF-A11Y-003**: Suporte a screen reader (VoiceOver/TalkBack) em todas as telas.
- **RNF-A11Y-004**: Navegação por teclado completa na web.
- **RNF-A11Y-005**: Suporte a `prefers-reduced-motion`.

### 4.4 Internacionalização
- **RNF-I18N-001**: Arquitetura de strings via i18next; PT-BR padrão, EN como segundo idioma na V1.1.
- **RNF-I18N-002**: Formato de data, número e moeda respeita locale do dispositivo.

### 4.5 Privacidade e conformidade
- **RNF-LGPD-001**: Política de privacidade clara, vinculada no cadastro.
- **RNF-LGPD-002**: Exportação de dados do usuário sob demanda (JSON).
- **RNF-LGPD-003**: Exclusão de conta efetiva em até 30 dias.
- **RNF-LGPD-004**: Consentimento granular para coleta de analytics.

### 4.6 Disponibilidade
- **RNF-AVL-001**: SLA de 99.5% mensal para a API.
- **RNF-AVL-002**: Backups diários do banco com retenção de 30 dias; teste de restore mensal.
- **RNF-AVL-003**: Health checks com auto-restart de containers/instâncias.

### 4.7 Escalabilidade
- **RNF-SCL-001**: API stateless para escalonamento horizontal.
- **RNF-SCL-002**: Mídia servida por CDN (Cloudflare/CloudFront).
- **RNF-SCL-003**: Reads pesados (feed) com cache Redis (TTL curto, 30s).

---

## 5. Arquitetura técnica

### 5.1 Diagrama lógico (texto)

```
┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│  App Mobile  │     │  App Web     │     │  Painel Admin  │
│ (iOS/Android)│     │   (PWA)      │     │    (Next.js)   │
└──────┬───────┘     └──────┬───────┘     └────────┬───────┘
       │                    │                      │
       └─────── HTTPS ──────┴──────── HTTPS ───────┘
                            │
                  ┌─────────▼──────────┐
                  │   API Gateway      │   ← Fastify + Zod
                  │   (Node 20 LTS)    │     JWT auth middleware
                  └─────────┬──────────┘
                            │
        ┌───────────────────┼─────────────────────┐
        │                   │                     │
┌───────▼───────┐  ┌────────▼────────┐  ┌─────────▼────────┐
│  PostgreSQL   │  │     Redis       │  │  Object Storage  │
│  (Prisma ORM) │  │ (cache + queue) │  │ (S3 / R2 / GCS)  │
└───────────────┘  └────────┬────────┘  └──────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │   BullMQ Workers   │   ← jobs: simplificação LLM,
                  │   (Node 20 LTS)    │     envio de email, push
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │   LLM Provider     │   ← Claude API
                  │ (Anthropic / etc.) │
                  └────────────────────┘
```

### 5.2 Princípios arquiteturais
1. **Codebase única** para mobile e web (Expo).
2. **Backend stateless**: sem sessão em memória; estado em DB/Redis.
3. **Separação de concerns**: API ≠ workers ≠ painel admin.
4. **Cache-aside** para reads frequentes; **write-through** para counters.
5. **Otimistic UI** em ações sociais (like, comment).
6. **TypeScript end-to-end** com types compartilhados via monorepo.

### 5.3 Estrutura de monorepo recomendada

```
edugram/
├── apps/
│   ├── mobile/           # Expo (React Native)
│   ├── web/              # (opcional, se separar de mobile via Next.js)
│   ├── api/              # Fastify
│   ├── worker/           # BullMQ jobs
│   └── admin/            # Next.js painel admin
├── packages/
│   ├── shared-types/     # Tipos TS compartilhados (gerados do Prisma)
│   ├── ui/               # Componentes RN/RNW reusáveis
│   ├── config/           # ESLint, tsconfig, prettier compartilhados
│   └── db/               # Schema Prisma e migrations
├── infra/
│   ├── docker/
│   └── terraform/        # IaC para cloud
├── docs/
├── .github/workflows/
└── pnpm-workspace.yaml
```

**Gestor de workspace:** pnpm (preferido) ou Turborepo.

---

## 6. Stack tecnológica recomendada

### 6.1 Frontend (mobile + web)

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | **Expo SDK 54+** | Codebase única RN + web; EAS Build resolve fricção de build nativo |
| Linguagem | **TypeScript 5+** | Type safety end-to-end |
| Navegação | **expo-router** | File-based routing igual Next.js; SSG na web |
| State global | **Zustand** | Minimal, sem boilerplate; suficiente para escala atual |
| Server state | **TanStack Query v5** | Cache, retry, mutation, optimistic updates |
| Formulários | **react-hook-form + zod** | Validação compartilhada com o backend |
| Estilização | **NativeWind** (Tailwind) | Familiaridade web + suporte RN; alternativa: Tamagui |
| i18n | **i18next + react-i18next** | Padrão de mercado, suporta fallbacks |
| Ícones | **lucide-react-native** | Já em uso, consistente entre web/mobile |
| Visualizações | **Skia (react-native-skia)** para árvore (substituir WebView+D3) | Performance nativa, sem overhead de WebView |
| Auth storage | **expo-secure-store** | Keychain/Keystore para refresh token |
| Push | **expo-notifications** | Abstrai APNs/FCM |
| Deep links | **expo-linking + expo-router** | Universal links para compartilhamento |

### 6.2 Backend

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Runtime | **Node.js 20 LTS** | Estabilidade, ecosistema maduro |
| Framework HTTP | **Fastify 4** | 2–3× mais rápido que Express; suporte nativo a schemas |
| ORM | **Prisma 5** | Type safety, migrations declarativas, já em uso |
| Validação | **Zod 3** | Schema compartilhado client/server |
| Auth | **JWT (jose)** + bcrypt | Padrão da indústria; tokens curtos + refresh |
| Upload | **@fastify/multipart + sharp** | Multipart streaming + redimensionamento de imagem |
| Queue | **BullMQ + Redis** | Confiável, observável; suporta retry/backoff |
| Storage | **S3-compatible** (Cloudflare R2) | Sem egress fees, barato |
| Email | **Resend** ou **Postmark** | DX simples, deliverability alta |
| Logging | **pino** | Structured logs, performático |

### 6.3 Banco de dados e infra

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| DB primário | **PostgreSQL 16** | Tipos ricos (JSONB), full-text search, materialized views |
| Cache | **Redis 7** | Cache + queue + pub-sub |
| Search (V2) | **Meilisearch** | Tolerância a typos, simples de operar |
| CDN | **Cloudflare** | Free tier generoso, R2 integrado |

### 6.4 LLM e IA

| Uso | Provedor primário | Fallback |
|-----|------------------|----------|
| Simplificação de conteúdo | **Anthropic Claude (Haiku 4.5)** | Gemini Flash |
| Geração de quizzes | **Anthropic Claude (Sonnet 4.6)** | GPT-4o-mini |
| Moderação de conteúdo | **OpenAI Moderation API** (gratuito) | — |

**Cache de respostas LLM:** hash do prompt → resposta em Postgres, TTL 90 dias. Reduz custo e latência.

### 6.5 Hospedagem

| Componente | Opção recomendada | Alternativas |
|-----------|-------------------|--------------|
| API + Worker | **Fly.io** ou **Railway** | Render, AWS ECS |
| DB Postgres | **Neon** (serverless) ou **Supabase** | RDS, Crunchy Bridge |
| Redis | **Upstash** | Redis Cloud, ElastiCache |
| Web (PWA) | **Vercel** ou **Cloudflare Pages** | Netlify |
| Mobile build/distribuição | **EAS Build + EAS Submit** | — |
| Admin (Next.js) | **Vercel** | — |
| CDN/Storage | **Cloudflare R2 + CDN** | AWS S3 + CloudFront |

### 6.6 DevTools

| Categoria | Ferramenta |
|----------|-----------|
| CI/CD | GitHub Actions |
| Testes E2E | Playwright (web), Maestro (mobile) |
| Testes unitários | Vitest |
| Linting | ESLint + Prettier |
| Pre-commit | Lefthook |
| Erros | **Sentry** |
| Analytics | **PostHog** (open-source, self-host ou cloud) |
| Logs | **Better Stack** ou **Axiom** |
| Feature flags | **PostHog** (incluso) ou **GrowthBook** |

---

## 7. Esquema de banco de dados

### 7.1 Diagrama de entidades (texto)

```
users ─┬─< posts ─┬─< post_likes
       │          ├─< comments ──< comments (parent)
       │          └─< saved_posts
       ├─< follows >─┤
       ├─< quiz_attempts ──< quiz_answers
       ├─< notifications
       └─< refresh_tokens

knowledge_nodes ─┬─< knowledge_nodes (parent)
                 ├─< articles ─── (author: users)
                 ├─< posts (category)
                 └─< quizzes ──< questions ──< question_options
```

### 7.2 DDL completo (Prisma schema)

```prisma
// prisma/schema.prisma

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  TEACHER
  PUBLISHER
  MODERATOR
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  HIDDEN
  DELETED
}

enum NotificationType {
  POST_LIKE
  POST_COMMENT
  COMMENT_REPLY
  NEW_FOLLOWER
  QUIZ_GRADED
  ROLE_APPROVED
}

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  passwordHash    String
  name            String
  role            Role     @default(STUDENT)
  bio             String?
  avatarUrl       String?
  emailVerifiedAt DateTime?
  locale          String   @default("pt-BR")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  posts           Post[]
  comments        Comment[]
  postLikes       PostLike[]
  savedPosts      SavedPost[]
  quizAttempts    QuizAttempt[]
  notifications   Notification[]
  refreshTokens   RefreshToken[]
  authoredArticles Article[]
  following       Follow[]    @relation("FollowerToFollowing")
  followers       Follow[]    @relation("FollowingToFollower")

  @@index([role, deletedAt])
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime @default(now())
  userAgent String?
  ipAddress String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, expiresAt])
}

model KnowledgeNode {
  id         String   @id @default(cuid())
  slug       String   @unique
  parentId   String?
  label      String
  color      String   // hex ou token (ex: "indigo-500")
  icon       String?  // emoji ou nome de ícone
  orderIndex Int      @default(0)
  depth      Int      @default(0)
  path       String   // materialized path (ex: "physics/quantum_mechanics")
  createdAt  DateTime @default(now())

  parent   KnowledgeNode?  @relation("NodeHierarchy", fields: [parentId], references: [id])
  children KnowledgeNode[] @relation("NodeHierarchy")
  articles Article[]
  posts    Post[]
  quizzes  Quiz[]

  @@index([parentId, orderIndex])
  @@index([path])
}

model Article {
  id          String   @id @default(cuid())
  slug        String   @unique
  nodeId      String
  authorId    String?
  title       String
  snippet     String
  body        String   @db.Text  // markdown
  pdfUrl      String?
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  node   KnowledgeNode @relation(fields: [nodeId], references: [id])
  author User?         @relation(fields: [authorId], references: [id])

  @@index([nodeId, publishedAt])
}

model Post {
  id                String     @id @default(cuid())
  authorId          String
  title             String
  body              String     @db.Text  // markdown
  simplifiedBody    String?    @db.Text  // cache da versão simplificada por LLM
  simplifiedAt      DateTime?
  imageUrl          String?
  pdfUrl            String?
  categoryId        String?
  status            PostStatus @default(PUBLISHED)
  likesCount        Int        @default(0)
  commentsCount     Int        @default(0)
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  deletedAt         DateTime?

  author    User           @relation(fields: [authorId], references: [id])
  category  KnowledgeNode? @relation(fields: [categoryId], references: [id])
  likes     PostLike[]
  comments  Comment[]
  savedBy   SavedPost[]

  @@index([status, createdAt(sort: Desc)])
  @@index([categoryId, status, createdAt(sort: Desc)])
  @@index([authorId, createdAt(sort: Desc)])
}

model PostLike {
  postId    String
  userId    String
  createdAt DateTime @default(now())

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([postId, userId])
  @@index([userId, createdAt(sort: Desc)])
}

model Comment {
  id              String   @id @default(cuid())
  postId          String
  authorId        String
  parentCommentId String?
  body            String   @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  post     Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author   User      @relation(fields: [authorId], references: [id])
  parent   Comment?  @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies  Comment[] @relation("CommentReplies")

  @@index([postId, createdAt])
}

model SavedPost {
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@id([userId, postId])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower  User @relation("FollowerToFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("FollowingToFollower", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}

model Quiz {
  id          String   @id @default(cuid())
  title       String
  description String?
  nodeId      String
  createdById String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  node      KnowledgeNode @relation(fields: [nodeId], references: [id])
  questions Question[]
  attempts  QuizAttempt[]

  @@index([nodeId, isPublished])
}

model Question {
  id         String   @id @default(cuid())
  quizId     String
  prompt     String   @db.Text
  type       String   @default("single_choice") // single_choice | multi_choice
  orderIndex Int      @default(0)
  points     Int      @default(1)

  quiz    Quiz             @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options QuestionOption[]
  answers QuizAnswer[]

  @@index([quizId, orderIndex])
}

model QuestionOption {
  id         String  @id @default(cuid())
  questionId String
  label      String
  isCorrect  Boolean @default(false)
  orderIndex Int     @default(0)

  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([questionId, orderIndex])
}

model QuizAttempt {
  id         String   @id @default(cuid())
  userId     String
  quizId     String
  startedAt  DateTime @default(now())
  finishedAt DateTime?
  score      Int?

  user    User         @relation(fields: [userId], references: [id])
  quiz    Quiz         @relation(fields: [quizId], references: [id])
  answers QuizAnswer[]

  @@index([userId, startedAt(sort: Desc)])
}

model QuizAnswer {
  id                String   @id @default(cuid())
  attemptId         String
  questionId        String
  selectedOptionIds Json     // array de IDs
  isCorrect         Boolean

  attempt  QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question Question    @relation(fields: [questionId], references: [id])
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  payload   Json
  readAt    DateTime?
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt, createdAt(sort: Desc)])
}

model AuditLog {
  id           String   @id @default(cuid())
  actorId      String?
  action       String
  resourceType String
  resourceId   String?
  metadata     Json?
  createdAt    DateTime @default(now())

  @@index([actorId, createdAt(sort: Desc)])
  @@index([resourceType, resourceId])
}

model LlmCache {
  id        String   @id @default(cuid())
  promptHash String  @unique
  model     String
  response  String   @db.Text
  createdAt DateTime @default(now())
  expiresAt DateTime

  @@index([expiresAt])
}
```

### 7.3 Estratégia de migrations
- **Prisma Migrate** para todas as alterações de schema.
- Toda migration revisada por outro engenheiro antes de merge.
- Migrations destrutivas (drop column, type change) sempre em 2 deploys: 1) deprecar e duplicar, 2) remover após período de carência.
- Backfill de dados via job idempotente, não via migration SQL.

### 7.4 Decisões de modelagem
- **IDs como `cuid()`** (string) em vez de auto-increment: melhor para distribuição, não vaza contagem de registros.
- **Soft delete** via `deletedAt` em entidades de conteúdo (User, Post, Comment, Article).
- **Counters denormalizados** (`likesCount`, `commentsCount`) atualizados via transaction; reconciliação noturna via job.
- **Materialized path** em `KnowledgeNode.path` para queries de subárvore eficientes.
- **Refresh tokens hashados** (não armazenar token cru).

---

## 8. Especificação de API

### 8.1 Convenções

- **REST** sobre HTTPS; JSON.
- **Versionada** via path: `/v1/...`.
- **Autenticação**: `Authorization: Bearer <jwt>`.
- **Paginação**: cursor-based (`?cursor=...&limit=20`).
- **Erros** seguem RFC 7807:
  ```json
  {
    "type": "https://edugram.com/errors/validation",
    "title": "Validation failed",
    "status": 400,
    "detail": "Field 'email' is required",
    "errors": [{ "field": "email", "code": "required" }]
  }
  ```

### 8.2 Endpoints (V1)

#### Auth
- `POST /v1/auth/register` — `{ email, password, name }` → `{ user, accessToken, refreshToken }`
- `POST /v1/auth/login` — `{ email, password }` → `{ user, accessToken, refreshToken }`
- `POST /v1/auth/refresh` — `{ refreshToken }` → `{ accessToken, refreshToken }`
- `POST /v1/auth/logout` — invalida refresh token
- `POST /v1/auth/forgot-password` — envia email
- `POST /v1/auth/reset-password` — `{ token, newPassword }`
- `POST /v1/auth/verify-email` — `{ token }`

#### Users
- `GET /v1/users/me`
- `PATCH /v1/users/me` — `{ name?, bio?, avatarUrl?, locale? }`
- `GET /v1/users/:id`
- `DELETE /v1/users/me` — soft delete

#### Posts
- `GET /v1/posts?cursor&limit&categoryId` — feed paginado
- `GET /v1/posts/:id`
- `POST /v1/posts` — multipart (imagem + PDF)
- `PATCH /v1/posts/:id`
- `DELETE /v1/posts/:id`
- `POST /v1/posts/:id/like` / `DELETE /v1/posts/:id/like`
- `POST /v1/posts/:id/save` / `DELETE /v1/posts/:id/save`
- `POST /v1/posts/:id/simplify` — dispara job; retorna 202 com `jobId`
- `GET /v1/posts/:id/comments?cursor&limit`
- `POST /v1/posts/:id/comments` — `{ body, parentCommentId? }`

#### Knowledge Tree
- `GET /v1/tree` — árvore completa (cacheada, ETag)
- `GET /v1/tree/:slug` — subárvore
- `GET /v1/tree/:slug/articles?cursor&limit`
- `POST /v1/tree` (admin)
- `PATCH /v1/tree/:id` (admin)

#### Quizzes
- `GET /v1/quizzes?nodeId`
- `GET /v1/quizzes/:id` — com perguntas (sem revelar `isCorrect`)
- `POST /v1/quizzes/:id/attempts` — inicia tentativa
- `POST /v1/attempts/:id/answers` — `{ questionId, selectedOptionIds }`
- `POST /v1/attempts/:id/finish` → retorna score e gabarito

#### Notificações
- `GET /v1/notifications?cursor&limit`
- `POST /v1/notifications/:id/read`
- `POST /v1/notifications/read-all`

### 8.3 Convenções de WebSocket (V1.1)
- `wss://api.edugram.com/v1/ws` para push de notificações em tempo real.
- Auth via query string `?token=...`.

---

## 9. Especificação de UI

### 9.1 Design system

- **Tokens**: Cores, tipografia, espaçamento, sombras definidos em `packages/ui/tokens.ts`.
- **Paleta primária**: Indigo 600 (#4f46e5) como base atual.
- **Tipografia**: Inter (web) / SF Pro (iOS) / Roboto (Android) — fallbacks.
- **Densidade**: Espaçamento em múltiplos de 4px.
- **Modo claro e escuro** desde o V1.

### 9.2 Lista de telas (V1)

| Tela | Plataformas | Notas |
|------|-------------|-------|
| Welcome / Onboarding | Mobile, Web | 3 slides, skippable |
| Login | Mobile, Web | — |
| Cadastro | Mobile, Web | Inclui aceite de termos |
| Feed (Home) | Mobile, Web | Pull-to-refresh, infinite scroll |
| Detalhe do post | Mobile, Web | Comentários inline |
| Criar post | Mobile, Web | Form em wizard (3 passos) |
| Árvore do conhecimento | Mobile, Web | Skia (mobile) / SVG D3 (web) |
| Lista de artigos do nó | Mobile, Web | — |
| Detalhe do artigo | Mobile, Web | Botão "simplificar" |
| Lista de quizzes | Mobile, Web | Filtro por nó |
| Quiz em andamento | Mobile, Web | 1 pergunta por vez |
| Resultado do quiz | Mobile, Web | Score + revisão |
| Perfil próprio | Mobile, Web | Tabs: Posts, Salvos, Quizzes |
| Perfil de outro usuário | Mobile, Web | Tabs: Posts |
| Configurações | Mobile, Web | Notificações, idioma, tema |
| Notificações | Mobile, Web | Lista cronológica |
| Busca | Mobile, Web | Posts, usuários, nós |
| Esqueci minha senha | Mobile, Web | — |
| Resetar senha | Mobile, Web | Deep link |

### 9.3 Padrões de UX
- **Loading**: skeletons em listagens; spinners apenas em ações pontuais.
- **Erros**: banners contextuais; nunca alerts modais não-críticos.
- **Empty states**: ilustração + texto + CTA primário.
- **Confirmação destrutiva**: bottom sheet com botão vermelho.

---

## 10. Estratégia de testes

| Tipo | Ferramenta | Cobertura mínima |
|------|-----------|------------------|
| Unitário (backend) | Vitest | 80% das funções de domínio |
| Integração (backend) | Vitest + Testcontainers (Postgres real) | Todos os endpoints |
| Unitário (frontend) | Vitest + React Native Testing Library | Hooks customizados, componentes complexos |
| E2E (web) | Playwright | Fluxos críticos: cadastro, login, publicar, simplificar |
| E2E (mobile) | Maestro | Mesmos fluxos críticos |
| Performance | Lighthouse CI (web), Maestro perf (mobile) | Budget no CI |
| Acessibilidade | axe-core + Lighthouse | Sem regressões |
| Carga | k6 | API endpoints críticos: 1000 RPS sustentado |

**Estratégia de testes em CI:**
- PR: lint + typecheck + unit + integração + E2E smoke
- Main: tudo acima + E2E completo + Lighthouse + perf

---

## 11. DevOps, CI/CD e deploy

### 11.1 Pipeline CI (GitHub Actions)

```
on: pull_request
jobs:
  - lint+typecheck
  - test:unit
  - test:integration (Postgres em Docker)
  - test:e2e:smoke (Playwright)
  - build (todas as apps, valida build)
```

### 11.2 Pipeline CD

**Web (Vercel/Cloudflare Pages):**
- Push em `main` → preview deploy
- Tag `v*.*.*` → production deploy

**API/Worker (Fly.io):**
- Push em `main` → deploy staging
- Manual approval → deploy production
- Blue/green com health check; rollback automático em falha

**Mobile (EAS):**
- Push em `main` → EAS Build internal channel (TestFlight + Internal Testing)
- Tag `mobile-v*.*.*` → EAS Submit para App Store e Play Store
- OTA updates (expo-updates) para correções rápidas de JS

### 11.3 Ambientes
| Ambiente | URL | DB | Propósito |
|----------|-----|----|-----------|
| Local | localhost | Postgres Docker | Desenvolvimento |
| Preview | PR-{n}.edugram.dev | Branch DB (Neon) | Review de PR |
| Staging | staging.edugram.com | DB dedicado | QA |
| Production | app.edugram.com | DB principal | Usuários reais |

### 11.4 Distribuição mobile

**Pré-requisitos manuais (humano):**
1. Conta de desenvolvedor Apple ($99/ano).
2. Conta Google Play Console ($25 uma vez).
3. Certificados de assinatura, perfis de provisionamento (gerados pelo EAS).
4. Política de privacidade pública.
5. Capturas de tela e descrição em PT-BR e EN.
6. Ícone do app em alta resolução.
7. Asset pack para feature graphic (Google Play).

**Comandos típicos:**
```bash
# Build de produção
eas build --platform all --profile production

# Submissão para as lojas
eas submit --platform ios --latest
eas submit --platform android --latest

# OTA update (apenas JS)
eas update --branch production --message "Hotfix UI"
```

---

## 12. Observabilidade e segurança

### 12.1 Métricas obrigatórias
- Request rate, error rate, latência (P50, P95, P99) por endpoint.
- Tamanho da fila do BullMQ, taxa de falha de jobs.
- Custo de LLM por dia, por usuário, por job.
- DAU, MAU, retenção D1/D7/D30.

### 12.2 Logs
- JSON estruturado com `traceId`, `userId`, `requestId`.
- Nunca logar: senhas, tokens, PII bruta.
- Retenção: 30 dias quentes, 1 ano arquivados.

### 12.3 Alertas (PagerDuty/Better Stack)
- Error rate API > 1% em 5 min
- P95 > 1s em 10 min
- Falha de 3 jobs consecutivos
- Queda na ingestão de logs (sentinela)

### 12.4 Segurança operacional
- Dependabot/Renovate habilitado.
- `npm audit` no CI; falhar build em vulnerabilidades altas.
- Pentest leve anual (OWASP ZAP automatizado mensal).
- Política de divulgação responsável publicada (`/security.txt`).

---

## 13. Roadmap por marcos

### Marco 0 — Fundação (2 semanas)
- Configurar monorepo, CI, lint, typecheck.
- Stack escolhida funcionando "hello world" end-to-end.
- DB modelado e migrations aplicadas.
- Pipeline de deploy para staging funcionando.

### Marco 1 — MVP Auth + Feed (3 semanas)
- RF-AUTH-001..005
- RF-FEED-001..005, RF-FEED-009
- Deploy web pública (staging)
- Build mobile interno (TestFlight + Internal Testing)

### Marco 2 — Conteúdo estruturado (3 semanas)
- RF-TREE-001..007
- RF-FEED-006..008, 011
- Painel admin básico

### Marco 3 — Quiz e perfil (2 semanas)
- RF-QUIZ-001..004
- RF-PROF-001..004, 006

### Marco 4 — Polimento e lançamento (2 semanas)
- RF-NOTIF-001, 002
- Acessibilidade auditada
- Performance ajustada
- Submissão às lojas
- Soft launch (convite)

**Total estimado: ~12 semanas** com equipe de 2 devs full-stack + 1 designer part-time.

---

## 14. Divisão de tarefas LLM × humano

Esta seção classifica explicitamente cada categoria de trabalho e fornece **prompts pré-escritos** para tarefas LLM e **checklists** para humanos.

### 14.1 Princípios de divisão
| Bom para LLM | Bom para humano |
|--------------|-----------------|
| Scaffolding de código a partir de spec clara | Decisões de arquitetura com trade-offs |
| Boilerplate (rotas, DTOs, componentes triviais) | Revisão de segurança e código sensível |
| Geração de testes a partir de código existente | UX/visual design (julgamento estético) |
| Refactor mecânico dentro de regras explícitas | Submissão às lojas (processo manual) |
| Documentação a partir de código | Negociação de contratos, pricing, legal |
| Migração de dados idempotente | Resposta a incidentes em produção |
| Geração de seeds e fixtures | Aprovação de roles administrativos |

### 14.2 Prompts internos para LLM

> **Diretriz geral:** Sempre fornecer ao LLM (1) o arquivo de spec relevante (este documento), (2) o schema Prisma vigente, (3) o estilo de código do repositório (CLAUDE.md). Pedir saída em diff/patch quando possível.

#### Prompt #LLM-1 — Scaffold de endpoint REST
```
Implemente o endpoint <MÉTODO> <PATH> conforme a seção 8 do REQUISITOS.md.
Stack: Fastify 4 + Prisma 5 + Zod 3 + TypeScript.

Requisitos:
- Schema zod para body, params e query.
- Tipos inferidos do schema (z.infer).
- Handler isolado em src/routes/<modulo>/<acao>.ts.
- Erros usando AppError (importar de '@/lib/errors').
- Logs com pino (request.log).
- Sem console.log.

Não invente requisitos não listados. Se houver ambiguidade, liste-as ao final.
Saída: arquivo completo + entry no router.
```

#### Prompt #LLM-2 — Componente React Native + Web
```
Crie o componente <NomeDoComponente> conforme a tela <X> da seção 9.2.

Stack: Expo + expo-router + NativeWind + lucide-react-native + react-hook-form + zod.

Requisitos:
- Componente funcional TypeScript com props tipadas.
- Estilização via NativeWind classes (className).
- Funciona em iOS, Android e web (sem APIs platform-specific exceto via Platform.select).
- Acessibilidade: accessibilityLabel em controles, role apropriado.
- Loading e error states explícitos.
- Sem any.

Não use libs adicionais sem listar a justificativa.
Saída: componente + arquivo de teste com React Native Testing Library cobrindo render, interação e estado de erro.
```

#### Prompt #LLM-3 — Migration Prisma
```
Crie uma migration Prisma para a mudança: <descrever>

Requisitos:
- Compatível com PostgreSQL 16.
- Se houver mudança destrutiva (drop, alter type), produzir 2 migrations: deprecação e remoção.
- Backfill, se necessário, em script TS separado (apps/api/scripts/backfills/<nome>.ts).
- Atualizar schema.prisma de acordo.
- Listar índices necessários.

Saída: arquivos de migration + diff do schema + script de backfill (se aplicável).
```

#### Prompt #LLM-4 — Testes a partir de código
```
Gere testes para o módulo <caminho>.

Stack: Vitest + Testcontainers (para integração).

Requisitos:
- Cobertura mínima: caminhos felizes + 3 cenários de erro relevantes.
- Para rotas: usar fastify.inject() em vez de subir o servidor.
- Para acesso a DB: usar uma transaction rollback ao final de cada teste.
- Mocks apenas para serviços externos (LLM, email, S3).
- Nomes descritivos no estilo "should X when Y".

Saída: arquivo de teste pronto para rodar.
```

#### Prompt #LLM-5 — Simplificação de artigo (runtime, não DX)
> Este é o prompt enviado ao Claude pelo worker quando o usuário pede simplificação.
```
Você é um redator científico especializado em divulgação para público leigo.

Texto original (markdown):
---
{ARTICLE_BODY}
---

Tarefa:
- Reescreva em português brasileiro acessível para um leitor sem formação técnica (ensino médio completo).
- Preserve a precisão técnica e os termos essenciais; explique-os entre parênteses na primeira ocorrência.
- Mantenha estrutura em parágrafos curtos (máx. 3 frases cada).
- Limite a 60% do tamanho do original.
- Saída em markdown puro, sem cabeçalho, sem comentários meta.

Restrições:
- Não invente fatos.
- Se o texto contiver claims sem fonte, NÃO os reforce — reformule em tom hipotético.
- Não inclua opiniões pessoais.
```

#### Prompt #LLM-6 — Geração de quiz a partir de artigo
```
Você é um professor experiente criando uma avaliação formativa.

Artigo (markdown):
---
{ARTICLE_BODY}
---

Tarefa: gere 5 perguntas de múltipla escolha que testem compreensão dos conceitos centrais.

Requisitos:
- Cada pergunta tem 4 alternativas, exatamente 1 correta.
- Distratores plausíveis baseados em mal-entendidos comuns, não absurdos.
- Inclua justificativa breve da resposta correta.
- Dificuldade média; evite pergadinhas semânticas.

Saída: JSON estritamente conforme schema:
{
  "questions": [
    {
      "prompt": "string",
      "options": [
        { "label": "string", "isCorrect": boolean }
      ],
      "explanation": "string"
    }
  ]
}
```

#### Prompt #LLM-7 — Refactor mecânico
```
Refatorar <caminho/arquivo> para:
<descrever a regra precisa, ex: "extrair toda lógica de validação de entrada para um middleware compartilhado em src/middleware/validate.ts">

Restrições:
- Não alterar comportamento observável.
- Manter toda cobertura de testes existente passando.
- Se algum teste falhar, listar a razão sem alterá-lo.

Saída: diff unificado.
```

#### Prompt #LLM-8 — Seed de dados realistas
```
Gere um seed Prisma para popular dados de demonstração.

Quantidades:
- 20 users (5 teachers, 2 publishers, 13 students); senhas em texto plano "password"
- 30 KnowledgeNodes (estrutura realista de disciplinas)
- 80 articles distribuídos pelos nós
- 150 posts variados, com 30% tendo PDF

Requisitos:
- Conteúdo em PT-BR realista (não Lorem ipsum).
- IDs determinísticos (usar @faker-js/faker com seed fixa = 42).
- Idempotente: rodar 2× não duplica.

Saída: arquivo seed.ts completo.
```

### 14.3 Checklists para humanos

#### Checklist HUM-1 — Decisão de arquitetura
- [ ] Trade-offs documentados (≥ 2 alternativas consideradas)
- [ ] Custo estimado (infra, dev time, manutenção)
- [ ] ADR (Architecture Decision Record) escrito em `docs/adr/`
- [ ] Revisado por pelo menos 1 engenheiro sênior

#### Checklist HUM-2 — Submissão à App Store
- [ ] Conta Apple Developer ativa ($99/ano pago)
- [ ] App ID criado no Apple Developer Portal
- [ ] Certificados de produção gerados (via EAS)
- [ ] Capturas de tela em todos os tamanhos exigidos (6.7", 6.5", 5.5", iPad)
- [ ] Descrição em PT-BR e EN, ≤ 4000 chars
- [ ] Keywords ≤ 100 chars
- [ ] URL de suporte e privacidade públicas
- [ ] Categoria escolhida (Education)
- [ ] Faixa etária definida
- [ ] Conformidade com guidelines (revisar 4.2, 5.1.1)
- [ ] Build enviado via EAS Submit
- [ ] Aguardar review (~ 24–48h)

#### Checklist HUM-3 — Submissão ao Google Play
- [ ] Conta Google Play Console ativa ($25 pagos)
- [ ] Listagem completa (descrição curta + completa, ícone, feature graphic)
- [ ] Capturas: telefone, 7"/10" tablet (mínimo)
- [ ] Política de privacidade pública
- [ ] Classificação de conteúdo respondida (questionário IARC)
- [ ] App content (anúncios, target audience, segurança de dados)
- [ ] Closed/Internal track configurado
- [ ] Build enviado via EAS Submit
- [ ] Aguardar review (horas a dias)

#### Checklist HUM-4 — Revisão de segurança em PR
- [ ] Sem secrets commitados (`gitleaks` no CI confirma)
- [ ] Inputs validados com zod
- [ ] Queries SQL via Prisma (sem `$queryRaw` sem boas razões)
- [ ] Auth/role checada onde necessário
- [ ] Logs não vazam PII
- [ ] Erros não revelam stack trace ao cliente
- [ ] Uploads validados (MIME + tamanho)

#### Checklist HUM-5 — Resposta a incidente
- [ ] Reconhecer no canal de incidentes (em ≤ 5 min)
- [ ] Status page atualizada (se afetar usuários)
- [ ] Investigar causa raiz com logs/traces
- [ ] Mitigar (rollback, feature flag off, scale up)
- [ ] Comunicar resolução
- [ ] Postmortem em até 5 dias úteis (sem culpa, focado em sistema)

#### Checklist HUM-6 — Aprovação de role elevado
- [ ] Verificar identidade do solicitante (LinkedIn, instituição)
- [ ] Confirmar vínculo institucional (email institucional ou prova)
- [ ] Documentar decisão no audit log
- [ ] Notificar usuário do resultado

#### Checklist HUM-7 — Auditoria de acessibilidade
- [ ] Lighthouse a11y ≥ 95 em todas as telas-chave
- [ ] Teste manual com VoiceOver (iOS) em 5 telas
- [ ] Teste manual com TalkBack (Android) em 5 telas
- [ ] Navegação completa por teclado na web
- [ ] Contraste verificado nas variações de tema
- [ ] Reduzir movimento honra `prefers-reduced-motion`

### 14.4 Tarefas que **nunca** delegar a LLM
- Aprovar deploy em produção.
- Aprovar elevação de role a admin/moderator.
- Editar audit logs.
- Decidir o que fazer com um report de conteúdo sensível.
- Aceitar termos de serviço de provedores em nome da empresa.
- Negociar contratos comerciais.

---

## 15. Glossário

| Termo | Definição |
|-------|-----------|
| **DAU / MAU** | Daily / Monthly Active Users |
| **P95** | 95º percentil de latência |
| **PWA** | Progressive Web App; instalável e funciona offline |
| **EAS** | Expo Application Services |
| **OTA update** | Atualização de código JavaScript sem nova submissão à loja |
| **CUID** | Collision-resistant Unique Identifier |
| **ADR** | Architecture Decision Record |
| **Soft delete** | Marcar como deletado sem remover fisicamente |
| **Materialized path** | Padrão de armazenar caminho como string para queries hierárquicas eficientes |
| **Cursor pagination** | Paginação por marcador opaco em vez de offset numérico |
| **RPO / RTO** | Recovery Point Objective / Recovery Time Objective |
| **LGPD** | Lei Geral de Proteção de Dados (Brasil) |

---

## Apêndice A — Comparação com a implementação atual (MVP)

Esta seção mapeia o **que existe hoje** vs **o que esta especificação define**, para servir de guia de migração.

| Área | Hoje | Spec V1 | Ação |
|------|------|---------|------|
| Auth | Login simples sem token; senha em texto plano | JWT + refresh; bcrypt | **Reescrever** |
| Posts | CRUD básico em Express + Prisma | Idem + likes/comments/save reais | **Estender** |
| Feed | Listagem cronológica simples | Cursor pagination + filtros | **Refazer endpoint** |
| Árvore | Hardcoded no frontend; D3 em WebView | Persistida em DB; Skia nativo | **Reescrever frontend + popular DB** |
| Quiz | Apenas tela estática | Quizzes em DB, tentativas persistidas | **Implementar do zero** |
| Perfil | Mock com strings hardcoded | Estatísticas reais por role | **Estender** |
| Mobile build | Expo Go dev | EAS Build assinado | **Configurar EAS** |
| Web | Expo Web em Docker | Vercel/Cloudflare Pages | **Migrar** |
| Testes | 1 stub Jest | Cobertura completa | **Construir suite** |
| CI/CD | Inexistente | GitHub Actions completo | **Construir** |

---

**Fim do documento.** Para discussões e atualizações, abrir PR neste arquivo. Cada mudança deve incrementar a versão (semver: MAJOR para mudança incompatível de escopo, MINOR para nova funcionalidade, PATCH para correção/clarificação).
