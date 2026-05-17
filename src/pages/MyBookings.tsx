import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { ArrowLeft, CalendarDays, Users, Package, LogOut, Clock } from "lucide-react";

interface Booking {
  id: string;
  packageTitle: string;
  travelDate: string;
  travelers: number;
  totalAmount: number;
  status: string;
  createdAt: any;
}

export default function MyBookings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("customerEmail", "in", [user.email, user.email?.toLowerCase()])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      
      // Sort manually by createdAt to avoid index issues
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setBookings(sortedData);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    confirmed: "text-lime-accent bg-lime-accent/10 border-lime-accent/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <main className="min-h-screen bg-mist-black text-kimono-white pb-24">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-mist-black/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 md:px-24 py-4 sm:py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:text-lime-accent transition-colors" />
          <span className="text-xs uppercase tracking-widest">Home</span>
        </Link>
        <span className="font-display text-lg sm:text-xl tracking-[0.2em] text-lime-accent">INDIA TOURS</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline uppercase tracking-widest text-xs">Sign Out</span>
        </button>
      </nav>

      <section className="px-4 sm:px-8 md:px-24 max-w-5xl mx-auto mt-8 sm:mt-16">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-16"
        >
          <p className="text-lime-accent text-xs uppercase tracking-[0.4em] mb-4">Welcome back</p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display tracking-tight leading-tight">
            {user?.displayName?.split(" ")[0] || "Traveler"}
          </h1>
          <p className="text-white/40 mt-4 text-sm">{user?.email}</p>
        </motion.div>

        {/* Bookings */}
        <div>
          <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-editorial italic">My Bookings</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-white/30 text-xs sm:text-sm">{bookings.length} trip{bookings.length !== 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div className="text-center py-24 text-white/30">
              <div className="w-8 h-8 border-2 border-lime-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm uppercase tracking-widest">Loading your journeys...</p>
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-white/5 px-4"
            >
              <Package className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-editorial italic text-white/40 mb-4">No trips yet</h3>
              <p className="text-white/30 text-sm mb-8">Your booked journeys will appear here</p>
              <Link
                to="/packages"
                className="inline-block px-8 py-3 border border-lime-accent text-lime-accent text-xs uppercase tracking-widest hover:bg-lime-accent hover:text-mist-black transition-colors"
              >
                Explore Packages
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl sm:text-2xl font-editorial italic">{booking.packageTitle}</h3>
                        <span className={`text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 border ${statusColors[booking.status] || statusColors.pending}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 sm:gap-6 text-white/50 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-lime-accent" />
                          <span>{booking.travelDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-lime-accent" />
                          <span>{booking.travelers} Traveler{booking.travelers > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-lime-accent" />
                          <span>
                            {booking.status === 'confirmed' ? 'Trip Confirmed' : 
                             booking.status === 'cancelled' ? 'Trip Cancelled' : 
                             'Confirmation Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right border-t border-white/5 pt-4 md:border-none md:pt-0">
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/30 mb-1">Total Amount</p>
                      <p className="font-display text-2xl sm:text-3xl text-lime-accent">
                        ₹{booking.totalAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
