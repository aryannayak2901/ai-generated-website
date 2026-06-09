"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Media } from "@/payload-types";

export interface ProductListProps {
  title?: string;
  subtitle?: string;
  products?:
    | {
        name: string;
        description: string;
        image?: string | Media;
        link?: string;
        id?: string | null;
      }[]
    | null;
}

export function ProductList({
  title = "Our Legal Services",
  subtitle = "Comprehensive legal solutions tailored to your unique needs and objectives.",
  products,
}: ProductListProps) {
  const resolvedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    return products
      .map((product) => {
        if (!product || !product.image) return null;
        const imageUrl =
          typeof product.image === "object" && product.image.url
            ? product.image.url
            : typeof product.image === "string"
              ? product.image
              : "";
        const imageAlt =
          typeof product.image === "object" && product.image.alt
            ? product.image.alt
            : product.name;
        return {
          ...product,
          imageUrl,
          imageAlt,
        };
      })
      .filter(
        (product):
          product is {
            name: string;
            description: string;
            link?: string;
            imageUrl: string;
            imageAlt: string;
          } =>
          !!product &&
          !!product.imageUrl &&
          (product.imageUrl.startsWith("/") ||
            product.imageUrl.startsWith("http://") ||
            product.imageUrl.startsWith("https://")),
      );
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full py-24 lg:py-32 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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

        {resolvedProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {resolvedProducts.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group bg-light-slate-surface rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl lg:text-2xl font-bold text-charcoal mb-3 group-hover:text-gold-accent transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm lg:text-base text-slate-gray leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>
                  {product.link && (
                    <Link
                      href={product.link}
                      className="inline-flex items-center gap-2 text-gold-accent font-semibold text-sm uppercase tracking-wider hover:text-primary transition-colors duration-300"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <p className="text-slate-gray text-lg">No products available at this time.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}