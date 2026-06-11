import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical, Search, FileText, Paperclip, Bookmark, Pencil } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_BASE_URL } from '../config/api';
import useBreakpoint from '../hooks/useBreakpoint';
import { fetchSavedIds, toggleSave } from '../lib/posts';
import EditPostPage from './EditPostPage';
import AuthorProfilePage from './AuthorProfilePage';

// Definido fora do componente para o TextInput não perder foco a cada render
const FormField = ({ label, ...props }) => (
  <>
    <Text className="text-sm font-bold text-gray-700 mt-3 mb-1">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-800"
      placeholderTextColor="#9ca3af"
      {...props}
    />
  </>
);

export default function FeedPage({ currentUser }) {
  const { isTablet, isDesktop } = useBreakpoint();
  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;
  const userType = currentUser?.role || 'aluno';
  const canPublish = userType === 'professor' || userType === 'revista';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  React.useEffect(() => {
    if (currentUser?.id) {
      fetchSavedIds(currentUser.id).then(setSavedIds);
    }
  }, [currentUser?.id]);

  const handleToggleSave = async (post) => {
    if (!currentUser?.id) return;
    const currentlySaved = savedIds.includes(post.id);
    try {
      const nowSaved = await toggleSave(post.id, currentUser.id, currentlySaved);
      setSavedIds((prev) =>
        nowSaved ? [...prev, post.id] : prev.filter((id) => id !== post.id),
      );
    } catch (e) {
      console.error('Erro ao salvar/remover:', e);
    }
  };

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
  const [editingPost, setEditingPost] = useState(null);
  const [viewingAuthorId, setViewingAuthorId] = useState(null);

  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newDoi, setNewDoi] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReferences, setNewReferences] = useState('');
  const [newCategory, setNewCategory] = useState('physics');
  const [newSubcategory, setNewSubcategory] = useState('geral');
  const [newPdf, setNewPdf] = useState(null);
  const [newSupplementary, setNewSupplementary] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setNewTitle('');
    setNewAbstract('');
    setNewKeywords('');
    setNewDoi('');
    setNewContent('');
    setNewReferences('');
    setNewCategory('physics');
    setNewSubcategory('geral');
    setNewPdf(null);
    setNewSupplementary(null);
  };

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled === false) setNewPdf(result.assets[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const pickSupplementary = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.canceled === false) setNewSupplementary(result.assets[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadPost = async () => {
    if (!newTitle || !newContent) {
      Alert.alert('Erro', 'Título e conteúdo são obrigatórios.');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('fullContent', newContent);
      formData.append('abstract', newAbstract);
      formData.append('keywords', newKeywords);
      formData.append('doi', newDoi);
      formData.append('references', newReferences);
      formData.append('category', newCategory);
      formData.append('subcategory', newSubcategory);
      if (currentUser?.id) formData.append('authorId', String(currentUser.id));
      formData.append('author', currentUser?.name || 'Anônimo');

      if (newPdf) {
        formData.append('pdf', {
          uri: newPdf.uri,
          name: newPdf.name,
          type: newPdf.mimeType || 'application/pdf',
        });
      }
      if (newSupplementary) {
        formData.append('supplementary', {
          uri: newSupplementary.uri,
          name: newSupplementary.name,
          type: newSupplementary.mimeType || 'application/octet-stream',
        });
      }

      const response = await fetch(`${API_BASE_URL}/posts/upload`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        Alert.alert('Sucesso', 'Publicação criada com sucesso!');
        setShowAddPostModal(false);
        resetForm();
        fetchPosts();
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.error || 'Falha ao publicar.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro de conexão.');
    } finally {
      setIsUploading(false);
    }
  };

  const simplifyContent = async (postId, originalContent) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSimplifying: true } : p)),
    );
    try {
      const prompt = `Simplifique o seguinte texto científico para um público geral, utilizando linguagem clara e concisa em português (Brasil):\n\n${originalContent}`;
      const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, simplifiedSnippet: text || p.simplifiedSnippet, isSimplifying: false } : p,
        ),
      );
    } catch (error) {
      console.error('Erro Gemini:', error);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isSimplifying: false } : p)),
      );
    }
  };

  const handlePostClick = (post) => {
    setSelectedPostForFullView(post);
    setShowFullContentModal(true);
  };

  const renderPostItem = ({ item: post }) => (
    <Pressable
      onPress={() => handlePostClick(post)}
      className={`bg-white rounded-xl shadow overflow-hidden mb-4 ${numColumns > 1 ? 'flex-1 mx-2' : ''} hover:shadow-lg`}
    >
      <View className="flex-row items-center p-4">
        <Pressable
          onPress={() => post.authorId && setViewingAuthorId(post.authorId)}
          className="flex-row items-center flex-1 hover:opacity-70"
        >
          <Image source={{ uri: post.profilePic }} className="w-10 h-10 rounded-full mr-3" />
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{post.author}</Text>
            <Text className="text-xs text-gray-500">{post.time}</Text>
          </View>
        </Pressable>
        <MoreVertical size={20} color="#6b7280" />
      </View>

      <Image
        source={typeof post.image === 'string' ? { uri: post.image } : post.image}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
      />

      <View className="flex-row justify-around p-4">
        <View className="flex-row items-center gap-1">
          <Heart size={20} color="#6b7280" />
          <Text className="text-sm text-gray-600">{post.likesCount ?? post.likes ?? 0}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MessageCircle size={20} color="#6b7280" />
          <Text className="text-sm text-gray-600">{post.comments}</Text>
        </View>
        <Share2 size={20} color="#6b7280" />
      </View>

      <View className="px-4 pb-4">
        <Text className="font-bold text-lg text-gray-900 mb-2">{post.title}</Text>
        <Text className="text-sm text-gray-700 leading-5" numberOfLines={3}>
          {post.abstract || post.simplifiedSnippet || post.fullContent}
        </Text>
        {post.keywords?.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 mt-2">
            {post.keywords.slice(0, 4).map((kw, i) => (
              <View key={i} className="bg-primary-50 px-2 py-0.5 rounded-full">
                <Text className="text-xs text-primary-700">{kw}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );

  if (viewingAuthorId) {
    return <AuthorProfilePage authorId={viewingAuthorId} onBack={() => setViewingAuthorId(null)} />;
  }

  if (editingPost) {
    return (
      <EditPostPage
        post={editingPost}
        currentUser={currentUser}
        onBack={() => setEditingPost(null)}
        onSaved={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <Image
          source={require('../assets/images/LOGO_LADO_SEM_FUNDO.png')}
          style={{ width: 100, height: 30, resizeMode: 'contain' }}
        />
        <View className="flex-row items-center gap-4">
          {canPublish && (
            <Pressable
              onPress={() => setShowAddPostModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-bold text-sm">+ Nova Publicação</Text>
            </Pressable>
          )}
          <Pressable className="hover:opacity-70">
            <Search size={20} color="#6b7280" />
          </Pressable>
        </View>
      </View>

      <FlatList
        key={`feed-${numColumns}`}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 20 }} />
          ) : (
            <Text className="text-center mt-5 text-gray-500">Nenhum post encontrado.</Text>
          )
        }
      />

      {/* Modal de detalhe */}
      <Modal
        animationType="slide"
        transparent
        visible={showFullContentModal}
        onRequestClose={() => setShowFullContentModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md lg:max-w-2xl max-h-[90%]">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {selectedPostForFullView?.title}
            </Text>
            <ScrollView style={{ flexGrow: 1 }}>
              {selectedPostForFullView?.abstract ? (
                <View className="mb-3">
                  <Text className="text-sm font-bold text-gray-800 mb-1">Resumo</Text>
                  <Text className="text-sm text-gray-700 leading-6">
                    {selectedPostForFullView.abstract}
                  </Text>
                </View>
              ) : null}
              {selectedPostForFullView?.keywords?.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5 mb-3">
                  {selectedPostForFullView.keywords.map((kw, i) => (
                    <View key={i} className="bg-primary-50 px-2.5 py-1 rounded-full">
                      <Text className="text-xs text-primary-700 font-medium">{kw}</Text>
                    </View>
                  ))}
                </View>
              )}
              {selectedPostForFullView?.doi ? (
                <Text className="text-xs text-gray-500 mb-3">DOI: {selectedPostForFullView.doi}</Text>
              ) : null}
              <Text className="text-sm font-bold text-gray-800 mb-1">Conteúdo</Text>
              <Text className="text-sm text-gray-700 leading-6 mb-4">
                {selectedPostForFullView?.fullContent}
              </Text>
              {selectedPostForFullView?.simplifiedSnippet && (
                <View className="mt-2 pt-3 border-t border-gray-200">
                  <Text className="font-semibold text-gray-800 text-sm mb-2">
                    Versão Simplificada:
                  </Text>
                  <Text className="text-sm italic text-gray-600">
                    {selectedPostForFullView.simplifiedSnippet}
                  </Text>
                </View>
              )}
              {selectedPostForFullView?.references ? (
                <View className="mt-2 pt-3 border-t border-gray-200">
                  <Text className="font-semibold text-gray-800 text-sm mb-1">Referências</Text>
                  <Text className="text-xs text-gray-600 leading-5">
                    {selectedPostForFullView.references}
                  </Text>
                </View>
              ) : null}
            </ScrollView>

            <View className="flex-row justify-end gap-3 mt-6 flex-wrap">
              {currentUser?.id &&
                selectedPostForFullView &&
                selectedPostForFullView.authorId === currentUser.id && (
                  <Pressable
                    onPress={() => {
                      setEditingPost(selectedPostForFullView);
                      setShowFullContentModal(false);
                    }}
                    className="flex-row items-center bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-lg justify-center"
                  >
                    <Pencil size={16} color="#fff" />
                    <Text className="text-white text-sm font-semibold ml-2">Editar</Text>
                  </Pressable>
                )}
              {currentUser?.id && selectedPostForFullView && (
                <Pressable
                  onPress={() => handleToggleSave(selectedPostForFullView)}
                  className={`flex-row items-center py-2 px-4 rounded-lg ${savedIds.includes(selectedPostForFullView.id) ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <Bookmark
                    size={16}
                    color={savedIds.includes(selectedPostForFullView.id) ? '#fff' : '#374151'}
                    fill={savedIds.includes(selectedPostForFullView.id) ? '#fff' : 'none'}
                  />
                  <Text
                    className={`text-sm font-semibold ml-2 ${savedIds.includes(selectedPostForFullView.id) ? 'text-white' : 'text-gray-700'}`}
                  >
                    {savedIds.includes(selectedPostForFullView.id) ? 'Salvo' : 'Salvar'}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() =>
                  simplifyContent(selectedPostForFullView.id, selectedPostForFullView.fullContent)
                }
                disabled={selectedPostForFullView?.isSimplifying}
                className={`flex-row items-center justify-center bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-lg ${selectedPostForFullView?.isSimplifying ? 'opacity-50' : ''}`}
              >
                {selectedPostForFullView?.isSimplifying && (
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white text-sm font-semibold">
                  {selectedPostForFullView?.isSimplifying ? 'Simplificando...' : 'Simplificar ✨'}
                </Text>
              </Pressable>

              {selectedPostForFullView?.pdfUrl && (
                <Pressable
                  onPress={() => Linking.openURL(selectedPostForFullView.pdfUrl)}
                  className="flex-row items-center bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg justify-center"
                >
                  <FileText size={16} color="#fff" />
                  <Text className="text-white text-sm font-semibold ml-2">PDF</Text>
                </Pressable>
              )}

              {selectedPostForFullView?.supplementaryUrl && (
                <Pressable
                  onPress={() => Linking.openURL(selectedPostForFullView.supplementaryUrl)}
                  className="flex-row items-center bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-lg justify-center"
                >
                  <Paperclip size={16} color="#fff" />
                  <Text className="text-white text-sm font-semibold ml-2">Anexo</Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => setShowFullContentModal(false)}
                className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg justify-center"
              >
                <Text className="text-gray-800 text-sm font-semibold">Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de criação */}
      <Modal
        animationType="slide"
        transparent
        visible={showAddPostModal}
        onRequestClose={() => setShowAddPostModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md lg:max-w-2xl max-h-[92%]">
            <Text className="text-xl font-bold text-gray-800 mb-1">Nova Publicação Científica</Text>
            <Text className="text-xs text-gray-500 mb-2">
              Preencha os campos do artigo. Título e conteúdo são obrigatórios.
            </Text>
            <ScrollView style={{ maxHeight: '70%' }}>
              <FormField
                label="Título *"
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Título do artigo"
              />
              <FormField
                label="Resumo (abstract)"
                value={newAbstract}
                onChangeText={setNewAbstract}
                placeholder="Resumo curto do artigo"
                multiline
                style={{ height: 70, textAlignVertical: 'top' }}
              />
              <FormField
                label="Palavras-chave"
                value={newKeywords}
                onChangeText={setNewKeywords}
                placeholder="Separadas por vírgula: quântica, física, energia"
                autoCapitalize="none"
              />
              <FormField
                label="DOI"
                value={newDoi}
                onChangeText={setNewDoi}
                placeholder="Ex: 10.1000/xyz123 (opcional)"
                autoCapitalize="none"
              />
              <FormField
                label="Categoria"
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder="Ex: physics"
                autoCapitalize="none"
              />
              <FormField
                label="Subcategoria"
                value={newSubcategory}
                onChangeText={setNewSubcategory}
                placeholder="Ex: quantum_mechanics"
                autoCapitalize="none"
              />
              <FormField
                label="Conteúdo do Artigo *"
                value={newContent}
                onChangeText={setNewContent}
                placeholder="Texto completo do artigo"
                multiline
                style={{ height: 110, textAlignVertical: 'top' }}
              />
              <FormField
                label="Referências"
                value={newReferences}
                onChangeText={setNewReferences}
                placeholder="Referências bibliográficas"
                multiline
                style={{ height: 70, textAlignVertical: 'top' }}
              />

              <Text className="text-sm font-bold text-gray-700 mt-4 mb-1">Anexos</Text>
              <Pressable
                onPress={pickPdf}
                className="p-3 bg-gray-100 rounded-lg flex-row items-center border border-dashed border-gray-300 hover:bg-gray-200 mb-2"
              >
                <FileText size={18} color="#dc2626" />
                <Text className="text-gray-600 font-semibold ml-2 flex-1">
                  {newPdf ? `PDF: ${newPdf.name}` : 'Anexar PDF principal (opcional)'}
                </Text>
              </Pressable>
              <Pressable
                onPress={pickSupplementary}
                className="p-3 bg-gray-100 rounded-lg flex-row items-center border border-dashed border-gray-300 hover:bg-gray-200"
              >
                <Paperclip size={18} color="#4f46e5" />
                <Text className="text-gray-600 font-semibold ml-2 flex-1">
                  {newSupplementary
                    ? `Anexo: ${newSupplementary.name}`
                    : 'Material suplementar — qualquer arquivo (opcional)'}
                </Text>
              </Pressable>
            </ScrollView>

            <View className="flex-row justify-end gap-3 mt-6">
              <Pressable
                onPress={handleUploadPost}
                disabled={isUploading}
                className={`flex-row items-center justify-center bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-lg ${isUploading ? 'opacity-50' : ''}`}
              >
                <Text className="text-white text-sm font-semibold">
                  {isUploading ? 'Enviando...' : 'Publicar'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowAddPostModal(false)}
                className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg justify-center"
              >
                <Text className="text-gray-800 text-sm font-semibold">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
