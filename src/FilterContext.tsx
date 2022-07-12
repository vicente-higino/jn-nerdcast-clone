import React, { FC, PropsWithChildren, useContext, useEffect, useReducer, } from "react";
import { FilterItemsDict } from "./FilterButton";
import { checkIfAllFiltersAreTrue, } from "./utils";

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

type Action = |
{
  type: "UPDATE_FILTER";
  payload: { name: string, value: boolean }
} |
{
  type: "ADD_FILTER";
  payload: string;
} |
{
  type: "SELECT_ALL";
  payload?: never;
}

const reducer: React.Reducer<FilterItemsDict, Action> = (state, { type, payload }) => {
  switch (type) {
    case "UPDATE_FILTER":
      return { ...state, [payload.name]: payload.value };
    case "ADD_FILTER":
      return { ...state, [payload]: state[payload] ?? checkIfAllFiltersAreTrue(state) };
    case "SELECT_ALL":
      const newState: FilterItemsDict = {};
      for (const key in state) {
        newState[key] = true;
      }
      return newState;
    default:
      return state;
  }
}

type FilterContextType = {
  filter: FilterItemsDict;
  dispatch: React.Dispatch<Action>;
};

const FilterContext = React.createContext<FilterContextType>({ filter: defaultFilter, dispatch: () => { } });

export const useFilter = () => useContext(FilterContext);

export const FilterProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [filter, dispatch] = useReducer(reducer,
    window.localStorage.getItem("filter") ?
      JSON.parse(window.localStorage.getItem("filter")!) as FilterItemsDict :
      defaultFilter
  );
  useEffect(() => {
    window.localStorage.setItem("filter", JSON.stringify(filter));
  }, [filter])

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};