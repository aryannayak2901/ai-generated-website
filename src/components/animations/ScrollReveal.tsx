"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: directionOffset[direction].x,
        y: directionOffset[direction].y,
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : directionOffset[direction].x,
        y: isInView ? 0 : directionOffset[direction].y,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
