# EduGram App - MVP Mobile

Este é um aplicativo móvel desenvolvido com Expo/React Native baseado no protótipo EduGram. O app oferece uma plataforma educacional com feed de conteúdo, árvore do conhecimento, quiz interativo e perfil de usuário.

## 🚀 Funcionalidades

- **Tela de Boas-vindas**: Interface atrativa para novos usuários
- **Login/Autenticação**: Sistema de login com validação
- **Feed de Conteúdo**: Posts educacionais com funcionalidade de simplificação
- **Árvore do Conhecimento**: Visualização interativa usando D3.js
- **Quiz Interativo**: Sistema de perguntas e respostas com pontuação
- **Perfil de Usuário**: Diferentes tipos de usuário (aluno, professor, revista)

## 📱 Tecnologias Utilizadas

- **Expo**: Framework para desenvolvimento React Native
- **React Native**: Framework para aplicações móveis
- **React Navigation**: Navegação entre telas
- **Expo Vector Icons**: Ícones para interface
- **React Native WebView**: Para renderização da árvore do conhecimento
- **Expo Linear Gradient**: Gradientes para design visual

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Expo Go app no seu dispositivo móvel (para testes)

### Passos para executar

1. **Clone ou baixe o projeto**
   ```bash
   cd EduGramApp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Adicione as imagens do logo**
   - Coloque `LOGO_GRANDE_SEM_FUNDO.png` na pasta `assets/images/`
   - Coloque `LOGO_LADO_SEM_FUNDO.png` na pasta `assets/images/`

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```
   ou
   ```bash
   expo start
   ```

5. **Execute no dispositivo**
   - Escaneie o QR code com o app Expo Go (Android/iOS)
   - Ou use um emulador Android/iOS

### Comandos alternativos

- **Android**: `npm run android` (requer Android Studio)
- **iOS**: `npm run ios` (requer macOS e Xcode)
- **Web**: `npm run web` (para testes no navegador)

## 📁 Estrutura do Projeto

```
EduGramApp/
├── assets/
│   └── images/           # Imagens e logos
├── components/
│   └── PostCard.js       # Componente de card de post
├── screens/
│   ├── WelcomePage.js    # Tela de boas-vindas
│   ├── LoginPage.js      # Tela de login
│   ├── FeedPage.js       # Tela do feed
│   ├── KnowledgeTreePage.js # Árvore do conhecimento
│   ├── QuizPage.js       # Tela de quiz
│   └── ProfilePage.js    # Tela de perfil
├── App.js                # Componente principal
├── app.json              # Configurações do Expo
└── package.json          # Dependências do projeto
```

## 🔐 Credenciais de Teste

Para testar o login, use:
- **Email**: test@example.com
- **Senha**: password

## 🎨 Design e UX

O aplicativo mantém a identidade visual do protótipo original com:
- Gradientes roxo/azul nas telas de entrada
- Interface limpa e moderna
- Navegação intuitiva com tabs na parte inferior
- Componentes responsivos para diferentes tamanhos de tela

## 🔧 Personalização

### Alterando cores
As cores principais podem ser alteradas nos arquivos de estilo de cada componente. A cor primária atual é `#4f46e5` (indigo).

### Adicionando conteúdo
- **Posts do feed**: Edite o array `posts` em `FeedPage.js`
- **Perguntas do quiz**: Modifique o array `questions` em `QuizPage.js`
- **Dados da árvore**: Altere `treeData` em `KnowledgeTreePage.js`

## 📱 Compatibilidade

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Expo SDK**: 49+

## 🚀 Deploy

Para fazer deploy do aplicativo:

1. **Build para Android**:
   ```bash
   expo build:android
   ```

2. **Build para iOS**:
   ```bash
   expo build:ios
   ```

3. **Publicar no Expo**:
   ```bash
   expo publish
   ```

## 📝 Notas de Desenvolvimento

- As imagens de placeholder são carregadas de serviços externos
- A árvore do conhecimento usa WebView para renderizar D3.js
- O sistema de navegação é baseado em estado para simplicidade
- Todos os componentes são responsivos e otimizados para mobile

## 🐛 Solução de Problemas

### Erro de imagem não encontrada
- Verifique se as imagens estão na pasta `assets/images/`
- Confirme que os nomes dos arquivos estão corretos

### Problemas de navegação
- Limpe o cache: `expo r -c`
- Reinstale dependências: `rm -rf node_modules && npm install`

### WebView não carrega
- Verifique a conexão com internet
- Teste em dispositivo físico (WebView pode ter limitações no simulador)

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação oficial do Expo: https://docs.expo.dev/

