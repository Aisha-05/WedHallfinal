import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hallsAPI } from "../api";

function EditHallPage() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHall();
  }, [id]);

  const fetchHall = async () => {
    try {
      setLoading(true);
      const data = await hallsAPI.getById(id);
      setFormData({
        name: data.hall.name,
        description: data.hall.description,
        location: data.hall.location,
        price: data.hall.price,
        capacity: data.hall.capacity,
        images: data.hall.images || [],
        services: data.hall.services || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlAdd = () => {
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
    const serviceName = prompt("Enter service name:");
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

    setSubmitLoading(true);

    try {
      await hallsAPI.update(id, {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        images: formData.images,
        services: formData.services,
      });

      alert("Hall updated successfully!");
      navigate("/owner/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
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
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-purple-700 font-semibold"
        >
          ← Back
        </button>

        <div className="card p-8">
          <h1 className="text-4xl font-bold mb-8">Edit Hall</h1>

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
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Images</label>
              <p className="text-gray-600 text-sm mb-4">Manage hall images</p>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Hall ${idx}`}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
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
              )}

              <button
                type="button"
                onClick={handleImageUrlAdd}
                className="btn-outline"
              >
                + Add Image URL
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Services{" "}
                <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Add services provided by your hall
              </p>

              {formData.services.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span>✓ {service}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="text-purple-600 hover:text-purple-800 font-semibold"
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
              disabled={submitLoading}
              className="btn-primary w-full"
            >
              {submitLoading ? "Updating..." : "Update Hall"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditHallPage;
