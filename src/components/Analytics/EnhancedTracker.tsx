"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth, trackTimerThreshold } from "@/lib/analytics/events";

// Extend global window object with gtag typings
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type UserTier = "passive" | "active" | "highly_engaged";

const TIER_KEY = "ga_user_tier";
const CLICK_KEY = "ga_click_count";

/**
 * Safe local helper to set a custom dimension in Google Analytics.
 */
const setCustomDimension = (key: string, value: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("set", { [key]: value });
    // Also update any existing configurations if needed
    console.log(`[GA4 Tracker] Dimension Set - ${key}: ${value}`);
  }
};

/**
 * Retrieves the saved user tier from session storage.
 * Defaults to 'passive' if not set or if session storage is unavailable.
 */
const getSavedUserTier = (): UserTier => {
  if (typeof window === "undefined") return "passive";
  try {
    const saved = sessionStorage.getItem(TIER_KEY);
    if (saved === "passive" || saved === "active" || saved === "highly_engaged") {
      return saved;
    }
  } catch {
    // Session storage may be unavailable (e.g. private browsing or security block)
  }
  return "passive";
};

/**
 * Retrieves the current session click count from session storage.
 */
const getSavedClickCount = (): number => {
  if (typeof window === "undefined") return 0;
  try {
    const saved = sessionStorage.getItem(CLICK_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
  } catch {
    // Ignore
  }
  return 0;
};

/**
 * Upgrades the user tier if the new tier is higher in the progression hierarchy.
 * progression hierarchy: passive -> active -> highly_engaged
 */
const updateUserTier = (newTier: UserTier) => {
  const current = getSavedUserTier();
  const tierWeights: Record<UserTier, number> = {
    passive: 1,
    active: 2,
    highly_engaged: 3,
  };

  if (tierWeights[newTier] > tierWeights[current]) {
    try {
      sessionStorage.setItem(TIER_KEY, newTier);
    } catch {
      // Ignore
    }

    setCustomDimension("user_tier", newTier);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "user_tier_upgrade", {
        previous_tier: current,
        new_tier: newTier,
      });
    }
  }
};

/**
 * Derives the legal practice area from the given URL pathname.
 * E.g., '/practice-areas/corporate' -> 'corporate'
 */
const extractPracticeArea = (pathname: string): string => {
  if (pathname.startsWith("/practice-areas/")) {
    const parts = pathname.split("/");
    return parts[2] || "general";
  }
  return "none";
};

export function EnhancedTracker() {
  const pathname = usePathname();
  const firedMilestones = useRef<Set<number>>(new Set());

  // 1. Practice Area and User Tier tracking on route transitions
  useEffect(() => {
    // Set the practice_area custom dimension
    const practiceArea = extractPracticeArea(pathname);
    setCustomDimension("practice_area", practiceArea);

    // Initialize/set current user tier custom dimension for this page view
    const currentTier = getSavedUserTier();
    setCustomDimension("user_tier", currentTier);

    // Clear fired scroll depth milestones for the new page view
    firedMilestones.current.clear();
  }, [pathname]);

  // 2. Track Clicks and Form Submissions for User Tier Progression
  useEffect(() => {
    // Listen to document clicks for upgrading to 'active'
    const handleDocClick = () => {
      const clicks = getSavedClickCount() + 1;
      try {
        sessionStorage.setItem(CLICK_KEY, clicks.toString());
      } catch {
        // Ignore
      }

      if (clicks >= 3) {
        updateUserTier("active");
      }
    };

    // Listen to form submissions successful custom event for upgrading to 'highly_engaged'
    const handleFormSuccess = () => {
      updateUserTier("highly_engaged");
    };

    document.addEventListener("click", handleDocClick);
    window.addEventListener("form_submitted_success", handleFormSuccess);

    return () => {
      document.removeEventListener("click", handleDocClick);
      window.removeEventListener("form_submitted_success", handleFormSuccess);
    };
  }, []);

  // 3. Page Engagement Timers (30s, 60s, 180s)
  useEffect(() => {
    // 30 seconds timer: logs threshold and upgrades to active
    const timer30 = setTimeout(() => {
      trackTimerThreshold(30);
      updateUserTier("active");
    }, 30000);

    // 60 seconds timer: logs threshold
    const timer60 = setTimeout(() => {
      trackTimerThreshold(60);
    }, 60000);

    // 180 seconds (3 minutes) timer: logs threshold and upgrades to highly_engaged
    const timer180 = setTimeout(() => {
      trackTimerThreshold(180);
      updateUserTier("highly_engaged");
    }, 180000);

    return () => {
      clearTimeout(timer30);
      clearTimeout(timer60);
      clearTimeout(timer180);
    };
  }, [pathname]);

  // 4. Performance-optimized Scroll Depth tracking (25%, 50%, 75%, 100%)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          const docHeight = document.documentElement.scrollHeight - windowHeight;

          if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            const milestones = [25, 50, 75, 100];

            milestones.forEach((milestone) => {
              if (scrollPercent >= milestone && !firedMilestones.current.has(milestone)) {
                firedMilestones.current.add(milestone);
                trackScrollDepth(milestone);
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Fire initially to catch pre-scrolled pages or immediate 100% on extremely short pages
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}
