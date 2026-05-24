import React, { useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import useBreakpoint from '../hooks/useBreakpoint';
import Sidebar from './Sidebar';

import FeedPage from '../screens/FeedPage';
import KnowledgeTreePage from '../screens/KnowledgeTreePage';
import QuizPage from '../screens/QuizPage';
import ProfilePage from '../screens/ProfilePage';

const Tab = createBottomTabNavigator();

function MobileShell({ currentUser, onLogout, onUpdateUser }) {
  const userType = currentUser?.role || 'aluno';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Árvore') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'Quiz') iconName = focused ? 'bulb' : 'bulb-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed">{() => <FeedPage currentUser={currentUser} />}</Tab.Screen>
      <Tab.Screen name="Árvore">{() => <KnowledgeTreePage userType={userType} />}</Tab.Screen>
      <Tab.Screen name="Quiz" component={QuizPage} />
      <Tab.Screen name="Perfil">
        {() => (
          <ProfilePage currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function DesktopShell({ currentUser, onLogout, onUpdateUser }) {
  const [currentRoute, setCurrentRoute] = useState('Feed');
  const userType = currentUser?.role || 'aluno';

  const renderScreen = () => {
    switch (currentRoute) {
      case 'Feed':
        return <FeedPage currentUser={currentUser} />;
      case 'Árvore':
        return <KnowledgeTreePage userType={userType} />;
      case 'Quiz':
        return <QuizPage />;
      case 'Perfil':
        return (
          <ProfilePage currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />
        );
      default:
        return <FeedPage currentUser={currentUser} />;
    }
  };

  return (
    <View className="flex-1 flex-row bg-gray-50">
      <Sidebar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      <View className="flex-1 overflow-hidden">
        <View className="flex-1 max-w-6xl mx-auto w-full">{renderScreen()}</View>
      </View>
    </View>
  );
}

export default function AppShell({ currentUser, onLogout, onUpdateUser }) {
  const { isDesktop } = useBreakpoint();
  if (isDesktop) {
    return (
      <DesktopShell currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />
    );
  }
  return <MobileShell currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />;
}
