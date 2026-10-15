import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Seva from "./pages/Seva";
import KathaBhajans from "./pages/KathaBhajans";
import NaamJap from "./pages/NaamJap";

function NotFound() {
  return (
    <main className="not-found-page py-20 text-center space-y-4">
      <h1 className="text-3xl font-bold text-spiritual-darkMaroon">
        Page not found
      </h1>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-spiritual-saffron text-white px-6 py-2.5 rounded-full font-semibold shadow"
      >
        Return to Home
      </Link>
    </main>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#4A0E17] text-[#FFF8ED] py-10 px-4 border-t border-[#D4AF37]/30">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
        {/* Brand & Symbol */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-[#FF8C00] flex items-center justify-center text-white font-bold text-base shadow-sm">
            ॐ
          </span>
          <strong className="text-lg font-serif tracking-wider text-white">
            Bhakti Seva Dham
          </strong>
        </div>

        {/* Subtitle / Description */}
        <p className="text-xs text-[#EADDE0] max-w-lg leading-relaxed mx-auto">
          A place for devotion, spiritual learning, and selfless service. Shri
          Radha Raman &amp; Banke Bihari Seva.
        </p>

        {/* Nav Links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#F4E08B] pt-1"
          aria-label="Footer navigation"
        >
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/quiz" className="hover:text-white transition">
            Daily Quiz
          </Link>
          <Link to="/leaderboard" className="hover:text-white transition">
            Leaderboard
          </Link>
          <Link to="/katha" className="hover:text-white transition">
            Katha &amp; Bhajans
          </Link>
          <Link to="/jap" className="hover:text-white transition">
            📿 Naam Jap
          </Link>
          <Link to="/seva" className="hover:text-white transition">
            Voluntary Seva
          </Link>
        </nav>

        {/* Copyright */}
        <small className="block text-[#A8929A] text-[11px] pt-2 border-t border-white/10 w-full max-w-xs mx-auto">
          © 2026 Bhakti Seva Dham. Designed BY @Ki.ran_.ig
        </small>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell flex flex-col min-h-screen bg-spiritual-cream font-sans">
        <Navbar />

        <main className="app-content flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/seva" element={<Seva />} />
            <Route path="/katha" element={<KathaBhajans />} />
            <Route path="/katha-bhajans" element={<KathaBhajans />} />
            <Route path="/jap" element={<NaamJap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
