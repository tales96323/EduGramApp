import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenHeader from '../../components/ScreenHeader';

const STORAGE_KEY = '@edugram_settings';
const DEFAULTS = { darkMode: false, reducedMotion: false, language: 'pt-BR' };

const info = (msg) => {
  if (Platform.OS === 'web') window.alert(msg);
  else Alert.alert('EduGram', msg);
};

const ToggleRow = ({ label, desc, value, onValueChange, border }) => (
  <View className={`flex-row items-center px-4 py-4 ${border ? 'border-b border-gray-100' : ''}`}>
    <View className="flex-1 pr-3">
      <Text className="text-base font-semibold text-gray-900">{label}</Text>
      {desc ? <Text className="text-xs text-gray-500 mt-0.5">{desc}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
      thumbColor="#ffffff"
    />
  </View>
);

const NavRow = ({ label, value, onPress, border }) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center px-4 py-4 hover:bg-gray-50 ${border ? 'border-b border-gray-100' : ''}`}
  >
    <Text className="text-base text-gray-900 flex-1">{label}</Text>
    {value ? <Text className="text-sm text-gray-500 mr-2">{value}</Text> : null}
    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
  </Pressable>
);

export default function SettingsPage({ currentUser, onBack }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      } catch (e) {
        console.error('Erro carregando configurações:', e);
      }
    })();
  }, []);

  const update = async (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Erro salvando configurações:', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Configurações" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="lg:max-w-xl lg:self-center lg:w-full">
          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Aparência</Text>
          <View className="bg-white rounded-xl mb-5">
            <ToggleRow
              label="Modo escuro"
              desc="Aplicar tema escuro (em breve)"
              value={settings.darkMode}
              onValueChange={(v) => update({ darkMode: v })}
              border
            />
            <ToggleRow
              label="Reduzir animações"
              desc="Menos movimento na interface"
              value={settings.reducedMotion}
              onValueChange={(v) => update({ reducedMotion: v })}
            />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Idioma e Região</Text>
          <View className="bg-white rounded-xl mb-5">
            <NavRow
              label="Idioma"
              value={settings.language === 'pt-BR' ? 'Português (BR)' : 'English (US)'}
              onPress={() => update({ language: settings.language === 'pt-BR' ? 'en-US' : 'pt-BR' })}
            />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Conta</Text>
          <View className="bg-white rounded-xl mb-5">
            <NavRow
              label="Email"
              value={currentUser?.email || '—'}
              onPress={() => info('Alteração de email estará disponível em breve.')}
              border
            />
            <NavRow
              label="Privacidade"
              onPress={() => info('Configurações de privacidade em breve.')}
            />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Sobre</Text>
          <View className="bg-white rounded-xl">
            <NavRow label="Versão do app" value="1.0.0" onPress={() => {}} border />
            <NavRow
              label="Termos de uso"
              onPress={() => info('Termos de uso estarão disponíveis em breve.')}
              border
            />
            <NavRow
              label="Política de privacidade"
              onPress={() => info('Política de privacidade estará disponível em breve.')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
