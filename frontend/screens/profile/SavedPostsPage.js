import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { ScientificPostCard, ScientificPostDetail } from '../../components/ScientificPost';
import { API_BASE_URL } from '../../config/api';
import { toggleSave } from '../../lib/posts';

export default function SavedPostsPage({ currentUser, onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${currentUser.id}/saved`);
        const data = await res.json();
        if (active) setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Erro buscando salvos:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  const handleUnsave = async (post) => {
    try {
      await toggleSave(post.id, currentUser.id, true);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setSelected(null);
    } catch (e) {
      console.error('Erro removendo dos salvos:', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Salvos" onBack={onBack} />
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 24 }} />
      ) : posts.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="bookmark-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-center mt-3 text-base">
            Você ainda não salvou nenhum artigo.
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Abra um post e toque em "Salvar" para guardá-lo aqui.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text className="text-sm font-semibold text-gray-600 mb-3">
            {posts.length} {posts.length === 1 ? 'artigo salvo' : 'artigos salvos'}
          </Text>
          <View className="lg:flex-row lg:flex-wrap lg:gap-x-[2%]">
            {posts.map((post) => (
              <View key={post.id} className="lg:w-[49%]">
                <ScientificPostCard post={post} onPress={() => setSelected(post)} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={!!selected}
        onRequestClose={() => setSelected(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <ScientificPostDetail
            post={selected}
            onClose={() => setSelected(null)}
            isSaved
            onToggleSave={() => handleUnsave(selected)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
