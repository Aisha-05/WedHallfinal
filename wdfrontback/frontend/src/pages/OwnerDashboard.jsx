import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hallsAPI, bookingsAPI } from "../api";

/* -- Hardcoded demo data (fallback when DB is empty) -- */
const HARDCODED_HALLS = [
  {
    id: 701,
    name: "Grand Palace Hall",
    description: "Elegant and spacious wedding venue with stunning crystal chandeliers and marble floors.",
    location: "Downtown District",
    price: 5000,
    capacity: 500,
    average_rating: 4.8,
    total_ratings: 24,
    images: ["https://images.unsplash.com/photo-1763553113332-800519753e40?w=500&auto=format&fit=crop&q=60"],
    services: ["Catering", "DJ", "Parking"],
  },
  {
    id: 702,
    name: "Royal Garden Venue",
    description: "Beautiful outdoor garden setting with lush greenery and romantic ambiance.",
    location: "Countryside",
    price: 4500,
    capacity: 300,
    average_rating: 4.5,
    total_ratings: 18,
    images: ["https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?w=500&auto=format&fit=crop&q=60"],
    services: ["Decoration", "Parking"],
  },
  {
    id: 703,
    name: "Luxury Wedding Estate",
    description: "Premium wedding hall with modern amenities, spacious catering area, and panoramic views.",
    location: "Uptown Area",
    price: 6000,
    capacity: 400,
    average_rating: 4.9,
    total_ratings: 31,
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVr2cF3MpKQ-jpF7je_w1V0Px1j5_MiPHpVw&s"],
    services: ["Catering", "DJ", "Photography", "Parking"],
  },
];

const HARDCODED_PENDING = [
  { id: 801, hall_name: "Grand Palace Hall", client_name: "Nour Belkacem", client_email: "nour.b@example.com", start_date: "2026-03-20", end_date: "2026-03-21", status: "pending", created_at: "2026-02-10T09:00:00Z" },
  { id: 802, hall_name: "Royal Garden Venue", client_name: "Karim Hadj", client_email: "karim.h@example.com", start_date: "2026-04-05", end_date: "2026-04-06", status: "pending", created_at: "2026-02-14T15:30:00Z" },
  { id: 803, hall_name: "Luxury Wedding Estate", client_name: "Amina Zerhoun", client_email: "amina.z@example.com", start_date: "2026-05-12", end_date: "2026-05-13", status: "pending", created_at: "2026-02-16T11:00:00Z" },
];

const HARDCODED_HISTORY = [
  { id: 901, hall_name: "Grand Palace Hall", client_name: "Sarah Johnson", client_email: "sarah@example.com", start_date: "2025-12-15", end_date: "2025-12-16", status: "approved", created_at: "2025-11-20T10:00:00Z" },
  { id: 902, hall_name: "Royal Garden Venue", client_name: "Ahmed Benali", client_email: "ahmed@example.com", start_date: "2025-11-01", end_date: "2025-11-02", status: "approved", created_at: "2025-10-15T08:30:00Z" },
  { id: 903, hall_name: "Grand Palace Hall", client_name: "Lina Mezouar", client_email: "lina@example.com", start_date: "2025-10-10", end_date: "2025-10-11", status: "approved", created_at: "2025-09-28T14:00:00Z" },
];

