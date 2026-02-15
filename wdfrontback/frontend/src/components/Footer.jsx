import React from "react";

function Footer() {
  return (
    <footer className="bg-[#C8A891] text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">💍</div>
              <div className="text-xl font-bold">Wed Hall</div>
            </div>
            <p className="text-white/80">
              Your premier wedding hall booking platform.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="/halls" className="hover:text-white transition">
                  Browse Halls
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Account</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="/login" className="hover:text-white transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-white transition">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-white/80">support@wedhall.com</p>
            <p className="text-white/80">+1 (555) 000-0000</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <p className="text-white/80 text-center">
            © 2024 Wed Hall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
