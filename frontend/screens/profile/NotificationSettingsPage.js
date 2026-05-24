import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from '../../components/ScreenHeader';

const STORAGE_KEY = '@edugram_notif_prefs';
const DEFAULTS = { push: true, likes: true, comments: true, followers: true, news: false };

const ITEMS = [
  { key: 'push', label: 'Notificações push', desc: 'Receber alertas no dispositivo' },
  { key: 'likes', label: 'Curtidas', desc: 'Quando curtirem suas publicações' },
  { key: 'comments', label: 'Comentários', desc: 'Quando comentarem suas publicações' },
  { key: 'followers', label: 'Novos seguidores', desc: 'Quando alguém começar a te seguir' },
  { key: 'news', label: 'Novidades EduGram', desc: 'Anúncios e novidades da plataforma' },
];

export default function NotificationSettingsPage({ onBack }) {
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
      } catch (e) {
        console.error('Erro carregando preferências:', e);
      }
      setLoading(false);
    })();
  }, []);

  const toggle = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Erro salvando preferências:', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Notificações" onBack={onBack} />
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="lg:max-w-xl lg:self-center lg:w-full">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
              Permissões de notificação
            </Text>
            <View className="bg-white rounded-xl">
              {ITEMS.map((item, i) => (
                <View
                  key={item.key}
                  className={`flex-row items-center px-4 py-4 ${i !== ITEMS.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-gray-900">{item.label}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{item.desc}</Text>
                  </View>
                  <Switch
                    value={prefs[item.key]}
                    onValueChange={() => toggle(item.key)}
                    trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
                    thumbColor="#ffffff"
                  />
                </View>
              ))}
            </View>
            <Text className="text-xs text-gray-400 text-center mt-4">
              As preferências ficam salvas neste dispositivo.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
