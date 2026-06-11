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

// Perfis de AUTOR criados pela própria plataforma — um para cada cientista
// cujas obras (de domínio público) são publicadas no feed. As fotos são
// retratos de domínio público (servidas localmente em /edugram-authors/).
const AUTHORS = {
  11: {
    id: 11,
    name: 'Albert Einstein',
    role: 'Físico teórico',
    field: 'physics',
    avatarUrl: '/edugram-authors/einstein.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Físico teórico (1879–1955). Teoria da Relatividade e contribuições fundamentais à física quântica.',
    verified: true,
    followersCount: 98231,
    followingCount: 12,
  },
  12: {
    id: 12,
    name: 'Charles Darwin',
    role: 'Naturalista',
    field: 'biology',
    avatarUrl: '/edugram-authors/darwin.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Naturalista britânico (1809–1882). Formulou a teoria da evolução por seleção natural.',
    verified: true,
    followersCount: 76540,
    followingCount: 9,
  },
  13: {
    id: 13,
    name: 'Isaac Newton',
    role: 'Físico e matemático',
    field: 'physics',
    avatarUrl: '/edugram-authors/newton.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Físico e matemático inglês (1643–1727). Leis do movimento, gravitação universal e óptica.',
    verified: true,
    followersCount: 84120,
    followingCount: 5,
  },
  14: {
    id: 14,
    name: 'Marie Curie',
    role: 'Física e química',
    field: 'chemistry',
    avatarUrl: '/edugram-authors/curie.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Física e química (1867–1934). Pioneira no estudo da radioatividade; dois prêmios Nobel.',
    verified: true,
    followersCount: 71008,
    followingCount: 14,
  },
  15: {
    id: 15,
    name: 'Gregor Mendel',
    role: 'Naturalista',
    field: 'biology',
    avatarUrl: '/edugram-authors/mendel.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Monge e naturalista (1822–1884). Fundador da genética com seus experimentos com ervilhas.',
    verified: true,
    followersCount: 42390,
    followingCount: 3,
  },
  16: {
    id: 16,
    name: 'Antoine Lavoisier',
    role: 'Químico',
    field: 'chemistry',
    avatarUrl: '/edugram-authors/lavoisier.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Químico francês (1743–1794). Pai da química moderna e da lei da conservação da massa.',
    verified: true,
    followersCount: 38715,
    followingCount: 6,
  },
  17: {
    id: 17,
    name: 'Galileu Galilei',
    role: 'Astrônomo e físico',
    field: 'physics',
    avatarUrl: '/edugram-authors/galileo.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Astrônomo e físico (1564–1642). Observações telescópicas e fundamentos do método científico.',
    verified: true,
    followersCount: 65900,
    followingCount: 7,
  },
  18: {
    id: 18,
    name: 'Michael Faraday',
    role: 'Físico e químico',
    field: 'physics',
    avatarUrl: '/edugram-authors/faraday.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Físico e químico britânico (1791–1867). Indução eletromagnética e eletroquímica.',
    verified: true,
    followersCount: 51230,
    followingCount: 8,
  },
  19: {
    id: 19,
    name: 'Dmitri Mendeleev',
    role: 'Químico',
    field: 'chemistry',
    avatarUrl: '/edugram-authors/mendeleev.jpg',
    institution: 'Perfil curado · EduGram',
    bio: 'Químico russo (1834–1907). Criador da tabela periódica dos elementos.',
    verified: true,
    followersCount: 47880,
    followingCount: 4,
  },
};

function makeDemoUser(overrides = {}) {
  return {
    id: 1,
    name: 'Convidado Demo',
    email: 'demo@edugram.app',
    role: 'aluno',
    institution: 'Conta de demonstração',
    bio: 'Conta de demonstração do portfólio. Explore o feed, a árvore do conhecimento, o quiz e os perfis dos autores.',
    avatarUrl: 'https://i.pravatar.cc/200?img=60',
    verified: false,
    followersCount: 3,
    followingCount: 9,
    postsCount: 0,
    quizPoints: 120,
    ...overrides,
  };
}

