import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { favoritesAPI, ratingsAPI } from "../api";
import StarRating from "./StarRating";

function HallCard({ hall, isFavorite = false, onFavoriteChange = null }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const firstImage =
    hall.images && hall.images.length > 0
      ? hall.images[0]
      : "https://images.unsplash.com/photo-1519167471654-76ce0107279f?w=400&h=300&fit=crop";

  useEffect(() => {
    // Update favorite state when isFavorite prop changes
    setFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    // Load rating when component mounts
    loadRating();
  }, [hall.id]);

  const loadRating = async () => {
    try {
      const response = await ratingsAPI.getByHall(hall.id);
      setAverageRating(response.average_rating || 0);
      setTotalRatings(response.total_ratings || 0);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "client") {
      alert("Please login as a client to add favorites");
      return;
    }

    setLoading(true);
    const previousFavorite = favorite;
    setFavorite(!favorite); // Optimistic update

    try {
      if (previousFavorite) {
        await favoritesAPI.remove(hall.id);
      } else {
        await favoritesAPI.add(hall.id);
      }
      if (onFavoriteChange) {
        onFavoriteChange(!previousFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setFavorite(previousFavorite);
      alert(
        `Failed to ${previousFavorite ? "remove from" : "add to"} favorites: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExploreClick = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate("/login");
    } else {
      // Go to hall detail if logged in
      navigate(`/halls/${hall.id}`);
    }
  };

  return (
    <div className="card overflow-hidden h-full hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={firstImage}
          alt={hall.name}
          className="w-full h-56 object-cover"
        />
        {user && user.role === "client" && (
          <button
            onClick={handleFavoriteToggle}
            disabled={loading}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-md"
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span className="text-2xl">{favorite ? "❤️" : "🤍"}</span>
          </button>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{hall.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hall.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <span>📍</span>
            <span className="text-sm">{hall.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>👥</span>
            <span className="text-sm">Capacity: {hall.capacity} guests</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-primary">${hall.price}</span>
          <span className="text-xs text-gray-500">per event</span>
        </div>

        {hall.owner_name && (
          <div className="mb-4 pb-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mt-4">
              Owned by: <span className="font-semibold">{hall.owner_name}</span>
            </p>
          </div>
        )}

        <div className="mb-4 pb-4 border-t border-gray-200">
          <div className="pt-4">
            <StarRating
              hallId={hall.id}
              averageRating={averageRating}
              totalRatings={totalRatings}
              canRate={false}
            />
          </div>
        </div>

        <button
          onClick={handleExploreClick}
          className="block w-full btn-primary text-center"
        >
          🔍 Explore
        </button>
      </div>
    </div>
  );
}

export default HallCard;
