import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  EpisodesFeedReponse,
  EpisodesFeedReponseData,
  Podcast,
} from "./EpisodesFeedResponse";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { Post } from "./Post";
import { FilterButton } from "./FilterButton";
import { useFilter } from "./FilterContext";
import { Player } from "./Player";

const getPodcasts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<EpisodesFeedReponse>(
    `/api/?page_size=50&page=${pageParam}`
  );
  return data.data;
};

function Posts() {
  const { ref, inView } = useInView({ rootMargin: "500px" });
  const [post, setPost] = useState<Podcast>();
  const onClick = React.useCallback((post: Podcast) => setPost(post), []);
  const { filter, dispatch } = useFilter();
  const {
    data,
    isError,
    isSuccess,
    isLoading,
    error,
    fetchNextPage,
  } = useInfiniteQuery<EpisodesFeedReponseData, AxiosError>(
    "podcasts",
    getPodcasts,
    {
      getNextPageParam: ({ podcasts, paginateData }) =>
        paginateData.currentPage < paginateData.totalPages
          ? paginateData.currentPage + 2
          : undefined,
      onError: (error) => toast.error(`Something went wrong: ${error.message}`),
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    if (data) {
      for (const page of data.pages) {
        for (const post of page.podcasts) {
          for (const { name } of post.categories.podcast_product) {
            dispatch({ type: "ADD_FILTER", payload: name });
          }
        }
      }
    }
  }, [data, dispatch]);

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return (
      <div className="posts">
        {[...Array(30)].map((_, i) => (
          <Post key={i} />
        ))}
      </div>
    );
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <>
      <div className="posts">
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.podcasts.flatMap((post, j) =>
              filter[post.categories.podcast_product.at(-1)?.name ?? ""] ? (
                <Post key={post.id} post={post} onClick={onClick} />
              ) : null
            )}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} />
      <Player post={post} />
      <FilterButton />
    </>
  );
}

export default Posts;
