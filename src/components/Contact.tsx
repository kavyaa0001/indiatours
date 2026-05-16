"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Send } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CONTACT_EMAIL = "karanpw.live@gmail.com";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "enquiries"), {
        name,
        phone,
        comment,
        email: CONTACT_EMAIL,
        createdAt: serverTimestamp(),
        status: "new",
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="contacts" className="relative min-h-screen w-full flex items-center px-8 md:px-24 py-32 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contact.jpg"
            alt="Himalayan Temple"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-mist-black/30" />
        </div>

        {/* Frosted Glass Form */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 w-full max-w-xl frosted-glass p-12 space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-editorial italic leading-tight">
              Want to join us, but still have questions?
            </h2>
            <p className="text-sm tracking-[0.4em] uppercase text-kimono-white/50">
              Leave a request
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 space-y-4"
            >
              <p className="text-4xl">🙏</p>
              <h3 className="text-2xl font-editorial italic text-lime-accent">Your request is ready!</h3>
              <p className="text-white/60 text-sm">Your email client will open with your details pre-filled. Just hit send!</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors">Submit another</button>
            </motion.div>
          ) : (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="group relative">
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20"
              />
            </div>
            <div className="group relative">
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20"
              />
            </div>
            <div className="group relative">
              <textarea
                id="contact-comment"
                name="comment"
                placeholder="Comment"
                rows={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20 resize-none"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-mountain-cream text-mist-black font-display text-xl tracking-[0.3em] hover:bg-lime-accent transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SENDING..." : "SEND"}
            </button>
          </form>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-mist-black py-16 px-8 md:px-24 border-t border-white/5">
        <div className="flex flex-col md:row gap-12 justify-between items-center md:items-start">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-lime-accent" />
            <span className="font-display text-xl tracking-[0.2em] text-kimono-white">INDIA TOURS</span>
          </div>

          <div className="flex gap-12 text-xs uppercase tracking-[0.2em] text-kimono-white/50">
            {["Home", "About", "Included", "Contacts"].map((item) => (
              <a key={item} href="#" className="hover:text-lime-accent transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex gap-8 text-kimono-white/30">
            <FaInstagram className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
            <FaFacebook className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
            <Send className="w-5 h-5 hover:text-lime-accent cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="mt-16 text-center text-[10px] tracking-[0.2em] text-white/10 uppercase">
          © 2024 INDIA TOURS. ART DIRECTED BY THE SOUL OF THE HIMALAYAS.
        </div>
      </footer>
    </>
  );
}
