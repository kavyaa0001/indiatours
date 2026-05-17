import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { bookSeats } from "@/hooks/useSeats";
import { useAuth } from "@/context/AuthContext";
import { X, CheckCircle2, User, Phone, Mail, CalendarDays, Users } from "lucide-react";

const WHATSAPP_NUMBER = "916203977379"; // Format: 91 + 10 digit number

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  packageId: string;
  totalAmount: number;
  travelers: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  packageTitle,
  packageId,
  totalAmount,
  travelers,
}: BookingModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !travelDate) return;
    setLoading(true);
    setError("");

    try {
      // Check and reserve seats first
      const seatsBooked = await bookSeats(packageId, travelers);
      if (!seatsBooked) {
        setError("Sorry! Not enough seats available for this package. Please try fewer travelers.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "bookings"), {
        customerName: name,
        customerEmail: email.toLowerCase(),
        customerPhone: phone,
        userId: user?.uid || null,
        travelDate,
        travelers,
        packageId,
        packageTitle,
        totalAmount,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setName("");
      setEmail("");
      setPhone("");
      setTravelDate("");
      setError("");
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-sm overflow-y-auto max-h-[90vh] scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {success ? (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-lime-accent mx-auto" />
                  </motion.div>
                  <h3 className="text-3xl font-editorial italic text-white">
                    Booking Confirmed!
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Your booking for <span className="text-lime-accent font-semibold">{packageTitle}</span> has been received.
                    Our team will contact you shortly on <span className="text-white">{phone}</span>.
                  </p>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm text-sm space-y-2">
                    <div className="flex justify-between text-white/60">
                      <span>Package</span><span className="text-white">{packageTitle}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Travelers</span><span className="text-white">{travelers}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Travel Date</span><span className="text-white">{travelDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                      <span className="text-white/60">Total Amount</span>
                      <span className="text-lime-accent font-display text-lg">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I just booked the ${packageTitle} package for ${travelDate}. My name is ${name} and phone is ${phone}. Total: ₹${totalAmount.toLocaleString('en-IN')}. Please confirm my booking.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-[#25D366] text-white font-display text-base tracking-[0.2em] hover:bg-[#20bb5a] transition-colors flex items-center justify-center gap-3"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      CHAT ON WHATSAPP
                    </a>
                    <button
                      onClick={handleClose}
                      className="w-full py-4 border border-white/20 text-white/60 font-display text-base tracking-[0.2em] hover:bg-white/5 transition-colors"
                    >
                      CLOSE
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Form State */
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <p className="text-lime-accent text-xs uppercase tracking-[0.3em] mb-2">Booking for</p>
                    <h2 className="text-3xl font-editorial italic text-white">{packageTitle}</h2>
                    <p className="text-white/40 text-sm mt-1">{travelers} Traveler{travelers > 1 ? "s" : ""} · ₹{totalAmount.toLocaleString("en-IN")} total</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        id="booking-name"
                        name="booking-name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20 text-white"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        id="booking-email"
                        name="booking-email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20 text-white"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        id="booking-phone"
                        name="booking-phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20 text-white"
                      />
                    </div>

                    {/* Travel Date */}
                    <div className="relative">
                      <CalendarDays className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        id="booking-date"
                        name="booking-date"
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors text-white/60 [color-scheme:dark]"
                      />
                    </div>

                    {/* Travelers display (readonly) */}
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-3 border border-white/10 rounded-sm">
                      <Users className="w-4 h-4 text-lime-accent" />
                      <span className="text-white/60 text-sm">{travelers} Traveler{travelers > 1 ? "s" : ""} selected from calculator</span>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-kimono-white text-mist-black font-display text-lg tracking-[0.2em] hover:bg-lime-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {loading ? "CONFIRMING..." : "CONFIRM BOOKING"}
                    </button>

                    <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
                      Our team will call you within 24 hours to confirm
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
