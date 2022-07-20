import { useCallback, } from "react";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FilterItemsDict, useFilter } from "./FilterContext";
import { FilterIcon } from "./icons/FilterIcon";
import { checkIfAllFiltersAreTrue, countTrueValues } from "./utils";
import { motion } from "framer-motion";

function sortFilter(filter: FilterItemsDict): [string, boolean][] {
  const arr = Object.entries(filter);
  const newArr: [string, boolean][] = [];
  arr.sort((a, b) => a[0].localeCompare(b[0]));
  newArr.push(...arr.filter((v) => v[1]));
  newArr.push(...arr.filter((v) => !v[1]));
  return newArr;
}

export const FilterButton: FC<{}> = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { filter } = useFilter();
  const [modalPosition, setModalPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

  const clickOutside: EventListener = useCallback(
    (e) => {
      if (!buttonRef.current?.contains(e.target as Node) && !modalRef.current?.contains(e.target as Node))
        setExpanded(false);
    },
    [setExpanded],
  )
  const updateModalPosition = useCallback(
    () => {
      if (buttonRef.current && modalRef.current) {
        const { x, y, width: widthButton } = buttonRef.current.getBoundingClientRect();
        const { height, width: widthModal } = modalRef.current.getBoundingClientRect();
        setModalPosition({ top: y - height - 10, left: x - widthModal + widthButton });
      }
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
    updateModalPosition();
    window.addEventListener("resize", updateModalPosition);
    return () => {
      window.removeEventListener("resize", updateModalPosition);
    }
  }, [updateModalPosition])

  return (<>
    <motion.button whileTap={{ scale: 0.9, transition: { duration: 0.1 } }} ref={buttonRef} className="filter-button" onClick={() => {
      setExpanded(prev => !prev);
      updateModalPosition();
    }}>
      <FilterIcon style={{ width: "50%", margin: "auto" }} />
    </motion.button>
    <motion.div
      style={{ ...modalPosition }}
      animate={expanded ? { x: "0", opacity: 1 } : { x: 400, opacity: 0 }}
      transition={{ duration: 1, bounce: 0.5, type: "spring", delayChildren: 10 }}
      className="modal"
      ref={modalRef}>
      <div className="filter-header">
        <h3 style={{ gridColumn: 2 }}>Filter</h3>
        <SelectAllButton />
      </div>
      <motion.div initial="hidden" whileInView="visible">
        {sortFilter(filter)
          .map((n, i) =>
            <FilterItem name={n[0]} key={n[0]} index={i} />
          )}
      </motion.div>
    </motion.div>
  </>
  );
};
const FilterItem: FC<{ name: string; index: number; }> = ({ name, index }) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const { filter, dispatch } = useFilter();
  const item = {
    visible: {
      x: 0,
      transition: {
        duration: 0.5,
        delay: index % 2 === 0 ? 0 : 0.25
      }
    },
    hidden: {
      x: index % 2 === 0 ? "100%" : "-100%",
      transition: { duration: 0 }
    },
  }
  const checkIfHasAtLeastOneCheked = (value: boolean) => {
    const trueTotal = countTrueValues(filter);
    if (trueTotal > 1 || value) {
      dispatch({ type: "UPDATE_FILTER", payload: { name, value } });
      toast.dismiss("filterErrorMessage");
    } else {
      toast.error("At least one must be selected", { position: "bottom-right", id: "filterErrorMessage", duration: 2000 });
    };
  }

  return <motion.div
    whileTap={{ scale: .9 }}
    whileHover={{ scale: 1.1 }}
    variants={item}
    className="filter-item" onClick={() => checkIfHasAtLeastOneCheked(!filter[name])} data-checked={filter[name]}>
    <input ref={checkBoxRef} type="checkbox" checked={filter[name]} onChange={(e) => checkIfHasAtLeastOneCheked(e.target.checked)} />
    <label>{name}</label>
  </motion.div>;
};


export const SelectAllButton = () => {
  const { filter, dispatch } = useFilter();
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  }
  return (
    <motion.button
      whileTap={{ scale: .9 }}
      animate={!checkIfAllFiltersAreTrue(filter) ? "open" : "closed"}
      variants={variants}
      onClick={() => dispatch({ type: "SELECT_ALL" })}>
      Select all
    </motion.button>
  )
}

