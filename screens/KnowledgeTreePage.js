import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'; // Para renderizar o D3.js
import { ChevronLeft, X } from 'lucide-react-native'; // Ícones

export default function KnowledgeTreePage() {
  const rawKnowledgeNodesData = [
    {
      id: 'physics',
      label: 'Física',
      color: 'bg-blue-500',
      icon: '⚡',
      children: [
        { id: 'cinematics', label: 'Cinemática', color: 'bg-blue-400', icon: '🏃',
          articles: [
            { id: 'art1', title: 'Introdução à Cinemática: Movimento Retilíneo Uniforme', snippet: 'Explora os conceitos básicos de posição, velocidade e tempo no movimento uniforme.' },
            { id: 'art2', title: 'Aceleração e Queda Livre: Fundamentos da Cinemática', snippet: 'Análise do movimento com aceleração constante, incluindo a gravidade.' },
          ]
        },
        { id: 'mechanics', label: 'Mecânica', color: 'bg-blue-400', icon: '⚙️',
          children: [
            { id: 'newtonian', label: 'Mecânica Newtoniana', color: 'bg-blue-300', icon: '�',
              articles: [
                { id: 'art3', title: 'As Três Leis de Newton e Suas Aplicações', snippet: 'Um estudo aprofundado das leis que regem o movimento dos corpos.' },
                { id: 'art4', title: 'Força e Movimento: Uma Análise Detalhada', snippet: 'Examina a relação entre força, massa e aceleração.' },
              ]
            },
            { id: 'quantum_mechanics', label: 'Mecânica Quântica', color: 'bg-blue-300', icon: '⚛️',
              articles: [
                { id: 'art5', title: 'Princípios da Mecânica Quântica para Iniciantes', snippet: 'Conceitos fundamentais como superposição e entrelaçamento.' },
                { id: 'art6', title: 'O Gato de Schrödinger: Paradoxo e Realidade', snippet: 'Discussão sobre o famoso experimento mental e suas implicações.' },
              ]
            },
          ]
        },
        { id: 'nuclear', label: 'Física Nuclear', color: 'bg-blue-400', icon: '☢️',
          articles: [
            { id: 'art7', title: 'Reações Nucleares: Fissão e Fusão', snippet: 'Exploração dos processos que libertam energia nos núcleos atómicos.' },
            { id: 'art8', title: 'Radioatividade e Suas Aplicações', snippet: 'Estudo da desintegração nuclear e usos em medicina e indústria.' },
          ]
        },
        { id: 'thermodynamics', label: 'Termodinâmica', color: 'bg-blue-400', icon: '🔥',
          articles: [
            { id: 'art9', title: 'Leis da Termodinâmica: Energia e Entropia', snippet: 'Os princípios que governam a energia e a desordem nos sistemas físicos.' },
            { id: 'art10', title: 'Ciclos Térmicos e Eficiência Energética', snippet: 'Análise de motores e sistemas de refrigeração.' },
          ]
        },
        { id: 'optics', label: 'Óptica', color: 'bg-blue-400', icon: '💡',
          articles: [
            { id: 'art11', title: 'Reflexão e Refração da Luz', snippet: 'Como a luz interage com diferentes meios e superfícies.' },
            { id: 'art12', title: 'Instrumentos Ópticos: Lentes e Espelhos', snippet: 'O funcionamento de telescópios, microscópios e óculos.' },
          ]
        },
      ]
    },
    {
      id: 'biology',
      label: 'Biologia',
      color: 'bg-green-500',
      icon: '🌿',
      children: [
        { id: 'cell_biology', label: 'Biologia Celular', color: 'bg-green-400', icon: '🔬',
          articles: [
            { id: 'art13', title: 'A Célula: Unidade Fundamental da Vida', snippet: 'Estrutura e função das células procarióticas e eucarióticas.' },
            { id: 'art14', title: 'Organelos Celulares e Suas Funções', snippet: 'Detalhes sobre as organelas que compõem uma célula.' },
          ]
        },
        { id: 'genetics', label: 'Genética', color: 'bg-green-400', icon: '🧬',
          children: [
            { id: 'mendelian', label: 'Genética Mendeliana', color: 'bg-green-300', icon: '🌱',
              articles: [
                { id: 'art15', title: 'As Leis de Mendel e a Herança Genética', snippet: 'Os princípios da hereditariedade descobertos por Gregor Mendel.' },
                { id: 'art16', title: 'Cruzamentos Genéticos: Da Teoria à Prática', snippet: 'Como prever a herança de características em diferentes cruzamentos.' },
              ]
            },
            { id: 'molecular', label: 'Genética Molecular', color: 'bg-green-300', icon: '🔗',
              articles: [
                { id: 'art17', title: 'O DNA e o Código Genético', snippet: 'A estrutura do DNA e como a informação genética é codificada.' },
                { id: 'art18', title: 'Engenharia Genética: Ferramentas e Aplicações', snippet: 'Técnicas de manipulação de genes e suas aplicações.' },
              ]
            },
          ]
        },
        { id: 'ecology', label: 'Ecologia', color: 'bg-green-400', icon: '🌍',
          articles: [
            { id: 'art19', title: 'Ecossistemas e Cadeias Alimentares', snippet: 'Interações entre seres vivos e o ambiente em diferentes ecossistemas.' },
            { id: 'art20', title: 'Sustentabilidade e Conservação Ambiental', snippet: 'Estratégias para proteger o meio ambiente e garantir um futuro sustentável.' },
          ]
        },
        { id: 'zoology', label: 'Zoologia', color: 'bg-green-400', icon: '🦁',
          articles: [
            { id: 'art21', title: 'Classificação Animal: Invertebrados e Vertebrados', snippet: 'Visão geral da diversidade do reino animal.' },
            { id: 'art22', title: 'Comportamento Animal e Adaptações', snippet: 'Estudo de como os animais interagem com o ambiente e se adaptam.' },
          ]
        },
      ]
    },
    {
      id: 'chemistry',
      label: 'Química',
      color: 'bg-purple-500',
      icon: '🧪',
      children: [
        { id: 'organic', label: 'Química Orgânica', color: 'bg-purple-400', icon: '🔗',
          articles: [
            { id: 'art23', title: 'Introdução aos Compostos Orgânicos', snippet: 'Estudo dos compostos de carbono e suas propriedades.' },
            { id: 'art24', title: 'Reações Orgânicas Essenciais', snippet: 'Principais tipos de reações e mecanismos em química orgânica.' },
          ]
        },
        { id: 'inorganic', label: 'Química Inorgânica', color: 'bg-purple-400', icon: '💎',
          articles: [
            { id: 'art25', title: 'Metais e Não-Metais: Propriedades e Usos', snippet: 'Características e aplicações dos elementos inorgânicos.' },
            { id: 'art26', title: 'Ácidos, Bases e Sais: Reações Químicas', snippet: 'Fundamentos da química inorgânica e suas interações.' },
          ]
        },
        { id: 'physical', label: 'Físico-Química', color: 'bg-purple-400', icon: '⚛️',
          articles: [
            { id: 'art27', title: 'Termoquímica: Calor e Reações Químicas', snippet: 'Relação entre energia e transformações químicas.' },
            { id: 'art28', title: 'Cinética Química: Velocidade das Reações', snippet: 'Fatores que influenciam a rapidez das reações químicas.' },
          ]
        },
      ]
    },
    {
      id: 'math',
      label: 'Matemática',
      color: 'bg-red-500',
      icon: '➕',
      children: [
        { id: 'algebra', label: 'Álgebra', color: 'bg-red-400', icon: '🧮',
          articles: [
            { id: 'art29', title: 'Equações e Inequações: Fundamentos da Álgebra', snippet: 'Como resolver problemas com variáveis e relações.' },
            { id: 'art30', title: 'Funções e Gráficos: Representações Algébricas', snippet: 'Entendendo as relações entre variáveis através de funções.' },
          ]
        },
        { id: 'geometry', label: 'Geometria', color: 'bg-red-400', icon: '📐',
          articles: [
            { id: 'art31', title: 'Geometria Euclidiana: Figuras Planas e Sólidos', snippet: 'Estudo de formas, tamanhos e posições no espaço.' },
            { id: 'art32', title: 'Trigonometria: Relações em Triângulos', snippet: 'Cálculo de ângulos e lados em triângulos, especialmente retângulos.' },
          ]
        },
        { id: 'calculus', label: 'Cálculo', color: 'bg-red-400', icon: '📈',
          articles: [
            { id: 'art33', title: 'Derivadas: Taxas de Variação', snippet: 'Como calcular a taxa de mudança instantânea de uma função.' },
            { id: 'art34', title: 'Integrais: Acumulação e Áreas', snippet: 'Métodos para calcular áreas, volumes e acumulações.' },
          ]
        },
      ]
    },
    {
      id: 'cs',
      label: 'Ciência da Computação',
      color: 'bg-yellow-500',
      icon: '💻',
      children: [
        { id: 'programming', label: 'Programação', color: 'bg-yellow-400', icon: '⌨️',
          articles: [
            { id: 'art35', title: 'Lógica de Programação para Iniciantes', snippet: 'Os fundamentos do pensamento computacional.' },
            { id: 'art36', title: 'Introdução a Estruturas de Dados', snippet: 'Organização e armazenamento eficiente de dados.' },
          ]
        },
        { id: 'algorithms', label: 'Algoritmos', color: 'bg-yellow-400', icon: '🧠',
          articles: [
            { id: 'art37', title: 'Algoritmos de Ordenação e Busca', snippet: 'Métodos para organizar e encontrar dados de forma eficiente.' },
            { id: 'art38', title: 'Complexidade de Algoritmos', snippet: 'Análise da eficiência de algoritmos em termos de tempo e espaço.' },
          ]
        },
        { id: 'ai', label: 'Inteligência Artificial', color: 'bg-yellow-400', icon: '🤖',
          articles: [
            { id: 'art39', title: 'Fundamentos de Machine Learning', snippet: 'Introdução aos algoritmos que permitem aos computadores aprender com dados.' },
            { id: 'art40', title: 'Redes Neurais Artificiais: Como Funcionam', snippet: 'Modelos inspirados no cérebro humano para resolver problemas complexos.' },
          ]
        },
      ]
    },
    {
      id: 'history',
      label: 'História',
      color: 'bg-pink-500',
      icon: '📜',
      children: [
        { id: 'ancient', label: 'História Antiga', color: 'bg-pink-400', icon: '🏛️',
          articles: [
            { id: 'art41', title: 'Civilizações Antigas: Egito e Mesopotâmia', snippet: 'O berço da civilização e as primeiras grandes sociedades.' },
            { id: 'art42', title: 'Grécia e Roma: Berços da Civilização Ocidental', snippet: 'A influência duradoura das culturas grega e romana.' },
          ]
        },
        { id: 'medieval', label: 'Idade Média', color: 'bg-pink-400', icon: '🏰',
          articles: [
            { id: 'art43', title: 'Feudalismo e a Sociedade Medieval', snippet: 'A estrutura social e económica da Idade Média.' },
            { id: 'art44', title: 'As Cruzadas e o Islão Medieval', snippet: 'Conflitos e intercâmbios culturais entre o Ocidente e o Oriente.' },
          ]
        },
        { id: 'modern', label: 'História Moderna', color: 'bg-pink-400', icon: '🏭',
          articles: [
            { id: 'art45', title: 'Revolução Científica e Iluminismo', snippet: 'Grandes transformações no pensamento científico e filosófico.' },
            { id: 'art46', title: 'As Grandes Navegações e a Expansão Europeia', snippet: 'A era da exploração e o impacto global.' },
          ]
        },
      ]
    },
  ];

  const [selectedTopicArticles, setSelectedTopicArticles] = useState(null);
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const webViewRef = useRef(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [currentRoot, setCurrentRoot] = useState(null);
  const [history, setHistory] = useState([]);

  // Função para mapear classes Tailwind para valores hexadecimais para D3
  const tailwindColorMap = {
    'bg-blue-500': '#3b82f6', 'bg-blue-400': '#60a5fa', 'bg-blue-300': '#93c5fd',
    'bg-green-500': '#22c55e', 'bg-green-400': '#4ade80', 'bg-green-300': '#86efad',
    'bg-purple-500': '#a855f7', 'bg-purple-400': '#c084fc',
    'bg-red-500': '#ef4444', 'bg-red-400': '#f87171',
    'bg-yellow-500': '#eab308', 'bg-yellow-400': '#facc15',
    'bg-pink-500': '#ec4899', 'bg-pink-400': '#f472b6',
  };

  const openArticlesModal = useCallback((articles) => {
    setSelectedTopicArticles(articles);
    setShowArticlesModal(true);
  }, []);

  const closeArticlesModal = useCallback(() => {
    setSelectedTopicArticles(null);
    setShowArticlesModal(false);
  }, []);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const initializeTree = useCallback((data) => {
    const clonedData = deepClone({
      id: 'root',
      label: 'Conhecimento Geral',
      children: data
    });

    const collapseChildren = (node) => {
      if (node.children) {
        node._children = node.children;
        node.children = null;
        node._children.forEach(collapseChildren);
      }
    };

    if (clonedData.children) {
      clonedData.children.forEach(collapseChildren);
    }
    return clonedData;
  }, []);

  useEffect(() => {
    const initialRoot = initializeTree(rawKnowledgeNodesData);
    setCurrentRoot(initialRoot);
    setHistory([{ treeState: deepClone(initialRoot), transform: { k: 1, x: 0, y: 0 } }]); // D3 zoomIdentity
  }, [initializeTree]);

  // Função para gerar o HTML com o código D3
  const generateD3Html = useCallback((data, initialTransform) => {
    const d3Data = JSON.stringify(data);
    const transform = JSON.stringify(initialTransform);
    const colorMap = JSON.stringify(tailwindColorMap);

    // Note: Concatenação de strings para evitar problemas com template literals aninhados
    // Adicionado o meta tag Content-Security-Policy
    return (
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<meta http-equiv="Content-Security-Policy" content="script-src \'unsafe-eval\' \'self\' https://cdnjs.cloudflare.com;">' + // Adicionado CSP
        '<style>' +
          'body { margin: 0; overflow: hidden; font-family: sans-serif; }' +
          'svg { display: block; }' +
          '.link { fill: none; stroke: #ccc; stroke-width: 1.5px; }' +
          '.node circle { stroke: #fff; stroke-width: 1.5px; }' +
          '.node text { font: 11px sans-serif; fill: #333; }' +
        '</style>' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>' +
      '</head>' +
      '<body>' +
        '<svg id="d3-svg"></svg>' +
        '<script>' +
          'console.log("D3 script started!");' + // Added for debugging
          'const d3Data = ' + d3Data + ';' +
          'const initialTransform = ' + transform + ';' +
          'const tailwindColorMap = ' + colorMap + ';' +

          'const width = 600;' +
          'const height = 600;' +
          'const margin = 50;' +
          'const baseRadius = Math.min(width, height) / 2 - margin;' +

          'const svg = d3.select("#d3-svg")' +
            '.attr("viewBox", [-width / 2, -height / 2, width, height])' +
            '.style("width", "100%")' +
            '.style("height", "100%");' +

          'const g = svg.append("g");' +

          'const zoomBehavior = d3.zoom()' +
            '.scaleExtent([0.5, 8])' +
            '.on("zoom", (event) => {' +
              'g.attr("transform", event.transform);' +
              'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "zoom", transform: event.transform }));' +
            '});' +

          'svg.call(zoomBehavior);' +

          'svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(initialTransform.x, initialTransform.y).scale(initialTransform.k));' +

          'function update(source) {' +
            'const root = d3.hierarchy(source, d => d.children);' +
            'd3.tree().size([2 * Math.PI, baseRadius]).separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)(root);' +

            'g.selectAll(".link")' +
              '.data(root.links(), d => d.target.data.id)' +
              '.join(' +
                'enter => enter.append("path")' +
                  '.attr("class", "link")' +
                  '.attr("d", d3.linkRadial().angle(node => node.x).radius(node => node.y))' +
                  '.attr("opacity", 0)' +
                  '.transition().duration(750).attr("opacity", 0.7),' +
                'update => update.transition().duration(750)' +
                  '.attr("d", d3.linkRadial().angle(node => node.x).radius(node => node.y))' +
                  '.attr("opacity", 0.7),' +
                'exit => exit.transition().duration(750).attr("opacity", 0).remove()' +
              ');' +

            'const node = g.selectAll(".node")' +
              '.data(root.descendants(), d => d.data.id)' +
              '.join(' +
                'enter => {' +
                  'const enterNode = enter.append("g")' +
                    '.attr("class", "node")' +
                    '.attr("opacity", 0)' +
                    '.attr("transform", function(d) { ' + // Using function for clarity
                        'var angle = d.x * 180 / Math.PI - 90; ' +
                        'return "rotate(" + angle + ") translate(" + d.y + ",0)"; ' +
                    '});' +

                  'enterNode.append("circle")' +
                    '.attr("r", 7)' +
                    '.attr("fill", d => tailwindColorMap[d.data.color] || "#555");' +

                  'enterNode.append("text")' +
                    '.attr("dy", "0.31em")' +
                    '.attr("x", d => d.x < Math.PI ? 9 : -9)' +
                    '.attr("transform", function(d) { ' + // Using function for clarity
                        'var angle = -(d.x * 180 / Math.PI - 90); ' +
                        'return "rotate(" + angle + ")"; ' +
                    '})' +
                    '.attr("text-anchor", d => d.x < Math.PI ? "start" : "end")' +
                    '.text(d => d.data.label)' +
                    '.clone(true).lower()' +
                    '.attr("stroke", "white")' +
                    '.attr("stroke-width", 3);' +

                  'return enterNode.transition().duration(750).attr("opacity", 1);' +
                '},' +
                'update => update.transition().duration(750).attr("opacity", 1)' +
                    '.attr("transform", function(d) { ' + // Using function for clarity
                        'var angle = d.x * 180 / Math.PI - 90; ' +
                        'return "rotate(" + angle + ") translate(" + d.y + ",0)"; ' +
                    '}),' +
                'exit => exit.transition().duration(750).attr("opacity", 0).remove()' +
              ');' +

            'node.on("click", function(event, d) {' +
              'event.stopPropagation();' +
              'if (d.data.articles && d.data.articles.length > 0) {' +
                'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "articles", articles: d.data.articles, topic: d.data.label }));' +
              '} else {' +
                'if (d.children) {' +
                  'd._children = d.children;' +
                  'd.children = null;' +
                '} else {' +
                  'd.children = d._children;' +
                  'd._children = null;' +
                '}' +
                'update(root.data);' + // Changed from update(root) to update(root.data)
                'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "treeState", treeState: root.data }));' +
              '}' +

              'if (d.data.id !== "root") {' +
                  'const x = d.x;' +
                  'const y = d.y;' +
                  'const scale = 2;' +

                  'const targetX = y * Math.cos(x);' +
                  'const targetY = y * Math.sin(x);;' +

                  'const newTransform = d3.zoomIdentity.translate(width / 2 - targetX * scale, height / 2 - targetY * scale).scale(scale);' +
                  'svg.transition().duration(750).call(zoomBehavior.transform, newTransform);' +
                  'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "zoom", transform: newTransform }));' +
              '} else {' +
                  'const initialTransform = d3.zoomIdentity.translate(0,0).scale(1);' +
                  'svg.transition().duration(750).call(zoomBehavior.transform, initialTransform);' +
                  'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "zoom", transform: initialTransform }));' +
              '}' +
            '});' +
          '}' +

          'update(d3Data);' +

          'window.addEventListener("message", (event) => {' +
            'const message = JSON.parse(event.data);' +
            'if (message.type === "restoreState") {' +
              'const newTreeState = message.treeState;' +
              'const newTransform = message.transform;' +
              'update(newTreeState);' +
              'svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity.translate(newTransform.x, newTransform.y).scale(newTransform.k));' +
            '}' +
          '});' +

          'window.ReactNativeWebView.postMessage(JSON.stringify({ type: "ready" }));' +
        '</script>' +
      '</body>' +
      '</html>'
    );
  }, [tailwindColorMap]);

  // Atualiza o WebView quando currentRoot ou history mudam
  useEffect(() => {
    if (webViewRef.current && currentRoot) {
      const lastTransform = history[history.length - 1]?.transform || { k: 1, x: 0, y: 0 };
      // Apenas injeta JS para atualizar o D3 se o WebView já estiver carregado
      if (!webViewLoading) {
        webViewRef.current.injectJavaScript(`
          window.postMessage(JSON.stringify({ type: 'restoreState', treeState: ${JSON.stringify(currentRoot)}, transform: ${JSON.stringify(lastTransform)} }));
          true; // Necessário para que injectJavaScript retorne algo
        `);
      }
    }
  }, [currentRoot, history, generateD3Html, webViewLoading]);


  const onWebViewMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    console.log('Message from WebView:', message.type); // Log message type
    if (message.type === 'ready') {
      setWebViewLoading(false);
    } else if (message.type === 'articles') {
      openArticlesModal(message.articles.map(article => ({ ...article, topic: message.topic })));
    } else if (message.type === 'zoom') {
        // Atualiza apenas a transformação no histórico, sem alterar o estado da árvore
        setHistory(prevHistory => {
            const lastEntry = prevHistory[prevHistory.length - 1];
            if (lastEntry) {
                return [...prevHistory.slice(0, prevHistory.length - 1), { ...lastEntry, transform: message.transform }];
            }
            return prevHistory;
        });
    } else if (message.type === 'treeState') {
        // Atualiza o estado da árvore quando o D3 a modifica (expansão/colapso)
        // Isso é crucial para manter o estado React e D3 sincronizados
        setCurrentRoot(message.treeState);
        // Garante que o histórico também reflita a nova treeState
        setHistory(prevHistory => {
            const lastEntry = prevHistory[prevHistory.length - 1];
            if (lastEntry) {
                return [...prevHistory.slice(0, prevHistory.length - 1), { ...lastEntry, treeState: message.treeState }];
            }
            return prevHistory;
        });
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, history.length - 1);
      const prevState = newHistory[newHistory.length - 1];

      // Envia a mensagem para o WebView restaurar o estado e o zoom
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.postMessage(JSON.stringify({ type: 'restoreState', treeState: ${JSON.stringify(prevState.treeState)}, transform: ${JSON.stringify(prevState.transform)} }));
          true; // Necessário para que injectJavaScript retorne algo
        `);
      }
      setCurrentRoot(prevState.treeState);
      setHistory(newHistory);
    } else if (history.length === 1) {
      // Se estiver no estado inicial, re-inicializa para garantir
      const initialRoot = initializeTree(rawKnowledgeNodesData);
      setCurrentRoot(initialRoot);
      setHistory([{ treeState: deepClone(initialRoot), transform: { k: 1, x: 0, y: 0 } }]);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.postMessage(JSON.stringify({ type: 'restoreState', treeState: ${JSON.stringify(initialRoot)}, transform: { k: 1, x: 0, y: 0 } }));
          true; // Necessário para que injectJavaScript retorne algo
        `);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árvore do Conhecimento</Text>
      <Text style={styles.subtitle}>
        Explore os tópicos do conhecimento em um formato de árvore radial. Clique nos nós para expandir e aplicar zoom!
      </Text>

      {/* Botão Voltar */}
      {history.length > 1 && (
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
        >
          <ChevronLeft size={20} color="#1f2937" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}

      {/* Contêiner WebView para a visualização D3.js */}
      <View style={styles.webViewContainer}>
        {webViewLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Carregando Árvore do Conhecimento...</Text>
          </View>
        )}
        {currentRoot && (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: generateD3Html(currentRoot, history[history.length - 1]?.transform || { k: 1, x: 0, y: 0 }) }}
            style={styles.webView}
            onMessage={onWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            onLoadEnd={() => setWebViewLoading(false)}
            onLoadStart={() => setWebViewLoading(true)}
          />
        )}
      </View>

      <Text style={styles.hintText}>
        (Os tópicos mais detalhados nos ramos externos podem conter artigos. Clique neles para abrir o leitor.)
      </Text>

      {/* Modal de Artigos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showArticlesModal}
        onRequestClose={closeArticlesModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeArticlesModal}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalArticlesTitle}>Artigos sobre {selectedTopicArticles?.[0]?.topic || 'o tópico selecionado'}</Text>
            {selectedTopicArticles?.length > 0 ? (
              <ScrollView style={styles.articlesScrollView}>
                {selectedTopicArticles.map(article => (
                  <View key={article.id} style={styles.articleItem}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleSnippet}>{article.snippet}</Text>
                    <TouchableOpacity style={styles.readArticleButton}>
                      <Text style={styles.readArticleButtonText}>Ler Artigo</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noArticlesText}>Nenhum artigo encontrado para este tópico.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Centraliza os filhos horizontalmente
    justifyContent: 'center', // Centraliza os filhos verticalmente
    padding: 16, // p-4
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
    marginBottom: 16, // mb-4
  },
  subtitle: {
    color: '#4b5563', // text-gray-600
    textAlign: 'center',
    marginBottom: 24, // mb-6
    maxWidth: 300, // max-w-md
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // mb-4
    backgroundColor: '#e5e7eb', // bg-gray-200
    paddingVertical: 8, // py-2
    paddingHorizontal: 16, // px-4
    borderRadius: 8, // rounded-lg
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
  },
  backButtonText: {
    color: '#1f2937', // text-gray-800
    fontWeight: 'bold',
    marginLeft: 8, // mr-2
  },
  webViewContainer: {
    width: '100%',
    maxWidth: 400, // Limita a largura máxima
    aspectRatio: 1, // Mantém a proporção quadrada
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8, // p-2
    borderRadius: 12, // rounded-xl
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    backgroundColor: '#ffffff', // Adicionado para visualizar os limites do container
    overflow: 'hidden', // Garante que o conteúdo não transborde
  },
  webView: {
    flex: 1, // Faz o WebView preencher o espaço disponível no seu container
    width: '100%', // Garante que o WebView ocupe 100% da largura do seu container
    backgroundColor: 'transparent', // Para ver o fundo do container
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
  },
  hintText: {
    fontSize: 12, // text-xs
    color: '#9ca3af', // text-gray-400
    marginTop: 32, // mt-8
    textAlign: 'center',
    maxWidth: 300, // max-w-md
  },
  // Estilos do Modal de Artigos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // bg-black bg-opacity-50
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // p-4
  },
  modalContent: {
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    shadowColor: '#000', // shadow-lg
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Para Android
    padding: 24, // p-6
    width: '100%',
    maxWidth: 400, // max-w-md
    maxHeight: '90%', // max-h-[90vh]
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16, // top-4
    right: 16, // right-4
    zIndex: 1,
  },
  modalArticlesTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
    marginBottom: 16, // mb-4
  },
  articlesScrollView: {
    flexGrow: 1, // Permite que o ScrollView ocupe o espaço disponível
  },
  articleItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
    borderRadius: 8, // rounded-lg
    padding: 16, // p-4
    marginBottom: 16, // Adiciona espaçamento entre os artigos
  },
  articleTitle: {
    fontWeight: '600', // font-semibold
    fontSize: 18, // text-lg
    color: '#4f46e5', // text-indigo-700
    marginBottom: 4, // mb-1
  },
  articleSnippet: {
    color: '#374151', // text-gray-700
    fontSize: 14, // text-sm
  },
  readArticleButton: {
    marginTop: 8, // mt-2
  },
  readArticleButtonText: {
    color: '#4f46e5', // text-indigo-600
    fontSize: 14, // text-sm
    textDecorationLine: 'underline', // hover:underline
  },
  noArticlesText: {
    color: '#6b7280', // text-gray-500
  },
});