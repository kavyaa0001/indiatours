import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Package, packages as staticPackages } from "@/data/packages";
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle, CalendarDays, ReceiptText, ShieldCheck, Map, Users, Plus, Minus } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useSeats } from "@/hooks/useSeats";
import ReviewSection from "@/components/ReviewSection";
import { useAuth } from "@/context/AuthContext";
import { UserCircle } from "lucide-react";

const ADMIN_EMAIL = "karanpw.live@gmail.com";

type TabType = 'overview' | 'itinerary' | 'details' | 'terms';

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [travelers, setTravelers] = useState(1);
  const [wantsVIP, setWantsVIP] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function fetchPkg() {
      if (!id) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "packages", id));
        if (snap.exists()) {
          setPackageData(snap.data() as Package);
        } else {
          // Fallback to static data
          const fallback = staticPackages.find(p => p.id === id);
          if (fallback) setPackageData(fallback);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPkg();
  }, [id]);

  const { seatData } = useSeats(id ?? "");

  if (loading) {
    return (
      <div className="min-h-screen bg-mist-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lime-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-mist-black text-kimono-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display mb-4">Package not found</h1>
        <Link to="/packages" className="text-lime-accent hover:underline">Return to Packages</Link>
      </div>
    );
  }

  // Calculate Price
  const basePricePerPerson = packageData.basePrice;
  const vipAddonPrice = 2500; // Example flat addon per person
  const totalPrice = (basePricePerPerson + (wantsVIP ? vipAddonPrice : 0)) * travelers;

  return (
    <main className="min-h-screen bg-mist-black text-kimono-white selection:bg-lime-accent selection:text-mist-black pb-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={packageData.image}
            alt={packageData.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mist-black via-mist-black/20 to-transparent" />
        </motion.div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-center">
          <Link to="/packages" className="flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 text-kimono-white group-hover:text-lime-accent transition-colors" />
            <span className="font-display text-sm tracking-[0.2em] group-hover:text-lime-accent transition-colors">ALL PACKAGES</span>
          </Link>
          <div className="flex items-center gap-6">
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
              <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-kimono-white/60 hover:text-kimono-white transition-colors">
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Title */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-24 z-10">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-9xl font-display tracking-tight uppercase leading-tight"
          >
            {packageData.title}
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 text-white/70 uppercase tracking-widest text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-lime-accent" />
              <span>India</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-accent" />
              <span>{packageData.duration}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 sm:px-8 md:px-24 max-w-[1600px] mx-auto mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24 items-start">
        
        {/* Left Column: Details & Tabs */}
        <div className="lg:col-span-2">
          
          {/* Tabs Navigation */}
          <div 
            className="flex gap-6 md:gap-8 border-b border-white/10 pb-4 mb-8 md:mb-12 overflow-x-auto scrollbar-none flex-nowrap whitespace-nowrap"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              { id: 'overview', icon: Map, label: 'Overview' },
              { id: 'itinerary', icon: CalendarDays, label: 'Itinerary' },
              { id: 'details', icon: ReceiptText, label: 'Package Details' },
              { id: 'terms', icon: ShieldCheck, label: 'Terms & Conditions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 text-sm uppercase tracking-widest pb-4 -mb-[17px] transition-colors border-b-2 shrink-0 ${
                  activeTab === tab.id ? 'border-lime-accent text-lime-accent' : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div>
                    <h2 className="text-3xl font-editorial italic mb-6 text-white/90">About the Journey</h2>
                    <p className="text-lg text-white/60 leading-relaxed font-light">
                      {packageData.description}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-3xl font-editorial italic mb-6 text-white/90">Trip Highlights</h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-sm border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-lime-accent flex-shrink-0" />
                          <span className="text-white/80 text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* ITINERARY TAB */}
              {activeTab === 'itinerary' && (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent"
                >
                  {packageData.itinerary.map((day, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-mist-black text-lime-accent shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(20,20,20,1)] z-10">
                        <span className="font-display text-xs">{idx + 1}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-6 rounded-sm border border-white/10 hover:border-white/30 transition-colors">
                        <span className="text-lime-accent font-display tracking-widest text-xs uppercase mb-2 block">{day.day}</span>
                        <h3 className="text-xl font-editorial italic text-white/90 mb-3">{day.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12"
                >
                  <div>
                    <h2 className="text-2xl font-editorial italic mb-6 text-white/90 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-lime-accent" />
                      What's Included
                    </h2>
                    <ul className="space-y-4">
                      {packageData.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-white/70 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-lime-accent mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-2xl font-editorial italic mb-6 text-white/90 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      What's Excluded
                    </h2>
                    <ul className="space-y-4">
                      {packageData.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-white/70 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* TERMS TAB */}
              {activeTab === 'terms' && (
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-3xl font-editorial italic mb-8 text-white/90">Terms & Conditions</h2>
                  <div className="bg-white/5 p-8 rounded-sm border border-white/10">
                    <ul className="space-y-6">
                      {packageData.terms.map((term, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-white/60 text-sm leading-relaxed">
                          <span className="font-display text-lime-accent/50">{idx + 1}.</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Price Calculator Sticky Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-sm">
            <h3 className="text-2xl font-editorial italic mb-8 border-b border-white/10 pb-4">Calculate Price</h3>
            
            <div className="space-y-8">
              {/* Travelers */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Number of Travelers
                </label>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded-sm border border-white/10">
                  <button 
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="p-3 hover:bg-white/10 transition-colors rounded-sm text-white/70"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-2xl">{travelers}</span>
                  <button 
                    onClick={() => setTravelers(travelers + 1)}
                    className="p-3 hover:bg-white/10 transition-colors rounded-sm text-white/70"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Optional Add-ons */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-4">
                  Optional Add-ons
                </label>
                <label className="flex items-start gap-4 p-4 border border-white/10 rounded-sm cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={wantsVIP}
                      onChange={(e) => setWantsVIP(e.target.checked)}
                      className="w-4 h-4 accent-lime-accent bg-black border-white/20 rounded-sm"
                    />
                  </div>
                  <div>
                    <span className="block text-sm text-white/90 mb-1">VIP Services & Upgrades</span>
                    <span className="block text-xs text-white/50">Priority darshan/premium tenting (+₹2,500/person)</span>
                  </div>
                </label>
              </div>

              {/* Seat Availability */}
              {seatData && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                      Seat Availability
                    </label>
                    <span className={`text-xs font-display ${
                      seatData.isSoldOut ? "text-red-400" :
                      seatData.availableSeats <= 5 ? "text-amber-400" : "text-lime-accent"
                    }`}>
                      {seatData.isSoldOut ? "SOLD OUT" : `${seatData.availableSeats} seats left`}
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        seatData.isSoldOut ? "bg-red-400" :
                        seatData.percentage >= 75 ? "bg-amber-400" : "bg-lime-accent"
                      }`}
                      style={{ width: `${seatData.percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/20 mt-1">{seatData.bookedSeats} of {seatData.totalSeats} booked</p>
                </div>
              )}
              <div className="pt-8 border-t border-white/10 mt-8">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm uppercase tracking-[0.2em] text-white/50">Total Amount</span>
                  <span className="font-display text-4xl text-lime-accent">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  disabled={seatData?.isSoldOut || false}
                  className="w-full py-4 bg-kimono-white text-mist-black font-display text-lg tracking-[0.2em] hover:bg-lime-accent hover:text-mist-black transition-all duration-300 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-kimono-white"
                >
                  {seatData?.isSoldOut ? "SOLD OUT" : "PROCEED TO BOOK"}
                </button>
                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-4">
                  No hidden charges • Taxes included
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Reviews Section */}
      <ReviewSection packageId={packageData.id} packageTitle={packageData.title} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        packageTitle={packageData.title}
        packageId={packageData.id}
        totalAmount={totalPrice}
        travelers={travelers}
      />
    </main>
  );
}
