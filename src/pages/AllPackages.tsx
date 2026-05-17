import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Lock, Users, UserCircle } from "lucide-react";
import { useSeats } from "@/hooks/useSeats";
import { useAuth } from "@/context/AuthContext";
import { usePackages } from "@/hooks/usePackages";

const ADMIN_EMAIL = "karanpw.live@gmail.com";

const upcomingPackages = [
  { id: "spiti", title: "Spiti Valley", image: "/images/hero.jpg", expected: "Summer 2027" },
  { id: "ladakh", title: "Ladakh Expeditions", image: "/images/contact.jpg", expected: "Summer 2027" },
  { id: "kashmir", title: "Kashmir Valleys", image: "/images/hero-bg-india.png", expected: "Autumn 2027" },
];

// Individual card with its own seat hook
function PackageCard({ pkg, idx }: { pkg: typeof packages[0]; idx: number }) {
  const { seatData } = useSeats(pkg.id);

  return (
    <Link key={pkg.id} to={seatData?.isSoldOut ? "#" : `/package/${pkg.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        whileHover={{ y: seatData?.isSoldOut ? 0 : -10 }}
        className={`group relative h-[380px] sm:h-[450px] bg-white/5 border border-white/10 overflow-hidden rounded-sm ${seatData?.isSoldOut ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="absolute inset-0">
          <img
            src={pkg.image}
            alt={pkg.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              seatData?.isSoldOut
                ? "opacity-30 grayscale"
                : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mist-black via-mist-black/50 to-transparent opacity-80" />
        </div>

        {/* SOLD OUT overlay */}
        {seatData?.isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="border-2 border-red-400/60 px-8 py-3 rotate-[-15deg]">
              <span className="text-red-400 font-display text-3xl tracking-widest">SOLD OUT</span>
            </div>
          </div>
        )}

        {/* Seat indicator bar */}
        {seatData && !seatData.isSoldOut && (
          <div className="absolute top-4 right-4 z-10">
            <div className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${
              seatData.availableSeats <= 5
                ? "bg-red-400/20 border-red-400/40 text-red-400"
                : seatData.availableSeats <= 10
                ? "bg-amber-400/20 border-amber-400/40 text-amber-400"
                : "bg-lime-accent/10 border-lime-accent/20 text-lime-accent"
            }`}>
              {seatData.availableSeats} seats left
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
          <h2 className={`text-4xl font-display mb-2 transition-colors ${seatData?.isSoldOut ? "text-white/40" : "text-white group-hover:text-lime-accent"}`}>
            {pkg.title}
          </h2>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/60 text-sm uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                <span>{pkg.duration}</span>
              </div>
              {seatData && (
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <Users className="w-3 h-3" />
                  <span>{seatData.bookedSeats}/{seatData.totalSeats}</span>
                </div>
              )}
            </div>
            <span className={`font-display text-2xl ${seatData?.isSoldOut ? "text-white/30" : "text-lime-accent"}`}>
              {pkg.price}
            </span>
          </div>

          {/* Seat progress bar */}
          {seatData && (
            <div className="mt-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  seatData.isSoldOut ? "bg-red-400" :
                  seatData.percentage >= 75 ? "bg-amber-400" : "bg-lime-accent"
                }`}
                style={{ width: `${seatData.percentage}%` }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function AllPackages() {
  const { user } = useAuth();
  const { packages, loading } = usePackages();

  if (loading) return (
    <div className="min-h-screen bg-mist-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-lime-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-mist-black text-kimono-white selection:bg-lime-accent selection:text-mist-black">
      {/* Header */}
      <nav className="absolute top-0 left-0 w-full z-50 p-4 sm:p-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-5 h-5 text-kimono-white group-hover:text-lime-accent transition-colors" />
          <span className="font-display text-sm tracking-[0.2em] group-hover:text-lime-accent transition-colors">HOME</span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
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
            <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-kimono-white/60 hover:text-kimono-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>

      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 sm:px-8 md:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-24"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display tracking-tight mb-4 md:mb-6">ALL PACKAGES</h1>
          <p className="text-lg sm:text-xl text-mouse-gray font-light max-w-2xl">
            Choose your next spiritual journey or high-altitude adventure.
            Our curated experiences are designed to bring you closer to the divine Himalayas.
          </p>
        </motion.div>

        {/* Active Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg, idx) => (
            <PackageCard key={pkg.id} pkg={pkg} idx={idx} />
          ))}
        </div>
      </section>

      {/* Upcoming Packages */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-24 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 sm:gap-8 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-4xl font-editorial italic text-white/50">Coming Soon</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {upcomingPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative h-[250px] sm:h-[300px] border border-white/5 overflow-hidden rounded-sm group grayscale"
              >
                <div className="absolute inset-0">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-mist-black/80 backdrop-blur-[2px]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Lock className="w-8 h-8 text-white/20 mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-display text-white/40 mb-2">{pkg.title}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-lime-accent/50 border border-lime-accent/20 px-4 py-1 rounded-full">
                    {pkg.expected}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
