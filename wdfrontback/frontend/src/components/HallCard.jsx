import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { favoritesAPI, ratingsAPI } from "../api";

/* -- Star Display (shared uniform style) -- */
function StarDisplay({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <svg key={star} viewBox="0 0 20 20" className="w-4 h-4" fill={filled ? "#A0795C" : half ? "url(#halfStarCard)" : "#E0D0C1"}>
              {half && (<defs><linearGradient id="halfStarCard"><stop offset="50%" stopColor="#A0795C" /><stop offset="50%" stopColor="#E0D0C1" /></linearGradient></defs>)}
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-[#6B4F3A]">{rating > 0 ? rating.toFixed(1) : "\u2014"}</span>
      {count > 0 && <span className="text-xs text-[#B5A89E]">({count})</span>}
    </div>
  );
}

function HallCard({ hall, isFavorite = false, onFavoriteChange = null }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(hall.average_rating || 0);
  const [totalRatings, setTotalRatings] = useState(hall.total_ratings || 0);

  const firstImage =
    hall.images && hall.images.length > 0
      ? hall.images[0]
      : "https://images.unsplash.com/photo-1519167471654-76ce0107279f?w=500&h=300&fit=crop";

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    // If rating not included from backend, load it
    if (!hall.average_rating && hall.average_rating !== 0) {
      loadRating();
    }
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
    e.stopPropagation();
    if (!user || user.role !== "client") {
      alert("Please login as a client to add favorites");
      return;
    }

    setLoading(true);
    const previousFavorite = favorite;
    setFavorite(!favorite);

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
      setFavorite(previousFavorite);
      alert(`Failed to ${previousFavorite ? "remove from" : "add to"} favorites: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/halls/${hall.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-[#E0D0C1]/40 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={firstImage} alt={hall.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#6B4F3A] px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">${hall.price}</div>
        {/* Capacity badge */}
        <div className="absolute top-3 left-3 bg-[#6B4F3A]/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>
          {hall.capacity}
        </div>
        {/* Favorite heart */}
        {user && user.role === "client" && (
          <button
            onClick={handleFavoriteToggle}
            disabled={loading}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#F5EDE4] transition-all duration-300 shadow-sm"
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill={favorite ? "#A0795C" : "none"} stroke={favorite ? "#A0795C" : "#C8A891"} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-[#6B4F3A] leading-tight mb-2">{hall.name}</h3>
        <div className="mb-3"><StarDisplay rating={averageRating} count={totalRatings} /></div>
        <p className="text-[#9C8577] text-sm mb-3 line-clamp-2 leading-relaxed">{hall.description}</p>
        <div className="flex items-center gap-1.5 text-[#B5A89E] text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#C8A891]"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
          {hall.location}
        </div>

        {hall.services && hall.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hall.services.slice(0, 3).map((s, idx) => (<span key={idx} className="px-2.5 py-1 bg-[#F5EDE4] text-[#8B6F47] text-xs rounded-full font-medium">{s}</span>))}
            {hall.services.length > 3 && <span className="px-2.5 py-1 bg-[#F5EDE4] text-[#B5A89E] text-xs rounded-full">+{hall.services.length - 3}</span>}
          </div>
        )}

        {hall.owner_name && (
          <div className="mt-auto pt-3 border-t border-[#E0D0C1]/40">
            <p className="text-xs text-[#B5A89E]">Managed by <span className="font-semibold text-[#9C8577]">{hall.owner_name}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HallCard;