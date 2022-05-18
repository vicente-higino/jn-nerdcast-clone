import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./App.css"
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-left" />
      <App />
    </QueryClientProvider>

  </React.StrictMode>
);


