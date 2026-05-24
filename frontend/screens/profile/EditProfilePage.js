import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { API_BASE_URL } from '../../config/api';

const showAlert = (title, msg) => {
  if (Platform.OS === 'web') window.alert(`${title}: ${msg}`);
  else Alert.alert(title, msg);
};

// Definido fora do componente para o TextInput não perder foco a cada render
const Field = ({ label, ...props }) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white"
      placeholderTextColor="#9ca3af"
      {...props}
    />
  </View>
);

export default function EditProfilePage({ currentUser, onUpdateUser, onBack }) {
  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [field, setField] = useState(currentUser.field || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [pickedAvatar, setPickedAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const pickAvatar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (result.canceled === false) setPickedAvatar(result.assets[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadAvatar = async () => {
    if (!pickedAvatar) return null;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: pickedAvatar.uri,
        name: pickedAvatar.name || 'avatar.jpg',
        type: pickedAvatar.mimeType || 'image/jpeg',
      });
      const res = await fetch(`${API_BASE_URL}/users/${currentUser.id}/avatar`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha ao enviar imagem');
      }
      const updated = await res.json();
      setAvatarUrl(updated.avatarUrl || '');
      setPickedAvatar(null);
      return updated;
    } catch (e) {
      showAlert('Erro', e.message || 'Falha ao enviar imagem');
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    setSaving(true);
    try {
      let avatarUpdated = null;
      if (pickedAvatar) {
        avatarUpdated = await uploadAvatar();
        if (!avatarUpdated) {
          setSaving(false);
          return;
        }
      }

      const res = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, institution, field, avatarUrl }),
      });
      if (res.ok) {
        const updated = await res.json();
        await onUpdateUser({ ...currentUser, ...(avatarUpdated || {}), ...updated });
        showAlert('Sucesso', 'Perfil atualizado!');
        onBack();
      } else {
        const err = await res.json();
        showAlert('Erro', err.error || 'Falha ao salvar o perfil.');
      }
    } catch (e) {
      console.error(e);
      showAlert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  const preview =
    (pickedAvatar && pickedAvatar.uri) ||
    avatarUrl ||
    currentUser.profilePic ||
    `https://placehold.co/200x200/3b82f6/ffffff?text=${encodeURIComponent((name[0] || '?').toUpperCase())}`;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Editar Perfil" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="lg:max-w-xl lg:self-center lg:w-full">
          <View className="items-center mb-4">
            <View className="relative">
              <Image
                source={{ uri: preview }}
                style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#e5e7eb' }}
              />
              <Pressable
                onPress={pickAvatar}
                className="absolute -bottom-1 -right-1 bg-primary-600 hover:bg-primary-700 rounded-full w-8 h-8 items-center justify-center border-[3px] border-white"
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </Pressable>
            </View>
            <Pressable onPress={pickAvatar} className="mt-3">
              <Text className="text-sm text-primary-600 font-semibold">
                {pickedAvatar ? `Selecionada: ${pickedAvatar.name}` : 'Escolher foto do dispositivo'}
              </Text>
            </Pressable>
            {pickedAvatar && (
              <Pressable onPress={() => setPickedAvatar(null)} className="mt-1">
                <Text className="text-xs text-gray-500">Remover seleção</Text>
              </Pressable>
            )}
            {uploadingAvatar && (
              <ActivityIndicator size="small" color="#4f46e5" style={{ marginTop: 6 }} />
            )}
          </View>

          <View className="bg-white rounded-xl p-4">
            <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
            <Field
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Fale um pouco sobre você"
              multiline
              style={{ height: 80, textAlignVertical: 'top' }}
            />
            <Field
              label="Instituição"
              value={institution}
              onChangeText={setInstitution}
              placeholder="Ex: USP — Instituto de Física"
            />
            <Field
              label="Área de atuação"
              value={field}
              onChangeText={setField}
              placeholder="Ex: physics, biology"
              autoCapitalize="none"
            />
            <Field
              label="URL do avatar (alternativa ao upload)"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />

            <Pressable
              onPress={handleSave}
              disabled={saving}
              className={`bg-primary-600 hover:bg-primary-700 rounded-lg py-3 mt-2 items-center ${saving ? 'opacity-50' : ''}`}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Salvar Alterações</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
