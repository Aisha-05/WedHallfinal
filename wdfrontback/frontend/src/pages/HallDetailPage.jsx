import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hallsAPI, bookingsAPI, favoritesAPI, ratingsAPI } from "../api";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ImageGallery from "../components/ImageGallery";

function HallDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [userBookedHall, setUserBookedHall] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchHall();
  }, [id, user]);

  const fetchHall = async () => {
    try {
      setLoading(true);
      const data = await hallsAPI.getById(id);
      setHall(data.hall);
      setError(null);

      // Load ratings (non-blocking - fail silently)
      try {
        const ratingsData = await ratingsAPI.getByHall(id);
        setAverageRating(ratingsData.average_rating || 0);
        setTotalRatings(ratingsData.total_ratings || 0);
        setUserRating(ratingsData.user_rating?.rating || null);
      } catch (ratingErr) {
        console.error("Error loading ratings:", ratingErr);
        // Continue without ratings
        setAverageRating(0);
        setTotalRatings(0);
        setUserRating(null);
      }

      // Check if user has favorited this hall (only for clients, non-blocking)
      if (user && user.role === "client") {
        try {
          const favoritesData = await favoritesAPI.getAll();
          const isFav = favoritesData.favorites?.some(
            (fav) => parseInt(fav.id) === parseInt(id),
          );
          setIsFavorite(isFav || false);
        } catch (favErr) {
          console.error("Error loading favorites:", favErr);
          setIsFavorite(false);
        }
      }

      // Check if user has booked this hall (only for clients, non-blocking)
      if (user && user.role === "client") {
        try {
          const bookingsData = await bookingsAPI.getAll();
          const hasBooked = bookingsData.bookings?.some(
            (b) =>
              parseInt(b.hall_id) === parseInt(id) && b.status === "approved",
          );
          setUserBookedHall(hasBooked || false);
        } catch (bookingErr) {
          console.error("Error loading bookings:", bookingErr);
          // Continue without booking check
          setUserBookedHall(false);
        }
      }
    } catch (err) {
      console.error("Error loading hall:", err);
      setError("Failed to load hall details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "client") {
      alert("Please login as a client to book a hall");
      navigate("/login");
      return;
    }

    if (!hall) {
      setBookingError("Hall data is still loading. Please wait.");
      return;
    }

    if (!startDate || !endDate) {
      setBookingError("Please select both start and end dates");
      return;
    }

    // Validate end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      setBookingError("End date must be after start date");
      return;
    }

    setBookingError("");
    setBookingLoading(true);
    try {
      await bookingsAPI.create({
        hall_id: hall.id,
        start_date: startDate,
        end_date: endDate,
      });
      alert("Booking request submitted! The owner will review your request.");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      // Check if it's a conflict error (409)
      if (
        error.message.includes("already booked") ||
        error.message.includes("requested dates")
      ) {
        setBookingError(
          "This hall is already booked for the requested dates. Please choose different dates.",
        );
      } else {
        setBookingError("Booking failed: " + error.message);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || user.role !== "client") {
      alert("Please login as a client to add favorites");
      navigate("/login");
      return;
    }

    const previousFavorite = isFavorite;
    setIsFavorite(!isFavorite); // Optimistic update

    try {
      if (previousFavorite) {
        await favoritesAPI.remove(hall.id);
      } else {
        await favoritesAPI.add(hall.id);
      }
    } catch (error) {
      // Revert on error
      setIsFavorite(previousFavorite);
      alert(
        `Failed to ${previousFavorite ? "remove from" : "add to"} favorites: ${error.message}`,
      );
    }
  };

  const handleRatingUpdate = (newRating) => {
    setAverageRating(newRating.average_rating);
    setTotalRatings(newRating.total_ratings);
    setUserRating(newRating.user_rating);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
      </div>
    );
  }

  if (error || !hall) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Hall not found or error loading hall details
        </div>
      </div>
    );
  }

  const firstImage =
    hall.images && hall.images.length > 0
      ? hall.images[0]
      : "https://images.unsplash.com/photo-1519167471654-76ce0107279f?w=800&h=600&fit=crop";

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-purple-700 font-semibold"
        >
          ← Back to halls
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="card overflow-hidden mb-8">
              <img
                src={firstImage}
                alt={hall.name}
                className="w-full h-96 object-cover cursor-pointer hover:opacity-90 transition"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setGalleryOpen(true);
                }}
              />

              {hall.images && hall.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-gray-100">
                  {hall.images.slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="h-20 object-cover rounded cursor-pointer hover:opacity-75 transition"
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        setGalleryOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">{hall.name}</h1>

              <div className="flex items-center gap-8 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-lg">{hall.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="text-lg">
                    Capacity: {hall.capacity} guests
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                {hall.description}
              </p>

              {hall.services && hall.services.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Services Provided</h2>
                  <div className="flex flex-wrap gap-3">
                    {hall.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold"
                      >
                        ✓ {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hall.owner_name && (
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Managed by</h3>
                  <p className="text-lg">{hall.owner_name}</p>
                  {hall.owner_email && (
                    <p className="text-sm text-gray-600">{hall.owner_email}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="card p-8 mb-8 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Price per event</p>
                <p className="text-4xl font-bold text-primary">${hall.price}</p>
              </div>

              {/* Rating Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 mb-3 font-semibold">Rating</p>
                <StarRating
                  hallId={hall.id}
                  averageRating={averageRating}
                  totalRatings={totalRatings}
                  userRating={userRating}
                  canRate={userBookedHall}
                  onRatingSubmit={handleRatingUpdate}
                />
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className={`w-full py-3 rounded-lg font-semibold mb-4 transition border-2 ${
                  isFavorite
                    ? "bg-secondary text-white border-secondary"
                    : "border-secondary text-secondary hover:bg-pink-50"
                }`}
              >
                {isFavorite
                  ? "❤️ Remove from Favorites"
                  : "🤍 Add to Favorites"}
              </button>

              {/* Booking Form */}
              {user && user.role === "client" && (
                <form onSubmit={handleBooking}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setBookingError("");
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setBookingError("");
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="input-field"
                      required
                    />
                  </div>

                  {bookingError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary w-full"
                  >
                    {bookingLoading ? "Booking..." : "Request Booking"}
                  </button>
                </form>
              )}

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  <a
                    href="/login"
                    className="text-primary hover:text-purple-700 font-semibold"
                  >
                    Login
                  </a>{" "}
                  to book this hall
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {galleryOpen && hall.images && (
        <ImageGallery
          images={hall.images}
          initialIndex={selectedImageIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}

export default HallDetailPage;
