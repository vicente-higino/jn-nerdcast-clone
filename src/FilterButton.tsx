import React, { useCallback } from "react";
import { FC, useEffect, useRef, useState } from "react";
import { FilterIcon } from "./icons/FilterIcon";

export type FilterItemsDict = { [key: string]: boolean; };

export const FilterButton: FC<{
  filterItems: FilterItemsDict;
  onChangeItems: (items: FilterItemsDict) => void;
}> = ({ filterItems, onChangeItems }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const items = useRef<FilterItemsDict>(filterItems);

  useEffect(() => {
    items.current = filterItems;
  }, [filterItems])

  const onChange = useCallback(
    (r: boolean, n: string) => {
      items.current = { ...items.current, [n]: r };
      onChangeItems(items.current);
    },
    [onChangeItems]
  );

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
        {Object.keys(items.current)
          .sort()
          .map((n) =>
            <FilterItem name={n} key={n} checked={items.current[n]} onChange={onChange} />
          )}
      </div>
    </button>
  );
};
const FilterItem: FC<{ name: string; checked?: boolean; onChange: (result: boolean, name: string) => void; }> = ({ name, checked, onChange }) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [checkState, setCheckState] = useState(checked ?? true);

  useEffect(() => {
    onChange(checkState, name);
  }, [checkState, name, onChange]);

  return <div className="filter-item" onClick={() => setCheckState(!checkState)} data-checked={checkState}>
    <input ref={checkBoxRef} type="checkbox" checked={checkState} onChange={(e) => setCheckState(e.target.checked)} />
    <label>{name}</label>
  </div>;
};
