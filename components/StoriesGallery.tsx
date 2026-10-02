"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Story } from "@/lib/stories";
import StoryReader from "@/components/StoryReader";
import styles from "@/components/stories.module.css";

export type StoryOrigin = { left: number; top: number; width: number; height: number };

export default function StoriesGallery({ stories }: { stories: Story[] }) {
  const [selected, setSelected] = useState<{ story: Story; origin: StoryOrigin } | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1>STORIES</h1>
        <p>People &amp; Palantir</p>
      </div>
      <section aria-label="みんなのストーリー" className={styles.gallery}>
        <p className={styles.intro}>パランティアに惹かれた、それぞれの理由。</p>
        <div className={styles.grid}>
          {stories.map((story) => (
            <div key={story.slug} className={styles.cardWrap}>
              {story.decoration && (
                <div className={styles.peeker} aria-hidden="true">
                  <Image src={story.decoration} alt="" width={1152} height={1344} sizes="120px" className={styles.peekerImage} />
                </div>
              )}
              <button
                type="button"
                className={styles.card}
                aria-label={`${story.name}のストーリーを読む`}
                aria-haspopup="dialog"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
                  setSelected({ story, origin: { left, top, width, height } });
                }}
              >
                <span className={styles.profile}>
                  <Image src={story.avatar} alt="" width={88} height={88} sizes="88px" className={styles.avatar} />
                  <span><span className={styles.name}>{story.name}</span><span className={styles.handle}>{story.handle}</span></span>
                </span>
                <span className={styles.quote}>{story.quote}</span>
                <span className={styles.read}>READ STORY <span aria-hidden="true">→</span></span>
                {story.restingImage && <Image src={story.restingImage} alt="" width={120} height={120} sizes="120px" className={styles.resting} />}
              </button>
            </div>
          ))}
        </div>
        {stories.length === 0 && (
          <div className={styles.emptyWrap}>
            <div className={styles.emptyPeeker} aria-hidden="true">
              <Image src="/images/stories/decorations/paradog-peeking-fullbody-v1.png" alt="" width={1152} height={1344} sizes="128px" className={styles.peekerImage} />
            </div>
            <div className={styles.empty}>
              <p className={styles.emptyLabel}>COMING SOON</p>
              <h2>それぞれのストーリーを、ここに。</h2>
              <p>みなさんとパランティアの出会いや、惹かれた理由。<br />一人ひとりの言葉で、少しずつお届けしていきます。</p>
            </div>
          </div>
        )}
      </section>
      {selected && <StoryReader story={selected.story} origin={selected.origin} onClose={() => { setSelected(null); trigger.current?.focus(); }} />}
    </main>
  );
}