// Artigos baseados em obras científicas reais de DOMÍNIO PÚBLICO
// (autores falecidos há mais de 70 anos e/ou publicações pré-1928).
// Cada artigo é atribuído ao perfil do seu autor original (ver AUTHORS).
// Os textos são resumos curtos próprios; as obras originais são de domínio
// público — sem questões de direito autoral.
const RAW_POSTS = [
  {
    authorId: 11,
    time: '1905',
    seed: 'relativity',
    likesCount: 982,
    comments: 73,
    title: 'Sobre a Eletrodinâmica dos Corpos em Movimento',
    abstract: 'Introduz a Relatividade Restrita: a velocidade da luz é a mesma para todos os observadores.',
    fullContent:
      'As medidas de espaço e de tempo dependem do referencial, e a velocidade da luz no vácuo é constante para todos — levando à dilatação do tempo e à contração do comprimento. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Tempo e distância mudam com a velocidade; a luz tem sempre a mesma velocidade.',
    keywords: ['relatividade', 'física', 'espaço-tempo'],
    references: 'Einstein, A. (1905). Annalen der Physik, 17, 891–921. Domínio público.',
    category: 'physics',
    subcategory: 'mechanics',
  },
  {
    authorId: 11,
    time: '1905',
    seed: 'emc2',
    likesCount: 1204,
    comments: 96,
    title: 'A Inércia de um Corpo Depende de seu Conteúdo de Energia?',
    abstract: 'Artigo curto que estabelece a equivalência entre massa e energia (E = mc²).',
    fullContent:
      'Einstein deduz que a massa de um corpo é uma medida de seu conteúdo de energia, expressa pela relação E = mc². (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Massa e energia são duas faces da mesma coisa: E = mc².',
    keywords: ['energia', 'massa', 'E=mc²'],
    references: 'Einstein, A. (1905). Annalen der Physik, 18, 639–641. Domínio público.',
    category: 'physics',
    subcategory: 'mechanics',
  },
  {
    authorId: 11,
    time: '1905',
    seed: 'photon',
    likesCount: 743,
    comments: 51,
    title: 'Sobre um Ponto de Vista Heurístico Acerca da Luz',
    abstract: 'Propõe que a luz é composta por quanta de energia, explicando o efeito fotoelétrico.',
    fullContent:
      'A luz pode ser tratada como pacotes discretos de energia (quanta), o que explica a emissão de elétrons por metais iluminados. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'A luz vem em "pacotes" de energia — base da física quântica.',
    keywords: ['luz', 'quanta', 'efeito fotoelétrico'],
    references: 'Einstein, A. (1905). Annalen der Physik, 17, 132–148. Domínio público.',
    category: 'physics',
    subcategory: 'quantum_mechanics',
  },
  {
    authorId: 12,
    time: '1859',
    seed: 'evolution',
    likesCount: 1532,
    comments: 210,
    title: 'A Origem das Espécies',
    abstract: 'Apresenta a teoria da evolução das espécies por meio da seleção natural.',
    fullContent:
      'Organismos variam, e aqueles com características vantajosas tendem a sobreviver e a se reproduzir mais, transmitindo-as — o que, ao longo do tempo, origina novas espécies. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Os mais adaptados sobrevivem e passam suas características adiante.',
    keywords: ['evolução', 'seleção natural', 'espécies'],
    references: 'Darwin, C. (1859). On the Origin of Species. John Murray. Domínio público.',
    category: 'biology',
    subcategory: 'ecology',
  },
  {
    authorId: 12,
    time: '1871',
    seed: 'descent',
    likesCount: 689,
    comments: 88,
    title: 'A Descendência do Homem',
    abstract: 'Aplica a teoria da evolução à origem humana e introduz a seleção sexual.',
    fullContent:
      'Darwin argumenta que a espécie humana descende de formas anteriores e discute o papel da seleção sexual na evolução. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Os humanos também são fruto da evolução, como as demais espécies.',
    keywords: ['evolução', 'seleção sexual', 'antropologia'],
    references: 'Darwin, C. (1871). The Descent of Man. John Murray. Domínio público.',
    category: 'biology',
    subcategory: 'zoology',
  },
  {
    authorId: 13,
    time: '1687',
    seed: 'principia',
    likesCount: 1120,
    comments: 140,
    title: 'Princípios Matemáticos da Filosofia Natural',
    abstract: 'Enuncia as três leis do movimento e a lei da gravitação universal.',
    fullContent:
      'Newton formula as leis do movimento e demonstra que a mesma força que faz os corpos caírem mantém os planetas em órbita. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'As mesmas leis regem a queda de uma maçã e a órbita da Lua.',
    keywords: ['mecânica', 'gravidade', 'movimento'],
    references: 'Newton, I. (1687). Philosophiæ Naturalis Principia Mathematica. Domínio público.',
    category: 'physics',
    subcategory: 'mechanics',
  },
  {
    authorId: 13,
    time: '1704',
    seed: 'optics',
    likesCount: 534,
    comments: 47,
    title: 'Óptica',
    abstract: 'Estuda a natureza da luz e mostra que a luz branca é composta por várias cores.',
    fullContent:
      'Por meio de prismas, Newton demonstra que a luz branca se decompõe em um espectro de cores e estuda reflexão e refração. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'A luz branca é, na verdade, uma mistura de todas as cores.',
    keywords: ['óptica', 'luz', 'espectro'],
    references: 'Newton, I. (1704). Opticks. Domínio público.',
    category: 'physics',
    subcategory: 'optics',
  },
  {
    authorId: 14,
    time: '1903',
    seed: 'radioactivity',
    likesCount: 812,
    comments: 64,
    title: 'Pesquisas sobre as Substâncias Radioativas',
    abstract: 'Tese que sistematiza o estudo da radioatividade e suas propriedades.',
    fullContent:
      'Marie Curie mede e caracteriza a radiação emitida por compostos de urânio e tório, consolidando o conceito de radioatividade. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Alguns elementos emitem energia espontaneamente: é a radioatividade.',
    keywords: ['radioatividade', 'urânio', 'física'],
    references: 'Curie, M. (1903). Recherches sur les substances radioactives. Domínio público.',
    category: 'physics',
    subcategory: 'nuclear',
  },
  {
    authorId: 14,
    time: '1898',
    seed: 'radium',
    likesCount: 658,
    comments: 39,
    title: 'Sobre uma Nova Substância Radioativa: o Rádio',
    abstract: 'Comunicação que anuncia a descoberta de um novo elemento fortemente radioativo.',
    fullContent:
      'A partir da pechblenda, os Curie isolam um novo elemento, o rádio, muito mais radioativo que o urânio. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'A descoberta do rádio, um elemento intensamente radioativo.',
    keywords: ['rádio', 'radioatividade', 'química'],
    references: 'Curie, P. & Curie, M. (1898). Comptes rendus de l’Académie des sciences. Domínio público.',
    category: 'chemistry',
    subcategory: 'inorganic',
  },
  {
    authorId: 15,
    time: '1866',
    seed: 'genetics',
    likesCount: 514,
    comments: 64,
    title: 'Experimentos sobre Hibridação de Plantas',
    abstract: 'Estudo com ervilhas que estabeleceu as leis básicas da hereditariedade.',
    fullContent:
      'Cruzando variedades de ervilha, Mendel observa proporções constantes na descendência e formula as leis da hereditariedade. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Características passam dos pais aos filhos em proporções previsíveis.',
    keywords: ['genética', 'hereditariedade', 'Mendel'],
    references: 'Mendel, G. (1866). Verhandlungen des naturforschenden Vereines in Brünn. Domínio público.',
    category: 'biology',
    subcategory: 'mendelian',
  },
  {
    authorId: 16,
    time: '1789',
    seed: 'chemistry',
    likesCount: 298,
    comments: 17,
    title: 'Tratado Elementar de Química',
    abstract: 'Consolida a química moderna e enuncia a lei da conservação da massa.',
    fullContent:
      'Lavoisier demonstra que, em uma reação química, a massa total se conserva, e propõe uma nomenclatura sistemática para os elementos. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Na natureza, nada se cria e nada se perde: a massa se conserva.',
    keywords: ['química', 'conservação da massa', 'elementos'],
    references: 'Lavoisier, A. (1789). Traité élémentaire de chimie. Domínio público.',
    category: 'chemistry',
    subcategory: 'inorganic',
  },
  {
    authorId: 17,
    time: '1610',
    seed: 'stars',
    likesCount: 905,
    comments: 77,
    title: 'Sidereus Nuncius — O Mensageiro das Estrelas',
    abstract: 'Relata as primeiras observações astronômicas feitas com telescópio.',
    fullContent:
      'Galileu descreve as montanhas da Lua, inúmeras estrelas novas e as quatro maiores luas de Júpiter. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Com o telescópio, Galileu revelou luas, crateras e novas estrelas.',
    keywords: ['astronomia', 'telescópio', 'Júpiter'],
    references: 'Galilei, G. (1610). Sidereus Nuncius. Domínio público.',
    category: 'physics',
    subcategory: 'optics',
  },
  {
    authorId: 17,
    time: '1632',
    seed: 'dialogue',
    likesCount: 612,
    comments: 103,
    title: 'Diálogo sobre os Dois Máximos Sistemas do Mundo',
    abstract: 'Defende o modelo heliocêntrico em comparação ao geocêntrico.',
    fullContent:
      'Em forma de diálogo, Galileu compara os sistemas de Ptolomeu e de Copérnico, reunindo argumentos a favor do heliocentrismo. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'A Terra gira em torno do Sol — e não o contrário.',
    keywords: ['heliocentrismo', 'astronomia', 'Copérnico'],
    references: 'Galilei, G. (1632). Dialogo sopra i due massimi sistemi del mondo. Domínio público.',
    category: 'physics',
    subcategory: 'mechanics',
  },
  {
    authorId: 18,
    time: '1839',
    seed: 'electricity',
    likesCount: 487,
    comments: 35,
    title: 'Pesquisas Experimentais em Eletricidade',
    abstract: 'Reúne experimentos sobre indução eletromagnética e eletroquímica.',
    fullContent:
      'Faraday mostra que um campo magnético variável induz corrente elétrica, base dos geradores e transformadores. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'Ímãs em movimento geram eletricidade — o princípio dos geradores.',
    keywords: ['eletromagnetismo', 'indução', 'eletricidade'],
    references: 'Faraday, M. (1839). Experimental Researches in Electricity. Domínio público.',
    category: 'physics',
    subcategory: 'optics',
  },
  {
    authorId: 19,
    time: '1869',
    seed: 'periodic',
    likesCount: 729,
    comments: 58,
    title: 'A Lei Periódica dos Elementos Químicos',
    abstract: 'Organiza os elementos por peso atômico, revelando propriedades periódicas.',
    fullContent:
      'Mendeleev ordena os elementos conhecidos e percebe que suas propriedades se repetem periodicamente, prevendo elementos ainda não descobertos. (Resumo de obra em domínio público.)',
    simplifiedSnippet: 'As propriedades dos elementos se repetem em ciclos — a tabela periódica.',
    keywords: ['tabela periódica', 'elementos', 'química'],
    references: 'Mendeleev, D. (1869). Zeitschrift für Chemie. Domínio público.',
    category: 'chemistry',
    subcategory: 'inorganic',
  },
];

function seedPosts() {
  return RAW_POSTS.map((p, i) => {
    const author = AUTHORS[p.authorId];
    return {
      id: 101 + i,
      author: author.name,
      profilePic: author.avatarUrl,
      image: `https://picsum.photos/seed/${p.seed}/600/400`,
      doi: '',
      ...p,
    };
  });
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
    if (userMatch && method === 'GET') {
      const id = Number(userMatch[1]);
      if (id === user.id) return jsonResponse(user);
      const author = AUTHORS[id];
      if (author) {
        const postsCount = posts.filter((p) => p.authorId === id).length;
        return jsonResponse({ ...author, postsCount });
      }
      return jsonResponse({ error: 'user_not_found' }, 404);
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
