/**
 * Ativa o modo demo (mock API) quando o build define EXPO_PUBLIC_DEMO=1.
 * Importado como primeiro módulo em index.js para instalar o mock de `fetch`
 * antes de qualquer tela renderizar.
 */
import { installMockApi } from './mockApi';

if (process.env.EXPO_PUBLIC_DEMO === '1') {
  installMockApi();
}
