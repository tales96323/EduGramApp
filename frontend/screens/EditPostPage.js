import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, Paperclip, Image as ImageIcon } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import { API_BASE_URL } from '../config/api';

const showAlert = (title, msg) => {
  if (Platform.OS === 'web') window.alert(`${title}: ${msg}`);
  else Alert.alert(title, msg);
};

const Field = ({ label, ...props }) => (
  <>
    <Text className="text-sm font-bold text-gray-700 mt-3 mb-1">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-800"
      placeholderTextColor="#9ca3af"
      {...props}
    />
  </>
);

export default function EditPostPage({ post, currentUser, onSaved, onBack }) {
  const [title, setTitle] = useState(post.title || '');
  const [abstract, setAbstract] = useState(post.abstract || '');
  const [keywords, setKeywords] = useState(
    Array.isArray(post.keywords) ? post.keywords.join(', ') : (post.keywords || ''),
  );
  const [doi, setDoi] = useState(post.doi || '');
  const [fullContent, setFullContent] = useState(post.fullContent || '');
  const [references, setReferences] = useState(post.references || '');
  const [category, setCategory] = useState(post.category || '');
  const [subcategory, setSubcategory] = useState(post.subcategory || '');
  const [simplifiedSnippet, setSimplifiedSnippet] = useState(post.simplifiedSnippet || '');

  const [newPdf, setNewPdf] = useState(null);
  const [newSupplementary, setNewSupplementary] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [saving, setSaving] = useState(false);

  const pickPdf = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (r.canceled === false) setNewPdf(r.assets[0]);
    } catch (e) {
      console.error(e);
    }
  };
  const pickSupplementary = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (r.canceled === false) setNewSupplementary(r.assets[0]);
    } catch (e) {
      console.error(e);
    }
  };
  const pickImage = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (r.canceled === false) setNewImage(r.assets[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !fullContent.trim()) {
      showAlert('Erro', 'Título e conteúdo são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('userId', String(currentUser.id));
      formData.append('title', title);
      formData.append('fullContent', fullContent);
      formData.append('abstract', abstract);
      formData.append('keywords', keywords);
      formData.append('doi', doi);
      formData.append('references', references);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('simplifiedSnippet', simplifiedSnippet);

      if (newPdf) {
        formData.append('pdf', {
          uri: newPdf.uri,
          name: newPdf.name,
          type: newPdf.mimeType || 'application/pdf',
        });
      }
      if (newSupplementary) {
        formData.append('supplementary', {
          uri: newSupplementary.uri,
          name: newSupplementary.name,
          type: newSupplementary.mimeType || 'application/octet-stream',
        });
      }
      if (newImage) {
        formData.append('image', {
          uri: newImage.uri,
          name: newImage.name,
          type: newImage.mimeType || 'image/jpeg',
        });
      }

      const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PATCH',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const updated = await res.json();
        showAlert('Sucesso', 'Publicação atualizada!');
        if (onSaved) await onSaved(updated);
        onBack();
      } else {
        const err = await res.json();
        showAlert('Erro', err.error || 'Falha ao atualizar a publicação.');
      }
    } catch (e) {
      console.error(e);
      showAlert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScreenHeader title="Editar Publicação" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="lg:max-w-2xl lg:self-center lg:w-full bg-white rounded-xl p-4">
          <Text className="text-xs text-gray-500 mb-1">
            Corrija eventuais erros da pesquisa. As alterações ficam visíveis imediatamente.
          </Text>

          <Field label="Título *" value={title} onChangeText={setTitle} placeholder="Título do artigo" />
          <Field
            label="Resumo (abstract)"
            value={abstract}
            onChangeText={setAbstract}
            placeholder="Resumo curto do artigo"
            multiline
            style={{ height: 70, textAlignVertical: 'top' }}
          />
          <Field
            label="Palavras-chave"
            value={keywords}
            onChangeText={setKeywords}
            placeholder="Separadas por vírgula"
            autoCapitalize="none"
          />
          <Field label="DOI" value={doi} onChangeText={setDoi} placeholder="Ex: 10.1000/xyz123" autoCapitalize="none" />
          <Field label="Categoria" value={category} onChangeText={setCategory} placeholder="Ex: physics" autoCapitalize="none" />
          <Field label="Subcategoria" value={subcategory} onChangeText={setSubcategory} placeholder="Ex: quantum_mechanics" autoCapitalize="none" />
          <Field
            label="Conteúdo do Artigo *"
            value={fullContent}
            onChangeText={setFullContent}
            placeholder="Texto completo do artigo"
            multiline
            style={{ height: 140, textAlignVertical: 'top' }}
          />
          <Field
            label="Versão simplificada"
            value={simplifiedSnippet}
            onChangeText={setSimplifiedSnippet}
            placeholder="Versão simplificada (opcional)"
            multiline
            style={{ height: 80, textAlignVertical: 'top' }}
          />
          <Field
            label="Referências"
            value={references}
            onChangeText={setReferences}
            placeholder="Referências bibliográficas"
            multiline
            style={{ height: 70, textAlignVertical: 'top' }}
          />

          <Text className="text-sm font-bold text-gray-700 mt-4 mb-1">Substituir Anexos (opcional)</Text>
          <Pressable
            onPress={pickImage}
            className="p-3 bg-gray-100 rounded-lg flex-row items-center border border-dashed border-gray-300 hover:bg-gray-200 mb-2"
          >
            <ImageIcon size={18} color="#059669" />
            <Text className="text-gray-600 font-semibold ml-2 flex-1">
              {newImage ? `Nova capa: ${newImage.name}` : 'Substituir imagem de capa'}
            </Text>
          </Pressable>
          <Pressable
            onPress={pickPdf}
            className="p-3 bg-gray-100 rounded-lg flex-row items-center border border-dashed border-gray-300 hover:bg-gray-200 mb-2"
          >
            <FileText size={18} color="#dc2626" />
            <Text className="text-gray-600 font-semibold ml-2 flex-1">
              {newPdf ? `Novo PDF: ${newPdf.name}` : post.pdfOriginalName ? `Substituir PDF (atual: ${post.pdfOriginalName})` : 'Anexar PDF principal'}
            </Text>
          </Pressable>
          <Pressable
            onPress={pickSupplementary}
            className="p-3 bg-gray-100 rounded-lg flex-row items-center border border-dashed border-gray-300 hover:bg-gray-200"
          >
            <Paperclip size={18} color="#4f46e5" />
            <Text className="text-gray-600 font-semibold ml-2 flex-1">
              {newSupplementary
                ? `Novo anexo: ${newSupplementary.name}`
                : post.supplementaryOriginalName
                  ? `Substituir anexo (atual: ${post.supplementaryOriginalName})`
                  : 'Anexar material suplementar'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`bg-primary-600 hover:bg-primary-700 rounded-lg py-3 mt-5 items-center ${saving ? 'opacity-50' : ''}`}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Salvar Alterações</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
