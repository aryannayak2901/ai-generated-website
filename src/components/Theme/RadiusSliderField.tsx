"use client";

import React, { useCallback } from "react";
import { useField } from "@payloadcms/ui";
import { motion } from "framer-motion";

interface RadiusSliderFieldProps {
  path: string;
  field: {
    label?: string;
    description?: string;
  };
}

export const RadiusSliderField: React.FC<RadiusSliderFieldProps> = ({ path, field }) => {
  const { value = 0.375, setValue } = useField<number>({ path });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedValue = parseFloat(e.target.value);
      setValue(isNaN(parsedValue) ? 0.375 : parsedValue);
    },
    [setValue]
  );

  // Return a friendly text description of the selected radius
  const getRadiusLabel = (r: number) => {
    if (r <= 0) return "Sharp (0px)";
    if (r <= 0.125) return "Subtle (2px)";
    if (r <= 0.25) return "Small (4px)";
    if (r <= 0.375) return "Medium (6px)";
    if (r <= 0.5) return "Regular (8px)";
    if (r <= 0.75) return "Large (12px)";
    if (r <= 1.0) return "Extra Large (16px)";
    return "Pill / Full";
  };

  return (
    <div
      className="radius-slider-field-container"
      style={{
        marginBottom: "20px",
        padding: "16px",
        background: "rgba(255, 255, 255, 0.02)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)",
      }}
    >
      <div
        className="field-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <label
          className="field-label"
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          {field.label || path}
        </label>

        <span
          className="radius-badge"
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#d4af37",
            background: "rgba(212, 175, 55, 0.1)",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          {value}rem
        </span>
      </div>

      {field.description && (
        <p
          className="field-description"
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginTop: "0px",
            marginBottom: "12px",
            lineHeight: "1.4",
          }}
        >
          {field.description}
        </p>
      )}

      {/* Main slider and visual preview container */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginTop: "12px",
        }}
      >
        {/* Slider Input */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.0625"
            value={value}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              outline: "none",
              cursor: "pointer",
              accentColor: "#d4af37",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b",
              fontFamily: "sans-serif",
            }}
          >
            <span>Sharp (0rem)</span>
            <span style={{ color: "#d4af37", fontWeight: 500 }}>{getRadiusLabel(value)}</span>
            <span>Full (1.5rem)</span>
          </div>
        </div>

        {/* Live Visual Preview Shape */}
        <div
          style={{
            width: "56px",
            height: "56px",
            background: "rgba(212, 175, 55, 0.08)",
            border: "2px solid #d4af37",
            borderRadius: `${value}rem`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "border-radius 0.15s ease",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "1.5px dashed rgba(212, 175, 55, 0.4)",
              borderRadius: `calc(${value}rem * 0.6)`,
              transition: "border-radius 0.15s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RadiusSliderField;
