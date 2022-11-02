import { FC, PropsWithChildren, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from "react-router-dom";
import { formatDuration, radomPercentil, } from "./utils";
import { PostProps } from "./Types";

export const Post: FC<PropsWithChildren<{ post?: PostProps, enableLink?: boolean, }>> =
  (({ children, post, enableLink = true }) => {

    if (!post) {
      return <div className="grid">
        <Skeleton height={"100%"} baseColor="#6d6d6d" highlightColor="#858585" containerClassName="grid-image" />
        <div className="grid-content--skeleton">
          <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(30, 50)} />
          <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(45, 80)} />
          <Skeleton baseColor="#434343" enableAnimation={false} width={radomPercentil(60, 75)} />
        </div>
      </div>
    }
    const body = (
      <div className="grid">
        <Image src={post.image} alt={post.slug} />
        {children}
        <div className="grid-content">
          <h4 style={{ color: "#3bb4b4" }}>{`${post.product_name} ${post.episode}`}</h4>
          <h3>{post.title}</h3>
          <h5 style={{ color: "#b4b4b4" }}>{format(post)}</h5>
        </div>
        <div className="post-description" dangerouslySetInnerHTML={{ __html: post.description }} />
      </div >
    );

    if (enableLink) {
      return (
        <Link to={`/${post.product}/${post.slug}/${post.id}`} className="link-style">
          {body}
        </Link>
      );
    }
    return <>{body}</>;
  }
  );

export const Image: FC<{ src: string, alt: string, }> = (props) => {
  const [show, setShow] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImg = () => setShow(true);
  return (
    <>
      {!show && <Skeleton
        baseColor="#6d6d6d"
        highlightColor="#858585"
        height={"100%"}
        containerClassName="grid-image loading"
      />}
      <img ref={imgRef} className={`grid-image ${show ? "visible" : "hidden"}`} onLoad={showImg} src={props.src} alt={props.alt} />
    </>
  )
}
function format(post: PostProps) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(post.published_at).toLocaleDateString(undefined, options);
  const time = formatDuration(post.duration);
  return `${post.product_name} • ${date} • ${time}`;
}

