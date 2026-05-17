import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/my-bookings");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled. Please enable Google in Firebase Console → Authentication → Sign-in method.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is unauthorized. Please add this Vercel domain to Authorized Domains in Firebase Console → Authentication → Settings.");
      } else {
        setError(`Google sign-in failed: ${err.message || err.code || "unknown error"}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/my-bookings");
    } catch (err: any) {
      console.error("Registration error:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") setError("This email is already registered. Please login.");
      else if (err.code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (err.code === "auth/operation-not-allowed") setError("Email/Password login is not enabled in Firebase. Please enable it in Firebase Console → Authentication → Sign-in method.");
      else if (err.code === "auth/network-request-failed") setError("Network error. Please check your internet connection.");
      else setError(`Error: ${err.code || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-mist-black text-kimono-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero.jpg" alt="bg" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-mist-black via-mist-black/95 to-transparent" />
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex items-center gap-2 group text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:text-lime-accent transition-colors" />
        <span className="text-xs uppercase tracking-widest">Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mt-16 sm:mt-0"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-lime-accent text-xs uppercase tracking-[0.4em] mb-4">India Tours</p>
          <h1 className="text-3xl sm:text-5xl font-display tracking-tight">Create Account</h1>
          <p className="text-white/40 mt-4 text-sm">Join us for your divine journey</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/30 text-white"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/30 text-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-transparent border-b border-white/20 pl-8 py-3 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/30 text-white"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-3 px-4 border border-red-400/20">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-kimono-white text-mist-black font-display text-lg tracking-[0.2em] hover:bg-lime-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-mist-black/50 backdrop-blur-md px-4 text-white/30">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white/5 border border-white/10 text-white flex items-center justify-center gap-4 hover:bg-white/10 transition-all duration-300 group"
          >
            <FcGoogle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm tracking-[0.2em]">SIGN UP WITH GOOGLE</span>
          </button>

          <p className="text-center text-white/30 text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-lime-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
