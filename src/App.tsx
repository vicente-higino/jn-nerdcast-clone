import "./App.css";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { Episode } from './pages/Episode';
import { GlobalFetchingIndicator } from './GlobalFetchingIndicator';
import { ReactQueryDevtools } from 'react-query/devtools'
import React, { useContext, useState } from "react";
import { FilterItemsDict } from "./FilterButton";

export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

const defaultFilter: FilterItemsDict = {
  "Caneca de Mamicas": true,
  "Empreendedor": true,
  "Generacast": true,
  "Lá do Bunker": true,
  "NerdCash": true,
  "NerdCast": true,
  "NerdTech": true,
  "Papo de Parceiro": true
};

type FilterContextType = {
  filter: FilterItemsDict;
  setFilter: React.Dispatch<React.SetStateAction<FilterItemsDict>>;
}

export const FilterContext = React.createContext<FilterContextType>({ filter: defaultFilter, setFilter: () => { } });

export const useFilterContext = () => useContext(FilterContext);

export const App = () => {
  const [filter, setFilter] = useState(defaultFilter);

  return (<>
    <QueryClientProvider client={queryClient}>
      <FilterContext.Provider value={{ filter, setFilter }}>
        <GlobalFetchingIndicator />
        <Router>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/:nome/:episode" element={<Episode />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </Router>
        <ReactQueryDevtools />
      </FilterContext.Provider>
    </QueryClientProvider>
  </>
  )
}
