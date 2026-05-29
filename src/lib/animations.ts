/**
 * Animation Variants & Configurations
 * Framer Motion variants and GSAP configurations for consistent animations
 * across the application (page transitions, scroll effects, hover states)
 */

import { Variants } from "framer-motion";

// ============================================================================
// FRAMER MOTION VARIANTS
// ============================================================================

/**
 * Fade In Animation
 * Simple opacity transition for entrance effects
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Slide Up Animation
 * Element slides up and fades in from bottom
 */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Slide Left Animation
 * Element slides left and fades in from right
 */
export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Slide Right Animation
 * Element slides right and fades in from left
 */
export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Scale Up Animation
 * Element scales up and fades in
 */
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/**
 * Stagger Container
 * Parent container for staggering children animations
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger Item
 * Child item for use with stagger container
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

/**
 * Hover Scale
 * Subtle scale on hover for interactive elements
 */
export const hoverScaleVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
};

/**
 * Hover Lift
 * Subtle lift on hover (transform + shadow elevation)
 */
export const hoverLiftVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -4 },
};

/**
 * Rotate On Hover
 * Subtle rotation on hover
 */
export const rotateVariants: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: 2 },
};

// ============================================================================
// GSAP CONFIGURATIONS
// ============================================================================

/**
 * Scroll Reveal Configuration
 * Settings for GSAP ScrollTrigger fade-in effects
 */
export const scrollRevealConfig = {
  trigger: "",
  start: "top 80%",
  end: "top 50%",
  scrub: false,
  markers: false,
};

/**
 * Parallax Configuration
 * Settings for GSAP parallax scroll effects
 */
export const parallaxConfig = {
  factor: 0.5, // Adjust for parallax intensity (0.3-0.8)
};

/**
 * Scroll Timeline Configuration
 * Settings for scroll-linked animations
 */
export const scrollTimelineConfig = {
  start: "top center",
  end: "bottom center",
  scrub: 0.5, // Smooth scrubbing
  markers: false,
};

// ============================================================================
// ANIMATION TIMING CONSTANTS
// ============================================================================

export const animationDurations = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  slower: 0.8,
};

export const animationDelays = {
  xs: 0.05,
  sm: 0.1,
  md: 0.15,
  lg: 0.2,
  xl: 0.3,
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easing = {
  linear: "linear",
  easeIn: "easeIn",
  easeOut: "easeOut",
  easeInOut: "easeInOut",
  circIn: "circIn",
  circOut: "circOut",
  circInOut: "circInOut",
  backIn: "backIn",
  backOut: "backOut",
  backInOut: "backInOut",
  anticipate: "anticipate",
};

// ============================================================================
// PAGE TRANSITION ANIMATIONS
// ============================================================================

/**
 * Page Exit Animation
 * Fade out and slight zoom for page exits
 */
export const pageExitVariants: Variants = {
  initial: { opacity: 1, scale: 1 },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3 },
  },
};

/**
 * Page Enter Animation
 * Fade in and slight zoom for page enters
 */
export const pageEnterVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};
