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

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(
      "chambers_bhatt_disclaimer_accepted",
    );
    if (!hasAccepted) {
      setIsOpen(true);
    }
    setIsMounted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("chambers_bhatt_disclaimer_accepted", "true");
    setIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl mx-auto rounded-md shadow-2xl p-8 border border-slate-200 dark:border-white/10 bg-white dark:bg-navy">
        <AlertDialogHeader className="mb-4 space-y-3">
          <AlertDialogTitle className="text-2xl font-bold text-navy dark:text-white tracking-tight font-display">
            Important Legal Disclaimer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-gray dark:text-slate-gray/80 leading-relaxed text-base">
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
            className="w-full sm:w-auto bg-gold text-white hover:bg-gold/90 transition-all duration-300 font-bold tracking-wide rounded-sm px-8 py-2.5 shadow-sm"
          >
            I Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
