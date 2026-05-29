"use client";

import { trackEvent as baseTrackEvent } from "@/components/GoogleAnalyticsTracker";

/**
 * Safe local helper to invoke gtag with fallback to baseTrackEvent
 */
function safeGtag(action: string, eventName: string, params: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag(action, eventName, params);
  } else {
    // Fall back to the central baseTrackEvent utility
    baseTrackEvent(eventName, params);
  }
}

/**
 * Triggers a GA4 select_content or cta_click event with parameters.
 * @param ctaName The name or identifier of the clicked call-to-action (CTA).
 * @param ctaLocation The location or section of the page containing the CTA.
 */
export function trackCTAClick(ctaName: string, ctaLocation: string): void {
  safeGtag("event", "cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });

  // Trigger standard GA4 select_content event
  safeGtag("event", "select_content", {
    content_type: "cta",
    item_id: ctaName,
    location_id: ctaLocation,
  });
}

/**
 * Triggers a standard generate_lead or custom form_submission event.
 * @param formId The HTML ID or unique identifier of the form.
 * @param formName The user-friendly name of the form.
 * @param status The status of the submission ('success' | 'failure').
 */
export function trackFormSubmission(
  formId: string,
  formName: string,
  status: "success" | "failure"
): void {
  safeGtag("event", "form_submission", {
    form_id: formId,
    form_name: formName,
    status: status,
  });

  if (status === "success") {
    // Trigger standard GA4 generate_lead event on successful conversion
    safeGtag("event", "generate_lead", {
      form_id: formId,
      form_name: formName,
      value: 1.0,
      currency: "INR",
    });

    // Dispatch a client-side CustomEvent to notify the EnhancedTracker to upgrade user tier
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("form_submitted_success", {
          detail: { formId, formName },
        })
      );
    }
  }
}

/**
 * Triggers a custom scroll_depth event for dynamic scroll tracking milestones.
 * @param depthPercent The percentage scroll milestone reached (e.g. 25, 50, 75, 100).
 */
export function trackScrollDepth(depthPercent: number): void {
  safeGtag("event", "scroll_depth", {
    depth_percent: depthPercent,
  });
}

/**
 * Triggers a custom engagement_timer event when specific page engagement durations are hit.
 * @param seconds The threshold in seconds reached (e.g. 30, 60, 180).
 */
export function trackTimerThreshold(seconds: number): void {
  safeGtag("event", "engagement_timer", {
    seconds_elapsed: seconds,
  });
}
