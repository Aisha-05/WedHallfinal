import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [topHalls] = useState([
    {
      id: 1,
      name: "Grand Palace Hall",
      description:
        "Elegant and spacious wedding venue with stunning crystal chandeliers and marble floors.",
      location: "Downtown District",
      price: 5000,
      averageRating: 4.8,
      image:
        "https://images.unsplash.com/photo-1763553113332-800519753e40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVhdXRpZnVsJTIwd2VkZGluZyUyMGhhbGwlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      name: "Royal Garden Venue",
      description:
        "Beautiful outdoor garden setting with lush greenery and romantic ambiance perfect for weddings.",
      location: "Countryside",
      price: 4500,
      averageRating: 4.7,
      image:
        "https://plus.unsplash.com/premium_photo-1664530452329-42682d3a73a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJlYXV0aWZ1bCUyMHdlZGRpbmclMjBoYWxsJTIwaW1hZ2VzfGVufDB8fDB8fHww",
    },
    {
      id: 3,
      name: "Luxury Wedding Estate",
      description:
        "Premium wedding hall with modern amenities, spacious catering area, and panoramic views.",
      location: "Uptown Area",
      price: 6000,
      averageRating: 4.9,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVr2cF3MpKQ-jpF7je_w1V0Px1j5_MiPHpVw&s",
    },
  ]);
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
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-start">
            <div className="text-left max-w-3xl">
              <h1
                className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                L'amour écrit
                <br />
                l'histoire, notre salle
                <br />
                en devient le décore
              </h1>
              <Link
                to="/halls"
                className="inline-block px-8 py-3 rounded-lg font-bold text-lg transition duration-300 bg-[#C8A891] text-white hover:bg-opacity-80 hover:shadow-lg hover:scale-105"
              >
                Discover Venues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - The Best Wedding Halls */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-black mb-2">
                The Best wedding Halls
              </h3>
              <p className="text-gray-700"></p>
            </div>

            {/* Card 2 - Search/Filtering */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-black mb-2">
                Searching/Filtring by localisation and price
              </h3>
              <p className="text-gray-700"></p>
            </div>

            {/* Card 3 - Business Development */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-black mb-2">
                Business Development
              </h3>
              <p className="text-gray-700"></p>
            </div>

            {/* Card 4 - Advertisement */}
            <div className="bg-[#C8A891] p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-white mb-2">
                Advertisement of your wedding halls
              </h3>
              <p className="text-sm text-white">+many offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Wedding Halls Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Most Popular Wedding Halls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topHalls.map((hall) => (
              <div
                key={hall.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {hall.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {hall.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">{hall.location}</p>
                      {hall.averageRating && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-yellow-500 text-lg">⭐</span>
                          <span className="font-bold text-black">
                            {hall.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#C8A891]">
                        ${hall.price}
                      </p>
                      <p className="text-sm text-gray-600">/event</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s"
                alt="Akram Benchouche"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Akram Benchouche
                </h3>
                <p className="text-[#C8A891] font-semibold mb-3">
                  Lead Developer
                </p>
                <p className="text-gray-600 text-sm">
                  Expert in full-stack development with 5+ years of experience
                  building scalable web applications.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s"
                alt="Reda Ameriou"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Reda Ameriou
                </h3>
                <p className="text-[#C8A891] font-semibold mb-3">
                  Backend Developer
                </p>
                <p className="text-gray-600 text-sm">
                  Specialist in database architecture and API development,
                  ensuring robust and efficient backend systems.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s"
                alt="Aya Ismahen"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Aya Ismahen
                </h3>
                <p className="text-[#C8A891] font-semibold mb-3">
                  Frontend Developer
                </p>
                <p className="text-gray-600 text-sm">
                  Creative UI/UX specialist focused on delivering beautiful and
                  intuitive user interfaces.
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjZ2gOBG7JjV_VWkSsRzzWiMvWNpRkO5mmw&s"
                alt="Djahara Aisha"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Djahara Aisha
                </h3>
                <p className="text-[#C8A891] font-semibold mb-3">
                  Project Manager
                </p>
                <p className="text-gray-600 text-sm">
                  Strategic leader ensuring project success through coordination
                  and exceptional team management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Plan Your Wedding?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of happy couples who found their perfect venue on Wed
            Hall.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/halls" className="btn-primary text-center">
              Start Browsing
            </Link>
            <Link to="/signup" className="btn-outline text-center">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
