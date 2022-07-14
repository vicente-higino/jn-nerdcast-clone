import { useCallback } from "react";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useFilter } from "./FilterContext";
import { FilterIcon } from "./icons/FilterIcon";
import { checkIfAllFiltersAreTrue, countTrueValues } from "./utils";

export const FilterButton: FC<{}> = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { filter, dispatch } = useFilter();
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const clickOutside: EventListener = useCallback(
    (e) => {
      if (!buttonRef.current?.contains(e.target as Node) && !modalRef.current?.contains(e.target as Node))
        setExpanded(false);
    },
    [setExpanded],
  )
  const updateModalPosition = useCallback(
    () => {
      const { x, y, width } = buttonRef.current!.getBoundingClientRect();
      setModalPosition({ top: y, left: x + width });
    },
    [setModalPosition],
  )

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    }
  }, [clickOutside])

  useEffect(() => {
    window.addEventListener("resize", updateModalPosition);
    return () => {
      window.removeEventListener("resize", updateModalPosition);
    }

  }, [updateModalPosition])

  return (<>
    <button ref={buttonRef} className="filter-button" onClick={(e) => {
      setExpanded(!expanded);
      updateModalPosition();
    }}>
      <FilterIcon style={{ width: "50%", margin: "auto" }} />
    </button>
    <div ref={modalRef} className="modal" aria-expanded={expanded} style={modalPosition}>
      <div className="filter-header">
        <h3>Filter</h3>
        <button style={checkIfAllFiltersAreTrue(filter) ? { display: "none" } : {}} onClick={() => dispatch({ type: "SELECT_ALL" })}>
          Select all
        </button>
      </div>
      {Object.keys(filter)
        .sort()
        .map((n) =>
          <FilterItem name={n} key={n} />
        )}
    </div>
  </>
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
