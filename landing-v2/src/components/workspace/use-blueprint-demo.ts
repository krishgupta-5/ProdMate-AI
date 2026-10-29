"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { artifacts, heroIdeas } from "@/content/landing";

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, readMotion, () => false);
}

/**
 * Scenes of the hero session, in order. Each scene has a duration; scenes with ticks advance a
 * sub counter (typed characters, generated files) before moving on.
 */
export const SCENES = [
  "typing", // prompt types into the composer
  "send", // send button pressed
  "think-docs", // user bubble, "Generating Project Documentation"
  "docs", // README.md card and the System Config chip
  "chip", // chip pressed
  "think-config", // "Generating System Configuration"
  "config", // system-config.yaml card
  "batch", // the remaining files tick in one by one
  "final", // final-spec.md with export buttons
  "export", // GitHub export running
  "done", // exported, hold, then loop
] as const;

export type Scene = (typeof SCENES)[number];

/** Files the batch card generates after README.md and system-config.yaml. */
export const batchFiles = artifacts.filter(
  (a) => a.id !== "markdown" && a.id !== "config" && a.id !== "finalMarkdown",
);

const TYPE_MS = 26;
const BATCH_MS = 300;
const HOLD: Record<Scene, number> = {
  typing: 0,
  send: 520,
  "think-docs": 1600,
  docs: 2600,
  chip: 900,
  "think-config": 1300,
  config: 2600,
  batch: 0,
  final: 1700,
  export: 1500,
  done: 3600,
};

/**
 * Drives the hero chat session: type an idea, send it, stream README.md and system-config.yaml,
 * batch the remaining files, consolidate final-spec.md and export to GitHub. Loops while `active`;
 * pauses off screen. Reduced motion shows the finished session.
 */
export function useSessionDemo(active = true) {
  const reduce = useReducedMotion();
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);

  const idea = heroIdeas[ideaIndex];
  const scene = SCENES[index];

  useEffect(() => {
    if (reduce || !active) return;
    let delay = HOLD[scene];
    let next: () => void = () => {
      setIndex((i) => i + 1);
      setSub(0);
    };
    if (scene === "typing" && sub < idea.length) {
      delay = TYPE_MS;
      next = () => setSub((n) => n + 1);
    } else if (scene === "batch" && sub < batchFiles.length) {
      delay = BATCH_MS;
      next = () => setSub((n) => n + 1);
    } else if (scene === "done") {
      next = () => {
        setIdeaIndex((i) => (i + 1) % heroIdeas.length);
        setIndex(0);
        setSub(0);
      };
    } else if (scene === "typing" || scene === "batch") {
      delay = 380;
    }
    const timer = setTimeout(next, delay);
    return () => clearTimeout(timer);
  }, [reduce, active, scene, sub, idea.length]);

  if (reduce) {
    return { idea, scene: "done" as Scene, at: SCENES.length - 1, sub: batchFiles.length };
  }
  return { idea, scene, at: index, sub };
}

/** Index of a scene, for "has the session reached this point" checks. */
export const sceneAt = (scene: Scene) => SCENES.indexOf(scene);

/** Cycles through a list of phrases while mounted. */
export function useCycle(length: number, ms: number, active = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setI((n) => (n + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, active]);
  return i;
}

/** Greeting by local time. Renders a neutral greeting on the server to keep hydration stable. */
const noop = () => () => {};
function readGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
export function useGreeting() {
  return useSyncExternalStore(noop, readGreeting, () => "Welcome back");
}
