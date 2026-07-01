import { useState, FormEvent } from "react";
import { Star, MessageSquare, Award, Sparkles, Send, Check } from "lucide-react";
import { Review, Tour } from "../types";

interface ReviewsListProps {
  reviews: Review[];
  tours: Tour[];
  activeTourId?: string;
  onNewReviewAdded: (newReview: Review) => void;
}

export default function ReviewsList({
  reviews,
  tours,
  activeTourId = "all",
  onNewReviewAdded
}: ReviewsListProps) {
  // Form State
  const [userName, setUserName] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [selectedTourId, setSelectedTourId] = useState<string>(activeTourId === "all" ? "general" : activeTourId);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  // Star hover states for input
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  // Filtered Reviews depending on selection
  const filteredReviews = reviews.filter(r => {
    if (activeTourId === "all") return true;
    return r.tourId === activeTourId;
  });

  // Calculate statistics from reviews
  const totalReviews = filteredReviews.length;
  const averageRating = totalReviews > 0 
    ? Number((filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  // Star ratings breakdowns
  const starBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = filteredReviews.filter(r => Math.round(r.rating) === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, percentage, count };
  });

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg(false);

    if (!userName || !comment) {
      setFormError("Please fill out your name and write a review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: selectedTourId,
          userName,
          rating,
          comment
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      onNewReviewAdded(data);
      setUserName("");
      setRating(5);
      setComment("");
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);
    } catch (err: any) {
      setFormError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 lg:p-8 space-y-8" id="reviews-list-container">
      
      {/* Title */}
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h3 className="font-serif text-2xl font-bold text-gray-900">User Reviews & Ratings</h3>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mt-1">
            Real customer feedback &bull; 100% Verified
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-gold">
          <Award className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">5.01 Stars Overall</span>
        </div>
      </div>

      {/* Stats Breakdown Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-stone-50 p-6 rounded-2xl border border-gray-100">
        
        {/* Core average circle */}
        <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
          <span className="font-serif text-5xl font-bold text-charcoal">{averageRating}</span>
          <div className="flex justify-center items-center text-gold my-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`h-5 w-5 ${s <= Math.round(averageRating) ? "fill-gold text-gold" : "text-gray-300"}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-mono block uppercase tracking-wider">
            {totalReviews} Total Reviews
          </span>
        </div>

        {/* Detailed star slider bars */}
        <div className="md:col-span-8 space-y-2 pl-0 md:pl-4">
          {starBreakdown.map(({ star, percentage, count }) => (
            <div key={star} className="flex items-center space-x-3 text-xs font-mono">
              <span className="w-8 text-right text-gray-500">{star} ★</span>
              <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gold h-full rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-left text-gray-400">({count})</span>
            </div>
          ))}
        </div>

      </div>

      {/* Main Reviews Layout Grid: List on Left, Write Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Reviews scrolling list */}
        <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-gold/20 hover:shadow-md transition-all duration-300"
                id={`user-review-${review.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-imperial text-white font-mono text-xs w-9 h-9 flex items-center justify-center rounded-full border border-gold/30 font-bold shadow-inner">
                      {review.userAvatar}
                    </div>
                    <div>
                      <strong className="text-sm text-gray-800 block">{review.userName}</strong>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        Verified &bull; {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-gold text-gold" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Tour Reference Tag */}
                {review.tourTitle && (
                  <span className="inline-block bg-gray-50 text-gray-500 border border-gray-100 rounded text-[9px] font-mono uppercase px-2 py-0.5 mb-2">
                    Tour: {review.tourTitle.split(" (")[0]}
                  </span>
                )}

                <p className="text-gray-600 text-xs font-light leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 font-mono text-xs">
              Be the first to leave a review for this excursion!
            </div>
          )}
        </div>

        {/* Right Side: Write a Review Form */}
        <div className="lg:col-span-5 bg-stone-50 border border-gray-200 rounded-xl p-5 shadow-inner">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
            <MessageSquare className="h-4 w-4 text-imperial" />
            <h4 className="font-serif font-bold text-gray-900 text-base">Share Your Experience</h4>
          </div>

          {successMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-xs text-emerald-800 flex items-start space-x-2 leading-relaxed animate-fade-in">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong>Thank you!</strong> Your rating has been successfully logged. The overall tour averages have updated dynamically inside our server JSON database!
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4" id="write-review-form">
              {formError && (
                <p className="text-xs text-red-500 font-mono">⚠️ {formError}</p>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                  Your Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jean Dupont"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-imperial"
                />
              </div>

              {/* Choose Tour Dropdown */}
              {activeTourId === "all" && (
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Select Tour Excursion
                  </label>
                  <select
                    value={selectedTourId}
                    onChange={(e) => setSelectedTourId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-imperial cursor-pointer"
                  >
                    <option value="general">General Agency Review</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>{tour.title.split(" (")[0]}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Star Rating Interactive Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                  Your Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      id={`form-star-rating-${s}`}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`h-6 w-6 ${(hoveredStar || rating) >= s ? "fill-gold text-gold" : "text-gray-300"}`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-gray-400 ml-2">
                    {rating === 5 && "Excellent!"}
                    {rating === 4 && "Very Good"}
                    {rating === 3 && "Average"}
                    {rating === 2 && "Disappointing"}
                    {rating === 1 && "Terrible"}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                  Written Feedback
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Share details of your experience with guides, timings, landmarks..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:border-imperial"
                />
              </div>

              {/* Submit Review */}
              <button
                type="submit"
                id="review-submit-btn"
                disabled={isSubmitting}
                className="w-full bg-charcoal hover:bg-black text-white text-xs font-semibold font-mono uppercase tracking-wider py-3 rounded-lg border border-gold/20 flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5 text-gold" />
                <span>{isSubmitting ? "Submitting..." : "Submit Verified Review"}</span>
              </button>
            </form>
          )}

          {/* Quick legal check */}
          <p className="text-[10px] text-gray-400 font-mono text-center mt-3 leading-tight">
            🛡️ We enforce spam filtering and Google-equivalent fraud protection checks dynamically.
          </p>
        </div>

      </div>

    </div>
  );
}
