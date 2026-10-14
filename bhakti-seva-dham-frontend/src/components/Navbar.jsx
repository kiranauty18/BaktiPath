import React, { useState } from 'react';
import { Menu, X, Heart, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-spiritual-cream border-b border-spiritual-golden/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-spiritual-golden shadow-md bg-spiritual-cream flex items-center justify-center">
                <img 
                  src="/images/radhaRaman.png" 
                  alt="Shri Radha Raman Ji" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-spiritual-darkMaroon tracking-wide">
                  Bhakti Seva Dham
                </span>
                <p className="text-xs text-spiritual-saffron font-medium">Shri Radha Raman & Banke Bihari Seva</p>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-spiritual-darkMaroon font-medium text-sm">
            <a href="/" className="hover:text-spiritual-saffron transition">Home</a>
            <a href="/quiz" className="hover:text-spiritual-saffron transition">Daily Quiz</a>
            <a href="/leaderboard" className="hover:text-spiritual-saffron transition">Leaderboard</a>
            <a href="/katha" className="hover:text-spiritual-saffron transition">Katha & Bhajans</a>
            
            {/* Naam Jap Highlighted Link in Navbar */}
            <a 
              href="/jap" 
              className="bg-spiritual-saffron/10 hover:bg-spiritual-saffron hover:text-white text-spiritual-saffron border border-spiritual-saffron/40 px-3.5 py-2 rounded-full transition flex items-center space-x-1.5 font-semibold shadow-sm"
            >
              <span>📿 Naam Jap</span>
            </a>

            <a href="/seva" className="hover:text-spiritual-saffron transition">Voluntary Seva</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-spiritual-darkMaroon focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-spiritual-cream border-b border-spiritual-golden/30 px-4 pt-2 pb-6 space-y-3 font-medium">
          <a href="/" className="block py-2 text-spiritual-darkMaroon border-b border-gray-100">Home</a>
          <a href="/quiz" className="block py-2 text-spiritual-darkMaroon border-b border-gray-100">Daily Quiz</a>
          <a href="/leaderboard" className="block py-2 text-spiritual-darkMaroon border-b border-gray-100">Leaderboard</a>
          <a href="/katha" className="block py-2 text-spiritual-darkMaroon border-b border-gray-100">Katha & Bhajans</a>
          
          {/* Mobile Naam Jap Link */}
          <a href="/jap" className="block py-2.5 px-4 rounded-xl bg-spiritual-saffron text-black font-bold shadow-sm flex items-center space-x-2">
            <span>📿 Naam Jap Counter</span>
          </a>

          <a href="/seva" className="block py-2 text-spiritual-darkMaroon border-b border-gray-100">Voluntary Seva</a>
        </div>
      )}
    </nav>
  ); 
}