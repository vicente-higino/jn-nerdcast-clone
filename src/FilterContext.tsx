import React, { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { FilterItemsDict } from "./FilterButton";

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
};
const FilterContext = React.createContext<FilterContextType>({ filter: defaultFilter, setFilter: () => { } });

export const useFilter = () => useContext(FilterContext);

export const FilterProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [filter, setFilter] = useState(
    window.localStorage.getItem("filter") ?
      JSON.parse(window.localStorage.getItem("filter")!) as FilterItemsDict :
      defaultFilter
  );

  useEffect(() => {
    window.localStorage.setItem("filter", JSON.stringify(filter));
  }, [filter])


  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};