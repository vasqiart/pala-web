"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  size?: string;
  className?: string;
};

export default function MobileButtonDogIcon({
  src,
  alt = "",
  size,
  className = "",
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={28}
      height={28}
      className={`${size ?? "h-7 w-auto"} ${className}`.trim()}
    />
  );
}
