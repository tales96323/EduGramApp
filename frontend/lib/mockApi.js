/**
 * Mock API para a DEMO web do portfólio.
 *
 * Quando ativado, intercepta `fetch` e responde localmente (sem backend),
 * com estado em memória que persiste durante a sessão. Assim o app roda
 * 100% no navegador, embutido no portfólio, sem servidor nem banco.
 *
 * Ativação: definir EXPO_PUBLIC_DEMO=1 no build (ver index.js).
 */

let installed = false;

const pic = (n) => `https://i.pravatar.cc/100?img=${n}`;

function makeDemoUser(overrides = {}) {
  return {
    id: 1,
    name: 'Convidado Demo',
    email: 'demo@edugram.app',
    role: 'professor',
    institution: 'EduGram · Conta de demonstração',
    bio: 'Conta de demonstração do portfólio. Explore o feed, a árvore do conhecimento, o quiz e o perfil.',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    verified: true,
    followersCount: 1280,
    followingCount: 312,
    postsCount: 0,
    quizPoints: 940,
    ...overrides,
  };
}

// Posts baseados em obras científicas reais de DOMÍNIO PÚBLICO
// (autores falecidos há mais de 70 anos e/ou publicações pré-1928).
// Os textos abaixo são resumos curtos próprios; as obras originais são de
// domínio público — sem questões de direito autoral.
function seedPosts() {
  return [
    {
      id: 101,
      authorId: 11,
      author: 'Albert Einstein',
      profilePic: pic(12),
      time: '1905',
      image: 'https://picsum.photos/seed/relativity/600/400',
      likesCount: 982,
      comments: 73,
      title: 'Sobre a Eletrodinâmica dos Corpos em Movimento',
      abstract:
        'Artigo que introduz a Teoria da Relatividade Restrita: a velocidade da luz é a mesma para todos os observadores.',
      fullContent:
        'Einstein mostra que as medidas de espaço e de tempo dependem do referencial e que a velocidade da luz no vácuo é constante para todos, levando à dilatação do tempo e à contração do comprimento. (Resumo de obra em domínio público.)',
      simplifiedSnippet:
        'Tempo e distância mudam conforme a velocidade — mas a luz tem sempre a mesma velocidade para todos.',
      keywords: ['relatividade', 'física', 'luz', 'espaço-tempo'],
      doi: '',
      references: 'Einstein, A. (1905). Annalen der Physik, 17, 891–921. Domínio público.',
      category: 'physics',
      subcategory: 'mechanics',
    },
    {
      id: 102,
      authorId: 12,
      author: 'Gregor Mendel',
      profilePic: pic(47),
      time: '1866',
      image: 'https://picsum.photos/seed/genetics/600/400',
      likesCount: 514,
      comments: 64,
      title: 'Experimentos sobre Hibridação de Plantas',
      abstract:
        'Estudo com ervilhas que estabeleceu as leis básicas da hereditariedade e fundou a genética.',
      fullContent:
        'Cruzando variedades de ervilha, Mendel observou proporções constantes na descendência e formulou as leis da segregação e da distribuição independente dos fatores hereditários. (Resumo de obra em domínio público.)',
      simplifiedSnippet:
        'Características passam dos pais aos filhos seguindo proporções previsíveis.',
      keywords: ['genética', 'hereditariedade', 'ervilhas', 'Mendel'],
      doi: '',
      references:
        'Mendel, G. (1866). Verhandlungen des naturforschenden Vereines in Brünn. Domínio público.',
      category: 'biology',
      subcategory: 'mendelian',
    },
    {
      id: 103,
      authorId: 13,
      author: 'Euclides de Alexandria',
      profilePic: pic(15),
      time: '~300 a.C.',
      image: 'https://picsum.photos/seed/geometry/600/400',
      likesCount: 367,
      comments: 41,
      title: 'Os Elementos',
      abstract:
        'Obra que organiza a geometria e a teoria dos números a partir de definições, axiomas e demonstrações.',
      fullContent:
        'A partir de poucos postulados, Euclides deduz centenas de proposições, estabelecendo o método axiomático-dedutivo que ainda hoje fundamenta a matemática. (Resumo de obra em domínio público.)',
      simplifiedSnippet:
        'Partindo de regras simples e evidentes, é possível demonstrar toda a geometria.',
      keywords: ['geometria', 'matemática', 'axiomas', 'Euclides'],
      doi: '',
      references: 'Euclides (c. 300 a.C.). Os Elementos. Domínio público.',
      category: 'math',
      subcategory: 'geometry',
    },
    {
      id: 104,
      authorId: 14,
      author: 'Antoine Lavoisier',
      profilePic: pic(33),
      time: '1789',
      image: 'https://picsum.photos/seed/chemistry/600/400',
      likesCount: 298,
      comments: 17,
      title: 'Tratado Elementar de Química',
      abstract:
        'Obra que consolidou a química moderna e enunciou a lei da conservação da massa.',
      fullContent:
        'Lavoisier demonstrou que, em uma reação química, a massa total se conserva, e propôs uma nomenclatura sistemática para os elementos. (Resumo de obra em domínio público.)',
      simplifiedSnippet:
        'Na natureza, nada se cria e nada se perde: a massa se conserva nas reações.',
      keywords: ['química', 'conservação da massa', 'elementos', 'Lavoisier'],
      doi: '',
      references: 'Lavoisier, A. (1789). Traité élémentaire de chimie. Domínio público.',
      category: 'chemistry',
      subcategory: 'inorganic',
    },
  ];
}

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

