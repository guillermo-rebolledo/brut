import { useRef } from "react";
import { motion, useInView } from "motion/react";

type InViewSlideUpFadeProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  delay?: number;
};

export function InViewSlideUpFade({
  children,
  className,
  once = true,
  delay = 0.2,
}: InViewSlideUpFadeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 16, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
