import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";
import loginBackground from "../assets/loginsigninbackgroun.png";

function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

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
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 bg-white/10 shadow-2xl backdrop-blur-sm overflow-y-auto mr-6 rounded-xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💍</div>
            <h1 className="text-3xl font-bold">Join Wed Hall</h1>
            <p className="text-gray-600 mt-2">
              Create your account to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                I am a:
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="client">Client (Looking for halls)</option>
                <option value="owner">Owner (Have a hall to rent)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#C8A891] hover:text-opacity-80 font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
