import { createRoot } from 'react-dom/client';

import { MockApp } from './App.js';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<MockApp />);
}
