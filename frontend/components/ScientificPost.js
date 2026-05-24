import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Linking } from 'react-native';
import { FileText, Paperclip, Heart, MessageCircle, X, Bookmark, Pencil } from 'lucide-react-native';

const Keywords = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;
  return (
    <View className="flex-row flex-wrap gap-1.5 mb-3">
      {keywords.map((kw, i) => (
        <View key={i} className="bg-primary-50 px-2.5 py-1 rounded-full">
          <Text className="text-xs text-primary-700 font-medium">{kw}</Text>
        </View>
      ))}
    </View>
  );
};

// Card compacto — usado em listas (perfil, feed)
export function ScientificPostCard({ post, onPress }) {
  const summary = post.abstract || post.simplifiedSnippet || post.fullContent;
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl shadow overflow-hidden mb-4 hover:shadow-lg"
    >
      {post.image ? (
        <Image
          source={typeof post.image === 'string' ? { uri: post.image } : post.image}
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
        />
      ) : null}
      <View className="p-4">
        <Text className="font-bold text-lg text-gray-900 mb-1">{post.title}</Text>
        <Text className="text-xs text-gray-500 mb-2">
          {post.author} · {post.time || ''}
        </Text>
        {summary ? (
          <Text className="text-sm text-gray-700 leading-5 mb-3" numberOfLines={3}>
            {summary}
          </Text>
        ) : null}
        <Keywords keywords={post.keywords} />
        {post.doi ? (
          <Text className="text-xs text-gray-400 mb-2">DOI: {post.doi}</Text>
        ) : null}
        <View className="flex-row items-center gap-4 mt-1">
          <View className="flex-row items-center gap-1">
            <Heart size={16} color="#6b7280" />
            <Text className="text-xs text-gray-600">{post.likesCount ?? post.likes ?? 0}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MessageCircle size={16} color="#6b7280" />
            <Text className="text-xs text-gray-600">{post.comments ?? 0}</Text>
          </View>
          {post.pdfUrl ? (
            <View className="flex-row items-center gap-1">
              <FileText size={16} color="#dc2626" />
              <Text className="text-xs text-gray-600">PDF</Text>
            </View>
          ) : null}
          {post.supplementaryUrl ? (
            <View className="flex-row items-center gap-1">
              <Paperclip size={16} color="#4f46e5" />
              <Text className="text-xs text-gray-600">Anexo</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

// Visão completa — usada dentro de um modal
export function ScientificPostDetail({ post, onClose, isSaved, onToggleSave, canEdit, onEdit }) {
  if (!post) return null;
  return (
    <View className="bg-white rounded-xl shadow-lg w-full max-w-md lg:max-w-2xl max-h-[90%]">
      <View className="flex-row items-start justify-between p-6 pb-3">
        <Text className="text-xl font-bold text-gray-900 flex-1 pr-3">{post.title}</Text>
        <Pressable onPress={onClose} className="p-1 hover:opacity-70">
          <X size={24} color="#6b7280" />
        </Pressable>
      </View>

      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 8 }}>
        <Text className="text-xs text-gray-500 mb-4">
          {post.author} · {post.time || ''}
        </Text>

        {post.image ? (
          <Image
            source={typeof post.image === 'string' ? { uri: post.image } : post.image}
            style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 16 }}
            resizeMode="cover"
          />
        ) : null}

        {post.abstract ? (
          <View className="mb-4">
            <Text className="text-sm font-bold text-gray-800 mb-1">Resumo</Text>
            <Text className="text-sm text-gray-700 leading-6">{post.abstract}</Text>
          </View>
        ) : null}

        <Keywords keywords={post.keywords} />

        {post.doi ? (
          <Text className="text-xs text-gray-500 mb-4">DOI: {post.doi}</Text>
        ) : null}

        <View className="mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-1">Conteúdo</Text>
          <Text className="text-sm text-gray-700 leading-6">{post.fullContent}</Text>
        </View>

        {post.simplifiedSnippet ? (
          <View className="mb-4 pt-3 border-t border-gray-200">
            <Text className="text-sm font-bold text-gray-800 mb-1">Versão Simplificada</Text>
            <Text className="text-sm italic text-gray-600 leading-6">{post.simplifiedSnippet}</Text>
          </View>
        ) : null}

        {post.references ? (
          <View className="mb-4 pt-3 border-t border-gray-200">
            <Text className="text-sm font-bold text-gray-800 mb-1">Referências</Text>
            <Text className="text-xs text-gray-600 leading-5">{post.references}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="flex-row flex-wrap gap-3 p-6 pt-3">
        {canEdit && onEdit ? (
          <Pressable
            onPress={onEdit}
            className="flex-row items-center bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-lg"
          >
            <Pencil size={16} color="#fff" />
            <Text className="text-white text-sm font-semibold ml-2">Editar</Text>
          </Pressable>
        ) : null}
        {onToggleSave ? (
          <Pressable
            onPress={onToggleSave}
            className={`flex-row items-center py-2 px-4 rounded-lg ${isSaved ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <Bookmark size={16} color={isSaved ? '#fff' : '#374151'} fill={isSaved ? '#fff' : 'none'} />
            <Text className={`text-sm font-semibold ml-2 ${isSaved ? 'text-white' : 'text-gray-700'}`}>
              {isSaved ? 'Salvo' : 'Salvar'}
            </Text>
          </Pressable>
        ) : null}
        {post.pdfUrl ? (
          <Pressable
            onPress={() => Linking.openURL(post.pdfUrl)}
            className="flex-row items-center bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg"
          >
            <FileText size={16} color="#fff" />
            <Text className="text-white text-sm font-semibold ml-2">Baixar PDF</Text>
          </Pressable>
        ) : null}
        {post.supplementaryUrl ? (
          <Pressable
            onPress={() => Linking.openURL(post.supplementaryUrl)}
            className="flex-row items-center bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-lg"
          >
            <Paperclip size={16} color="#fff" />
            <Text className="text-white text-sm font-semibold ml-2">Material Suplementar</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onClose}
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg justify-center"
        >
          <Text className="text-gray-800 text-sm font-semibold">Fechar</Text>
        </Pressable>
      </View>
    </View>
  );
}
