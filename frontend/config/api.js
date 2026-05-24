import { Platform } from 'react-native';

export const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://192.168.1.36:3000';
