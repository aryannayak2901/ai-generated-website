"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { trackEvent } from "@/components/GoogleAnalyticsTracker";

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const hasAccepted = localStorage.getItem(
        "chambers_bhatt_disclaimer_accepted",
      );
      if (!hasAccepted) {
        setIsOpen(true);
      }
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("chambers_bhatt_disclaimer_accepted", "true");
    trackEvent("disclaimer_accepted", {
      accepted_at: new Date().toISOString(),
    });
    setIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl mx-auto rounded-md shadow-2xl p-8 border border-slate-200 bg-white">
        <AlertDialogHeader className="mb-4 space-y-3">
          <AlertDialogTitle className="text-2xl font-bold text-foreground tracking-tight font-serif">
            Important Legal Disclaimer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed text-base">
            As per the rules of the Bar Council of India, we are not permitted
            to solicit work and advertise. By clicking &quot;I Agree&quot;, the
            user acknowledges there has been no advertisement, personal
            communication, solicitation, invitation or inducement of any sort
            whatsoever from us or any of our members to solicit any work through
            this website.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={handleAccept}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/85 transition-all duration-300 font-semibold tracking-wide rounded-sm px-8 py-2.5 shadow-sm"
          >
            I Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
