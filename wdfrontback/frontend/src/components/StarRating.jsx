import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ratingsAPI } from "../api";

function StarRating({
  hallId,
  averageRating = 0,
  totalRatings = 0,
  userRating = null,
  canRate = false,
  onRatingSubmit = null,
}) {
  const { user } = useContext(AuthContext);
  const [hoverRating, setHoverRating] = useState(0);
  const [userCurrentRating, setUserCurrentRating] = useState(userRating);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setUserCurrentRating(userRating);
  }, [userRating]);

  const handleStarClick = async (star) => {
    if (!canRate || !user || user.role !== "client") {
      return;
    }

    setLoading(true);

    try {
      const response = await ratingsAPI.submit({
        hall_id: hallId,
        rating: star,
      });

      if (response.success) {
        setUserCurrentRating(star);
        setSuccess("Rating submitted!");
        setTimeout(() => setSuccess(""), 2000);

        if (onRatingSubmit) {
          onRatingSubmit({
            average_rating: response.average_rating,
            total_ratings: response.total_ratings,
            user_rating: response.user_rating,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setSuccess(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || userCurrentRating || averageRating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() =>
              canRate && user && user.role === "client" && setHoverRating(star)
            }
            onMouseLeave={() => setHoverRating(0)}
            disabled={!canRate || !user || user.role !== "client" || loading}
            className={`text-2xl transition ${
              star <= displayRating ? "text-yellow-400" : "text-gray-300"
            } ${canRate && user && user.role === "client" && !loading ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {averageRating > 0 ? (
          <span className="font-semibold text-gray-700">
            {averageRating.toFixed(1)}
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">
            Hall not rated yet
          </span>
        )}
      </div>

      {success && (
        <span className="text-xs text-green-600 font-semibold">{success}</span>
      )}

      {canRate && user && user.role === "client" && userCurrentRating && (
        <span className="text-xs text-primary font-semibold">Rated</span>
      )}

      {canRate && user && user.role === "client" && !userCurrentRating && (
        <span className="text-xs text-gray-600 font-medium">Click to rate</span>
      )}

      {!canRate && user && user.role === "client" && (
        <span className="text-xs text-gray-500">Approve booking to rate</span>
      )}

      {!user && <span className="text-xs text-gray-500">Login to rate</span>}
    </div>
  );
}

export default StarRating;
