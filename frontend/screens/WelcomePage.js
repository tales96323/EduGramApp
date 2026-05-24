import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomePage = ({ setCurrentPage }) => {
  return (
    <LinearGradient colors={['#9333ea', '#4f46e5', '#3b82f6']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 py-6 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <View className="flex-1 justify-center items-center lg:items-start lg:max-w-xl">
            <Image
              source={require('../assets/images/LOGO_GRANDE_SEM_FUNDO.png')}
              style={{ width: 168, height: 168, marginBottom: 30 }}
              resizeMode="contain"
              onError={() => console.log('Logo image not found')}
            />
            <Text className="text-4xl lg:text-5xl font-bold text-white mb-4 text-center lg:text-left">
              Bem-vindo!
            </Text>
            <Text className="text-lg text-gray-200 text-center lg:text-left leading-6 max-w-sm lg:max-w-md">
              Parabéns por fazer parte de nossa comunidade de divulgação científica!
              {'\n\n'}
              Faça o login e acesse os conteúdos publicados.
            </Text>
          </View>

          <View className="w-full max-w-xs self-center mb-12 lg:mb-0 lg:self-auto lg:max-w-sm">
            <Pressable
              onPress={() => setCurrentPage('login')}
              className="bg-white py-3 rounded-lg mb-4 shadow-md hover:bg-gray-50 active:opacity-80"
            >
              <Text className="text-primary-600 text-base font-semibold text-center">
                Get Started
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCurrentPage('login')}
              className="bg-primary-600 py-3 rounded-lg shadow-md hover:bg-primary-700 active:opacity-80"
            >
              <Text className="text-white text-base font-semibold text-center">My Account</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WelcomePage;
