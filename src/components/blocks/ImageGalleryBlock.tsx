"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ImageGalleryBlockProps {
  blockType?: "imageGalleryBlock";
  title?: string;
  subtitle?: string;
  images?:
    | {
        image: string;
        caption?: string;
        id?: string | null;
      }[]
    | null;
  columns?: number;
}

export function ImageGalleryBlock({
  title = "Our Legal Chambers",
  subtitle = "A glimpse into our professional environment and distinguished cases",
  images,
  columns = 3,
}: ImageGalleryBlockProps) {
  const resolvedImages = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    return images
      .map((item) => {
        if (!item || !item.image) return null;
        const url = typeof item.image === "string" ? item.image : "";
        const caption = item.caption || "";
        return { url, caption };
      })
      .filter(
        (item): item is { url: string; caption: string } =>
          !!item &&
          !!item.url &&
          (item.url.startsWith("/") ||
            item.url.startsWith("http://") ||
            item.url.startsWith("https://")),
      );
  }, [images]);

  const getGridCols = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <section className="w-full bg-white py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-gray max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Image Grid */}
        {resolvedImages.length > 0 ? (
          <div className={`grid ${getGridCols()} gap-6 lg:gap-8`}>
            {resolvedImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group relative overflow-hidden rounded-lg bg-light-slate shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={img.url}
                    alt={img.caption || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Caption */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-sans text-sm lg:text-base font-medium">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Fallback when no images */
          <div className="flex items-center justify-center py-20 lg:py-28">
            <p className="text-slate-gray text-lg">No images available in gallery</p>
          </div>
        )}
      </div>
    </section>
  );
}