"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const serviceFeatures = [
  {
    number: "01",
    title: "Expert Local Guides",
    description: "Deeply knowledgeable locals who guide your spiritual and adventurous journey safely."
  },
  {
    number: "02",
    title: "Premium Stays",
    description: "Carefully curated accommodations ranging from luxury desert camps to cozy Himalayan retreats."
  },
  {
    number: "03",
    title: "VIP Darshan & Access",
    description: "Priority access to sacred temples, ensuring a peaceful and hassle-free spiritual experience."
  },
  {
    number: "04",
    title: "Seamless Transport",
    description: "Safe, comfortable, and reliable travel across challenging mountain and desert terrains."
  },
  {
    number: "05",
    title: "24/7 Concierge Support",
    description: "Round-the-clock dedicated assistance so you can focus entirely on your journey."
  }
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="about" className="py-16 md:py-32 bg-mist-black text-kimono-white px-4 sm:px-8 md:px-24" ref={containerRef}>
      {/* Heading */}
      <div className="flex items-center gap-4 sm:gap-8 mb-16 md:mb-32">
        <div className="h-[1px] flex-1 bg-white/20" />
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-display tracking-tight opacity-90 text-center">WHY CHOOSE US</h2>
        <div className="h-[1px] flex-1 bg-white/20" />
      </div>

      <div className="relative flex flex-col items-center min-h-screen">
        
        {/* Centered Alternating Text Timeline */}
        <div className="relative w-full max-w-5xl mx-auto py-12">
          {/* Central Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="flex flex-col space-y-24 md:space-y-40 relative pt-12 pb-12 md:pt-24 md:pb-24">
            {serviceFeatures.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={item.number} className={`relative flex w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-start`}>
                  
                  {/* Content Container (Half width on desktop, full width on mobile) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`relative w-full md:w-1/2 flex flex-col pl-16 md:pl-0 ${isEven ? 'md:items-end md:pr-12 md:pr-24 md:text-right' : 'md:items-start md:pl-12 md:pl-24 md:text-left'} items-start text-left`}
                  >
                    
                    {/* Node Dot / Number */}
                    <div className={`absolute top-0 flex items-center justify-center w-12 h-12 rounded-full bg-mist-black border border-lime-accent shadow-[0_0_20px_rgba(200,255,0,0.15)] z-10 left-0 md:left-auto ${isEven ? 'md:-right-6' : 'md:-left-6'}`}>
                      <span className="text-lime-accent font-display text-lg">{item.number}</span>
                    </div>

                    {/* Text Content */}
                    <div className="mt-2">
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-editorial italic text-white/90 mb-4 md:mb-6">{item.title}</h3>
                      <p className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
