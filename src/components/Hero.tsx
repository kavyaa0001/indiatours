"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Globe, Send, UserCircle, Menu, X } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePackages } from "@/hooks/usePackages";

const ADMIN_EMAIL = "karanpw.live@gmail.com";

export default function Hero() {
  const { scrollY } = useScroll();
  const { user } = useAuth();
  const { packages } = usePackages();
  const [menuOpen, setMenuOpen] = useState(false);

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
        className="absolute inset-0 z-10 flex justify-center pointer-events-none pt-[22vh] sm:pt-[12vh]"
      >
        <h1 className="text-[30vw] sm:text-[25vw] font-display text-transparent stroke-1 stroke-kimono-white/50 tracking-tighter select-none drop-shadow-lg"
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
      <nav className="absolute top-0 left-0 w-full z-50 p-6 sm:p-8 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-lime-accent" />
          <span className="font-display text-lg sm:text-xl tracking-[0.2em] text-kimono-white">INDIA TOURS</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-12">
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
            <div className="flex items-center gap-2 sm:gap-4">
              {user.email === ADMIN_EMAIL && (
                <Link to="/admin" className="text-xs uppercase tracking-[0.2em] text-lime-accent hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/my-bookings" className="flex items-center gap-2 px-4 sm:px-5 py-2 border border-lime-accent/50 rounded-full text-xs uppercase tracking-[0.2em] text-lime-accent hover:bg-lime-accent hover:text-mist-black transition-all duration-300">
                <UserCircle className="w-4 h-4" />
                <span className="hidden md:inline">{user.displayName?.split(" ")[0] || "Profile"}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-kimono-white/60 hover:text-kimono-white transition-colors">
                Login
              </Link>
              <Link to="/packages">
                <button className="px-4 sm:px-6 py-2 border border-kimono-white/30 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-kimono-white hover:text-mist-black transition-all duration-300">
                  Book
                </button>
              </Link>
            </div>
          )}
          
          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-kimono-white hover:text-lime-accent transition-colors z-[70] p-1"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Side Socials */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 text-kimono-white/40 hidden md:flex">
        <FaInstagram className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
        <FaFacebook className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
        <Send className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
      </div>

      {/* Polaroid Strip */}
      <div 
        id="packages" 
        className="absolute left-0 bottom-12 z-40 flex gap-4 overflow-x-auto w-full px-8 snap-x snap-mandatory scrollbar-none pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dynamicPolaroids.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ x: 0 }}
            whileHover={{ y: -10, scale: 1.05 }}
            className="w-48 h-64 bg-mountain-cream p-3 pb-10 shadow-2xl rotate-[-2deg] group cursor-pointer flex-shrink-0 snap-center"
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
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 right-auto md:right-[20%] bottom-[340px] md:bottom-[15%] z-40">
        <Link to="/packages">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative px-10 md:px-12 py-4 md:py-5 bg-mountain-cream text-mist-black font-display text-lg md:text-xl tracking-widest overflow-hidden group"
          >
            <span className="relative z-10">BOOK NOW</span>
            <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-lime-accent to-amber-400 transition-all duration-500 ease-out group-hover:h-full" />
          </motion.button>
        </Link>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-mist-black z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-mist-black border-l border-white/5 p-8 flex flex-col justify-between z-[70] md:hidden"
            >
              <div className="space-y-12">
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-lime-accent" />
                    <span className="font-display text-lg tracking-[0.2em] text-kimono-white">INDIA TOURS</span>
                  </div>
                  <button onClick={() => setMenuOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 text-sm uppercase tracking-[0.3em]">
                  {["About", "Packages", "Included", "Contacts"].map((item) => {
                    if (item === "Packages") {
                      return (
                        <Link 
                          key={item} 
                          to="/packages" 
                          onClick={() => setMenuOpen(false)}
                          className="text-kimono-white/80 hover:text-lime-accent transition-colors"
                        >
                          {item}
                        </Link>
                      );
                    }
                    return (
                      <a 
                        key={item} 
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-kimono-white/80 hover:text-lime-accent transition-colors"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                {user ? (
                  <div className="flex flex-col gap-4">
                    {user.email === ADMIN_EMAIL && (
                      <Link 
                        to="/admin" 
                        onClick={() => setMenuOpen(false)}
                        className="text-center text-xs uppercase tracking-[0.2em] text-lime-accent hover:text-white py-3 border border-lime-accent/20 rounded-full transition-colors"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <Link 
                      to="/my-bookings" 
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-lime-accent/50 rounded-full text-xs uppercase tracking-[0.2em] text-lime-accent hover:bg-lime-accent hover:text-mist-black transition-all"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>{user.displayName?.split(" ")[0] || "Profile"}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link 
                      to="/login" 
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-xs uppercase tracking-[0.2em] text-kimono-white/60 hover:text-kimono-white py-3 border border-white/10 rounded-full transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/packages"
                      onClick={() => setMenuOpen(false)}
                    >
                      <button className="w-full px-6 py-3 bg-lime-accent text-mist-black rounded-full text-xs uppercase tracking-[0.2em] hover:bg-white transition-all">
                        Book Now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
