import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthContext } from "./context/AuthContext";
import { authAPI } from "./api";

// Pages
import HomePage from "./pages/HomePage";
import HallsPage from "./pages/HallsPage";
import HallDetailPage from "./pages/HallDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import OwnerProfilePage from "./pages/OwnerProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddHallPage from "./pages/AddHallPage";
import EditHallPage from "./pages/EditHallPage";
import BookingsPage from "./pages/BookingsPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const data = await authAPI.me();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/halls" element={<HallsPage />} />
              <Route path="/halls/:id" element={<HallDetailPage />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <LoginPage />}
              />
              <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : <SignupPage />}
              />

              {/* Protected Routes - Client */}
              <Route
                path="/profile"
                element={
                  user && user.role === "client" ? (
                    <ProfilePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/favorites"
                element={
                  user && user.role === "client" ? (
                    <FavoritesPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/bookings"
                element={
                  user && user.role === "client" ? (
                    <BookingsPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Protected Routes - Owner */}
              <Route
                path="/owner/profile"
                element={
                  user && user.role === "owner" ? (
                    <OwnerProfilePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/owner/dashboard"
                element={
                  user && user.role === "owner" ? (
                    <OwnerDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/owner/add-hall"
                element={
                  user && user.role === "owner" ? (
                    <AddHallPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/owner/edit-hall/:id"
                element={
                  user && user.role === "owner" ? (
                    <EditHallPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
