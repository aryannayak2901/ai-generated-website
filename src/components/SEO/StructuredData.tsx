import React from "react";

export interface StructuredDataProps {
  schema: Record<string, any>;
}

/**
 * Safely stringifies a JSON-LD schema object and sanitizes it to block
 * script injection risks (XSS). Encodes "<" and ">" characters to their
 * safe Unicode counterparts.
 */
export function safeJsonLdStringify(schema: Record<string, any>): string {
  const jsonStr = JSON.stringify(schema);
  // Prevent any XSS injection or early tag closures inside HTML script blocks
  return jsonStr.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

/**
 * StructuredData is a high-performance React component designed for
 * server-side or client-side rendering of structured data schemas.
 * 
 * Injecting this component automatically supplies search crawlers and AEO agents
 * with rich contextual knowledge panels and trace-related connection loops.
 */
export default function StructuredData({ schema }: StructuredDataProps) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLdStringify(schema),
      }}
    />
  );
}
