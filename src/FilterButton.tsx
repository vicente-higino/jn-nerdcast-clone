import  { useCallback } from "react";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useFilter } from "./FilterContext";
import { FilterIcon } from "./icons/FilterIcon";

export type FilterItemsDict = { [key: string]: boolean; };

export const FilterButton: FC<{}> = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { filter } = useFilter();


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
    <button ref={buttonRef} className="filter-button" aria-expanded={expanded} onClick={(e) => {
      if (!divRef.current?.contains(e.target as Node))
        setExpanded(!expanded);
    }}>
      <FilterIcon style={{ width: "50%", margin: "auto" }} />
      <div ref={divRef} className="modal">
        <h3 style={{ textAlign: "center" }}>Filter</h3>
        {Object.keys(filter)
          .sort()
          .map((n) =>
            <FilterItem name={n} key={n} />
          )}
      </div>
    </button>
  );
};
const FilterItem: FC<{ name: string; }> = ({ name, }) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const { filter, setFilter } = useFilter();

  const checkIfHasAtLeastOneCheked = (value: boolean) => {
    const trueTotal = Object.values(filter).reduce((prev, curr) => curr ? prev + 1 : prev, 0)
    if (trueTotal > 1 || value) {
      setFilter(prev => { return { ...prev, [name]: value } });
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
