'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const HeroSplit: React.FC<any> = ({ heading, subheading, ctas, media }) => (
  <section className="flex flex-col md:flex-row min-h-[80vh] items-center bg-navy-primary text-white overflow-hidden">
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1 p-8 md:p-16 z-10"
    >
      <h1 className="text-5xl md:text-6xl font-playfair mb-6 leading-tight text-white">{heading}</h1>
      {subheading && <p className="text-xl md:text-2xl mb-10 text-gray-300 font-public-sans">{subheading}</p>}
      <div className="flex flex-wrap gap-4">
        {ctas?.map((cta: any, i: number) => (
          <a key={i} href={cta.link} className={`px-8 py-3 rounded-md transition-all duration-300 font-medium ${
            cta.style === 'primary' ? 'bg-gold-accent text-navy-primary hover:bg-gold-accent/90' :
            cta.style === 'secondary' ? 'bg-white text-navy-primary hover:bg-gray-100' :
            'border border-white/30 text-white hover:bg-white/10'
          }`}>
            {cta.label}
          </a>
        ))}
      </div>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="flex-1 h-full min-h-[50vh] md:min-h-[80vh] relative"
    >
      {media?.url ? (
        <img src={media.url} alt={media.alt || 'Hero Image'} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-navy-secondary to-navy-primary" />
      )}
    </motion.div>
  </section>
)
