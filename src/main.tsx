import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PropertyProvider } from './contexts/PropertyContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PropertyProvider>
      <App />
    </PropertyProvider>
  </React.StrictMode>
);