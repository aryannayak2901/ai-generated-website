import React from 'react';

export interface LexicalNode {
  type: string;
  tag?: string;
  format?: number;
  text?: string;
  children?: LexicalNode[];
  listType?: 'bullet' | 'number';
  indent?: number;
}

export interface LexicalContent {
  root: {
    children: LexicalNode[];
  };
}

export function LexicalRenderer({ content }: { content: any }) {
  if (!content) return null;

  // If content is just a string, render it as a paragraph
  if (typeof content === 'string') {
    return <p className="mb-6 text-slate-700 leading-relaxed text-lg">{content}</p>;
  }

  // If it's a Lexical structure
  const root = content.root;
  if (!root || !root.children) return null;

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.type === 'text') {
      const text = node.text || '';
      if (!text) return null;

      let element: React.ReactNode = text;

      const format = node.format || 0;
      const isBold = (format & 1) === 1;
      const isItalic = (format & 2) === 2;
      const isStrikethrough = (format & 4) === 4;
      const isUnderline = (format & 8) === 8;
      const isCode = (format & 16) === 16;

      if (isBold) element = <strong className="font-bold">{element}</strong>;
      if (isItalic) element = <em className="italic">{element}</em>;
      if (isUnderline) element = <span className="underline">{element}</span>;
      if (isStrikethrough) element = <span className="line-through">{element}</span>;
      if (isCode) element = <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-sm">{element}</code>;

      return <span key={index}>{element}</span>;
    }

    // Handle child nodes recursively
    const renderedChildren = node.children
      ? node.children.map((child, childIdx) => renderNode(child, childIdx))
      : null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-6 text-slate-700 leading-relaxed text-lg">
            {renderedChildren}
          </p>
        );
      case 'heading':
        const headingTag = node.tag || 'h2';
        const classes: Record<string, string> = {
          h1: "text-4xl md:text-5xl font-serif font-bold text-navy-primary mt-12 mb-6 tracking-tight",
          h2: "text-2xl md:text-3xl font-serif font-bold text-navy-primary mt-10 mb-5 tracking-tight border-b border-slate-100 pb-2",
          h3: "text-xl md:text-2xl font-serif font-bold text-navy-primary mt-8 mb-4",
          h4: "text-lg md:text-xl font-serif font-bold text-navy-primary mt-6 mb-3",
          h5: "text-md md:text-lg font-serif font-bold text-navy-primary mt-4 mb-2",
        };
        const HeadingComp = headingTag as any;
        return (
          <HeadingComp key={index} className={classes[headingTag] || classes.h2}>
            {renderedChildren}
          </HeadingComp>
        );
      case 'list':
        const isOrdered = node.listType === 'number';
        if (isOrdered) {
          return (
            <ol key={index} className="list-decimal pl-6 mb-6 text-slate-700 text-lg space-y-2">
              {renderedChildren}
            </ol>
          );
        } else {
          return (
            <ul key={index} className="list-disc pl-6 mb-6 text-slate-700 text-lg space-y-2">
              {renderedChildren}
            </ul>
          );
        }
      case 'listitem':
        return <li key={index} className="pl-1">{renderedChildren}</li>;
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gold-accent bg-slate-50/50 p-6 my-8 rounded-r-lg italic text-navy-primary text-xl font-serif">
            {renderedChildren}
          </blockquote>
        );
      default:
        // Fallback for custom or unhandled block types
        return <div key={index} className="mb-4">{renderedChildren}</div>;
    }
  };

  return <div className="lexical-content">{root.children.map((node: any, idx: number) => renderNode(node, idx))}</div>;
}
