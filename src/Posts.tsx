import axios, { AxiosError } from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { PodcastReponse } from "./nerdcastResponse";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import toast from 'react-hot-toast';
import { Post } from "./Post";
import React from "react";

const getPodcasts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<PodcastReponse>(
    `https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?paginated=true&per_page=20&page=${pageParam}`);
  return data;
}

function Posts() {
  const { ref, inView } = useInView({ rootMargin: "300%" });
  const [filterItems, setFilterItems] = useState<string[]>([]);
  const {
    data,
    isError,
    isSuccess,
    isLoading,
    error,
    fetchNextPage,
  } =
    useInfiniteQuery<PodcastReponse, AxiosError>('podcasts', getPodcasts, {
      getNextPageParam: ({ page, pages }) => page < pages ? page + 1 : undefined,
      onError: (error) => toast.error(`Something went wrong: ${error.message}`),
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  useEffect(() => {
    if (isSuccess) {
      const items: string[] = [];
      for (const page of data.pages) {
        for (const p of page.data) {
          !items.includes(p.product_name) && items.push(p.product_name);
        }
      }
      items.sort();
      setFilterItems(items);
    }
  }, [isSuccess, data]);

  if (isError) {
    return <p>{error.message}</p>
  }

  if (isLoading) {
    return <div className="posts">
      {[...Array(30)].map((_, i) => <Post key={i} />
      )}
    </div>
  }

  if (!isSuccess) {
    return null;
  }

  return (<>
    <div className="posts">
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map(post => (
            <Post key={post.id} post={post} ref={ref} />
          ))}
        </React.Fragment>
      ))}
    </div>
    <FilterButton filterItems={filterItems} />
  </>
  );
}

export default Posts;

export const FilterButton: FC<{ filterItems: string[] }> = ({ filterItems }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <button ref={buttonRef} className="filter-button" aria-expanded={expanded} onClick={(e) => {
      if (e.target === buttonRef.current)
        setExpanded(!expanded)
    }}>
      <div style={{ display: expanded ? "block" : "none", fontSize: "1.5rem" }}>
        <h3 style={{ textAlign: "center" }}>Filter</h3>
        {filterItems.map((n) =>
          <FilterItem name={n} key={n} />
        )}
      </div>
    </button>
  )
}

const FilterItem: FC<{ name: string }> = ({ name }) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [checkState, setCheckState] = useState(false);
  return <div className="filter-item" onClick={() => setCheckState(!checkState)} data-checked={checkState}>
    <input ref={checkBoxRef} type="checkbox" checked={checkState} onChange={(e) => setCheckState(e.target.checked)} />
    <label>{name}</label>
  </div>;
}

export function formatTime(timeInSeconds: number): string {
  return new Date(timeInSeconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}