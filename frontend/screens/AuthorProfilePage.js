import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { ScientificPostCard, ScientificPostDetail } from '../components/ScientificPost';
import { API_BASE_URL } from '../config/api';

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n ?? 0));

function Stat({ value, label }) {
  return (
    <View className="items-center px-2">
      <Text className="text-xl font-bold text-gray-900">{fmt(value)}</Text>
      <Text className="text-xs text-gray-500">{label}</Text>
    </View>
  );
}

export default function AuthorProfilePage({ authorId, onBack }) {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [a, p] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${authorId}`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/users/${authorId}/posts`).then((r) => r.json()),
        ]);
        if (active) {
          setAuthor(a && !a.error ? a : null);
          setPosts(Array.isArray(p) ? p : []);
        }
      } catch (e) {
        console.error('Erro carregando autor:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [authorId]);

  const initials = (author?.name || '?')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarUri =
    author?.avatarUrl || `https://placehold.co/200x200/3b82f6/ffffff?text=${encodeURIComponent(initials)}`;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Perfil do autor" onBack={onBack} />

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 24 }} />
      ) : !author ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="person-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-500 mt-3">Autor não encontrado.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white items-center py-8 px-6 mb-4 lg:rounded-2xl lg:shadow lg:mx-6 lg:mt-6">
            <View className="relative mb-4">
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#e5e7eb' }}
              />
              {author.verified && (
                <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-8 h-8 items-center justify-center border-[3px] border-white">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-1 text-center">{author.name}</Text>
            {author.role ? (
              <Text className="text-base font-semibold text-primary-600 mb-0.5">{author.role}</Text>
            ) : null}
            {author.institution ? (
              <Text className="text-sm text-gray-500 mb-3">{author.institution}</Text>
            ) : null}
            {author.bio ? (
              <Text className="text-sm text-gray-600 text-center px-2 leading-5">{author.bio}</Text>
            ) : null}

            <View className="flex-row mt-5">
              <Stat value={posts.length} label="Publicações" />
              <Stat value={author.followersCount} label="Seguidores" />
              <Stat value={author.followingCount} label="Seguindo" />
            </View>
          </View>

          <View className="px-4 lg:px-6 pb-8">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Publicações {posts.length > 0 ? `(${posts.length})` : ''}
            </Text>

            {posts.length === 0 ? (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Ionicons name="document-text-outline" size={40} color="#9ca3af" />
                <Text className="text-gray-500 text-center mt-3">Nenhuma publicação ainda.</Text>
              </View>
            ) : (
              <View className="lg:flex-row lg:flex-wrap lg:gap-x-[2%]">
                {posts.map((post) => (
                  <View key={post.id} className="lg:w-[49%]">
                    <ScientificPostCard post={post} onPress={() => setSelected(post)} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <Modal animationType="slide" transparent visible={!!selected} onRequestClose={() => setSelected(null)}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <ScientificPostDetail post={selected} onClose={() => setSelected(null)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
