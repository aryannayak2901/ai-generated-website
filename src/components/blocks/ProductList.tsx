"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Media } from "@/payload-types";

export interface ProductListProps {
  title?: string;
  subtitle?: string;
  products?:
    | {
        id?: string | null;
        image: string | Media;
        title: string;
        description: string;
        ctaText?: string;
        ctaLink?: string;
      }[]
    | null;
}

export function ProductList({
  title = "Our Legal Services",
  subtitle = "Comprehensive legal solutions tailored to your unique needs",
  products,
}: ProductListProps) {
  const resolvedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.map((product, index) => {
      const imageUrl = typeof product.image === "object" && product.image?.url ? product.image.url : typeof product.image === "string" ? product.image : "";
      const imageAlt = typeof product.image === "object" && product.image?.alt ? product.image.alt : product.title || "Legal Service";
      return {
        id: product.id || `product-${index}`,
        imageUrl,
        imageAlt,
        title: product.title || "Service Title",
        description: product.description || "Service description",
        ctaText: product.ctaText || "Learn More",
        ctaLink: product.ctaLink || "#",
      };
    });
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  };

  return (
    <section className="w-full py-20 lg:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base lg:text-lg text-slate-gray max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {resolvedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-light-slate rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 lg:h-64 overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary/40 text-sm">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 lg:p-8 flex flex-col h-64 lg:h-72">
                <h3 className="font-serif text-xl lg:text-2xl font-bold text-primary mb-3 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-slate-gray text-sm lg:text-base leading-relaxed mb-6 flex-grow line-clamp-3">
                  {product.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-sm h-11 lg:h-12 text-sm lg:text-base font-semibold tracking-wider transition-all duration-300 group"
                >
                  <Link href={product.ctaLink}>
                    <span>{product.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}