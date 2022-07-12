import React, { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { PodcastReponse } from "./nerdcastResponse";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import toast from 'react-hot-toast';
import { Post } from "./Post";
import { FilterButton } from "./FilterButton";
import { useFilter } from "./FilterContext";

const getPodcasts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<PodcastReponse>(
    `https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?paginated=true&per_page=50&page=${pageParam}`);
  return data;
}

function Posts() {
  const { ref, inView } = useInView({ rootMargin: "500px" });
  const { filter, dispatch } = useFilter();
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
    if (data) {
      for (const page of data.pages) {
        for (const post of page.data) {
          dispatch({ type: "ADD_FILTER", payload: post.product_name });
        }
      }
    }
  }, [data, dispatch]);

  if (isError) {
    return <p>{error.message}</p>
  }

  if (isLoading) {
    return <div className="posts">
      {[...Array(30)].map((_, i) => <Post key={i} />)}
    </div>
  }

  if (!isSuccess) {
    return null;
  }

  return (<>
    <div className="posts">
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.flatMap((post, j) => (
            filter[post.product_name] ? <Post
              key={post.id}
              post={post}
            /> : null
          ))}
        </React.Fragment>
      ))}
    </div>
    <div ref={ref} />
    <FilterButton />
  </>
  );
}

export default Posts
