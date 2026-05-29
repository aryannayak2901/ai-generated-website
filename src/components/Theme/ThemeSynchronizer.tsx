"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { useForm } from "@payloadcms/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { WEBSITE_COLOR_KEYS } from "./theme-presets";
import {
  parseCssOverrides,
  updateCssOverrides,
} from "../../globals/ThemeSettings/color-utils";

export const ThemeSynchronizer: React.FC = () => {
  const form = useForm();
  const [lastSyncTime, setLastSyncTime] = useState<string>("just now");
  const [pulseKey, setPulseKey] = useState<number>(0);

  // 1. Get raw form data in real time
  const formData = useMemo(() => {
    if (form && typeof form.getData === "function") {
      return form.getData();
    }
    return null;
  }, [form]);

  // 2. Loop-guard state tracking refs
  const lastState = useRef<{
    colors: Record<string, string>;
    radius: number | string;
    css: string;
  }>({
    colors: {},
    radius: 0.5,
    css: "",
  });

  // 3. Synchronization orchestrator
  useEffect(() => {
    if (!form || !formData) return;

    // Collect current values from form
    const currentColors: Record<string, string> = {};
    WEBSITE_COLOR_KEYS.forEach((key) => {
      if (formData[key] !== undefined) {
        currentColors[key] = formData[key] as string;
      }
      const darkKey = `${key}Dark`;
      if (formData[darkKey] !== undefined) {
        currentColors[darkKey] = formData[darkKey] as string;
      }
    });

    const currentRadius = formData.radius !== undefined ? formData.radius : 0.5;
    const currentCss = (formData.cssOverrides as string) || "";

    // Determine what has changed compared to last processed state
    let colorsChanged = false;
    if (currentRadius !== lastState.current.radius) {
      colorsChanged = true;
    } else {
      // Check if any color picker changed
      const allKeys = Array.from(
        new Set([
          ...Object.keys(currentColors),
          ...Object.keys(lastState.current.colors),
        ]),
      );
      for (const key of allKeys) {
        if (currentColors[key] !== lastState.current.colors[key]) {
          colorsChanged = true;
          break;
        }
      }
    }

    const cssChanged = currentCss !== lastState.current.css;

    const { dispatchFields } = form as any;

    // Real-time alignment workflow
    if (colorsChanged && !cssChanged) {
      // Pickers/sliders changed -> update CSS overrides
      const fields = { ...currentColors, radius: currentRadius };
      const updatedCss = updateCssOverrides(currentCss, fields);

      if (updatedCss !== currentCss) {
        lastState.current = {
          colors: currentColors,
          radius: currentRadius,
          css: updatedCss,
        };
        dispatchFields({
          type: "UPDATE",
          path: "cssOverrides",
          value: updatedCss,
        });
        setTimeout(() => {
          setPulseKey((prev) => prev + 1);
          setLastSyncTime(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          );
        }, 0);
      }
    } else if (cssChanged && !colorsChanged) {
      // CSS code editor changed -> parse and update pickers/sliders
      const parsedFields = parseCssOverrides(currentCss);

      let hasUpdatedAnyField = false;
      const nextColors = { ...lastState.current.colors };
      let nextRadius = lastState.current.radius;

      Object.entries(parsedFields).forEach(([field, parsedVal]) => {
        if (field === "radius") {
          if (formData.radius !== parsedVal) {
            dispatchFields({
              type: "UPDATE",
              path: "radius",
              value: parsedVal,
            });
            nextRadius = parsedVal;
            hasUpdatedAnyField = true;
          }
        } else {
          // It is a color field
          if (formData[field] !== parsedVal) {
            dispatchFields({ type: "UPDATE", path: field, value: parsedVal });
            nextColors[field] = parsedVal as string;
            hasUpdatedAnyField = true;
          }
        }
      });

      if (hasUpdatedAnyField) {
        lastState.current = {
          colors: nextColors,
          radius: nextRadius,
          css: currentCss,
        };
        setTimeout(() => {
          setPulseKey((prev) => prev + 1);
          setLastSyncTime(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          );
        }, 0);
      } else {
        lastState.current.css = currentCss;
      }
    } else {
      // Initial load or both updated simultaneously -> align refs to initial form state
      lastState.current = {
        colors: currentColors,
        radius: currentRadius,
        css: currentCss,
      };
    }
  }, [formData, form]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          margin: "0 0 24px 0",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "16px 24px",
            background: "rgba(15, 23, 41, 0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            overflow: "hidden",
          }}
        >
          {/* Subtle gold gradient background glow */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-10%",
              width: "120%",
              height: "200%",
              background:
                "radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              zIndex: 1,
            }}
          >
            {/* Spinning/pulsating gold badge */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4af37",
                boxShadow: "0 0 15px rgba(212, 175, 55, 0.15)",
              }}
            >
              <motion.div
                key={pulseKey}
                animate={{ rotate: [0, 18, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles size={18} />
              </motion.div>
            </div>

            <div>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Chambers Sync Engine Active
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                  }}
                  className="animate-pulse"
                />
              </h4>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontFamily: "Public Sans, sans-serif",
                  fontSize: "12px",
                  color: "#94a3b8",
                  lineHeight: "1.4",
                }}
              >
                Real-time bi-directional alignment of color presets, pickers,
                and website custom CSS overrides.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#d4af37",
              zIndex: 1,
            }}
          >
            <RefreshCw size={11} className="animate-spin-slow" />
            <span>Synced: {lastSyncTime}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSynchronizer;
