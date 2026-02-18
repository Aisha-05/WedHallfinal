import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPicture(true);
    setError("");

    try {
      const response = await authAPI.uploadProfilePicture(file);
      if (response.user) {
        setUser(response.user);
        setSuccess("Profile picture updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Failed to upload profile picture: " + err.message);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.user) {
        setUser(response.user);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-primary-dark hover:text-secondary font-semibold"
        >
          ← Back
        </button>

        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="mb-8 pb-8 border-b border-[#E0D0C1]/60">
            <label className="block text-sm font-semibold text-[#9C8577] mb-4">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={
                    user.profile_picture ||
                    "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                  }
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-dark"
                />
              </div>

              <div>
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    disabled={uploadingPicture}
                    className="hidden"
                  />
                  <span
                    className={`inline-block px-4 py-2 rounded-lg font-semibold transition ${
                      uploadingPicture
                        ? "bg-[#E0D0C1] text-[#9C8577] cursor-not-allowed"
                        : "btn-primary"
                    }`}
                  >
                    {uploadingPicture ? "Uploading..." : "Change Picture"}
                  </span>
                </label>
                <p className="text-xs text-[#B5A89E] mt-2">
                  JPG, PNG, GIF or WebP • Max 2MB
                </p>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field bg-cream cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Account Type
                </label>
                <div className="flex items-center">
                  <span className="bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Client
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Member Since
                </label>
                <p className="text-lg text-[#6B4F3A]">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-[#E0D0C1]/60">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name });
                    setError("");
                  }}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="pb-6 border-b border-[#E0D0C1]/60">
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Full Name
                </label>
                <p className="text-xl">{user.name}</p>
              </div>

              <div className="pb-6 border-b border-[#E0D0C1]/60">
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Email
                </label>
                <p className="text-xl">{user.email}</p>
              </div>

              <div className="pb-6 border-b border-[#E0D0C1]/60">
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Account Type
                </label>
                <p className="text-xl">
                  <span className="bg-primary-dark text-white px-3 py-1 rounded-full text-sm">
                    Client
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#9C8577] mb-2">
                  Member Since
                </label>
                <p className="text-xl">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-[#E0D0C1]/60">
                <p className="text-[#9C8577] text-sm">
                  For account changes or support, please contact us at
                  support@wedhall.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
