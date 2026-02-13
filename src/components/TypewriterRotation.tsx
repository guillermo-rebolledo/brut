import { motion } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";

type TypewriterRotationProps = {
  phrases: string[];
  everyMs?: number; // how long to wait AFTER fully typing before switching
  typeMs?: number; // delay per typed character
  deleteMs?: number; // delay per deleted character
  pauseAfterTypeMs?: number; // extra pause at end of typing (defaults to everyMs)
  pauseAfterDeleteMs?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
};

export function TypewriterRotation({
  phrases,
  everyMs = 1400,
  typeMs = 45,
  deleteMs = 30,
  pauseAfterTypeMs,
  pauseAfterDeleteMs = 250,
  loop = true,
  cursor = true,
  className,
}: TypewriterRotationProps) {
  const safe = phrases.filter(Boolean);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const current = safe[phraseIndex] ?? "";
  const pauseType = pauseAfterTypeMs ?? everyMs;
  const longestPhrase =
    safe.length > 0
      ? safe.reduce((a, b) => (a.length >= b.length ? a : b), "")
      : "";

  useEffect(() => {
    if (safe.length === 0) return;

    let timeoutId: number;

    // Finished typing -> wait, then start deleting
    if (!isDeleting && text === current) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), pauseType);
      return () => window.clearTimeout(timeoutId);
    }

    // Finished deleting -> wait, then move to next phrase and start typing
    if (isDeleting && text === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((i) => {
          const next = i + 1;
          if (next >= safe.length) return loop ? 0 : i;
          return next;
        });
      }, pauseAfterDeleteMs);

      return () => window.clearTimeout(timeoutId);
    }

    // Tick: add/remove one character
    timeoutId = window.setTimeout(
      () => {
        const next = isDeleting
          ? current.slice(0, Math.max(0, text.length - 1))
          : current.slice(0, text.length + 1);

        setText(next);
      },
      isDeleting ? deleteMs : typeMs,
    );

    return () => window.clearTimeout(timeoutId);
  }, [
    safe.length,
    current,
    text,
    isDeleting,
    typeMs,
    deleteMs,
    pauseType,
    pauseAfterDeleteMs,
    loop,
  ]);

  return (
    <span className={clsx("relative block w-full", className)}>
      {/* Invisible placeholder reserves space for longest phrase to prevent layout shift when wrapping */}
      <span aria-hidden="true" className="block invisible">
        {longestPhrase}
      </span>
      <span
        aria-live="polite"
        className="absolute left-0 top-0 w-full inline"
      >
        {text}
        {cursor && (
          <motion.span
            aria-hidden="true"
            className="inline-block text-cursor align-baseline"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          >
            |
          </motion.span>
        )}
      </span>
    </span>
  );
}
