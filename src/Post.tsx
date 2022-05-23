import { FC, PropsWithChildren, useRef, useState } from "react";
import { Podcast } from "./nerdcastResponse";
import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from "react-router-dom";

export const Post = React.forwardRef<HTMLDivElement, PropsWithChildren<{ post?: Podcast, enableLink?: boolean }>>
  (({ children, post, enableLink = true }, ref) => {

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
    const PostBody = (<div ref={ref} className="grid" >
      <Image src={post.thumbnails["img-16x9-1210x544"]} alt={post.slug} />
      {children}
      <div className="grid-content">
        <h4 style={{ color: "#3bb4b4" }}>{`${post.product_name} ${post.episode}`}</h4>
        <h3>{post.title}</h3>
        <h5 style={{ color: "#b4b4b4" }}>{`${post.product_name} • ${post.friendly_post_date} • ${post.friendly_post_time}`}</h5>
      </div>
    </div>);
    return <>
      {
        enableLink ?
          <Link to={`/${post.product}/${post.slug}`} className="link-style">
            {PostBody}
          </Link> : PostBody
      }
    </>
  }
  );

export const Image: FC<{ src: string, alt: string }> = (props) => {
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