import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <nav className="bg-[#C8A891] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Wed Hall
            </div>
          </Link>

          <div
            className="flex items-center gap-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {!user || user.role === "client" ? (
              <Link
                to="/halls"
                className="text-white hover:underline hover:scale-105 transition duration-200"
              >
                Discover Venues
              </Link>
            ) : null}

            {user && user.role === "client" && (
              <>
                <Link
                  to="/favorites"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  Favorites
                </Link>
                <Link
                  to="/bookings"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  Profile
                </Link>
              </>
            )}

            {user && user.role === "owner" && (
              <>
                <Link
                  to="/owner/dashboard"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/owner/add-hall"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  Add Hall
                </Link>
                <Link
                  to="/owner/profile"
                  className="text-white hover:underline hover:scale-105 transition duration-200"
                >
                  Profile
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profile_picture ||
                      "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-100">
                      {user.role === "owner" ? "Owner" : "Client"}
                    </p>
                  </div>
                </div>

                <Link
                  to={user.role === "owner" ? "/owner/profile" : "/profile"}
                  className="text-white hover:underline hover:scale-105 transition duration-200 text-sm font-semibold"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-white hover:underline hover:scale-105 transition duration-200 font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:underline hover:scale-105 transition duration-200 font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
