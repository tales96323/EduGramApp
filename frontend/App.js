import './global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/LoginPage';
import AppShell from './components/AppShell';
import { loadUser, saveUser, clearUser } from './lib/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentUser, setCurrentUserState] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadUser();
      if (stored) {
        setCurrentUserState(stored);
        setCurrentPage('main');
      }
      setBootstrapping(false);
    })();
  }, []);

  const setCurrentUser = async (user) => {
    setCurrentUserState(user);
    if (user) await saveUser(user);
    else await clearUser();
  };

  const logout = async () => {
    await clearUser();
    setCurrentUserState(null);
    setCurrentPage('welcome');
  };

  if (bootstrapping) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      </SafeAreaProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} />;
      case 'main':
        return <AppShell currentUser={currentUser} onLogout={logout} onUpdateUser={setCurrentUser} />;
      default:
        return <WelcomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>{renderPage()}</NavigationContainer>
    </SafeAreaProvider>
  );
}
