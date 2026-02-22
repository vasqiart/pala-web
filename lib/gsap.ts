/**
 * GSAP + ScrollTrigger 共通ヘルパ
 * クライアントでのみ使用。ScrollTrigger は gsap.registerPlugin で登録すること。
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
