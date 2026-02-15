import React, { useState, useEffect, useContext } from "react";
import HallCard from "../components/HallCard";
import { hallsAPI, favoritesAPI } from "../api";
import { AuthContext } from "../context/AuthContext";

function HallsPage() {
  const { user } = useContext(AuthContext);
  const [halls, setHalls] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    if (user && user.role === "client") {
      fetchFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const data = await hallsAPI.getAll();
      setHalls(data.halls || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await favoritesAPI.getAll();
      const favoriteIds = new Set(data.favorites?.map((fav) => fav.id) || []);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Error loading favorites:", err);
      // Still set empty set on error, don't break the page
      setFavorites(new Set());
    }
  };

  const handleFavoriteChange = (hallId, isFavorite) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(hallId);
    } else {
      newFavorites.delete(hallId);
    }
    setFavorites(newFavorites);
  };

  const filteredHalls = halls.filter((hall) => {
    const matchesSearch =
      hall.name.toLowerCase().includes(search.toLowerCase()) ||
      hall.location.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "budget") return matchesSearch && hall.price < 5000;
    if (filter === "premium") return matchesSearch && hall.price >= 5000;

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Wedding Halls</h1>
          <p className="text-gray-600 text-lg">
            Browse and book from our collection of beautiful wedding venues
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Filter by Price
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (Under $5000)</option>
                <option value="premium">Premium ($5000+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Error loading halls: {error}
          </div>
        ) : filteredHalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No halls found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHalls.map((hall) => (
              <HallCard
                key={hall.id}
                hall={hall}
                isFavorite={favorites.has(hall.id)}
                onFavoriteChange={(isFavorite) =>
                  handleFavoriteChange(hall.id, isFavorite)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HallsPage;
