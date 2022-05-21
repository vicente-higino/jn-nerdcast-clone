import axios, { AxiosError } from "axios";
import { useEffect } from "react";
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
      select: (dataObj) => {
        return {
          ...dataObj, pages: dataObj.pages.map(page => {
            return { ...page, data: page.data.slice(0, page.data.length - 1) }
          })
        }
      },
      onError: (error) => toast.error(`Something went wrong: ${error.message}`),
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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

  return (
    <div className="posts">
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map(post => (
            <Post key={post.id} post={post} ref={ref} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Posts;

export function formatTime(timeInSeconds: number): string {
  return new Date(timeInSeconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}