import { FC, PropsWithChildren } from "react";
import { PostProps } from "./Types";

export const Player: FC<PropsWithChildren<{
  post?: PostProps;
}>> = ({ post }) => {
  if (!post) {
    return null;
  }
  return (
    <div className="player">
      <div className="player-title">
        <p className="podcast-name">
          {`${post.categories.podcast_product.at(-1)?.name} ${
            post.metadata.podcast_episode
          }`}
        </p>
        <p className="podcast-title">{post.title}</p>
      </div>
      <AudioPlayer url={post.metadata.podcast_high} />
      <img src={post.metadata.feed_image.url} />
    </div>
  );
};

const AudioPlayer: FC<PropsWithChildren<{
  url: string;
}>> = ({ url }) => {
  return <audio src={url} controls autoPlay/>;
};
