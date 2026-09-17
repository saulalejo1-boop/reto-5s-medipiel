import React from 'react';
import ReactDOM from 'react-dom/client';
import { RetoProvider } from './context/RetoContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RetoProvider>
      <App />
    </RetoProvider>
  </React.StrictMode>
);
