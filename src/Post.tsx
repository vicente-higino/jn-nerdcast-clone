import { useRef, useState } from "react";
import { Podcast } from "./nerdcastResponse";
import React from "react";
import { formatTime } from "./Posts";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export const Post = React.forwardRef<HTMLDivElement, { post?: Podcast }>(({ post }, ref) => {
  const [showAudio, setShowAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const skipTo = post ? post["jump-to-time"]["end-time"] : 0;
  const [showSkipButton, setShowSkipButton] = useState(skipTo > 0);

  const handleClick = () => {
    const audio = audioRef.current;
    if (showAudio && audio && !showSkipButton) {
      audio.paused ? audio.play() : audio.pause();
    } else {
      setShowAudio(true);
    };
  }

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = skipTo;
      audioRef.current.play();
      setShowSkipButton(false);
    }
  }

  if (!post) {
    return <div className="grid">
      <Skeleton height={"100%"} baseColor="#6d6d6d" highlightColor="#858585" containerClassName="grid-image" />
      <div className="grid-content">
        <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(30, 50)} />
        <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(45, 80)} />
        <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(60, 75)} />
      </div>
    </div>
  }

  return (
    <div ref={ref} className="grid" onClick={handleClick}>
      <img className="grid-image" src={post.image} alt={post.image_alt} />
      <div className="grid-content">
        <div>
          <h4 style={{ color: "#3bb4b4" }}>{`${post.product_name} ${post.episode}`}</h4>
          <h3>{post.title}</h3>
          <h5 style={{ color: "#b4b4b4" }}>{`${post.product_name} • ${post.friendly_post_date} • ${post.friendly_post_time}`}</h5>
        </div>
        {showAudio && <audio ref={audioRef} style={{ alignSelf: "end", width: "100%" }} controls src={post.audio_high} autoPlay />}
      </div>
      {showAudio && showSkipButton && <button onClick={handleSkip}>Pular para {formatTime(skipTo)}</button>}
    </div>
  )
});



const radomPercentil = (min: number, max: number): string => {
  const n = Math.random() * 100;
  if (n > max) {
    return `${max}%`;
  }
  if (n < min) {
    return `${min}%`;
  }
  return `${n}%`;
}