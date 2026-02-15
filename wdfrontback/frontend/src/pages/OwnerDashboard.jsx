import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hallsAPI, bookingsAPI } from "../api";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("halls");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hallsData = await hallsAPI.getOwnerHalls();
      setHalls(hallsData.halls || []);

      const bookingsData = await bookingsAPI.getAll();
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHall = async (hallId) => {
    if (!window.confirm("Are you sure you want to delete this hall?")) {
      return;
    }

    try {
      await hallsAPI.delete(hallId);
      setHalls(halls.filter((h) => h.id !== hallId));
      alert("Hall deleted successfully");
    } catch (err) {
      alert("Failed to delete hall: " + err.message);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.update(bookingId, { status: newStatus });

      // Update bookings list
      const updatedBookings = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b,
      );
      setBookings(updatedBookings);
      alert("Booking status updated");
    } catch (err) {
      alert("Failed to update booking: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Owner Dashboard</h1>
          <button
            onClick={() => navigate("/owner/add-hall")}
            className="btn-primary"
          >
            + Add New Hall
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            Error: {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("halls")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "halls"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            My Halls ({halls.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "bookings"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
        </div>

        {/* Halls Tab */}
        {activeTab === "halls" && (
          <div>
            {halls.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 text-lg mb-6">
                  You haven't added any halls yet.
                </p>
                <button
                  onClick={() => navigate("/owner/add-hall")}
                  className="btn-primary"
                >
                  Add Your First Hall
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {halls.map((hall) => (
                  <div
                    key={hall.id}
                    className="card overflow-hidden hover:shadow-xl transition"
                  >
                    {hall.images && hall.images.length > 0 && (
                      <img
                        src={hall.images[0]}
                        alt={hall.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{hall.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {hall.description}
                      </p>

                      <div className="mb-4 space-y-2">
                        <p className="text-sm text-gray-600">
                          📍 {hall.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          💵 ${hall.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          👥 {hall.capacity} guests
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/owner/edit-hall/${hall.id}`)
                          }
                          className="flex-1 btn-outline text-sm py-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHall(hall.id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No booking requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="card p-6 hover:shadow-lg transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-600">Hall</p>
                        <p className="font-bold">{booking.hall_name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Client</p>
                        <p className="font-bold">{booking.client_name}</p>
                        <p className="text-xs text-gray-500">
                          {booking.client_email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-bold">
                          {new Date(booking.start_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          to{" "}
                          {new Date(booking.end_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking.id,
                                  "approved",
                                )
                              }
                              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking.id,
                                  "rejected",
                                )
                              }
                              className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
