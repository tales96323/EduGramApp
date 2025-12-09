require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = pool;


const rawKnowledgeNodesData = [
  {
    id: 'physics',
    label: 'Física',
    color: 'bg-blue-500',
    icon: '⚡',
    children: [
      {
        id: 'cinematics',
        label: 'Cinemática',
        color: 'bg-blue-400',
        icon: '��',
        articles: [
          {
            id: 'art1',
            title: 'Introdução à Cinemática: Movimento Retilíneo Uniforme',
            snippet: 'Explora os conceitos básicos de posição, velocidade e tempo no movimento uniforme.'
          },
          {
            id: 'art2',
            title: 'Aceleração e Queda Livre: Fundamentos da Cinemática',
            snippet: 'Análise do movimento com aceleração constante, incluindo a gravidade.'
          }
        ]
      },
      {
        id: 'mechanics',
        label: 'Mecânica',
        color: 'bg-blue-400',
        icon: '⚙️',
        children: [
          {
            id: 'newtonian',
            label: 'Mecânica Newtoniana',
            color: 'bg-blue-300',
            icon: ' ',
            articles: [
              {
                id: 'art3',
                title: 'As Três Leis de Newton e Suas Aplicações',
                snippet: 'Um estudo aprofundado das leis que regem o movimento dos corpos.'
              },
              {
                id: 'art4',
                title: 'Força e Movimento: Uma Análise Detalhada',
                snippet: 'Examina a relação entre força, massa e aceleração.'
              }
            ]
          },
          {
            id: 'quantum_mechanics',
            label: 'Mecânica Quântica',
            color: 'bg-blue-300',
            icon: '⚛️',
            articles: [
              {
                id: 'art5',
                title: 'Princípios da Mecânica Quântica para Iniciantes',
                snippet: 'Conceitos fundamentais como superposição e entrelaçamento.'
              },
              {
                id: 'art6',
                title: 'O Gato de Schrödinger: Paradoxo e Realidade',
                snippet: 'Discussão sobre o famoso experimento mental e suas implicações.'
              }
            ]
          }
        ]
      },
      {
        id: 'nuclear',
        label: 'Física Nuclear',
        color: 'bg-blue-400',
        icon: '☢️',
        articles: [
          {
            id: 'art7',
            title: 'Reações Nucleares: Fissão e Fusão',
            snippet: 'Exploração dos processos que libertam energia nos núcleos atómicos.'
          },
          {
            id: 'art8',
            title: 'Radioatividade e Suas Aplicações',
            snippet: 'Estudo da desintegração nuclear e usos em medicina e indústria.'
          }
        ]
      },
      {
        id: 'thermodynamics',
        label: 'Termodinâmica',
        color: 'bg-blue-400',
        icon: '��',
        articles: [
          {
            id: 'art9',
            title: 'Leis da Termodinâmica: Energia e Entropia',
            snippet: 'Os princípios que governam a energia e a desordem nos sistemas físicos.'
          },
          {
            id: 'art10',
            title: 'Ciclos Térmicos e Eficiência Energética',
            snippet: 'Análise de motores e sistemas de refrigeração.'
          }
        ]
      },
      {
        id: 'optics',
        label: 'Óptica',
        color: 'bg-blue-400',
        icon: '��',
        articles: [
          {
            id: 'art11',
            title: 'Reflexão e Refração da Luz',
            snippet: 'Como a luz interage com diferentes meios e superfícies.'
          },
          {
            id: 'art12',
            title: 'Instrumentos Ópticos: Lentes e Espelhos',
            snippet: 'O funcionamento de telescópios, microscópios e óculos.'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    label: 'Biologia',
    color: 'bg-green-500',
    icon: '��',
    children: [
      {
        id: 'cell_biology',
        label: 'Biologia Celular',
        color: 'bg-green-400',
        icon: '��',
        articles: [
          {
            id: 'art13',
            title: 'A Célula: Unidade Fundamental da Vida',
            snippet: 'Estrutura e função das células procarióticas e eucarióticas.'
          },
          {
            id: 'art14',
            title: 'Organelos Celulares e Suas Funções',
            snippet: 'Detalhes sobre as organelas que compõem uma célula.'
          }
        ]
      },
      {
        id: 'genetics',
        label: 'Genética',
        color: 'bg-green-400',
        icon: '��',
        children: [
          {
            id: 'mendelian',
            label: 'Genética Mendeliana',
            color: 'bg-green-300',
            icon: '🌱',
            articles: [
              {
                id: 'art15',
                title: 'As Leis de Mendel e a Herança Genética',
                snippet: 'Os princípios da hereditariedade descobertos por Gregor Mendel.'
              },
              {
                id: 'art16',
                title: 'Cruzamentos Genéticos: Da Teoria à Prática',
                snippet: 'Como prever a herança de características em diferentes cruzamentos.'
              }
            ]
          },
          {
            id: 'molecular',
            label: 'Genética Molecular',
            color: 'bg-green-300',
            icon: '🔗',
            articles: [
              {
                id: 'art17',
                title: 'O DNA e o Código Genético',
                snippet: 'A estrutura do DNA e como a informação genética é codificada.'
              },
              {
                id: 'art18',
                title: 'Engenharia Genética: Ferramentas e Aplicações',
                snippet: 'Técnicas de manipulação de genes e suas aplicações.'
              }
            ]
          }
        ]
      },
      {
        id: 'ecology',
        label: 'Ecologia',
        color: 'bg-green-400',
        icon: '��',
        articles: [
          {
            id: 'art19',
            title: 'Ecossistemas e Cadeias Alimentares',
            snippet: 'Interações entre seres vivos e o ambiente em diferentes ecossistemas.'
          },
          {
            id: 'art20',
            title: 'Sustentabilidade e Conservação Ambiental',
            snippet: 'Estratégias para proteger o meio ambiente e garantir um futuro sustentável.'
          }
        ]
      },
      {
        id: 'zoology',
        label: 'Zoologia',
        color: 'bg-green-400',
        icon: '��',
        articles: [
          {
            id: 'art21',
            title: 'Classificação Animal: Invertebrados e Vertebrados',
            snippet: 'Visão geral da diversidade do reino animal.'
          },
          {
            id: 'art22',
            title: 'Comportamento Animal e Adaptações',
            snippet: 'Estudo de como os animais interagem com o ambiente e se adaptam.'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    label: 'Química',
    color: 'bg-purple-500',
    icon: '��',
    children: [
      {
        id: 'organic',
        label: 'Química Orgânica',
        color: 'bg-purple-400',
        icon: '��',
        articles: [
          {
            id: 'art23',
            title: 'Introdução aos Compostos Orgânicos',
            snippet: 'Estudo dos compostos de carbono e suas propriedades.'
          },
          {
            id: 'art24',
            title: 'Reações Orgânicas Essenciais',
            snippet: 'Principais tipos de reações e mecanismos em química orgânica.'
          }
        ]
      },
      {
        id: 'inorganic',
        label: 'Química Inorgânica',
        color: 'bg-purple-400',
        icon: '��',
        articles: [
          {
            id: 'art25',
            title: 'Metais e Não-Metais: Propriedades e Usos',
            snippet: 'Características e aplicações dos elementos inorgânicos.'
          },
          {
            id: 'art26',
            title: 'Ácidos, Bases e Sais: Reações Químicas',
            snippet: 'Fundamentos da química inorgânica e suas interações.'
          }
        ]
      },
      {
        id: 'physical',
        label: 'Físico-Química',
        color: 'bg-purple-400',
        icon: '⚛️',
        articles: [
          {
            id: 'art27',
            title: 'Termoquímica: Calor e Reações Químicas',
            snippet: 'Relação entre energia e transformações químicas.'
          },
          {
            id: 'art28',
            title: 'Cinética Química: Velocidade das Reações',
            snippet: 'Fatores que influenciam a rapidez das reações químicas.'
          }
        ]
      }
    ]
  },
  {
    id: 'math',
    label: 'Matemática',
    color: 'bg-red-500',
    icon: '➕',
    children: [
      {
        id: 'algebra',
        label: 'Álgebra',
        color: 'bg-red-400',
        icon: '��',
        articles: [
          {
            id: 'art29',
            title: 'Equações e Inequações: Fundamentos da Álgebra',
            snippet: 'Como resolver problemas com variáveis e relações.'
          },
          {
            id: 'art30',
            title: 'Funções e Gráficos: Representações Algébricas',
            snippet: 'Entendendo as relações entre variáveis através de funções.'
          }
        ]
      },
      {
        id: 'geometry',
        label: 'Geometria',
        color: 'bg-red-400',
        icon: '��',
        articles: [
          {
            id: 'art31',
            title: 'Geometria Euclidiana: Figuras Planas e Sólidos',
            snippet: 'Estudo de formas, tamanhos e posições no espaço.'
          },
          {
            id: 'art32',
            title: 'Trigonometria: Relações em Triângulos',
            snippet: 'Cálculo de ângulos e lados em triângulos, especialmente retângulos.'
          }
        ]
      },
      {
        id: 'calculus',
        label: 'Cálculo',
        color: 'bg-red-400',
        icon: '��',
        articles: [
          {
            id: 'art33',
            title: 'Derivadas: Taxas de Variação',
            snippet: 'Como calcular a taxa de mudança instantânea de uma função.'
          },
          {
            id: 'art34',
            title: 'Integrais: Acumulação e Áreas',
            snippet: 'Métodos para calcular áreas, volumes e acumulações.'
          }
        ]
      }
    ]
  },
  {
    id: 'cs',
    label: 'Ciência da Computação',
    color: 'bg-yellow-500',
    icon: '��',
    children: [
      {
        id: 'programming',
        label: 'Programação',
        color: 'bg-yellow-400',
        icon: '⌨️',
        articles: [
          {
            id: 'art35',
            title: 'Lógica de Programação para Iniciantes',
            snippet: 'Os fundamentos do pensamento computacional.'
          },
          {
            id: 'art36',
            title: 'Introdução a Estruturas de Dados',
            snippet: 'Organização e armazenamento eficiente de dados.'
          }
        ]
      },
      {
        id: 'algorithms',
        label: 'Algoritmos',
        color: 'bg-yellow-400',
        icon: '��',
        articles: [
          {
            id: 'art37',
            title: 'Algoritmos de Ordenação e Busca',
            snippet: 'Métodos para organizar e encontrar dados de forma eficiente.'
          },
          {
            id: 'art38',
            title: 'Complexidade de Algoritmos',
            snippet: 'Análise da eficiência de algoritmos em termos de tempo e espaço.'
          }
        ]
      },
      {
        id: 'ai',
        label: 'Inteligência Artificial',
        color: 'bg-yellow-400',
        icon: '��',
        articles: [
          {
            id: 'art39',
            title: 'Fundamentos de Machine Learning',
            snippet: 'Introdução aos algoritmos que permitem aos computadores aprender com dados.'
          },
          {
            id: 'art40',
            title: 'Redes Neurais Artificiais: Como Funcionam',
            snippet: 'Modelos inspirados no cérebro humano para resolver problemas complexos.'
          }
        ]
      }
    ]
  },
  {
    id: 'history',
    label: 'História',
    color: 'bg-pink-500',
    icon: '��',
    children: [
      {
        id: 'ancient',
        label: 'História Antiga',
        color: 'bg-pink-400',
        icon: '🏛️',
        articles: [
          {
            id: 'art41',
            title: 'Civilizações Antigas: Egito e Mesopotâmia',
            snippet: 'O berço da civilização e as primeiras grandes sociedades.'
          },
          {
            id: 'art42',
            title: 'Grécia e Roma: Berços da Civilização Ocidental',
            snippet: 'A influência duradoura das culturas grega e romana.'
          }
        ]
      },
      {
        id: 'medieval',
        label: 'Idade Média',
        color: 'bg-pink-400',
        icon: '��',
        articles: [
          {
            id: 'art43',
            title: 'Feudalismo e a Sociedade Medieval',
            snippet: 'A estrutura social e económica da Idade Média.'
          },
          {
            id: 'art44',
            title: 'As Cruzadas e o Islão Medieval',
            snippet: 'Conflitos e intercâmbios culturais entre o Ocidente e o Oriente.'
          }
        ]
      },
      {
        id: 'modern',
        label: 'História Moderna',
        color: 'bg-pink-400',
        icon: '��',
        articles: [
          {
            id: 'art45',
            title: 'Revolução Científica e Iluminismo',
            snippet: 'Grandes transformações no pensamento científico e filosófico.'
          },
          {
            id: 'art46',
            title: 'As Grandes Navegações e a Expansão Europeia',
            snippet: 'A era da exploração e o impacto global.'
          }
        ]
      }
    ]
  }
];

async function insertNode(node, parentId = null, orderIndex = 0) {
  try {
    const result = await pool.query(
      'INSERT INTO knowledge_nodes (slug, label, color, icon, parent_id, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [node.id, node.label, node.color, node.icon, parentId, orderIndex]
    );
    
    const nodeId = result.rows[0].id;
    console.log(`Inserido nó: ${node.label} (ID: ${nodeId})`);
    
    // Inserir artigos se existirem
    if (node.articles && node.articles.length > 0) {
      for (const article of node.articles) {
        await pool.query(
          'INSERT INTO articles (slug, node_id, title, snippet) VALUES ($1, $2, $3, $4)',
          [article.id, nodeId, article.title, article.snippet]
        );
        console.log(`  - Artigo inserido: ${article.title}`);
      }
    }
    
    // Inserir filhos recursivamente
    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        await insertNode(node.children[i], nodeId, i);
      }
    }
    
    return nodeId;
  } catch (error) {
    console.error(`Erro ao inserir nó ${node.label}:`, error);
    throw error;
  }
}

async function populateDatabase() {
  try {
    console.log('Iniciando população do banco de dados...');
    
    // Limpar tabelas existentes
    await pool.query('DELETE FROM articles');
    await pool.query('DELETE FROM knowledge_nodes');
    
    // Inserir todos os nós raiz
    for (let i = 0; i < rawKnowledgeNodesData.length; i++) {
      await insertNode(rawKnowledgeNodesData[i], null, i);
    }
    
    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular banco:', error);
  } finally {
    await pool.end();
  }
}

populateDatabase();