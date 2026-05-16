import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/my-bookings");
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/my-bookings");
    } catch (err: any) {
      console.error(err);
      setError("Google sign-in failed.");
    }
  };

  return (
    <main className="min-h-screen bg-mist-black text-kimono-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/kedarnath.jpg" alt="bg" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-mist-black via-mist-black/95 to-transparent" />
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-10 flex items-center gap-2 group text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:text-lime-accent transition-colors" />
        <span className="text-xs uppercase tracking-widest">Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lime-accent text-xs uppercase tracking-[0.4em] mb-4">India Tours</p>
          <h1 className="text-5xl font-display tracking-tight">Welcome Back</h1>
          <p className="text-white/40 mt-4 text-sm">Sign in to view your bookings</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="login-email"
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
                id="login-password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {loading ? "SIGNING IN..." : "SIGN IN"}
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
            <span className="font-display text-sm tracking-[0.2em]">SIGN IN WITH GOOGLE</span>
          </button>

          <p className="text-center text-white/30 text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-lime-accent hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