/* -- Star Rating Display -- */
function StarDisplay({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <svg key={star} viewBox="0 0 20 20" className="w-4 h-4" fill={filled ? "#A0795C" : half ? "url(#halfStar)" : "#E0D0C1"}>
              {half && (<defs><linearGradient id="halfStar"><stop offset="50%" stopColor="#A0795C" /><stop offset="50%" stopColor="#E0D0C1" /></linearGradient></defs>)}
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-[#6B4F3A]">{rating > 0 ? rating.toFixed(1) : "\u2014"}</span>
      {count > 0 && <span className="text-xs text-[#B5A89E]">({count})</span>}
    </div>
  );
}

/* -- Confirm Modal -- */
function ConfirmModal({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#6B4F3A]/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center animate-[fadeIn_0.2s_ease-out]">
        <div className="w-14 h-14 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A0795C" strokeWidth="2" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">{title}</h3>
        <p className="text-[#9C8577] mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-5 py-2.5 rounded-full border-2 border-[#E0D0C1] text-[#6B4F3A] font-medium tracking-wide hover:bg-[#F5EDE4] transition-all duration-300">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 px-5 py-2.5 rounded-full text-white font-medium tracking-wide transition-all duration-300 shadow-sm ${confirmColor}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* -- Edit Hall Modal -- */
function EditHallModal({ open, hall, onClose, onSave }) {
  const MAX_IMAGES = 5;
  const [formData, setFormData] = useState({ name: "", description: "", location: "", price: "", capacity: "", images: [], services: [] });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hall) {
      setFormData({ name: hall.name || "", description: hall.description || "", location: hall.location || "", price: hall.price || "", capacity: hall.capacity || "", images: hall.images || [], services: hall.services || [] });
      setError("");
      setSelectedFiles([]);
    }
  }, [hall]);

  const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - formData.images.length;
    if (remaining <= 0) { setError(`Maximum ${MAX_IMAGES} images allowed. Remove an image first.`); return; }
    if (files.length > remaining) { setSelectedFiles(files.slice(0, remaining)); } else { setSelectedFiles(files); }
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      selectedFiles.forEach((file) => fd.append("images[]", file));
      const response = await fetch("/backend/index.php?route=halls/uploadImages", { method: "POST", body: fd, credentials: "include" });
      const text = await response.text();
      let data = text ? JSON.parse(text) : null;
      if (!response.ok) throw new Error(data?.error || "Upload failed");
      if (data?.images?.length > 0) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...data.images].slice(0, MAX_IMAGES) }));
        setSelectedFiles([]);
      }
      if (data?.errors?.length > 0) setError("Some failed: " + data.errors.join(", "));
    } catch (err) { setError("Upload failed: " + err.message); } finally { setUploading(false); }
  };

  const handleImageUrlAdd = () => {
    if (formData.images.length >= MAX_IMAGES) { setError(`Maximum ${MAX_IMAGES} images allowed.`); return; }
    const url = prompt("Enter image URL:");
    if (url) setFormData((p) => ({ ...p, images: [...p.images, url] }));
  };
  const handleRemoveImage = (i) => setFormData((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const handleServiceAdd = () => { const s = prompt("Enter service name:"); if (s?.trim()) setFormData((p) => ({ ...p, services: [...p.services, s.trim()] })); };
  const handleRemoveService = (i) => setFormData((p) => ({ ...p, services: p.services.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.description || !formData.location || !formData.price || !formData.capacity) { setError("All fields are required"); return; }
    if (parseFloat(formData.price) <= 0 || parseInt(formData.capacity) <= 0) { setError("Price and capacity must be greater than 0"); return; }
    setSubmitLoading(true);
    try {
      await hallsAPI.update(hall.id, { name: formData.name, description: formData.description, location: formData.location, price: parseFloat(formData.price), capacity: parseInt(formData.capacity), images: formData.images, services: formData.services });
      onSave();
    } catch (err) { setError(err.message); } finally { setSubmitLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#6B4F3A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-[#E0D0C1]/60 px-8 py-5 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-[#6B4F3A]">Edit Hall</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F5EDE4] flex items-center justify-center text-[#9C8577] hover:bg-[#E0D0C1] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">{error}</div>}
          <div><label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Hall Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows="4" required /></div>
          <div><label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Price (per event)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" step="0.01" min="0" required /></div>
            <div><label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Capacity (guests)</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input-field" min="1" required /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Images <span className="text-[#B5A89E] text-xs font-normal">({formData.images.length}/{MAX_IMAGES})</span></label>
            {formData.images.length > 0 && (<div className="grid grid-cols-4 gap-3 mb-3">{formData.images.map((img, idx) => (<div key={idx} className="relative group rounded-xl overflow-hidden"><img src={img} alt={`Hall ${idx}`} className={`w-full h-20 object-cover ${idx === 0 ? 'ring-2 ring-[#A0795C]' : ''}`} onError={(e) => (e.target.src = "https://via.placeholder.com/150")} />{idx === 0 && <span className="absolute bottom-1 left-1 bg-[#A0795C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Cover</span>}<button type="button" onClick={() => handleRemoveImage(idx)} className="absolute inset-0 bg-red-500/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xl font-bold">&times;</button></div>))}</div>)}
            {formData.images.length < MAX_IMAGES && (
              <div className="mb-3 p-3 border-2 border-dashed border-[#E0D0C1] rounded-xl">
                <input type="file" id="editImageInput" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                <label htmlFor="editImageInput" className="block cursor-pointer text-center">
                  <p className="text-[#6B4F3A] text-sm font-medium">Click to select images</p>
                  <p className="text-[#B5A89E] text-xs">JPG, PNG, GIF, WebP (Max 5MB each)</p>
                </label>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#E0D0C1]">
                    <p className="text-xs text-[#9C8577] mb-2">{selectedFiles.length} file(s) selected</p>
                    <button type="button" onClick={handleUploadImages} disabled={uploading} className="w-full px-4 py-2 rounded-full bg-[#C8A891] text-white text-sm font-medium hover:bg-[#b89880] transition-all disabled:opacity-60">{uploading ? "Uploading..." : "Upload"}</button>
                  </div>
                )}
              </div>
            )}
            <button type="button" onClick={handleImageUrlAdd} disabled={formData.images.length >= MAX_IMAGES} className={`text-sm text-[#A0795C] hover:text-[#8B6F47] font-medium transition ${formData.images.length >= MAX_IMAGES ? 'opacity-40 cursor-not-allowed' : ''}`}>+ Add Image URL</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Services</label>
            {formData.services.length > 0 && (<div className="flex flex-wrap gap-2 mb-3">{formData.services.map((s, idx) => (<span key={idx} className="inline-flex items-center gap-1.5 bg-[#F5EDE4] text-[#8B6F47] px-3 py-1.5 rounded-full text-sm">{s}<button type="button" onClick={() => handleRemoveService(idx)} className="text-[#A0795C] hover:text-red-500 font-bold transition">&times;</button></span>))}</div>)}
            <button type="button" onClick={handleServiceAdd} className="text-sm text-[#A0795C] hover:text-[#8B6F47] font-medium transition">+ Add Service</button>
          </div>
          <div className="flex gap-3 pt-2 border-t border-[#E0D0C1]/60">
            <button type="button" onClick={onClose} className="flex-1 px-5 py-3 rounded-full border-2 border-[#E0D0C1] text-[#6B4F3A] font-medium tracking-wide hover:bg-[#F5EDE4] transition-all duration-300">Cancel</button>
            <button type="submit" disabled={submitLoading} className="flex-1 px-5 py-3 rounded-full bg-[#C8A891] text-white font-medium tracking-wide hover:bg-[#b89880] transition-all duration-300 shadow-sm disabled:opacity-60">{submitLoading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -- Owner Dashboard -- */
function OwnerDashboard() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("halls");
  const [useHardcodedHalls, setUseHardcodedHalls] = useState(false);
  const [useHardcodedPending, setUseHardcodedPending] = useState(false);
  const [useHardcodedHistory, setUseHardcodedHistory] = useState(false);
  const [deletedHardcodedHalls, setDeletedHardcodedHalls] = useState([]);
  const [localBookings, setLocalBookings] = useState([]);
  const [editHall, setEditHall] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hallsData = await hallsAPI.getOwnerHalls();
      const realHalls = hallsData.halls || [];
      setHalls(realHalls);
      if (realHalls.length === 0) setUseHardcodedHalls(true);
      const bookingsData = await bookingsAPI.getAll();
      const realBookings = bookingsData.bookings || [];
      setBookings(realBookings);
      if (!realBookings.some((b) => b.status === "pending")) setUseHardcodedPending(true);
      if (!realBookings.some((b) => b.status === "approved")) setUseHardcodedHistory(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDeleteHall = (hallId) => {
    setConfirmAction({
      title: "Delete Hall",
      message: "Are you sure you want to delete this hall? This action cannot be undone and all associated bookings will be removed.",
      confirmLabel: "Delete",
      confirmColor: "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        const isHardcoded = [701, 702, 703].includes(hallId);
        if (isHardcoded) { setDeletedHardcodedHalls((prev) => [...prev, hallId]); }
        else { try { await hallsAPI.delete(hallId); setHalls(halls.filter((h) => h.id !== hallId)); } catch (err) { alert("Failed to delete hall: " + err.message); } }
        setConfirmAction(null);
      },
    });
  };

  const handleEditSaved = () => { setEditHall(null); fetchData(); };

  const handleBookingAction = (bookingId, newStatus) => {
    const label = newStatus === "approved" ? "Approve" : "Reject";
    const msg = newStatus === "approved" ? "Are you sure you want to approve this booking request?" : "Are you sure you want to reject this booking request? The client will be notified.";
    setConfirmAction({
      title: `${label} Booking`,
      message: msg,
      confirmLabel: label,
      confirmColor: newStatus === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        const isHardcoded = [801, 802, 803].includes(bookingId);
        if (isHardcoded) {
          setLocalBookings((prev) => {
            const existing = prev.find((b) => b.id === bookingId);
            if (existing) return prev.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b);
            const original = HARDCODED_PENDING.find((b) => b.id === bookingId);
            return [...prev, { ...original, status: newStatus }];
          });
        } else {
          try {
            await bookingsAPI.update(bookingId, { status: newStatus });
            setBookings(bookings.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b));
            if (newStatus === "approved") setUseHardcodedHistory(false);
          } catch (err) { alert("Failed to update booking: " + err.message); }
        }
        setConfirmAction(null);
      },
    });
  };

  /* -- Derived data -- */
  const realPending = bookings.filter((b) => b.status === "pending");
  const effectiveHardcodedPending = HARDCODED_PENDING.filter((hb) => { const local = localBookings.find((lb) => lb.id === hb.id); return !local || local.status === "pending"; });
  const locallyApproved = localBookings.filter((lb) => lb.status === "approved");
  const pendingBookings = realPending.length > 0 || !useHardcodedPending ? realPending : effectiveHardcodedPending;
  const approvedBookings = bookings.filter((b) => b.status === "approved");
  const historyBookings = approvedBookings.length > 0 || !useHardcodedHistory ? approvedBookings : [...HARDCODED_HISTORY, ...locallyApproved];
  const displayHalls = halls.length > 0 || !useHardcodedHalls ? halls : HARDCODED_HALLS.filter((h) => !deletedHardcodedHalls.includes(h.id));
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) {
    return (<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div></div>);
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-[#6B4F3A]">Owner Dashboard</h1>
          <button onClick={() => navigate("/owner/add-hall")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A891] text-white font-medium tracking-wide hover:bg-[#b89880] hover:shadow-lg transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
            Add New Hall
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">Error: {error}</div>}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#F5EDE4] p-1 rounded-full inline-flex">
          {[{ key: "halls", label: "My Halls", count: displayHalls.length }, { key: "bookings", label: "Requests", count: pendingBookings.length }, { key: "history", label: "History", count: historyBookings.length }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${activeTab === tab.key ? "bg-white text-[#6B4F3A] shadow-sm" : "text-[#9C8577] hover:text-[#6B4F3A]"}`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* HALLS TAB */}
        {activeTab === "halls" && (
          <div>
            {useHardcodedHalls && halls.length === 0 && (<div className="mb-4 bg-[#F5EDE4] border border-[#E0D0C1] text-[#A0795C] px-5 py-3 rounded-xl text-sm">Showing sample halls for preview. Add a real hall to see live data here.</div>)}
            {displayHalls.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="w-20 h-20 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A0795C" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21" /></svg>
                </div>
                <p className="text-[#9C8577] text-lg mb-2">No halls yet</p>
                <p className="text-[#B5A89E] text-sm mb-6">Add your first hall to start receiving bookings.</p>
                <button onClick={() => navigate("/owner/add-hall")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A891] text-white font-medium tracking-wide hover:bg-[#b89880] transition-all duration-300">Add Your First Hall</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayHalls.map((hall) => (
                  <div key={hall.id} className="bg-white rounded-2xl overflow-hidden border border-[#E0D0C1]/40 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img src={hall.images?.[0] || "https://via.placeholder.com/500x300?text=No+Image"} alt={hall.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#6B4F3A] px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">${hall.price}</div>
                      <div className="absolute top-3 left-3 bg-[#6B4F3A]/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>
                        {hall.capacity}
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#6B4F3A] leading-tight mb-2">{hall.name}</h3>
                      <div className="mb-3"><StarDisplay rating={hall.average_rating || 0} count={hall.total_ratings || 0} /></div>
                      <p className="text-[#9C8577] text-sm mb-3 line-clamp-2 leading-relaxed">{hall.description}</p>
                      <div className="flex items-center gap-1.5 text-[#B5A89E] text-sm mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#C8A891]"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
                        {hall.location}
                      </div>
                      {hall.services && hall.services.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hall.services.slice(0, 3).map((s, idx) => (<span key={idx} className="px-2.5 py-1 bg-[#F5EDE4] text-[#8B6F47] text-xs rounded-full font-medium">{s}</span>))}
                          {hall.services.length > 3 && <span className="px-2.5 py-1 bg-[#F5EDE4] text-[#B5A89E] text-xs rounded-full">+{hall.services.length - 3}</span>}
                        </div>
                      )}
                      <div className="flex gap-2 pt-3 border-t border-[#E0D0C1]/40">
                        <button onClick={() => setEditHall(hall)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-[#E0D0C1] text-[#6B4F3A] text-sm font-medium tracking-wide hover:bg-[#F5EDE4] transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteHall(hall.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-red-200 text-red-500 text-sm font-medium tracking-wide hover:bg-red-50 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
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

        {/* BOOKING REQUESTS TAB */}
        {activeTab === "bookings" && (
          <div>
            {useHardcodedPending && realPending.length === 0 && (<div className="mb-4 bg-[#F5EDE4] border border-[#E0D0C1] text-[#A0795C] px-5 py-3 rounded-xl text-sm">Showing sample requests for preview. Real booking requests will replace these.</div>)}
            {pendingBookings.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="w-20 h-20 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A0795C" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                </div>
                <p className="text-[#9C8577] text-lg mb-2">No pending requests</p>
                <p className="text-[#B5A89E] text-sm">New booking requests from clients will show up here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-[#E0D0C1]/40 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Hall</p><p className="font-semibold text-[#6B4F3A]">{booking.hall_name}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Client</p><p className="font-semibold text-[#6B4F3A]">{booking.client_name}</p><p className="text-xs text-[#B5A89E]">{booking.client_email}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Dates</p><p className="font-semibold text-[#6B4F3A]">{fmtDate(booking.start_date)} &rarr; {fmtDate(booking.end_date)}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Submitted</p><p className="text-sm text-[#9C8577]">{fmtDate(booking.created_at)}</p></div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleBookingAction(booking.id, "approved")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-medium tracking-wide hover:bg-green-100 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                          Approve
                        </button>
                        <button onClick={() => handleBookingAction(booking.id, "rejected")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-medium tracking-wide hover:bg-red-100 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            {useHardcodedHistory && approvedBookings.length === 0 && (<div className="mb-4 bg-[#F5EDE4] border border-[#E0D0C1] text-[#A0795C] px-5 py-3 rounded-xl text-sm">Showing sample data for preview. Approve a real booking to see live data here.</div>)}
            {historyBookings.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="w-20 h-20 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A0795C" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[#9C8577] text-lg mb-2">No history yet</p>
                <p className="text-[#B5A89E] text-sm">Approved booking requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-[#E0D0C1]/40 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Hall</p><p className="font-semibold text-[#6B4F3A]">{booking.hall_name}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Client</p><p className="font-semibold text-[#6B4F3A]">{booking.client_name}</p><p className="text-xs text-[#B5A89E]">{booking.client_email}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Event Dates</p><p className="font-semibold text-[#6B4F3A]">{fmtDate(booking.start_date)} &rarr; {fmtDate(booking.end_date)}</p></div>
                      <div><p className="text-xs text-[#B5A89E] uppercase tracking-wider mb-1">Booked On</p><p className="text-sm text-[#9C8577]">{new Date(booking.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></div>
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Hall Modal */}
      <EditHallModal open={!!editHall} hall={editHall} onClose={() => setEditHall(null)} onSave={handleEditSaved} />

      {/* Confirmation Modal */}
      <ConfirmModal open={!!confirmAction} title={confirmAction?.title} message={confirmAction?.message} confirmLabel={confirmAction?.confirmLabel} confirmColor={confirmAction?.confirmColor} onConfirm={confirmAction?.onConfirm} onCancel={() => setConfirmAction(null)} />
    </div>
  );
}

export default OwnerDashboard;