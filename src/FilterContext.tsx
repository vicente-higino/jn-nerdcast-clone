import React, { FC, PropsWithChildren, useContext, useEffect, useReducer, } from "react";
import { checkIfAllFiltersAreTrue, isFilterItemsDict, } from "./utils";

export type FilterItemsDict = Record<string, boolean>;

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

type Action =
  | {
    type: "UPDATE_FILTER";
    payload: { name: string, value: boolean }
  }
  | {
    type: "ADD_FILTER";
    payload: string;
  }
  | {
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
      const newState: FilterItemsDict = {...state};
      for (const key in newState) {
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

function tryParseFilterItemsDict() {
  try {
    const obj = JSON.parse(window.localStorage.getItem("filter")!);
    if (isFilterItemsDict(obj)) return obj;
  } catch (error) { }
  return defaultFilter;
}

export const FilterProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [filter, dispatch] = useReducer(reducer, tryParseFilterItemsDict());

  useEffect(() => {
    window.localStorage.setItem("filter", JSON.stringify(filter));
  }, [filter])

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};