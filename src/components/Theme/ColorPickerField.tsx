"use client";

import React, { useCallback } from "react";
import { useField } from "@payloadcms/ui";
import { motion } from "framer-motion";

interface ColorPickerFieldProps {
  path: string;
  field: {
    label?: string;
    description?: string;
  };
}

// Curated professional swatches (subtle golds, deep slates, start whites, soft ambers)
const RECOMMENDED_SWATCHES = [
  "#0f1729", // Deep Navy
  "#ffffff", // Stark White
  "#d4af37", // Subtle Gold
  "#f8fafc", // Light Slate Surface
  "#1e293b", // Medium Slate
  "#64748b", // Muted Gray
  "#ef4444", // Destructive Red
  "#064e3b", // Emerald Green
  "#7f1d1d", // Crimson Red
  "#d97706", // Warm Amber
];

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ path, field }) => {
  const { value = "", setValue } = useField<string>({ path });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const handleSwatchClick = useCallback(
    (color: string) => {
      setValue(color);
    },
    [setValue]
  );

  // Validate if it is a valid hex color
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);

  return (
    <div 
      className="color-picker-field-container"
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
          marginBottom: "8px" 
        }}
      >
        <label 
          className="field-label"
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            color: "#f1f5f9",
            margin: 0
          }}
        >
          {field.label || path}
        </label>
        
        {value && (
          <span 
            className="hex-badge"
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: isValidHex ? "#d4af37" : "#ef4444",
              background: "rgba(212, 175, 55, 0.1)",
              padding: "2px 8px",
              borderRadius: "4px",
              border: `1px solid ${isValidHex ? "rgba(212, 175, 55, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
            }}
          >
            {value}
          </span>
        )}
      </div>

      {field.description && (
        <p 
          className="field-description"
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginTop: "0px",
            marginBottom: "12px",
            lineHeight: "1.4"
          }}
        >
          {field.description}
        </p>
      )}

      <div 
        className="input-row"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center"
        }}
      >
        {/* Color preview circle that acts as picker activator */}
        <div 
          className="color-preview-wrapper"
          style={{
            position: "relative",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            cursor: "pointer",
            flexShrink: 0,
            background: value || "#ffffff",
            transition: "transform 0.2s"
          }}
        >
          <input
            type="color"
            value={isValidHex ? value : "#ffffff"}
            onChange={handleChange}
            style={{
              position: "absolute",
              top: "-5px",
              left: "-5px",
              width: "52px",
              height: "52px",
              opacity: 0,
              cursor: "pointer",
            }}
          />
          {/* Subtle inner shadow overlay */}
          <div 
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text Input */}
        <div style={{ flexGrow: 1, position: "relative" }}>
          <input
            type="text"
            placeholder="#FFFFFF"
            value={value}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "42px",
              padding: "0 12px 0 12px",
              background: "rgba(15, 23, 41, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "#ffffff",
              fontFamily: "monospace",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#d4af37";
              e.target.style.boxShadow = "0 0 0 2px rgba(212, 175, 55, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Suggested Swatches Row */}
      <div 
        className="swatches-container"
        style={{
          marginTop: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        {RECOMMENDED_SWATCHES.map((color) => (
          <motion.button
            key={color}
            type="button"
            onClick={() => handleSwatchClick(color)}
            whileHover={{ scale: 1.15, y: -1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "4px",
              background: color,
              border: color.toLowerCase() === "#ffffff" ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: 0,
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPickerField;
