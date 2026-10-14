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
      <h1 className="text-3xl font-bold text-spiritual-darkMaroon">Page not found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-block bg-spiritual-saffron text-white px-6 py-2.5 rounded-full font-semibold shadow">
        Return to Home
      </Link>
    </main>
  );
}

function Footer() {
  return (
    <footer className="app-footer bg-spiritual-darkMaroon text-spiritual-cream py-8 px-4 text-center border-t border-spiritual-golden/30">
      <div className="app-footer-brand flex justify-center items-center space-x-2 mb-2">
        <span className="app-footer-om w-8 h-8 rounded-full bg-spiritual-saffron flex items-center justify-center text-white font-bold text-sm">ॐ</span>
        <strong>Bhakti Seva Dham</strong>
      </div>

      <p className="text-xs text-gray-300 max-w-md mx-auto mb-4">
        A place for devotion, spiritual learning, and selfless service. Shri Radha Raman &amp; Banke Bihari Seva.
      </p>

      <nav className="app-footer-links flex flex-wrap justify-center gap-4 text-xs text-spiritual-golden font-medium mb-4" aria-label="Footer navigation">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/quiz" className="hover:underline">Daily Quiz</Link>
        <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
        <Link to="/seva" className="hover:underline">Voluntary Seva</Link>
        <Link to="/katha" className="hover:underline">Katha &amp; Bhajans</Link>
        <Link to="/jap" className="hover:underline">📿 Naam Jap</Link>
      </nav>

      <small className="text-gray-500 text-xs">© 2026 Bhakti Seva Dham. Designed BY @Ki.ran_.ig</small>
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