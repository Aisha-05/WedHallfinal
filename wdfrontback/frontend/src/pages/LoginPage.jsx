import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";
import loginBackground from "../assets/loginsigninbackgroun.png";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authAPI.login(formData);
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/halls");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 bg-white/10 shadow-2xl backdrop-blur-sm mr-6 rounded-xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💍</div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-[#9C8577] mt-2">
              Log in to your Wed Hall account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-[#9C8577]">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#C8A891] hover:text-opacity-80 font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
