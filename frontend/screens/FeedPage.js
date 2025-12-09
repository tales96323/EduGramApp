import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical, Sparkles, X, Search } from 'lucide-react-native';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Configuração da URL da API
  // Para Android Emulator: http://10.0.2.2:3000
  // Para iOS Simulator: http://localhost:3000
  // Para Dispositivo Físico: http://SEU_IP_LOCAL:3000
  const API_BASE_URL = 'http://192.168.1.36:3000';

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

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
      const prompt = `Simplifique o seguinte texto científico para um público geral, utilizando linguagem clara e concisa em português (Brasil):\n\n${originalContent}`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Para usar modelos diferentes de gemini-2.0-flash ou imagen-3.0-generate-002, forneça uma chave de API aqui. Caso contrário, deixe como está.
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
      <Image
        source={typeof post.image === 'string' ? { uri: post.image } : post.image}
        style={styles.postImage}
      />

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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullPageContainer}>
      {/* Header da FeedPage */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/LOGO_LADO_SEM_FUNDO.png')}
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 20 }} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#6b7280' }}>Nenhum post encontrado.</Text>
          )
        }
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
    backgroundColor: '#f3f4f6',
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
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  flatListContent: {
    gap: 16,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postAuthorInfo: {
    flexGrow: 1,
  },
  postAuthor: {
    fontWeight: '600',
    color: '#1f2937',
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    color: '#4b5563',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
  },
  postContent: {
    padding: 16,
    paddingTop: 0,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  postSnippet: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalScrollView: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  modalFullContent: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  simplifiedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  simplifiedTitle: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 14,
    marginBottom: 8,
  },
  simplifiedText: {
    color: '#4b5563',
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  simplifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  simplifyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSpinner: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  closeButton: {
    backgroundColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
});