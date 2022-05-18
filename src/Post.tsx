import { useRef, useState } from "react";
import { Podcast } from "./nerdcastResponse";
import React from "react";
import { formatTime } from "./App";

export const Post = React.forwardRef<HTMLDivElement, { post: Podcast; }>(({ post }, ref) => {
  const [showAudio, setShowAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const skipTo = post["jump-to-time"]["end-time"];
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

