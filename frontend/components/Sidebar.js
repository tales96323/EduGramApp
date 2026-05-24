import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ITEMS = [
  { key: 'Feed', label: 'Feed', icon: 'home', iconOutline: 'home-outline' },
  { key: 'Árvore', label: 'Árvore', icon: 'library', iconOutline: 'library-outline' },
  { key: 'Quiz', label: 'Quiz', icon: 'bulb', iconOutline: 'bulb-outline' },
  { key: 'Perfil', label: 'Perfil', icon: 'person', iconOutline: 'person-outline' },
];

export default function Sidebar({ currentRoute, onNavigate }) {
  return (
    <View className="w-60 h-full bg-white border-r border-gray-200 py-6 px-3">
      <View className="px-3 pb-6 mb-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-primary-600">EduGram</Text>
        <Text className="text-xs text-gray-500 mt-1">Ciência para todos</Text>
      </View>

      <View className="space-y-1">
        {ITEMS.map((item) => {
          const active = currentRoute === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => onNavigate?.(item.key)}
              className={`flex-row items-center px-3 py-3 rounded-lg ${
                active ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`}
            >
              <Ionicons
                name={active ? item.icon : item.iconOutline}
                size={22}
                color={active ? '#4f46e5' : '#6b7280'}
              />
              <Text
                className={`ml-3 text-base ${
                  active ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
