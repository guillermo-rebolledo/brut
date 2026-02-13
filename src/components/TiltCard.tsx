import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

export function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0); // [-0.5 .. 0.5]
  const y = useMotionValue(0);
  const hover = useMotionValue(0); // 0/1

  // Tilt (deg)
  const rotateY = useTransform(x, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(y, [-0.5, 0.5], [14, -14]);

  // Smooth it
  const rX = useSpring(rotateX, { stiffness: 260, damping: 20 });
  const rY = useSpring(rotateY, { stiffness: 260, damping: 20 });

  // Scale & lift on hover
  const scale = useSpring(useTransform(hover, [0, 1], [1, 1.03]), {
    stiffness: 320,
    damping: 22,
  });
  const z = useSpring(useTransform(hover, [0, 1], [0, 18]), {
    stiffness: 320,
    damping: 22,
  });

  // Cursor-following glare
  const glareX = useTransform(x, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["15%", "85%"]);
  const glareOpacity = useTransform(hover, [0, 1], [0, 1]);
  const glareBg = useMotionTemplate`radial-gradient(650px circle at ${glareX} ${glareY},
      rgba(255,255,255,0.22),
      rgba(255,255,255,0.08) 25%,
      transparent 45%)`;

  // Subtle border highlight that wakes up on hover
  const borderOpacity = useTransform(hover, [0, 1], [0.25, 0.75]);
  const borderBg = useMotionTemplate`radial-gradient(500px circle at ${glareX} ${glareY},
      rgba(255,255,255,0.35),
      transparent 55%)`;

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    x.set(nx);
    y.set(ny);
  }

  function onEnter() {
    hover.set(1);
  }

  function onLeave() {
    hover.set(0);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="relative size-fit rounded-full shadow-2xl transform-3d perspective[900px]"
      style={{
        rotateX: rX,
        rotateY: rY,
        scale,
        translateZ: z,
      }}
    >
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ opacity: glareOpacity, background: glareBg }}
      />

      {/* Content */}
      {children}
    </motion.div>
  );
}
