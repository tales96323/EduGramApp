# EduGram App - MVP Mobile

Este é um aplicativo móvel desenvolvido com Expo/React Native baseado no protótipo EduGram. O app oferece uma plataforma educacional com feed de conteúdo, árvore do conhecimento, quiz interativo e perfil de usuário.

## 🚀 Funcionalidades

- **Tela de Boas-vindas**: Interface atrativa para novos usuários
- **Login/Autenticação**: Sistema de login com validação
- **Feed de Conteúdo**: Posts educacionais com funcionalidade de simplificação (Backend Integration)
- **Árvore do Conhecimento**: Visualização interativa usando D3.js
- **Quiz Interativo**: Sistema de perguntas e respostas com pontuação
- **Perfil de Usuário**: Diferentes tipos de usuário (aluno, professor, revista)

## 📱 Tecnologias Utilizadas

- **Expo**: Framework para desenvolvimento React Native
- **React Native**: Framework para aplicações móveis
- **Node.js + Express**: Backend API
- **Prisma + PostgreSQL**: Banco de dados e ORM
- **Docker**: Containerização completa (Frontend + Backend + Database)

## 📁 Estrutura do Projeto

O projeto foi reestruturado para suportar containerização completa:

```
EduGramApp/
├── backend/              # Código do Backend (Node.js + Express + Prisma)
│   ├── prisma/           # Schema e Seeds do DB
│   ├── src/              # Código fonte da API
│   └── Dockerfile        # Configuração Docker do backend
├── frontend/             # Código do Frontend (Expo + React Native)
│   ├── assets/           # Imagens e logos
│   ├── components/       # Componentes React
│   ├── screens/          # Telas do App
│   ├── App.js            # Entry point
│   └── Dockerfile        # Configuração Docker do frontend
├── docker-compose.yml    # Orquestração dos 3 containers
└── README.md             # Documentação
```

## 🛠️ Instalação e Execução com Docker (Recomendado)

A maneira mais fácil de rodar a aplicação completa é usando Docker Compose. Isso levantará 3 containers: `postgres`, `backend` e `frontend`.

### Pré-requisitos
- Docker e Docker Compose instalados e rodando.

### Passos
1. **Clone ou baixe o projeto**
   ```bash
   cd EduGramApp
   ```

2. **Inicie os containers**
   ```bash
   docker-compose up --build
   ```
   
   Isso irá:
   - Iniciar o banco de dados PostgreSQL.
   - Construir e iniciar o Backend (disponível em `http://localhost:3000`).
   - Construir e iniciar o Frontend Expo (disponível em `http://localhost:19000` ou `http://localhost:8081`).

3. **Acessar o App**
   - O Expo Metro Bundler estará rodando no container `frontend`.
   - Você pode ver os logs do container para encontrar o QR Code ou URL.
   - Para acessar de um dispositivo físico ou emulador, certifique-se de que eles estão na mesma rede e conseguem acessar o IP da sua máquina.

### Configuração da API
O frontend está configurado para buscar o backend. Se estiver rodando no emulador Android, ele tentará `10.0.2.2:3000`. Se precisar alterar, edite `frontend/screens/FeedPage.js`.

## 🛠️ Execução Manual (Sem Docker)

Se preferir rodar localmente sem containers:

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Configure DATABASE_URL no .env ou ambiente
   npx prisma migrate deploy
   npm run seed
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔐 Credenciais de Teste
- **Email**: test@example.com
- **Senha**: password

## 🐛 Solução de Problemas

### Erro Prisma / OpenSSL no Docker
Se encontrar erros de `libssl` ou `openssl` nos logs do backend, certifique-se de que o `Dockerfile` do backend está usando `node:18-slim` e instalando `openssl`, e que o `schema.prisma` inclui `debian-openssl-3.0.x`. (Isso já está configurado na versão atual).

### Conexão Frontend -> Backend
Se o app não carregar posts, verifique a `API_BASE_URL` em `frontend/screens/FeedPage.js`. Emuladores e dispositivos físicos têm formas diferentes de acessar o localhost da máquina host.
