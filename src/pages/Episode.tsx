import axios, { AxiosError } from 'axios';
import { FC, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import { EpisodePageResponse } from '../EpisodePageResponse';
import { Post } from '../Post';
import { formatTime } from "../utils";

const getEpisode = async (episodeId: string) => {
  const { data } = await axios.get<EpisodePageResponse>(
    `https://api.jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/${episodeId}/`);
  return data;
}

export const Episode = () => {
  const episodeId = useParams<{ id: string }>().id!;
  const { data, isError, error } = useQuery<EpisodePageResponse, AxiosError>(["episode", episodeId], () => getEpisode(episodeId));
  const [showSkipButton, setShowSkipButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const skipTo = useRef(0);

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = skipTo.current;
      audioRef.current.play().catch();
      setShowSkipButton(false);
    }
  }

  useEffect(() => {
    if (data) {
      skipTo.current = data["jump-to-time"]["end-time"];
      skipTo.current > 0 && setShowSkipButton(true);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(`error ${error.code} ${error.message}`)
    }
  }, [isError, error]);

  if (isError) {
    return <ErrorMessage msg={error.message} code={error.code ?? "400"} />
  }

  return (
    <div className="post">
      <Post post={data} enableLink={false} >
        {showSkipButton && <button className="skip-button" onClick={handleSkip}>Pular para {formatTime(skipTo.current)}</button>}
      </Post>
      {data && <audio ref={audioRef} style={{ width: "100%" }} src={data.audio_high} controls />}
    </div>
  )
}

export const ErrorMessage: FC<{ msg: string, code: string }> = ({ msg, code }) => {
  return (
    <div style={{ display: "grid", placeContent: "center", minHeight: "100vh", gap: "10px" }}>
      <h1>Error {code}:</h1>
      <h1>{msg}</h1>
      <Link to={"/"} className="link">Go Back</Link>
    </div>
  )
}
