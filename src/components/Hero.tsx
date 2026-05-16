"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Send, UserCircle } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePackages } from "@/hooks/usePackages";

const ADMIN_EMAIL = "karanpw.live@gmail.com";

export default function Hero() {
  const { scrollY } = useScroll();
  const { user } = useAuth();
  const { packages } = usePackages();

  // Use first 5 packages for polaroids
  const dynamicPolaroids = packages.slice(0, 5).map((pkg) => ({
    id: pkg.id,
    title: pkg.title.toLowerCase(),
    img: pkg.image
  }));
  
  const mountainY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 250]);
  const womanY = useTransform(scrollY, [0, 500], [0, 0]); // Figure stays fixed or slower

  return (
    <section className="relative h-[120vh] w-full overflow-hidden bg-mist-black">
      {/* Background Plane: Misty Mountains */}
      <motion.div 
        style={{ y: mountainY }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/hero.jpg"
          alt="Misty Himalayan Mountains"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Mid-ground Plane: JAPAN Typography */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 z-10 flex justify-center pointer-events-none pt-[12vh]"
      >
        <h1 className="text-[25vw] font-display text-transparent stroke-1 stroke-kimono-white/50 tracking-tighter select-none drop-shadow-lg"
            style={{ WebkitTextStroke: "2px rgba(250, 250, 250, 0.4)" }}>
          INDIA
        </h1>
      </motion.div>

      {/* Foreground Plane: Mountains Mask (to hide bottom half of text) */}
      <motion.div 
        style={{ y: mountainY }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <div className="absolute inset-0 bg-mist-black/20" />
        <img
          src="/images/hero.jpg"
          alt="Misty Himalayan Mountains Foreground"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: "inset(55% 0 0 0)" }} // Lowered the mask to reveal more of the INDIA text
        />
      </motion.div>

      {/* Human Anchor: Kimono Woman */}


      {/* Navbar Overlay */}
      <nav className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-lime-accent" />
          <span className="font-display text-xl tracking-[0.2em] text-kimono-white">INDIA TOURS</span>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="hidden md:flex gap-8">
            {["About", "Packages", "Included", "Contacts"].map((item) => {
              const content = (
                <>
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-lime-accent transition-all duration-300 group-hover:w-full" />
                </>
              );

              if (item === "Packages") {
                return (
                  <Link key={item} to="/packages" className="group relative text-xs uppercase tracking-[0.2em] text-kimono-white/80 hover:text-kimono-white transition-colors">
                    {content}
                  </Link>
                );
              }

              return (
                <a key={item} href={`#${item.toLowerCase()}`} className="group relative text-xs uppercase tracking-[0.2em] text-kimono-white/80 hover:text-kimono-white transition-colors">
                  {content}
                </a>
              );
            })}
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              {user.email === ADMIN_EMAIL && (
                <Link to="/admin" className="text-xs uppercase tracking-[0.2em] text-lime-accent hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/my-bookings" className="flex items-center gap-2 px-5 py-2 border border-lime-accent/50 rounded-full text-xs uppercase tracking-[0.2em] text-lime-accent hover:bg-lime-accent hover:text-mist-black transition-all duration-300">
                <UserCircle className="w-4 h-4" />
                <span className="hidden md:inline">{user.displayName?.split(" ")[0] || "Profile"}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-kimono-white/60 hover:text-kimono-white transition-colors">
                Login
              </Link>
              <Link to="/packages">
                <button className="px-6 py-2 border border-kimono-white/30 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-kimono-white hover:text-mist-black transition-all duration-300">
                  Book
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Side Socials */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 text-kimono-white/40">
        <FaInstagram className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
        <FaFacebook className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
        <Send className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
      </div>

      {/* Polaroid Strip */}
      <div id="packages" className="absolute left-8 bottom-12 z-40 flex gap-4 overflow-visible">
        {dynamicPolaroids.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ x: 0 }}
            whileHover={{ y: -10, scale: 1.05 }}
            className="w-48 h-64 bg-mountain-cream p-3 pb-10 shadow-2xl rotate-[-2deg] group cursor-pointer flex-shrink-0"
            style={{ 
              // Using a simple CSS transform instead of useTransform inside map to avoid hook errors
              transform: `translateY(${idx % 2 === 0 ? '0px' : '10px'})`
            }}
          >
            <Link to={`/package/${item.id}`} className="block w-full h-full">
              <div className="relative w-full h-full overflow-hidden bg-mist-black">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-editorial italic text-mist-black text-[10px] mt-2 opacity-60">
                {item.title}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Book Button (Chunky) */}
      <div className="absolute right-[20%] bottom-[15%] z-40">
        <Link to="/packages">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative px-12 py-5 bg-mountain-cream text-mist-black font-display text-xl tracking-widest overflow-hidden group"
          >
            <span className="relative z-10">BOOK NOW</span>
            <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-lime-accent to-amber-400 transition-all duration-500 ease-out group-hover:h-full" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
