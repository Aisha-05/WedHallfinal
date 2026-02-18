import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hallsAPI } from "../api";

/* -- Hardcoded fallback for when DB is empty -- */
const FALLBACK_HALLS = [
  {
    id: 1, name: "Grand Palace Hall",
    description: "Elegant and spacious wedding venue with stunning crystal chandeliers and marble floors.",
    location: "Downtown District", price: 5000, capacity: 500,
    average_rating: 4.8, total_ratings: 24,
    images: ["https://images.unsplash.com/photo-1763553113332-800519753e40?w=500&auto=format&fit=crop&q=60"],
    services: ["Catering", "DJ", "Parking"],
  },
  {
    id: 2, name: "Royal Garden Venue",
    description: "Beautiful outdoor garden setting with lush greenery and romantic ambiance perfect for weddings.",
    location: "Countryside", price: 4500, capacity: 300,
    average_rating: 4.7, total_ratings: 18,
    images: ["https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?w=500&auto=format&fit=crop&q=60"],
    services: ["Decoration", "Parking"],
  },
  {
    id: 3, name: "Luxury Wedding Estate",
    description: "Premium wedding hall with modern amenities, spacious catering area, and panoramic views.",
    location: "Uptown Area", price: 6000, capacity: 400,
    average_rating: 4.9, total_ratings: 31,
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVr2cF3MpKQ-jpF7je_w1V0Px1j5_MiPHpVw&s"],
    services: ["Catering", "DJ", "Photography", "Parking"],
  },
];

/* -- Star Display (shared style with owner dashboard) -- */
function StarDisplay({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <svg key={star} viewBox="0 0 20 20" className="w-4 h-4" fill={filled ? "#A0795C" : half ? "url(#halfStarHome)" : "#E0D0C1"}>
              {half && (<defs><linearGradient id="halfStarHome"><stop offset="50%" stopColor="#A0795C" /><stop offset="50%" stopColor="#E0D0C1" /></linearGradient></defs>)}
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

function HomePage() {
  const navigate = useNavigate();
  const [topHalls, setTopHalls] = useState([]);
  const [loadingHalls, setLoadingHalls] = useState(true);

  useEffect(() => {
    fetchTopHalls();
  }, []);

  const fetchTopHalls = async () => {
    try {
      setLoadingHalls(true);
      const data = await hallsAPI.getAll();
      const halls = data.halls || [];
      if (halls.length > 0) {
        // Sort by average_rating descending, then by total_ratings descending
        const sorted = [...halls].sort((a, b) => {
          const ratingDiff = (b.average_rating || 0) - (a.average_rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return (b.total_ratings || 0) - (a.total_ratings || 0);
        });
        setTopHalls(sorted.slice(0, 3));
      } else {
        setTopHalls(FALLBACK_HALLS);
      }
    } catch (err) {
      console.error("Error fetching halls:", err);
      setTopHalls(FALLBACK_HALLS);
    } finally {
      setLoadingHalls(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524563216914-d552816e4d67?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-[#6B4F3A]/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-start">
            <div className="text-left max-w-3xl">
              <h1
                className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                L'amour ecrit
                <br />
                l'histoire, notre salle
                <br />
                en devient le decore
              </h1>
              <Link
                to="/halls"
                className="inline-block px-10 py-3.5 rounded-full font-medium text-lg tracking-wide transition-all duration-300 bg-[#C8A891] text-white hover:bg-[#b89880] hover:shadow-lg hover:scale-105"
              >
                Discover Venues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-[#6B4F3A] text-center mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300">
              <div className="text-4xl mb-4">&#x1F48E;</div>
              <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">The Best Wedding Halls</h3>
              <p className="text-[#9C8577]"></p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-4">&#x26A1;</div>
              <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Search & Filter by Location and Price</h3>
              <p className="text-[#9C8577]"></p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-4">&#x1F4BC;</div>
              <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Business Development</h3>
              <p className="text-[#9C8577]"></p>
            </div>
            <div className="bg-[#C8A891] p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Advertise Your Wedding Halls</h3>
              <p className="text-sm text-white/80">+ many offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Wedding Halls Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-[#6B4F3A] text-center mb-12">
            Most Popular Wedding Halls
          </h2>

          {loadingHalls ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topHalls.map((hall) => {
                const firstImage = hall.images && hall.images.length > 0 ? hall.images[0] : "https://images.unsplash.com/photo-1519167471654-76ce0107279f?w=500&h=300&fit=crop";
                return (
                  <div
                    key={hall.id}
                    onClick={() => navigate(`/halls/${hall.id}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E0D0C1]/40 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img src={firstImage} alt={hall.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <div className="flex flex-wrap gap-1.5">
                          {hall.services.slice(0, 3).map((s, idx) => (<span key={idx} className="px-2.5 py-1 bg-[#F5EDE4] text-[#8B6F47] text-xs rounded-full font-medium">{s}</span>))}
                          {hall.services.length > 3 && <span className="px-2.5 py-1 bg-[#F5EDE4] text-[#B5A89E] text-xs rounded-full">+{hall.services.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-[#6B4F3A] text-center mb-12">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300 text-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s" alt="Akram Benchouche" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Akram Benchouche</h3>
                <p className="text-[#A0795C] font-medium mb-3">Lead Developer</p>
                <p className="text-[#9C8577] text-sm">Expert in full-stack development with 5+ years of experience building scalable web applications.</p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300 text-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s" alt="Reda Ameriou" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Reda Ameriou</h3>
                <p className="text-[#A0795C] font-medium mb-3">Backend Developer</p>
                <p className="text-[#9C8577] text-sm">Specialist in database architecture and API development, ensuring robust and efficient backend systems.</p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300 text-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s" alt="Aya Ismahen" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Aya Ismahen</h3>
                <p className="text-[#A0795C] font-medium mb-3">Frontend Developer</p>
                <p className="text-[#9C8577] text-sm">Creative UI/UX specialist focused on delivering beautiful and intuitive user interfaces.</p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0D0C1]/40 hover:shadow-md transition-all duration-300 text-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s" alt="Djahara Aisha" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#6B4F3A] mb-2">Djahara Aisha</h3>
                <p className="text-[#A0795C] font-medium mb-3">Full Stack Developer & Manager</p>
                <p className="text-[#9C8577] text-sm">Versatile full-stack developer and outstanding project manager, bridging technical excellence with strategic team leadership to deliver exceptional results.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-[#6B4F3A] mb-8">
            Ready to Plan Your Wedding?
          </h2>
          <p className="text-xl text-[#9C8577] mb-8">
            Join thousands of happy couples who found their perfect venue on Wed Hall.
          </p>
          <div className="flex justify-center">
            <Link to="/halls" className="btn-primary text-center">Start Browsing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;