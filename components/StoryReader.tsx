"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Story } from "@/lib/stories";
import type { StoryOrigin } from "@/components/StoriesGallery";
import styles from "@/components/stories.module.css";

export default function StoryReader({ story, origin, onClose }: { story: Story; origin: StoryOrigin; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    const rect = dialog.getBoundingClientRect();
    dialog.style.setProperty("--start-x", `${origin.left + origin.width / 2 - rect.left - rect.width / 2}px`);
    dialog.style.setProperty("--start-y", `${origin.top + origin.height / 2 - rect.top - rect.height / 2}px`);
    dialog.style.setProperty("--start-scale", `${Math.min(origin.width / rect.width, 0.8)}`);
    dialog.classList.add(styles.opening);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [origin]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.reader}
      aria-labelledby="story-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <button ref={closeRef} type="button" className={styles.close} aria-label="ストーリーを閉じる" onClick={onClose}>×</button>
      <article className={styles.readerContent}>
        <div className={styles.profile}>
          <Image src={story.avatar} alt="" width={88} height={88} sizes="88px" className={styles.avatar} />
          <div><p className={styles.name}>{story.name}</p><p className={styles.handle}>{story.handle}</p></div>
        </div>
        <h2 id="story-title" className={styles.readerTitle}>{story.title || story.quote}</h2>
        {story.introduction && <div className={styles.hostIntro}>
          <h3>ぱらどっぐからひとこと</h3>
          <p>{story.introduction}</p>
        </div>}
        <div className={styles.prose}>{story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <Image src={story.restingImage || "/images/paradog/fv/paradog-fv-07.png"} alt="" width={112} height={112} sizes="112px" className={styles.readerDog} />
      </article>
    </dialog>,
    document.body,
  );
}
