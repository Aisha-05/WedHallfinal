import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hallsAPI } from "../api";

function AddHallPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    capacity: "",
    images: [],
    services: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const MAX_IMAGES = 5;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - formData.images.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed. Remove an image first.`);
      return;
    }
    if (files.length > remaining) {
      setError(`You can only add ${remaining} more image${remaining === 1 ? '' : 's'}. Selected ${files.length}.`);
      setSelectedFiles(files.slice(0, remaining));
    } else {
      setSelectedFiles(files);
    }
    setUploadProgress(0);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      selectedFiles.forEach((file) => {
        formDataToSend.append("images[]", file);
      });

      const response = await fetch("/backend/index.php?route=halls/uploadImages", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      let data = null;
      const text = await response.text();

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      if (data?.images && data.images.length > 0) {
        setFormData((prev) => {
          const combined = [...prev.images, ...data.images];
          return { ...prev, images: combined.slice(0, MAX_IMAGES) };
        });
        setSelectedFiles([]);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 2000);
      }

      if (data?.errors && data.errors.length > 0) {
        setError("Some files failed to upload: " + data.errors.join(", "));
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlAdd = () => {
    if (formData.images.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. Remove an image first.`);
      return;
    }
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleServiceAdd = () => {
    const serviceName = prompt(
      "Enter service name (e.g., Catering, DJ, Parking):",
    );
    if (serviceName && serviceName.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, serviceName.trim()],
      }));
    }
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.location ||
      !formData.price ||
      !formData.capacity
    ) {
      setError("All fields are required");
      return;
    }

    if (parseFloat(formData.price) <= 0 || parseInt(formData.capacity) <= 0) {
      setError("Price and capacity must be greater than 0");
      return;
    }

    if (formData.images.length === 0) {
      setError("Please add at least one image");
      return;
    }

    setLoading(true);

    try {
      await hallsAPI.create({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        images: formData.images,
        services: formData.services,
      });

      alert("Hall added successfully!");
      navigate("/owner/dashboard");
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
          onClick={() => navigate(-1)}
          className="mb-6 text-primary-dark hover:text-secondary font-semibold"
        >
          ← Back
        </button>

        <div className="card p-8">
          <h1 className="text-4xl font-bold mb-8">Add New Hall</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Hall Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Royal Grand Hall"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                rows="5"
                placeholder="Describe your hall, amenities, and special features..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Downtown, New York"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price (per event)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="5000"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Capacity (guests)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Images <span className="text-[#B5A89E] text-xs font-normal">({formData.images.length}/{MAX_IMAGES})</span></label>
              <p className="text-[#9C8577] text-sm mb-4">
                Upload up to {MAX_IMAGES} images. The first image will be used as the hall cover.
              </p>

              {/* File Upload Section */}
              <div className="mb-6 p-4 border-2 border-dashed border-[#E0D0C1] rounded-lg">
                <input
                  type="file"
                  id="imageInput"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="imageInput" className="block cursor-pointer">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-[#6B4F3A] font-semibold mb-1">
                      Click to select images or drag and drop
                    </p>
                    <p className="text-[#B5A89E] text-sm">
                      Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)
                    </p>
                  </div>
                </label>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E0D0C1]">
                    <p className="text-sm font-semibold mb-2">
                      Selected files: {selectedFiles.length}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-[#9C8577] truncate"
                        >
                          ✓ {file.name}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadImages}
                      disabled={uploading}
                      className="btn-primary w-full"
                    >
                      {uploading
                        ? `Uploading... ${uploadProgress}%`
                        : "⬆️ Upload Images"}
                    </button>
                  </div>
                )}
              </div>

              {/* Added Images Preview */}
              {formData.images.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">
                    Added Images ({formData.images.length}/{MAX_IMAGES})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Hall ${idx}`}
                          className={`w-full h-24 object-cover rounded ${idx === 0 ? 'ring-2 ring-[#A0795C]' : ''}`}
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#A0795C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Cover</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Add Button */}
              <button
                type="button"
                onClick={handleImageUrlAdd}
                disabled={formData.images.length >= MAX_IMAGES}
                className={`btn-outline w-full ${formData.images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                + Add Image URL
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Services{" "}
                <span className="text-[#B5A89E] text-xs">(Optional)</span>
              </label>
              <p className="text-[#9C8577] text-sm mb-4">
                Add services provided by your hall (e.g., Catering, DJ, Parking,
                Decoration)
              </p>

              {formData.services.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-cream text-secondary px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span>✓ {service}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="text-primary-dark hover:text-secondary font-semibold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleServiceAdd}
                className="btn-outline w-full"
              >
                + Add Service
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Adding hall..." : "Add Hall"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddHallPage;
