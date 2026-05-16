import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection, query, orderBy, onSnapshot, doc,
  updateDoc, getDocs, where
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useSeats, updateTotalSeats } from "@/hooks/useSeats";
import { packages } from "@/data/packages";
import {
  LayoutDashboard, BookOpen, MessageSquare, Star,
  LogOut, CheckCircle2, XCircle,
  Clock, IndianRupee, LayoutGrid, ArrowLeft, Package as PackageIcon, Database
} from "lucide-react";
import ManagePackages from "@/components/Admin/ManagePackages";
import { migratePackages } from "@/data/migrate";

const ADMIN_EMAIL = "karanpw.live@gmail.com";

type TabType = "dashboard" | "bookings" | "enquiries" | "reviews" | "seats" | "packages";

// Stat Card
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-display text-white">{value}</p>
      </div>
    </div>
  );
}

// Booking status badge
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    confirmed: "text-lime-accent bg-lime-accent/10 border-lime-accent/30",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
  };
  return (
    <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
}

// Seat Manager Row
function SeatRow({ pkg }: { pkg: typeof packages[0] }) {
  const { seatData } = useSeats(pkg.id);
  const [editing, setEditing] = useState(false);
  const [newTotal, setNewTotal] = useState(seatData?.totalSeats ?? 20);

  const handleSave = async () => {
    await updateTotalSeats(pkg.id, newTotal);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-5 border-b border-white/5 gap-4">
      <div className="flex items-center gap-4 flex-1">
        <img src={pkg.image} alt={pkg.title} className="w-12 h-12 object-cover rounded-sm opacity-70" />
        <div>
          <p className="text-white font-medium">{pkg.title}</p>
          <p className="text-white/40 text-xs">{pkg.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-white/30 text-xs mb-1">Booked</p>
          <p className="text-white font-display text-xl">{seatData?.bookedSeats ?? 0}</p>
        </div>
        <div className="text-center">
          <p className="text-white/30 text-xs mb-1">Available</p>
          <p className={`font-display text-xl ${seatData?.isSoldOut ? "text-red-400" : seatData?.availableSeats && seatData.availableSeats <= 5 ? "text-amber-400" : "text-lime-accent"}`}>
            {seatData?.availableSeats ?? "--"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/30 text-xs mb-1">Total</p>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newTotal}
                onChange={(e) => setNewTotal(Number(e.target.value))}
                min={seatData?.bookedSeats ?? 0}
                className="w-16 bg-white/10 border border-white/20 text-white text-center py-1 focus:outline-none focus:border-lime-accent"
              />
              <button onClick={handleSave} className="text-lime-accent text-xs hover:underline">Save</button>
              <button onClick={() => setEditing(false)} className="text-white/30 text-xs hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => { setNewTotal(seatData?.totalSeats ?? 20); setEditing(true); }} className="font-display text-xl text-white hover:text-lime-accent transition-colors">
              {seatData?.totalSeats ?? "--"}
            </button>
          )}
        </div>
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${seatData?.isSoldOut ? "bg-red-400" : seatData?.percentage && seatData.percentage >= 75 ? "bg-amber-400" : "bg-lime-accent"}`}
            style={{ width: `${seatData?.percentage ?? 0}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, pending: 0, enquiries: 0 });

  // Auth guard
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      navigate("/");
    } else if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Real-time bookings
  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBookings(data);
      setStats((prev) => ({
        ...prev,
        totalBookings: data.length,
        totalRevenue: data.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
        pending: data.filter((b: any) => b.status === "pending").length,
      }));
    });
  }, []);

  // Real-time enquiries
  useEffect(() => {
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEnquiries(data);
      setStats((prev) => ({ ...prev, enquiries: data.length }));
    });
  }, []);

  // Real-time reviews
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "bookings", id), { status });
  };

  const updateReviewStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "reviews", id), { status });
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "packages", label: "Manage Packages", icon: PackageIcon },
    { id: "seats", label: "Seat Management", icon: LayoutGrid },
  ];

  const handleMigration = async () => {
    if (window.confirm("This will upload all hardcoded packages to Firestore. Continue?")) {
      await migratePackages();
      alert("Migration complete!");
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-mist-black text-kimono-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-display mb-2">Access Denied</h1>
          <p className="text-white/40">You don't have admin permissions.</p>
          <Link to="/" className="text-lime-accent mt-4 inline-block hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-black text-kimono-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/5 flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/5">
          <p className="text-lime-accent text-xs uppercase tracking-[0.3em] mb-1">Admin Panel</p>
          <p className="font-display text-xl tracking-wider">INDIA TOURS</p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-widest transition-colors rounded-sm ${
                activeTab === tab.id
                  ? "bg-lime-accent/10 text-lime-accent border border-lime-accent/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:text-white text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:text-red-400 text-xs uppercase tracking-widest transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
        <div className="p-4 bg-lime-accent/5 border-t border-white/5 mt-auto">
          <button 
            onClick={handleMigration}
            className="w-full flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest text-lime-accent/40 hover:text-lime-accent transition-colors"
          >
            <Database className="w-3 h-3" /> Init Database
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div>
              <h1 className="text-4xl font-display tracking-tight mb-2">Dashboard</h1>
              <p className="text-white/40 text-sm">Welcome back, Admin</p>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard label="Total Bookings" value={stats.totalBookings} icon={BookOpen} color="bg-lime-accent/10 text-lime-accent" />
              <StatCard label="Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} icon={IndianRupee} color="bg-blue-400/10 text-blue-400" />
              <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-400/10 text-amber-400" />
              <StatCard label="Enquiries" value={stats.enquiries} icon={MessageSquare} color="bg-purple-400/10 text-purple-400" />
            </div>

            {/* Recent Bookings */}
            <div>
              <h2 className="text-2xl font-editorial italic mb-6">Recent Bookings</h2>
              <div className="bg-white/5 border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-white/30 uppercase tracking-widest text-xs">
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Package</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="text-white">{b.customerName}</p>
                          <p className="text-white/30 text-xs">{b.customerPhone}</p>
                        </td>
                        <td className="p-4 text-white/70">{b.packageTitle}</td>
                        <td className="p-4 text-white/70">{b.travelDate}</td>
                        <td className="p-4 text-lime-accent font-display">₹{b.totalAmount?.toLocaleString("en-IN")}</td>
                        <td className="p-4"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h1 className="text-4xl font-display tracking-tight">All Bookings <span className="text-white/30 text-2xl">({bookings.length})</span></h1>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-white/30 uppercase tracking-widest text-xs">
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Package</th>
                    <th className="text-left p-4">Travel Date</th>
                    <th className="text-left p-4">Travelers</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="text-white">{b.customerName}</p>
                        <p className="text-white/30 text-xs">{b.customerEmail}</p>
                        <p className="text-white/30 text-xs">{b.customerPhone}</p>
                      </td>
                      <td className="p-4 text-white/70">{b.packageTitle}</td>
                      <td className="p-4 text-white/70">{b.travelDate}</td>
                      <td className="p-4 text-white/70">{b.travelers}</td>
                      <td className="p-4 text-lime-accent font-display">₹{b.totalAmount?.toLocaleString("en-IN")}</td>
                      <td className="p-4"><StatusBadge status={b.status} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => updateBookingStatus(b.id, "confirmed")} className="text-lime-accent text-xs hover:underline">Confirm</button>
                          <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="text-red-400 text-xs hover:underline">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <p className="text-center text-white/30 py-16">No bookings yet</p>}
            </div>
          </motion.div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h1 className="text-4xl font-display tracking-tight">Enquiries <span className="text-white/30 text-2xl">({enquiries.length})</span></h1>
            <div className="space-y-4">
              {enquiries.map((e) => (
                <div key={e.id} className="bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-medium">{e.name}</p>
                      <p className="text-white/40 text-sm">{e.phone}</p>
                    </div>
                    <p className="text-white/20 text-xs">
                      {e.createdAt?.toDate?.()?.toLocaleDateString("en-IN") || "Recently"}
                    </p>
                  </div>
                  {e.comment && <p className="text-white/60 text-sm italic border-l-2 border-lime-accent/30 pl-4">"{e.comment}"</p>}
                </div>
              ))}
              {enquiries.length === 0 && <p className="text-center text-white/30 py-16">No enquiries yet</p>}
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h1 className="text-4xl font-display tracking-tight">Reviews <span className="text-white/30 text-2xl">({reviews.length})</span></h1>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className={`border p-6 transition-colors ${r.status === "approved" ? "bg-white/5 border-white/10" : "bg-red-400/5 border-red-400/20"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-medium">{r.userName}</p>
                      <p className="text-white/40 text-xs">{r.packageTitle} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${r.status === "approved" ? "text-lime-accent border-lime-accent/30" : "text-amber-400 border-amber-400/30"}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-4">"{r.review}"</p>
                  <div className="flex gap-4">
                    {r.status !== "approved" && (
                      <button onClick={() => updateReviewStatus(r.id, "approved")} className="text-lime-accent text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button onClick={() => updateReviewStatus(r.id, "rejected")} className="text-red-400 text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-center text-white/30 py-16">No reviews yet</p>}
            </div>
          </motion.div>
        )}

        {/* Seats Tab */}
        {activeTab === "seats" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h1 className="text-4xl font-display tracking-tight mb-2">Seat Management</h1>
              <p className="text-white/40 text-sm">Click on the Total number to edit seats for any package</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8">
              {packages.map((pkg) => (
                <SeatRow key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ManagePackages />
          </motion.div>
        )}

      </main>
    </div>
  );
}
