import { API_BASE_URL } from '../config/api';

// Retorna a lista de IDs de posts salvos pelo usuário
export async function fetchSavedIds(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/saved`);
    const data = await res.json();
    return Array.isArray(data) ? data.map((p) => p.id) : [];
  } catch (e) {
    console.error('Erro buscando posts salvos:', e);
    return [];
  }
}

// Alterna o estado de salvo de um post; retorna o novo estado (boolean)
export async function toggleSave(postId, userId, currentlySaved) {
  const method = currentlySaved ? 'DELETE' : 'POST';
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar post salvo');
  const data = await res.json();
  return data.saved;
}
