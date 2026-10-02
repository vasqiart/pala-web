"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import type { Story } from "@/lib/stories";
import StoryReader from "@/components/StoryReader";
import styles from "@/components/stories.module.css";

function Paw() {
  return <svg className={styles.paw} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="5" cy="9" rx="2.4" ry="3.2" transform="rotate(-25 5 9)" /><ellipse cx="10" cy="5" rx="2.3" ry="3" /><ellipse cx="16" cy="5.5" rx="2.3" ry="3" transform="rotate(15 16 5.5)" /><ellipse cx="21" cy="10" rx="2.2" ry="3" transform="rotate(30 21 10)" /><path d="M6.5 16c1.6-2.4 2.6-5 5.5-5s4 2.7 5.7 5.1c1.4 2.1 1 5-1.7 5-1.5 0-2.5-.8-4-.8s-2.6.8-4.1.8c-2.7 0-2.8-3-1.4-5.1Z" /></svg>;
}

export type StoryOrigin = { left: number; top: number; width: number; height: number };

export default function StoriesGallery({ stories, readerDecorations }: { stories: Story[]; readerDecorations: string[] }) {
  const [selected, setSelected] = useState<{ story: Story; origin: StoryOrigin; readerDecoration?: string } | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1>STORIES</h1>
        <p>People &amp; Palantir</p>
      </div>
      <section aria-label="みんなのストーリー" className={styles.gallery}>
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
                style={{ "--story-accent": story.quoteUnderlineColor ?? "#9ca3af" } as CSSProperties}
                aria-label={`${story.name}のストーリーを読む`}
                aria-haspopup="dialog"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
                  setSelected({ story, origin: { left, top, width, height }, readerDecoration: story.readerDecoration ?? (readerDecorations.length ? readerDecorations[Math.floor(Math.random() * readerDecorations.length)] : undefined) });
                }}
              >
                <span className={styles.profile}>
                  <Image src={story.avatar} alt="" width={88} height={88} sizes="88px" className={styles.avatar} />
                  <span><span className={styles.name}>{story.name}</span><span className={styles.handle}>{story.handle}</span></span>
                </span>
                {story.quote && <span className={styles.quote}><span className={styles.quoteGroup}><Paw /><span className={styles.quoteTitle}>{story.quote}</span><Paw /></span></span>}
                <span className={styles.read}>READ STORY <span aria-hidden="true">→</span></span>
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
      {selected && <StoryReader story={selected.story} origin={selected.origin} decoration={selected.readerDecoration} onClose={() => { setSelected(null); trigger.current?.focus(); }} />}
    </main>
  );
}
