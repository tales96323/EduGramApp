import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical, Sparkles, X, Search } from 'lucide-react-native'; // Importar Search aqui

export default function FeedPage() {
  // Dados simulados para as publicações, agora com fullContent e simplifiedSnippet
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Dr. Ana Silva',
      profilePic: 'https://placehold.co/40x40/a78bfa/ffffff?text=AS',
      title: 'Desvendando a Física Quântica',
      image: 'https://placehold.co/350x200/6366f1/ffffff?text=Física+Quântica',
      fullContent: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia. Este artigo explora conceitos como superposição, entrelaçamento e o princípio da incerteza de Heisenberg, explicando como esses fenómenos bizarros moldam a realidade a nível subatómico e as suas implicações para tecnologias futuras, como a computação quântica. Para entender a física quântica, é essencial mergulhar nas suas raízes históricas, desde as primeiras teorias de Max Planck e Albert Einstein até o desenvolvimento da mecânica matricial e da mecânica ondulatória por Werner Heisenberg e Erwin Schrödinger, respetivamente. A superposição, um dos conceitos mais contraintuitivos, descreve a capacidade de uma partícula existir em múltiplos estados simultaneamente até que seja observada. O entrelaçamento, por sua vez, liga o destino de duas ou mais partículas, independentemente da distância que as separa, de modo que a medição do estado de uma afeta instantaneamente o estado da outra. Estes conceitos não são apenas curiosidades teóricas; eles são a base para o desenvolvimento de tecnologias revolucionárias, como computadores quânticos, que prometem resolver problemas complexos que estão além das capacidades dos computadores clássicos, e novas formas de criptografia inquebrável, conhecida como criptografia quântica. Além disso, a física quântica desempenha um papel crucial na compreensão de fenómenos em diversas áreas da ciência, desde a estrutura atómica e molecular até o comportamento de materiais em temperaturas extremamente baixas, e a forma como a luz interage com a matéria.', // Este é o texto original completo
      simplifiedSnippet: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia. Este artigo explora conceitos como superposição, entrelaçamento e o princípio da incerteza de Heisenberg, explicando como esses fenómenos bizarros moldam a realidade a nível subatómico e as suas implicações para tecnologias futuras, como a computação quântica.', // Esta é a versão simplificada exibida inicialmente
      likes: 124,
      comments: 32,
      time: '2h atrás',
      isSimplifying: false,
    },
    {
      id: 2,
      author: 'Revista BioTech',
      profilePic: 'https://placehold.co/40x40/fcd34d/ffffff?text=RB',
      title: 'Engenharia Genética: O Futuro da Medicina',
      image: 'https://placehold.co/350x200/f59e0b/ffffff?text=Engenharia+Genética',
      fullContent: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas. A tecnologia CRISPR-Cas9, em particular, abriu portas para a correção de mutações genéticas e a criação de terapias inovadoras para condições como a fibrose cística e a anemia falciforme, prometendo um futuro onde doenças hereditárias podem ser curadas na sua origem. A edição genética, especialmente com a ferramenta CRISPR-Cas9, tem o potencial de transformar radicalmente a medicina. Esta técnica permite aos cientistas editar com precisão o ADN, removendo, adicionando ou alterando sequências genéticas específicas. Isso significa que podemos, em teoria, corrigir mutações genéticas que causam doenças hereditárias graves. Além das aplicações em doenças genéticas, a engenharia genética está a ser explorada para desenvolver novas terapias contra o cancro, criar culturas mais resistentes a pragas e doenças, e até mesmo para a produção de biocombustíveis. No entanto, o rápido avanço desta tecnologia levanta importantes questões éticas e sociais sobre a sua aplicação, a segurança e as implicações a longo prazo para a humanidade e o meio ambiente.', // Conteúdo original completo
      simplifiedSnippet: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas. A tecnologia CRISPR-Cas9, em particular, abriu portas para a correção de mutações genéticas e a criação de terapias inovadoras para condições como a fibrose cística e a anemia falciforme, prometendo um futuro onde doenças hereditárias podem ser curadas na sua origem.',
      likes: 289,
      comments: 78,
      time: '5h atrás',
      isSimplifying: false,
    },
    {
      id: 3,
      author: 'Prof. Carlos Mendes',
      profilePic: 'https://placehold.co/40x40/4ade80/ffffff?text=CM',
      title: 'A Importância da Sustentabilidade Ambiental',
      image: 'https://placehold.co/350x200/22c55e/ffffff?text=Sustentabilidade',
      fullContent: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável. Este artigo aborda a crise climática, a perda de biodiversidade e a poluição, destacando a necessidade urgente de transição para energias renováveis, economia circular e práticas agrícolas sustentáveis para proteger o nosso planeta para as futuras gerações. A sustentabilidade ambiental é um pilar fundamental para o bem-estar do planeta e das futuras gerações. Enfrentamos desafios prementes como as alterações climáticas, impulsionadas pela emissão de gases de efeito estufa, a rápida perda de biodiversidade devido à destruição de habitats e a poluição do ar, da água e do solo. Para combater esses problemas, é crucial adotar soluções como a transição energética para fontes renováveis (solar, eólica), a implementação de uma economia circular que minimize o desperdício, e a promoção de práticas agrícolas que preservem os ecossistemas e a fertilidade do solo. A educação ambiental e o engajamento da comunidade também desempenham um papel vital na construção de um futuro mais equilibrado e resiliente, onde o desenvolvimento humano coexista harmoniosamente com a natureza.', // Conteúdo original completo
      simplifiedSnippet: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável. Este artigo aborda a crise climática, a perda de biodiversidade e a poluição, destacando a necessidade urgente de transição para energias renováveis, economia circular e práticas agrícolas sustentáveis para proteger o nosso planeta para as futuras gerações.',
      likes: 98,
      comments: 15,
      time: '1 dia atrás',
      isSimplifying: false,
    },
  ]);

  const [selectedPostForFullView, setSelectedPostForFullView] = useState(null);
  const [showFullContentModal, setShowFullContentModal] = useState(false);

  // Função para simplificar o conteúdo usando a API Gemini
  const simplifyContent = async (postId, originalContent) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isSimplifying: true } : post
      )
    );

    try {
      const prompt = `Simplifique o seguinte texto científico para um público geral, utilizando linguagem clara e concisa em português (Portugal):\n\n${originalContent}`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Se quiser usar modelos diferentes de gemini-2.0-flash ou imagen-3.0-generate-002, forneça uma chave de API aqui. Caso contrário, deixe como está.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const simplifiedText = result.candidates[0].content.parts[0].text;
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, simplifiedSnippet: simplifiedText, isSimplifying: false } : post
          )
        );
      } else {
        console.error("Erro ao simplificar o conteúdo: Estrutura de resposta inesperada", result);
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, isSimplifying: false } : post
          )
        );
      }
    } catch (error) {
      console.error("Erro na chamada da API Gemini para simplificação:", error);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, isSimplifying: false } : post
          )
          );
      }
    };

  const handlePostClick = (post) => {
    setSelectedPostForFullView(post);
    setShowFullContentModal(true);
  };

  const renderPostItem = ({ item: post }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostClick(post)}>
      {/* Cabeçalho da Publicação */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.profilePic }} style={styles.profilePic} />
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <MoreVertical size={20} color="#6b7280" />
      </View>

      {/* Imagem da Publicação */}
      <Image source={{ uri: post.image }} style={styles.postImage} />

      {/* Ações da Publicação */}
      <View style={styles.postActions}>
        <View style={styles.actionItem}>
          <Heart size={20} color="#6b7280" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </View>
        <View style={styles.actionItem}>
          <MessageCircle size={20} color="#6b7280" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </View>
        <Share2 size={20} color="#6b7280" />
      </View>

      {/* Conteúdo da Publicação - sempre exibe o snippet simplificado ou o conteúdo completo se não houver simplificado */}
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postSnippet}>
          {post.simplifiedSnippet || post.fullContent}
        </Text>
        {/* O botão "Simplificar" agora está apenas dentro do modal */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullPageContainer}>
      {/* Header da FeedPage */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/LOGO_LADO_SEM_FUNDO.png')} // Caminho para a sua logo menor
          style={styles.headerLogo}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x32/cccccc/333333?text=EDUGRM'; }}
        />
        <TouchableOpacity>
          <Search size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Modal de Conteúdo Completo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFullContentModal}
        onRequestClose={() => setShowFullContentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedPostForFullView?.title}</Text>
            <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalFullContent}>{selectedPostForFullView?.fullContent}</Text>

                {selectedPostForFullView?.simplifiedSnippet && (
                    <View style={styles.simplifiedSection}>
                        <Text style={styles.simplifiedTitle}>Versão Simplificada:</Text>
                        <Text style={styles.simplifiedText}>{selectedPostForFullView.simplifiedSnippet}</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.simplifyButton, selectedPostForFullView?.isSimplifying && styles.disabledButton]}
                onPress={() => simplifyContent(selectedPostForFullView.id, selectedPostForFullView.fullContent)}
                disabled={selectedPostForFullView?.isSimplifying}
              >
                {selectedPostForFullView?.isSimplifying ? (
                  <ActivityIndicator size="small" color="#ffffff" style={styles.buttonSpinner} />
                ) : null}
                <Text style={styles.simplifyButtonText}>
                  {selectedPostForFullView?.isSimplifying ? 'Simplificando...' : 'Simplificar ✨'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFullContentModal(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullPageContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Cor de fundo da página
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  headerLogo: {
    width: 100, // Ajuste o tamanho da logo conforme necessário
    height: 30, // Ajuste o tamanho da logo conforme necessário
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    padding: 16, // p-4
  },
  flatListContent: {
    gap: 16, // space-y-4
  },
  postCard: {
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 12, // rounded-xl
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, // p-4
  },
  profilePic: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20, // rounded-full
    marginRight: 12, // mr-3
  },
  postAuthorInfo: {
    flexGrow: 1,
  },
  postAuthor: {
    fontWeight: '600', // font-semibold
    color: '#1f2937', // text-gray-800
  },
  postTime: {
    fontSize: 12, // text-xs
    color: '#6b7280', // text-gray-500
  },
  postImage: {
    width: '100%',
    height: 200, // Ajuste a altura conforme necessário
    resizeMode: 'cover', // object-cover
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16, // p-4
    color: '#4b5563', // text-gray-600
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // space-x-1
  },
  actionText: {
    fontSize: 14, // text-sm
  },
  postContent: {
    padding: 16, // p-4
    paddingTop: 0, // pt-0
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18, // text-lg
    color: '#111827', // text-gray-900
    marginBottom: 8, // mb-2
  },
  postSnippet: {
    color: '#374151', // text-gray-700
    fontSize: 14, // text-sm
    lineHeight: 22, // leading-relaxed
    marginBottom: 12, // mb-3
  },
  // Estilos do Modal
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
  },
  modalScrollView: {
    flexGrow: 1, // Permite que o ScrollView ocupe o espaço disponível
  },
  modalTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
    marginBottom: 16, // mb-4
  },
  modalFullContent: {
    color: '#374151', // text-gray-700
    fontSize: 14, // text-sm
    lineHeight: 22, // leading-relaxed
    marginBottom: 16, // mb-4
  },
  simplifiedSection: {
    marginTop: 16, // mt-4
    paddingTop: 16, // pt-4
    borderTopWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
  },
  simplifiedTitle: {
    fontWeight: '600', // font-semibold
    color: '#1f2937', // text-gray-800
    fontSize: 14, // text-sm
    marginBottom: 8, // mb-2
  },
  simplifiedText: {
    color: '#4b5563', // text-gray-600
    fontSize: 14, // text-sm
    fontStyle: 'italic',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // justify-end
    gap: 12, // space-x-3
    marginTop: 24, // mt-6
  },
  simplifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5', // bg-indigo-500
    paddingVertical: 8, // py-2
    paddingHorizontal: 16, // px-4
    borderRadius: 8, // rounded-lg
    fontWeight: '600', // font-semibold
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
  },
  simplifyButtonText: {
    color: '#ffffff', // text-white
    fontSize: 14, // text-sm
    fontWeight: '600',
  },
  buttonSpinner: {
    marginRight: 8, // -ml-1 mr-2
  },
  disabledButton: {
    opacity: 0.5,
  },
  closeButton: {
    backgroundColor: '#d1d5db', // bg-gray-300
    paddingVertical: 8, // py-2
    paddingHorizontal: 16, // px-4
    borderRadius: 8, // rounded-lg
    fontWeight: '600', // font-semibold
    shadowColor: '#000', // shadow-md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Para Android
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#1f2937', // text-gray-800
    fontSize: 14, // text-sm
    fontWeight: '600',
  },
});