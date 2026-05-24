import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config/api';
import { ScientificPostCard, ScientificPostDetail } from '../components/ScientificPost';
import { fetchSavedIds, toggleSave } from '../lib/posts';
import EditProfilePage from './profile/EditProfilePage';
import NotificationSettingsPage from './profile/NotificationSettingsPage';
import SavedPostsPage from './profile/SavedPostsPage';
import SettingsPage from './profile/SettingsPage';
import HelpPage from './profile/HelpPage';
import EditPostPage from './EditPostPage';

const ROLE_LABELS = {
  aluno: { title: 'Estudante', subtitle: 'Aprendiz' },
  professor: { title: 'Professor', subtitle: 'Educador' },
  revista: { title: 'Revista Científica', subtitle: 'Publicação' },
};

const confirmLogout = (onConfirm) => {
  const msg = 'Tem certeza que deseja sair da conta?';
  if (Platform.OS === 'web') {
    if (window.confirm(msg)) onConfirm();
  } else {
    Alert.alert('Sair', msg, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onConfirm },
    ]);
  }
};

const MENU_ITEMS = [
  { icon: 'person-outline', title: 'Editar Perfil', subtitle: 'Atualize suas informações', screen: 'editProfile' },
  { icon: 'notifications-outline', title: 'Notificações', subtitle: 'Gerencie suas preferências', screen: 'notifications' },
  { icon: 'bookmark-outline', title: 'Salvos', subtitle: 'Artigos e conteúdos salvos', screen: 'saved' },
  { icon: 'settings-outline', title: 'Configurações', subtitle: 'Preferências do app', screen: 'settings' },
  { icon: 'help-circle-outline', title: 'Ajuda', subtitle: 'Suporte e FAQ', screen: 'help' },
];