// Extrai campos de um corpo que pode ser JSON string ou FormData
function readBody(body) {
  const out = {};
  if (!body) return out;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return out;
    }
  }
  // FormData (web)
  if (typeof body.forEach === 'function' && typeof body.get === 'function') {
    body.forEach((value, key) => {
      out[key] = value;
    });
  }
  return out;
}

export function installMockApi() {
  if (installed) return;
  installed = true;

  const realFetch =
    typeof global !== 'undefined' && global.fetch ? global.fetch.bind(global) : null;

  let user = makeDemoUser();
  let posts = seedPosts();
  let nextId = 1000;
  const savedIds = new Set();

  const norm = (kw) =>
    typeof kw === 'string'
      ? kw.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(kw)
        ? kw
        : [];

  function handle(url, method, body) {
    let path;
    try {
      path = new URL(url).pathname;
    } catch {
      path = url;
    }

    // ── Gemini (IA externa): respostas canned ──
    if (url.includes('generativelanguage.googleapis.com')) {
      const payload = readBody(body);
      const isQuiz = JSON.stringify(payload).includes('responseSchema');
      let text;
      if (isQuiz) {
        text = JSON.stringify([
          {
            question: 'Na demonstração, qual estrutura armazena a informação genética?',
            options: ['Ribossomo', 'DNA', 'Mitocôndria', 'Membrana'],
            correctAnswer: 'DNA',
          },
          {
            question: 'O que a 2ª lei da termodinâmica descreve?',
            options: ['Conservação de massa', 'Aumento da entropia', 'Gravidade', 'Refração'],
            correctAnswer: 'Aumento da entropia',
          },
          {
            question: 'Redes neurais ajustam o quê durante o treino?',
            options: ['Pesos', 'Cores', 'Pixels', 'Tensão'],
            correctAnswer: 'Pesos',
          },
        ]);
      } else {
        text =
          'Versão simplificada (demo): este conteúdo foi resumido em linguagem simples para facilitar o entendimento de um público geral.';
      }
      return jsonResponse({ candidates: [{ content: { parts: [{ text }] } }] });
    }

    const data = readBody(body);

    // ── Auth ──
    if (path.endsWith('/login')) {
      user = makeDemoUser({ email: data.email || user.email });
      return jsonResponse(user);
    }
    if (path.endsWith('/register')) {
      user = makeDemoUser({ name: data.name || user.name, email: data.email || user.email });
      return jsonResponse(user);
    }

    // ── Posts ──
    if (path.endsWith('/posts/by-category')) {
      return jsonResponse({}); // árvore usa os nós embutidos
    }
    if (path.endsWith('/posts/upload')) {
      const post = {
        id: ++nextId,
        authorId: user.id,
        author: user.name,
        profilePic: user.avatarUrl,
        time: 'agora',
        image: `https://picsum.photos/seed/p${nextId}/600/400`,
        likesCount: 0,
        comments: 0,
        title: data.title || 'Sem título',
        abstract: data.abstract || '',
        fullContent: data.fullContent || '',
        simplifiedSnippet: '',
        keywords: norm(data.keywords),
        doi: data.doi || '',
        references: data.references || '',
        category: data.category || 'physics',
        subcategory: data.subcategory || 'geral',
      };
      posts = [post, ...posts];
      return jsonResponse({ ok: true, post });
    }
    const saveMatch = path.match(/\/posts\/([^/]+)\/save$/);
    if (saveMatch) {
      const id = Number(saveMatch[1]);
      if (method === 'DELETE') {
        savedIds.delete(id);
        return jsonResponse({ saved: false });
      }
      savedIds.add(id);
      return jsonResponse({ saved: true });
    }
    const postIdMatch = path.match(/\/posts\/([^/]+)$/);
    if (postIdMatch && (method === 'PATCH' || method === 'PUT')) {
      const id = Number(postIdMatch[1]);
      posts = posts.map((p) =>
        p.id === id
          ? {
              ...p,
              title: data.title ?? p.title,
              abstract: data.abstract ?? p.abstract,
              fullContent: data.fullContent ?? p.fullContent,
              simplifiedSnippet: data.simplifiedSnippet ?? p.simplifiedSnippet,
              keywords: data.keywords != null ? norm(data.keywords) : p.keywords,
              doi: data.doi ?? p.doi,
              references: data.references ?? p.references,
              category: data.category ?? p.category,
              subcategory: data.subcategory ?? p.subcategory,
            }
          : p,
      );
      return jsonResponse(posts.find((p) => p.id === id));
    }
    if (path.endsWith('/posts')) {
      return jsonResponse(posts);
    }

    // ── Users ──
    const userPostsMatch = path.match(/\/users\/([^/]+)\/posts$/);
    if (userPostsMatch) {
      const id = Number(userPostsMatch[1]);
      return jsonResponse(posts.filter((p) => p.authorId === id));
    }
    const savedMatch = path.match(/\/users\/([^/]+)\/saved$/);
    if (savedMatch) {
      return jsonResponse(posts.filter((p) => savedIds.has(p.id)));
    }
    const avatarMatch = path.match(/\/users\/([^/]+)\/avatar$/);
    if (avatarMatch) {
      const avatarUrl = 'https://i.pravatar.cc/200?img=32';
      user = { ...user, avatarUrl };
      return jsonResponse({ avatarUrl });
    }
    const userMatch = path.match(/\/users\/([^/]+)$/);
    if (userMatch && (method === 'PATCH' || method === 'PUT')) {
      user = { ...user, ...data };
      return jsonResponse(user);
    }

    // Rota desconhecida: 404 silencioso
    return jsonResponse({ error: 'not_found' }, 404);
  }

  global.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input && input.url;
    const method = ((init && init.method) || 'GET').toUpperCase();

    const isOurs =
      url &&
      (url.includes('/login') ||
        url.includes('/register') ||
        url.includes('/posts') ||
        url.includes('/users/') ||
        url.includes('generativelanguage.googleapis.com'));

    if (!isOurs) {
      return realFetch ? realFetch(input, init) : jsonResponse({}, 200);
    }

    // pequena latência para sensação realista
    await new Promise((r) => setTimeout(r, 220));
    try {
      return handle(url, method, init && init.body);
    } catch (e) {
      console.error('[mockApi] erro:', e);
      return jsonResponse({ error: 'mock_error' }, 500);
    }
  };
}
