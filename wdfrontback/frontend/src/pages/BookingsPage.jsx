import React, { useState, useEffect } from "react";
import { bookingsAPI } from "../api";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getAll();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
        <p className="text-gray-600 mb-8">
          Track and manage your wedding hall bookings
        </p>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Error loading bookings: {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">No bookings found.</p>
            <a href="/halls" className="btn-primary inline-block">
              Browse Halls
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="card p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {booking.hall_name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Owned by: {booking.owner_name}
                    </p>
                    <p className="text-gray-600">
                      📅{" "}
                      {new Date(booking.start_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}{" "}
                      to{" "}
                      {new Date(booking.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500">
                      Booked on{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
