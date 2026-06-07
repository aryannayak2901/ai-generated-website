'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export const HeroCentered: React.FC<any> = ({ heading, subheading, ctas, media }) => (
  <section className="relative flex flex-col items-center justify-center text-center min-h-[80vh] bg-navy-primary text-white p-8 md:p-16 overflow-hidden">
    {media?.url && (
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src={media.url} alt={media.alt || 'Background'} fill className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-primary/60 backdrop-blur-sm" />
      </div>
    )}
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
    >
      <h1 className="text-6xl md:text-8xl font-playfair mb-8 leading-tight">{heading}</h1>
      {subheading && <p className="text-2xl md:text-3xl mb-12 text-gray-300 font-public-sans max-w-3xl">{subheading}</p>}
      <div className="flex flex-wrap justify-center gap-6">
        {ctas?.map((cta: any, i: number) => (
          <a key={i} href={cta.link} className={`px-10 py-4 rounded-md transition-all duration-300 font-medium text-lg ${
            cta.style === 'primary' ? 'bg-gold-accent text-navy-primary hover:bg-gold-accent/90 shadow-[0_0_20px_rgba(212,175,55,0.3)]' :
            cta.style === 'secondary' ? 'bg-white text-navy-primary hover:bg-gray-100' :
            'border-2 border-white/30 text-white hover:bg-white/10'
          }`}>
            {cta.label}
          </a>
        ))}
      </div>
    </motion.div>
  </section>
)
