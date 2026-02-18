import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative text-white/90 hover:text-white font-medium tracking-wide transition-all duration-300 py-1 ${
      isActive(path)
        ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full"
        : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white/50 hover:after:rounded-full"
    }`;

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  return (
    <>
      <nav className="bg-[#C8A891] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                Wed Hall
              </div>
            </Link>

            {/* Navigation Links */}
            <div
              className="flex items-center gap-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {/* Client / Guest Links */}
              {(!user || user.role === "client") && (
                <>
                  <Link to="/" className={linkClass("/")}>
                    Home
                  </Link>
                  <Link to="/halls" className={linkClass("/halls")}>
                    Discover Venues
                  </Link>
                </>
              )}

              {user && user.role === "client" && (
                <>
                  <Link to="/favorites" className={linkClass("/favorites")}>
                    Favorites
                  </Link>
                  <Link to="/bookings" className={linkClass("/bookings")}>
                    My Bookings
                  </Link>
                </>
              )}

              {/* Owner Links */}
              {user && user.role === "owner" && (
                <>
                  <Link to="/" className={linkClass("/")}>
                    Home
                  </Link>
                  <Link
                    to="/owner/dashboard"
                    className={linkClass("/owner/dashboard")}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {/* Divider */}
              {user && (
                <div className="w-px h-6 bg-white/30 mx-1"></div>
              )}

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={user.role === "owner" ? "/owner/profile" : "/profile"}
                    className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 rounded-full pl-1 pr-4 py-1 transition-all duration-300"
                  >
                    <img
                      src={
                        user.profile_picture ||
                        "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-white/60 leading-tight">
                        {user.role === "owner" ? "Hall Owner" : "Client"}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-white/15 text-white/90 hover:text-white hover:bg-white/25 px-4 py-2 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-[#A0795C] hover:bg-white/90 px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#6B4F3A]/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center animate-[fadeIn_0.2s_ease-out]">
            {/* Icon */}
            <div className="w-14 h-14 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A0795C"
                strokeWidth="2"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">
              Confirm Logout
            </h3>
            <p className="text-[#9C8577] mb-6 text-sm">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-5 py-2.5 rounded-full border-2 border-[#E0D0C1] text-[#6B4F3A] font-medium tracking-wide hover:bg-[#F5EDE4] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-5 py-2.5 rounded-full bg-[#A0795C] text-white font-medium tracking-wide hover:bg-[#8B6F47] transition-all duration-300 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
