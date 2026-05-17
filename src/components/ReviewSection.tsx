import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, serverTimestamp
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Star, Send, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  userName: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: any;
}

interface ReviewSectionProps {
  packageId: string;
  packageTitle: string;
}

function StarRating({
  value, onChange, readonly = false, size = "md"
}: {
  value: number; onChange?: (v: number) => void; readonly?: boolean; size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function timeAgo(timestamp: any): string {
  if (!timestamp) return "Recently";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReviewSection({ packageId, packageTitle }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Real-time reviews
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("packageId", "==", packageId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(data);
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, [packageId]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) {
      setError("Please give a star rating and write your review.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "reviews"), {
        packageId,
        packageTitle,
        userId: user!.uid,
        userName: user!.displayName || "Anonymous Traveler",
        rating,
        review: reviewText.trim(),
        status: "approved", // auto-approve for now; can change to "pending" for moderation
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setRating(0);
      setReviewText("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-16 md:mt-24 px-4 sm:px-8 md:px-24 max-w-[1600px] mx-auto pb-16 md:pb-24">
      <div className="flex items-center gap-4 sm:gap-8 mb-8 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-editorial italic">Traveler Reviews</h2>
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="text-white/30 text-sm">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        {/* Left: Summary + Form */}
        <div className="space-y-8 sm:space-y-12">
          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8">
              <div className="text-center mb-8">
                <p className="text-7xl font-display text-lime-accent">{avgRating.toFixed(1)}</p>
                <StarRating value={Math.round(avgRating)} readonly size="md" />
                <p className="text-white/40 text-sm mt-2">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="space-y-3">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-white/40 text-xs w-4">{star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-white/30 text-xs w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="bg-white/5 border border-white/10 p-6 sm:p-8">
            <h3 className="text-xl font-editorial italic mb-6">
              {user ? "Write a Review" : "Sign in to Review"}
            </h3>

            {!user ? (
              <div className="text-center py-6 space-y-4">
                <User className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-white/40 text-sm">You need to be logged in to leave a review.</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 border border-lime-accent text-lime-accent text-xs uppercase tracking-widest hover:bg-lime-accent hover:text-mist-black transition-colors"
                >
                  Sign In
                </Link>
              </div>
            ) : submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 space-y-4"
              >
                <p className="text-4xl">🙏</p>
                <p className="text-lime-accent font-editorial italic text-xl">Thank you!</p>
                <p className="text-white/40 text-sm">Your review has been published.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                >
                  Write another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 block mb-3">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 block mb-3">Your Experience</label>
                  <textarea
                    id="review-text"
                    name="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your journey..."
                    rows={4}
                    required
                    className="w-full bg-transparent border border-white/10 p-4 focus:outline-none focus:border-lime-accent transition-colors placeholder:text-white/20 text-white resize-none text-sm"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-kimono-white text-mist-black font-display tracking-[0.2em] hover:bg-lime-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-2">
          {reviewsLoading ? (
            <div className="text-center py-24 text-white/30">
              <div className="w-8 h-8 border-2 border-lime-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm uppercase tracking-widest">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-24 border border-white/5">
              <Star className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-editorial italic text-white/40 mb-2">No reviews yet</h3>
              <p className="text-white/20 text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-lime-accent/10 border border-lime-accent/20 flex items-center justify-center">
                          <span className="text-lime-accent font-display text-sm">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{review.userName}</p>
                          <p className="text-white/30 text-xs">{timeAgo(review.createdAt)}</p>
                        </div>
                      </div>
                      <StarRating value={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{review.review}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
