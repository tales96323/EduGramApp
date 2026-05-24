import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@edugram_current_user';

export async function saveUser(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Erro salvando sessão:', e);
  }
}

export async function loadUser() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Erro carregando sessão:', e);
    return null;
  }
}

export async function clearUser() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erro limpando sessão:', e);
  }
}
