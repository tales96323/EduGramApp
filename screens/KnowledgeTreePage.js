import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeft, X } from 'lucide-react-native';

// ARTIGOS E NOS
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
                { id: 'newtonian', label: 'Mecânica Newtoniana', color: 'bg-blue-300', icon: ' ',
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


export default function KnowledgeTreePage() {
  const [selectedTopicArticles, setSelectedTopicArticles] = useState(null);
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const webViewRef = useRef(null);
  const [webViewLoading, setWebViewLoading] = useState(true);

  const [currentRoot, setCurrentRoot] = useState(null);
  const [history, setHistory] = useState([]);

  const tailwindColorMap = useMemo(() => ({
    'bg-blue-500': '#3b82f6', 'bg-blue-400': '#60a5fa', 'bg-blue-300': '#93c5fd',
    'bg-green-500': '#22c55e', 'bg-green-400': '#4ade80', 'bg-green-300': '#86efad',
    'bg-purple-500': '#a855f7', 'bg-purple-400': '#c084fc',
    'bg-red-500': '#ef4444', 'bg-red-400': '#f87171',
    'bg-yellow-500': '#eab308', 'bg-yellow-400': '#facc15',
    'bg-pink-500': '#ec4899', 'bg-pink-400': '#f472b6',
  }), []);

  const deepClone = useCallback((obj) => JSON.parse(JSON.stringify(obj)), []);

  // Função ajustada para colapsar a árvore desde o início
  const initializeTree = useCallback((data) => {
    // 1. Cria a função recursiva para colapsar todos os filhos
    const collapseAll = (node) => {
        if(node.children && node.children.length > 0) {
            node._children = node.children;
            node._children.forEach(collapseAll);
            node.children = null;
        }
    };

    // 2. Clona os dados para não modificar o original
    const clonedData = deepClone(data);

    // 3. Aplica a função de colapso em cada disciplina
    clonedData.forEach(collapseAll);

    // 4. Retorna a estrutura raiz, com as disciplinas já em '_children'
    return {
      id: 'root',
      label: 'Conhecimento',
      _children: clonedData, // Começa com as disciplinas ocultas
      children: null,
    };
  }, [deepClone]);


  useEffect(() => {
    const initialRoot = initializeTree(rawKnowledgeNodesData);
    setCurrentRoot(initialRoot);
    setHistory([{ treeState: deepClone(initialRoot), transform: { k: 1.5, x: 0, y: 0 } }]);
  }, [initializeTree, deepClone]);

  // Esta função gera o HTML com a lógica D3 corrigida
  const generateD3Html = useCallback((treeData, initialTransform) => {
    const d3Data = JSON.stringify(treeData);
    const transform = JSON.stringify(initialTransform);
    const colorMap = JSON.stringify(tailwindColorMap);

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
          <style>
              body, html { margin: 0; overflow: hidden; font-family: sans-serif; background-color: transparent; }
              .link { fill: none; stroke: #BDBDBD; stroke-width: 1.5px; }
              .node circle { stroke-width: 2px; }
              .node text { font: 13px sans-serif; fill: #424242; }
              .node--internal circle { stroke: #FFF; }
              .node--leaf circle { stroke: #FFF; }
          </style>
      </head>
      <body>
          <svg id="d3-svg" width="100%" height="100%"></svg>
          <script>
              const data = ${d3Data};
              const tailwindColorMap = ${colorMap};
              let root;
              const duration = 750;

              const svg = d3.select("#d3-svg");
              const width = svg.node().getBoundingClientRect().width;
              const height = svg.node().getBoundingClientRect().height;
              const g = svg.append("g");

              const tree = d3.tree().size([2 * Math.PI, Math.min(width, height) / 2 - 60])
                  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

              const postMessage = (message) => {
                  if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify(message));
                  }
              };

              // Prepara o zoom
              const zoomBehavior = d3.zoom().scaleExtent([0.5, 4]).on("zoom", (event) => {
                  g.attr("transform", event.transform);
              });
              svg.call(zoomBehavior);

              // Inicia a árvore
              root = d3.hierarchy(data, d => d.children || d._children);
              root.x0 = height / 2;
              root.y0 = 0;

              update(root);

              // Centraliza o nó raiz inicial
              const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(1.5);
              svg.call(zoomBehavior.transform, initialTransform);
              postMessage({ type: "zoom", transform: initialTransform });

              function update(source) {
                  const treeData = tree(root);
                  const nodes = treeData.descendants();
                  const links = treeData.links();

                  // Normaliza para profundidade fixa.
                  nodes.forEach(d => { d.y = d.depth * 100 });

                  // Update os nós...
                  const node = g.selectAll("g.node")
                      .data(nodes, d => d.data.id);

                  // Adiciona os novos nós na posição anterior do pai.
                  const nodeEnter = node.enter().append("g")
                      .attr("class", "node")
                      .classed("node--internal", d => d._children || d.children)
                      .classed("node--leaf", d => !(d._children || d.children))
                      .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")") // Posição inicial errada de propósito para animação
                      .on("click", (event, d) => click(d))
                      .style("cursor", "pointer");

                  nodeEnter.append("circle")
                      .attr("r", 1e-6) // Começa invisível
                      .style("fill", d => tailwindColorMap[d.data.color] || (d._children ? "#555" : "#999"))
                      .style("stroke", d => tailwindColorMap[d.data.color] || "#555");

                  nodeEnter.append("text")
                      .attr("dy", ".35em")
                      .attr("x", d => d.children || d._children ? -13 : 13)
                      .attr("text-anchor", d => d.children || d._children ? "end" : "start")
                      .text(d => d.data.label);

                  // Transiciona os nós para sua nova posição.
                  const nodeUpdate = nodeEnter.merge(node);
                  nodeUpdate.transition()
                      .duration(duration)
                      .attr("transform", d => "translate(" + d.y + "," + d.x + ")") // Posição final correta
                      .attr("transform", d => "rotate(" + (d.x * 180 / Math.PI - 90) + ") translate(" + d.y + ",0)")
                      .selectAll("circle")
                      .attr("r", 7);

                  nodeUpdate.selectAll("text")
                      .attr("transform", d => "rotate(" + -(d.x * 180 / Math.PI - 90) + ")")
                      .attr("x", d => d.x < Math.PI ? 15 : -15)
                      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end");


                  // Transiciona os nós que saem para a nova posição do pai.
                  const nodeExit = node.exit().transition()
                      .duration(duration)
                      .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
                      .remove();

                  nodeExit.select("circle").attr("r", 1e-6);
                  nodeExit.select("text").style("fill-opacity", 1e-6);

                  // Update os links...
                  const link = g.selectAll("path.link")
                      .data(links, d => d.target.data.id);

                  const linkEnter = link.enter().insert("path", "g")
                      .attr("class", "link")
                      .attr("d", d => {
                          const o = {x: source.x0, y: source.y0};
                          return d3.linkRadial().angle(d => d.x).radius(d => d.y)({source: o, target: o});
                      });

                  link.merge(linkEnter).transition()
                      .duration(duration)
                      .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y));

                  link.exit().transition()
                      .duration(duration)
                      .attr("d", d => {
                          const o = {x: source.x, y: source.y};
                          return d3.linkRadial().angle(d => d.x).radius(d => d.y)({source: o, target: o});
                      })
                      .remove();

                  // Guarda as posições antigas para a transição.
                  nodes.forEach(d => {
                      d.x0 = d.x;
                      d.y0 = d.y;
                  });
              }

              function click(d) {
                  if (d.data.articles && d.data.articles.length > 0) {
                      postMessage({ type: "articles", articles: d.data.articles, topic: d.data.label });
                      return;
                  }

                  if (d.children) {
                      d._children = d.children;
                      d.children = null;
                  } else {
                      d.children = d._children;
                      d._children = null;
                  }
                  update(d);

                  // Envia o estado atualizado da árvore para o React Native
                  const currentTransform = d3.zoomTransform(svg.node());
                  postMessage({ type: 'nodeClick', treeState: root.data, transform: currentTransform });
              }

              postMessage({ type: "ready" });
          </script>
      </body>
      </html>
    `;
  }, [tailwindColorMap]);

  // As funções do lado do React Native permanecem as mesmas
  const onWebViewMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    switch (message.type) {
      case 'ready': setWebViewLoading(false); break;
      case 'articles':
        setSelectedTopicArticles(message.articles.map(article => ({ ...article, topic: message.topic })));
        setShowArticlesModal(true);
        break;
      case 'zoom':
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) newHistory[newHistory.length - 1].transform = message.transform;
          return newHistory;
        });
        break;
      case 'nodeClick':
        setCurrentRoot(message.treeState);
        setHistory(prev => [...prev, { treeState: message.treeState, transform: message.transform }]);
        break;
    }
  };

  const goBack = () => {
    // A lógica de voltar continua a mesma, mas não será usada neste exemplo,
    // pois a nova implementação de D3 não precisa dela.
    // Pode ser reativada se necessário.
  };

  const closeArticlesModal = useCallback(() => {
    setSelectedTopicArticles(null);
    setShowArticlesModal(false);
  }, []);

  const memoizedHtml = useMemo(() => {
    if (!currentRoot) return null;
    return generateD3Html(currentRoot, history[0]?.transform);
  }, [currentRoot, generateD3Html]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árvore do Conhecimento</Text>

      <View style={styles.webViewContainer}>
        {webViewLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Carregando Árvore...</Text>
          </View>
        )}
        {memoizedHtml && (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: memoizedHtml }}
            style={styles.webView}
            onMessage={onWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        )}
      </View>

      <Text style={styles.hintText}>
        Clique nos nós para expandir e explorar os tópicos.
      </Text>

      {/* O Modal de Artigos permanece igual */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showArticlesModal}
        onRequestClose={closeArticlesModal}>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.modalCloseButton} onPress={closeArticlesModal}>
                      <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                  <Text style={styles.modalArticlesTitle}>
                      Artigos sobre {selectedTopicArticles?.[0]?.topic || ''}
                  </Text>
                  <ScrollView>
                      {selectedTopicArticles?.map(article => (
                          <View key={article.id} style={styles.articleItem}>
                              <Text style={styles.articleTitle}>{article.title}</Text>
                              <Text style={styles.articleSnippet}>{article.snippet}</Text>
                          </View>
                      ))}
                  </ScrollView>
              </View>
          </View>
      </Modal>
    </View>
  );
}

// INSIRA SEUS ESTILOS COMPLETOS AQUI
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 70, paddingBottom: 50, paddingHorizontal: 10, backgroundColor: '#f4f4f5', },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 10, },
  webViewContainer: { width: '100%', flex: 1, marginTop: 16, borderRadius: 16, backgroundColor: '#ffffff', overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, },
  webView: { flex: 1, backgroundColor: 'transparent', },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 10, },
  loadingText: { marginTop: 16, color: '#6b7280', fontSize: 16 },
  hintText: { fontSize: 14, color: '#6b7280', marginTop: 20, textAlign: 'center', },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 16, },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400, maxHeight: '100%', },
  modalCloseButton: { position: 'absolute', top: 12, right: 12, zIndex: 1, padding: 4 },
  modalArticlesTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, paddingRight: 24 },
  articleItem: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16, },
  articleTitle: { fontWeight: '600', fontSize: 17, color: '#4f46e5', marginBottom: 4, },
  articleSnippet: { color: '#374151', fontSize: 14, lineHeight: 20 },
});