import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.css";
import Posts from './Posts';
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
      <Posts />
    </QueryClientProvider>

  </React.StrictMode>
);


