import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config/api';

const LoginPage = ({ setCurrentPage, setCurrentUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(title + ': ' + message);
    } else {
      Alert.alert(title, message);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showAlert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const user = await res.json();
        if (setCurrentUser) await setCurrentUser(user);
        setCurrentPage('main');
      } else {
        const errorData = await res.json();
        showAlert('Erro', errorData.error || 'Email ou senha inválidos.');
      }
    } catch (e) {
      console.error(e);
      showAlert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      showAlert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const user = await res.json();
        if (setCurrentUser) await setCurrentUser(user);
        setCurrentPage('main');
      } else {
        const errorData = await res.json();
        showAlert('Erro', errorData.error || 'Não foi possível criar a conta.');
      }
    } catch (e) {
      console.error(e);
      showAlert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <LinearGradient colors={['#9333ea', '#4f46e5', '#3b82f6']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        >
          <View className="w-full max-w-md self-center lg:max-w-5xl lg:flex-row lg:items-center lg:gap-12">
            <View className="items-center mb-8 lg:flex-1 lg:items-start lg:mb-0">
              <Image
                source={require('../assets/images/LOGO_GRANDE_SEM_FUNDO.png')}
                style={{ width: 112, height: 112, marginBottom: 24 }}
                resizeMode="contain"
                onError={() => console.log('Logo image not found')}
              />
              <Text className="text-3xl lg:text-4xl font-bold text-white mb-2 text-center lg:text-left">
                {isSignUp ? 'Criar Conta' : 'Sign In'}
              </Text>
              <Text className="text-base text-gray-200 text-center lg:text-left lg:max-w-sm">
                {isSignUp
                  ? 'Preencha seus dados para começar a explorar a comunidade EduGram.'
                  : 'Acesse sua conta para continuar acompanhando o feed e fazendo quizzes.'}
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg w-full lg:flex-1 lg:max-w-md">
              {isSignUp && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Nome</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                    placeholder="Seu nome"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                  placeholder="your@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  {isSignUp ? 'Senha' : 'Password'}
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg">
                  <TextInput
                    className="flex-1 px-3 py-3 text-base text-gray-900"
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable className="px-3" onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                className="bg-primary-600 rounded-lg py-3 mt-2 mb-4 hover:bg-primary-700 active:opacity-80 disabled:opacity-50"
                onPress={isSignUp ? handleSignUp : handleSignIn}
                disabled={loading}
              >
                <Text className="text-white text-base font-semibold text-center">
                  {loading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Sign In'}
                </Text>
              </Pressable>

              {!isSignUp && (
                <Pressable>
                  <Text className="text-sm text-gray-700 text-center mb-4">Forgot Password?</Text>
                </Pressable>
              )}

              <Pressable onPress={toggleMode} className="items-center mt-2">
                <Text className="text-sm text-gray-700">
                  {isSignUp ? 'Já tem uma conta? ' : 'Não tem conta? '}
                  <Text className="text-primary-600 font-semibold">
                    {isSignUp ? 'Fazer login' : 'Criar conta'}
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginPage;
