import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.css";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { Episode } from './pages/Episode';
import { GlobalFetchingIndicator } from './GlobalFetchingIndicator';
import { ReactQueryDevtools } from 'react-query/devtools'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalFetchingIndicator />
      <Router>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/:episode" element={<Episode />} />
        </Routes>
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>

  </React.StrictMode>
);


