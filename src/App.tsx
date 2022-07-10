import "./App.css";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { Episode } from './pages/Episode';
import { GlobalFetchingIndicator } from './GlobalFetchingIndicator';
import { ReactQueryDevtools } from 'react-query/devtools'
import { FilterProvider } from "./FilterContext";

export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

export const App = () => {
  return (<>
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <GlobalFetchingIndicator />
        <Router>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/:nome/:episode" element={<Episode />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </Router>
        <ReactQueryDevtools />
      </FilterProvider>
    </QueryClientProvider>
  </>
  )
}
