import axios from "axios";
import { useRef, useState } from "react";
import { Podcast, PodcastReponse } from "./nerdcastResponse";
import { useInfiniteQuery } from "react-query";
import "./App.css"
import React from "react";


const getPodcasts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<PodcastReponse>(`https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?paginated=true&per_page=20&page=${pageParam}`);
  return data;
}
function App() {

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } =
    useInfiniteQuery('podcasts', getPodcasts, {
      getNextPageParam: (lastPage, pages) => lastPage.page + 1,
      select: (dataObj) => {
        return {
          ...dataObj, pages: dataObj.pages.map(page => {
            return { ...page, data: page.data.slice(0, page.data.length - 1) }
          })
        }
      },
    });

  if (isLoading || !isSuccess) {
    return <p>loading...</p>
  }
  if (isError) {
    return <p>error</p>
  }

  return (
    <>
      <div style={{ maxWidth: "min(100%,1000px)", marginInline: "auto", display: "grid", gap: "10px" }}>
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
      </button>
    </>
  );
}

export default App;

function Post({ post }: { post: Podcast }) {
  const [showAudio, setShowAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const skipTo = post["jump-to-time"]["end-time"];
  const [showSkipButton, setShowSkipButton] = useState(skipTo > 0);
  return <div className="grid" onClick={() => {
    const audio = audioRef.current;
    if (showAudio && audio && !showSkipButton) {
      audio.paused ? audio.play() : audio.pause();
    } else {
      setShowAudio(true)
    };
  }}>
    <img className="grid-image" src={post.image} alt={post.image_alt} />
    <div className="grid-content">
      <h4 style={{ color: "#3bb4b4" }}>{`${post.product_name} ${post.episode}`}</h4>
      <h3>{post.title}</h3>
      <h5 style={{ color: "#b4b4b4" }}>{`${post.friendly_post_type} • ${post.friendly_post_date} • ${post.friendly_post_time}`}</h5>
    </div>
    {showAudio && showSkipButton && <button onClick={() => {
      if (audioRef.current) {
        audioRef.current.currentTime = skipTo;
        audioRef.current.play();
        setShowSkipButton(false);
      }
    }}>Pular para {formatTime(skipTo)}</button>
    }
    {showAudio && <audio ref={audioRef} style={{ alignSelf: "end" }} controls src={post.audio_high} autoPlay />}
  </div >;
}

function formatTime(timeInSeconds: number): string {
  return new Date(timeInSeconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}