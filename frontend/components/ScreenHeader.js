import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenHeader({ title, onBack, right }) {
  return (
    <View className="flex-row items-center bg-white px-3 py-4 border-b border-gray-200">
      <Pressable onPress={onBack} className="p-1 mr-1 hover:opacity-70">
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>
      <Text className="text-lg font-bold text-gray-900 flex-1">{title}</Text>
      {right || null}
    </View>
  );
}
