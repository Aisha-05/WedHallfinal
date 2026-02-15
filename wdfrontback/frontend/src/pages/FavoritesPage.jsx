import React, { useState, useEffect } from "react";
import HallCard from "../components/HallCard";
import { favoritesAPI } from "../api";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoritesAPI.getAll();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (hallId) => {
    setFavorites(favorites.filter((fav) => fav.id !== hallId));
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">My Favorite Halls</h1>
        <p className="text-gray-600 mb-12">Halls you've marked as favorite</p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Error loading favorites: {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              You haven't added any favorites yet.
            </p>
            <a href="/halls" className="btn-primary inline-block">
              Browse Halls
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((hall) => (
              <HallCard
                key={hall.id}
                hall={hall}
                isFavorite={true}
                onFavoriteChange={(isFav) => {
                  if (!isFav) handleRemoveFavorite(hall.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
