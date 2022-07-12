import { useCallback } from "react";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useFilter } from "./FilterContext";
import { FilterIcon } from "./icons/FilterIcon";
import { checkIfAllFiltersAreTrue, countTrueValues } from "./utils";

export type FilterItemsDict = { [key: string]: boolean; };

export const FilterButton: FC<{}> = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { filter, dispatch } = useFilter();

  const clickOutside: EventListener = useCallback(
    (e) => {
      if (!buttonRef.current?.contains(e.target as Node))
        setExpanded(false);
    },
    [setExpanded],
  )

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    }
  }, [clickOutside])

  return (
    <div ref={buttonRef} className="filter-button" aria-expanded={expanded} onClick={(e) => {
      if (!modalRef.current?.contains(e.target as Node))
        setExpanded(!expanded);
    }}>
      <FilterIcon style={{ width: "50%", margin: "auto" }} />
      <div ref={modalRef} className="modal">
        <div className="filter-header">
          <h3>Filter</h3>
          <button style={checkIfAllFiltersAreTrue(filter) ? { display: "none" } : {}} onClick={() => dispatch({ type: "SELECT_ALL" })}>Select all</button>
        </div>
        {Object.keys(filter)
          .sort()
          .map((n) =>
            <FilterItem name={n} key={n} />
          )}
      </div>
    </div>
  );
};
const FilterItem: FC<{ name: string; }> = ({ name }) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const { filter, dispatch } = useFilter();

  const checkIfHasAtLeastOneCheked = (value: boolean) => {
    const trueTotal = countTrueValues(filter);
    if (trueTotal > 1 || value) {
      dispatch({ type: "UPDATE_FILTER", payload: { name, value } });
      toast.dismiss("filterErrorMessage");
    } else {
      toast.error("At least one must be selected", { position: "bottom-right", id: "filterErrorMessage", duration: 2000 });
    };
  }

  return <div className="filter-item" onClick={() => checkIfHasAtLeastOneCheked(!filter[name])} data-checked={filter[name]}>
    <input ref={checkBoxRef} type="checkbox" checked={filter[name]} onChange={(e) => checkIfHasAtLeastOneCheked(e.target.checked)} />
    <label>{name}</label>
  </div>;
};
