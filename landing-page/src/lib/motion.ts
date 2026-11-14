/** Shared motion: one ease-out curve, short durations, nothing bouncy. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades a piece up into place when it appears, and out when it leaves. */
export const appear = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: EASE },
};
