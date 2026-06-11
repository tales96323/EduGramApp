// Web: react-native-webview não tem implementação para navegador.
// Renderizamos um <iframe> com o HTML (srcDoc) e escutamos mensagens via
// window.postMessage, espelhando a API do WebView nativo (source.html / onMessage).
import React, { forwardRef, useEffect } from 'react';

const WebView = forwardRef(function WebView({ source, onMessage }, _ref) {
  useEffect(() => {
    if (!onMessage) return undefined;
    const handler = (e) => {
      if (typeof e.data === 'string' && e.data.startsWith('{')) {
        onMessage({ nativeEvent: { data: e.data } });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMessage]);

  return (
    <iframe
      title="knowledge-tree"
      srcDoc={source && source.html}
      style={{ border: 'none', width: '100%', height: '100%', background: 'transparent' }}
    />
  );
});

export default WebView;
