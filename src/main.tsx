import '@fontsource/archivo/400.css';
import '@fontsource/archivo/900.css';
import '@fontsource/archivo/600-italic.css';
import '@fontsource/archivo/700-italic.css';
import '@fontsource/archivo/800-italic.css';
import '@fontsource/archivo/900-italic.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
