import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'
import { Podcast } from '../nerdcastResponse';
import { Post } from '../Post';
import { formatTime } from '../Posts';

const getEpisode = async (episode?: string) => {
    const { data } = await axios.get<Podcast[]>(
        `https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?search=${episode}`);
    return data[0];
}
export const Episode = () => {
    const episode = useParams<{ episode: string }>().episode?.replaceAll("-", " ")!;
    const { data } = useQuery(["episode", episode], () => getEpisode(episode));
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
    }, [data])


    return (
        <div className="post">
            <Post post={data} enableLink={false} >
                {showSkipButton && <button className="skip-button" onClick={handleSkip}>Pular para {formatTime(skipTo.current)}</button>}
            </Post>
            {data && <audio ref={audioRef} style={{ width: "100%" }} src={data.audio_high} controls />}
        </div>
    )
}
