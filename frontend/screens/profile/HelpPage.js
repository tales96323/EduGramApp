import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';

const FAQ = [
  {
    q: 'Como publico um artigo?',
    a: 'No Feed, toque em "+ Nova Publicação" (disponível para professores e revistas). Preencha título, resumo, palavras-chave, conteúdo e anexe PDF ou material suplementar.',
  },
  {
    q: 'O que é a versão simplificada?',
    a: 'Ao abrir um artigo, o botão "Simplificar" gera uma versão em linguagem acessível do conteúdo científico usando IA.',
  },
  {
    q: 'Como salvo um artigo para ler depois?',
    a: 'Abra o artigo e toque no botão "Salvar". Ele ficará disponível em Perfil → Salvos.',
  },
  {
    q: 'Como funciona a Árvore do Conhecimento?',
    a: 'É um mapa visual das disciplinas. Toque nos nós para expandir áreas e ver os artigos vinculados a cada tópico.',
  },
  {
    q: 'Como edito meu perfil?',
    a: 'Vá em Perfil → Editar Perfil. Você pode alterar nome, bio, instituição, área de atuação e avatar.',
  },
  {
    q: 'Esqueci minha senha. E agora?',
    a: 'A recuperação de senha por email está em desenvolvimento. Por enquanto, entre em contato com o suporte.',
  },
];

export default function HelpPage({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Ajuda" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="lg:max-w-xl lg:self-center lg:w-full">
          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
            Perguntas Frequentes
          </Text>
          <View className="bg-white rounded-xl mb-5">
            {FAQ.map((item, i) => {
              const open = openIndex === i;
              return (
                <View
                  key={i}
                  className={i !== FAQ.length - 1 ? 'border-b border-gray-100' : ''}
                >
                  <Pressable
                    onPress={() => setOpenIndex(open ? null : i)}
                    className="flex-row items-center px-4 py-4 hover:bg-gray-50"
                  >
                    <Text className="flex-1 text-base font-semibold text-gray-900 pr-2">
                      {item.q}
                    </Text>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#9ca3af"
                    />
                  </Pressable>
                  {open ? (
                    <Text className="text-sm text-gray-600 leading-6 px-4 pb-4">{item.a}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Suporte</Text>
          <View className="bg-white rounded-xl">
            <Pressable
              onPress={() => Linking.openURL('mailto:suporte@edugram.com')}
              className="flex-row items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={22} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Email de suporte</Text>
                <Text className="text-xs text-gray-500">suporte@edugram.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL('https://github.com/anthropics/claude-code/issues')}
              className="flex-row items-center px-4 py-4 hover:bg-gray-50"
            >
              <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                <Ionicons name="bug-outline" size={22} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Reportar um problema</Text>
                <Text className="text-xs text-gray-500">Conte o que aconteceu</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>
          </View>

          <Text className="text-xs text-gray-400 text-center mt-5">EduGram · Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
