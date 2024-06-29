import { FC, PropsWithChildren, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { formatDuration, radomPercentil } from "./utils";
import { PostProps } from "./Types";
import React from "react";
import { Podcast } from "./EpisodesFeedResponse";

export const Post: FC<PropsWithChildren<{
  post?: PostProps;
  enableLink?: boolean;
  onClick?: (post: Podcast) => void;
}>> = React.memo(({ children, post, enableLink = true, onClick }) => {
  if (!post) {
    return (
      <div className="grid">
        <Skeleton
          height={"100%"}
          baseColor="#6d6d6d"
          highlightColor="#858585"
          containerClassName="grid-image"
        />
        <div className="grid-content--skeleton">
          <Skeleton
            baseColor="#434343"
            enableAnimation={false}
            width={radomPercentil(30, 50)}
          />
          <Skeleton
            baseColor="#434343"
            enableAnimation={false}
            width={radomPercentil(45, 80)}
          />
          <Skeleton
            baseColor="#434343"
            enableAnimation={false}
            width={radomPercentil(60, 75)}
          />
        </div>
      </div>
    );
  }
  const Body = () => (
    <div className="grid" onClick={() => onClick && onClick(post)}>
      <Image src={post.metadata.feed_image.url} alt={post.slug} />
      {children}
      <div className="grid-content">
        <h4 style={{ color: "#3bb4b4" }}>{`${
          post.categories.podcast_product.at(-1)?.name
        } ${post.metadata.podcast_episode}`}</h4>
        <h3>{post.title}</h3>
        <h5 style={{ color: "#b4b4b4" }}>{format(post)}</h5>
      </div>
      {/* <div
        className="post-description"
        dangerouslySetInnerHTML={{ __html: post.content.formated }}
      /> */}
    </div>
  );

  // if (enableLink) {
  //   return (
  //     <Link to={`/${post.product}/${post.slug}/${post.id}`} className="link-style">
  //       <Body />
  //     </Link>
  //   );
  // }
  return <Body />;
});

export const Image: FC<{ src: string; alt: string }> = (props) => {
  const [show, setShow] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImg = () => setShow(true);
  return (
    <>
      {!show && (
        <Skeleton
          baseColor="#6d6d6d"
          highlightColor="#858585"
          height={"100%"}
          containerClassName="grid-image loading"
        />
      )}
      <img
        ref={imgRef}
        className={`grid-image ${show ? "visible" : "hidden"}`}
        onLoad={showImg}
        src={props.src}
        alt={props.alt}
      />
    </>
  );
};
function format(post: PostProps) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(post.date).toLocaleDateString(undefined, options);
  const time = formatDuration(post.metadata.podcast_duration);
  return `${date} • ${time}`;
}
