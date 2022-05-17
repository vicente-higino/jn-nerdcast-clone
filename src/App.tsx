import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Datum, ResponseObject } from "./nerdcastResponse";
import "./App.css"

function App() {
  const [state, setState] = useState<Datum[]>();
  useEffect(() => {
    (async () => {
      const { data } = await axios.get<ResponseObject>("https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?paginated=true/");
      setState(data.data);
    })();

  }, [])
  if (!state) {
    return <p>loading</p>
  }

  return (
    <div style={{ maxWidth: "min(100%,1000px)", marginInline: "auto", display: "grid", gap: "10px" }}>
      {state.map((post) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default App;

function Post({ post }: { post: Datum }) {
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