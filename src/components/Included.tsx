"use client";

import { motion } from "framer-motion";
import { Compass, Plane, MapPin, Hotel } from "lucide-react";

const includedItems = [
  {
    icon: Compass,
    title: "Guides",
    desc: "2 awesome guides who know everything about the Himalayas!"
  },
  {
    icon: Plane,
    title: "Flights",
    desc: "Routes: Delhi — Dehradun, Dehradun — Delhi"
  },
  {
    icon: MapPin,
    title: "Transfers",
    desc: "From the airport to the hotels"
  },
  {
    icon: Hotel,
    title: "Hotels",
    desc: "Comfortable accommodation, 2 people per room (breakfasts included)"
  }
];

export default function Included() {
  return (
    <section id="included" className="py-32 bg-mist-black px-8 md:px-24">
      <div className="flex items-center gap-8 mb-24">
        <h2 className="text-6xl md:text-8xl font-display tracking-tight opacity-80">WHAT'S INCLUDED</h2>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {includedItems.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-panel p-10 group relative overflow-hidden h-[300px] flex flex-col justify-between"
          >
            {/* Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-lime-accent/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <item.icon className="w-8 h-8 text-lime-accent group-hover:scale-110 transition-transform duration-500" />
            
            <div className="space-y-4">
              <h3 className="text-sm tracking-[0.3em] font-medium uppercase text-kimono-white/60 group-hover:text-lime-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-xl font-editorial italic leading-snug">
                {item.desc}
              </p>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-lime-accent transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