const ProfilePage = ({ currentUser, onLogout, onUpdateUser }) => {
  const [subScreen, setSubScreen] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoadingPosts(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [postsRes, saved] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${currentUser.id}/posts`).then((r) => r.json()),
          fetchSavedIds(currentUser.id),
        ]);
        if (active) {
          setPosts(Array.isArray(postsRes) ? postsRes : []);
          setSavedIds(saved);
        }
      } catch (e) {
        console.error('Erro buscando dados do perfil:', e);
      } finally {
        if (active) setLoadingPosts(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  const handleToggleSave = async (post) => {
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

  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center p-6">
        <Text className="text-gray-500 text-center">
          Sessão não encontrada. Volte para o login.
        </Text>
      </SafeAreaView>
    );
  }

  // Sub-telas do perfil
  const back = () => setSubScreen(null);
  if (subScreen === 'editProfile') {
    return <EditProfilePage currentUser={currentUser} onUpdateUser={onUpdateUser} onBack={back} />;
  }
  if (subScreen === 'notifications') {
    return <NotificationSettingsPage onBack={back} />;
  }
  if (subScreen === 'saved') {
    return <SavedPostsPage currentUser={currentUser} onBack={back} />;
  }
  if (subScreen === 'settings') {
    return <SettingsPage currentUser={currentUser} onBack={back} />;
  }
  if (subScreen === 'help') {
    return <HelpPage onBack={back} />;
  }

  if (editingPost) {
    return (
      <EditPostPage
        post={editingPost}
        currentUser={currentUser}
        onBack={() => setEditingPost(null)}
        onSaved={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSelectedPost(null);
          setEditingPost(null);
        }}
      />
    );
  }

  const role = currentUser.role || 'aluno';
  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.aluno;
  const initials = (currentUser.name || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarUri =
    currentUser.avatarUrl ||
    currentUser.profilePic ||
    `https://placehold.co/200x200/3b82f6/ffffff?text=${encodeURIComponent(initials)}`;

  const getStats = () => {
    if (role === 'professor' || role === 'revista') {
      return [
        { label: 'Posts Publicados', value: String(posts.length || currentUser.postsCount || 0) },
        { label: 'Seguidores', value: String(currentUser.followersCount ?? 0) },
        { label: 'Seguindo', value: String(currentUser.followingCount ?? 0) },
      ];
    }
    return [
      { label: 'Pontos em Quiz', value: String(currentUser.quizPoints ?? 0) },
      { label: 'Seguidores', value: String(currentUser.followersCount ?? 0) },
      { label: 'Seguindo', value: String(currentUser.followingCount ?? 0) },
    ];
  };

  const stats = getStats();

  const handleLogout = () => {
    confirmLogout(() => {
      if (onLogout) onLogout();
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="lg:flex-row lg:gap-6 lg:p-6">
          <View className="lg:flex-1 lg:max-w-sm">
            <View className="bg-white items-center py-8 px-6 mb-4 lg:rounded-2xl lg:shadow">
              <View className="relative mb-4">
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#e5e7eb' }}
                />
                {currentUser.verified && (
                  <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-8 h-8 items-center justify-center border-[3px] border-white">
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>

              <Text className="text-2xl font-bold text-gray-900 mb-1 text-center">
                {currentUser.name}
              </Text>
              <Text className="text-base font-semibold text-primary-600 mb-0.5">
                {roleInfo.title}
              </Text>
              <Text className="text-sm text-gray-500 mb-3">{roleInfo.subtitle}</Text>
              {currentUser.email && (
                <Text className="text-xs text-gray-400 mb-2">{currentUser.email}</Text>
              )}
              {currentUser.institution && (
                <Text className="text-sm text-gray-600 text-center">
                  <Ionicons name="school-outline" size={14} color="#6b7280" /> {currentUser.institution}
                </Text>
              )}
              {currentUser.bio && (
                <Text className="text-sm text-gray-600 text-center mt-3 px-2">
                  {currentUser.bio}
                </Text>
              )}
            </View>

            <View className="flex-row bg-white mx-4 mb-4 rounded-xl py-5 shadow-sm lg:mx-0">
              {stats.map((stat, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-xl font-bold text-gray-900 mb-1">{stat.value}</Text>
                  <Text className="text-xs text-gray-500 text-center px-1">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="lg:flex-1">
            <View className="bg-white mx-4 rounded-xl mb-6 shadow-sm lg:mx-0">
              {MENU_ITEMS.map((item, index) => (
                <Pressable
                  key={item.screen}
                  onPress={() => setSubScreen(item.screen)}
                  className={`flex-row items-center py-4 px-5 ${index !== MENU_ITEMS.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}
                >
                  <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-4">
                    <Ionicons name={item.icon} size={24} color="#4f46e5" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-0.5">{item.title}</Text>
                    <Text className="text-sm text-gray-500">{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center bg-white mx-4 py-4 rounded-xl mb-6 shadow-sm hover:bg-red-50 lg:mx-0"
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="text-base font-semibold text-red-500 ml-2">Sair</Text>
            </Pressable>
          </View>
        </View>

        {/* Minhas Publicações */}
        <View className="px-4 lg:px-6 pb-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Minhas Publicações {posts.length > 0 ? `(${posts.length})` : ''}
          </Text>

          {loadingPosts ? (
            <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 16 }} />
          ) : posts.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <Ionicons name="document-text-outline" size={40} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-3">
                Você ainda não publicou nenhum artigo.
              </Text>
            </View>
          ) : (
            <View className="lg:flex-row lg:flex-wrap lg:gap-x-[2%]">
              {posts.map((post) => (
                <View key={post.id} className="lg:w-[49%]">
                  <ScientificPostCard post={post} onPress={() => setSelectedPost(post)} />
                </View>
              ))}
            </View>
          )}
        </View>

        <Text className="text-center text-xs text-gray-400 mb-8">Versão 1.0.0</Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={!!selectedPost}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <ScientificPostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            isSaved={selectedPost ? savedIds.includes(selectedPost.id) : false}
            onToggleSave={() => selectedPost && handleToggleSave(selectedPost)}
            canEdit={
              !!selectedPost &&
              !!currentUser?.id &&
              selectedPost.authorId === currentUser.id
            }
            onEdit={() => {
              setEditingPost(selectedPost);
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfilePage;
