import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive polyfill to prevent MediaPipe/Emscripten from overwriting fetch
// Some environments have window.fetch as a read-only getter which causes 
// "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    get: () => originalFetch,
    set: (v) => {
      console.warn('Attempt to overwrite window.fetch blocked to prevent crash.');
    }
  });
} catch (e) {
  console.error('Failed to apply fetch protection:', e);
}

import { LanguageProvider } from './context/LanguageContext.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline support
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
