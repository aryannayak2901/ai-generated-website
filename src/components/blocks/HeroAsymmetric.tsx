'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const HeroAsymmetric: React.FC<any> = ({ heading, subheading, ctas, media }) => {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (bgRef.current && media?.url) {
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: bgRef.current.parentElement,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
    }
  }, [media])

  return (
    <section className="relative min-h-[90vh] flex items-center p-8 md:p-16 overflow-hidden bg-navy-primary">
      {media?.url ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div ref={bgRef} className="absolute -inset-[20%] w-[140%] h-[140%]">
            <Image src={media.url} alt={media.alt || 'Background'} fill className="w-full h-full object-cover" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-navy-primary via-navy-primary to-navy-secondary" />
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-navy-primary/40 md:bg-white/5 p-10 md:p-16 rounded-3xl border border-white/10 text-white shadow-2xl ml-0 md:ml-12"
      >
        <h1 className="text-5xl md:text-7xl font-playfair mb-6 leading-tight">{heading}</h1>
        {subheading && <p className="text-xl md:text-2xl mb-10 text-gray-200 font-public-sans leading-relaxed">{subheading}</p>}
        <div className="flex flex-wrap gap-4">
          {ctas?.map((cta: any, i: number) => (
            <a key={i} href={cta.link} className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
              cta.style === 'primary' ? 'bg-gold-accent text-navy-primary hover:bg-white hover:text-navy-primary hover:scale-105' :
              cta.style === 'secondary' ? 'bg-white text-navy-primary hover:bg-gray-100 hover:scale-105' :
              'border border-white/30 text-white hover:bg-white/20 hover:scale-105'
            }`}>
              {cta.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
