import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/LoginPage';
import FeedPage from './screens/FeedPage';
import KnowledgeTreePage from './screens/KnowledgeTreePage';
import ProfilePage from './screens/ProfilePage';
import QuizPage from './screens/QuizPage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [userType, setUserType] = useState('aluno');

  // Function to render the correct page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'main':
        return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Feed') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Árvore') {
                  iconName = focused ? 'library' : 'library-outline';
                } else if (route.name === 'Quiz') {
                  iconName = focused ? 'bulb' : 'bulb-outline';
                } else if (route.name === 'Perfil') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4f46e5',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Feed" component={FeedPage} />
            <Tab.Screen name="Árvore" component={KnowledgeTreePage} />
            <Tab.Screen name="Quiz" component={QuizPage} />
            <Tab.Screen name="Perfil">
              {() => <ProfilePage userType={userType} />}
            </Tab.Screen>
          </Tab.Navigator>
        );
      default:
        return <WelcomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {renderPage()}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

