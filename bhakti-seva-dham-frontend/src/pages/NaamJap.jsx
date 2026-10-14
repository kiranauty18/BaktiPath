import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw, Volume2, VolumeX, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NaamJap() {
  // State variables for counting, malas, and persistence
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('bhakti_jap_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [totalLifetime, setTotalLifetime] = useState(() => {
    const saved = localStorage.getItem('bhakti_total_lifetime');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastAction, setLastAction] = useState(null); // For undo functionality

  // Calculations for Mala (108 beads)
  const currentMalaBeads = count % 108;
  const completedMalas = Math.floor(count / 108);
  const progressPercentage = (currentMalaBeads / 108) * 100;

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('bhakti_jap_count', count.toString());
    localStorage.setItem('bhakti_total_lifetime', totalLifetime.toString());
  }, [count, totalLifetime]);

  // Handle Jap Increment (+1)
  const handleJap = () => {
    setLastAction(count);
    setCount(prev => prev + 1);
    setTotalLifetime(prev => prev + 1);
  };

  // Handle Undo Last Count
  const handleUndo = () => {
    if (lastAction !== null) {
      setCount(lastAction);
      setTotalLifetime(prev => Math.max(0, prev - 1));
      setLastAction(null);
    }
  };

  // Handle Reset with confirmation
  const handleResetConfirm = () => {
    setCount(0);
    setLastAction(null);
    setShowResetConfirm(false);
  };

  return (
    <div className="bg-gradient-to-b from-spiritual-cream via-spiritual-pink/15 to-spiritual-cream min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-spiritual-darkMaroon flex flex-col items-center">
      
      {/* Header Banner */}
      <div className="max-w-xl w-full text-center space-y-3 mb-8">
        <span className="bg-spiritual-saffron/10 text-spiritual-saffron text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-spiritual-saffron/30 inline-flex items-center space-x-1.5">
          <Sparkles size={14} />
          <span>Nitya Naam Jap Sadhana</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          श्री राधा रानी & कृष्ण जाप
        </h1>
        <p className="text-gray-600 text-sm">
          "राधे राधे" स्मरण से man ko shanti aur aatma ko pavitrata milti hai.
        </p>
      </div>

      {/* Main Counter Dashboard Container */}
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-lg border border-spiritual-golden/30 space-y-6 relative overflow-hidden">
        
        {/* Top Control Bar (Audio & Reset) */}
        <div className="flex justify-between items-center text-xs font-medium text-gray-500">
          <button 
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="flex items-center space-x-1 bg-spiritual-cream hover:bg-spiritual-saffron/10 px-3 py-1.5 rounded-full border border-spiritual-golden/30 transition text-spiritual-darkMaroon"
            title={isAudioPlaying ? "Mute Bell/Flute Sound" : "Unmute Sound"}
          >
            {isAudioPlaying ? <Volume2 size={16} className="text-spiritual-saffron" /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? "Audio Enabled" : "Audio Muted"}</span>
          </button>

          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-1 text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition"
          >
            <RotateCcw size={14} />
            <span>Reset Counter</span>
          </button>
        </div>

        {/* Mala Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-spiritual-darkMaroon">
            <span>Mala Progress: {currentMalaBeads} / 108</span>
            <span className="text-spiritual-saffron">Completed Malas: {completedMalas}</span>
          </div>
          <div className="w-full bg-spiritual-cream h-3 rounded-full overflow-hidden border border-spiritual-golden/20 p-0.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-spiritual-saffron to-spiritual-golden h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Counter Display */}
        <div className="text-center py-6 bg-gradient-to-b from-spiritual-cream/60 to-white rounded-2xl border border-spiritual-golden/20 shadow-inner space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">Total Jap in Current Session</span>
          <div className="text-6xl sm:text-7xl font-black text-spiritual-saffron tracking-tight">
            {count}
          </div>
          <p className="text-xs text-spiritual-darkMaroon font-medium italic">
            "राधे राधे" 📿
          </p>
        </div>

        {/* Large Interactive "श्री राधा" Button */}
        <div className="flex justify-center pt-2">
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleJap}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-spiritual-saffron via-amber-500 to-spiritual-golden text-white font-extrabold text-2xl sm:text-3xl shadow-xl border-4 border-spiritual-cream flex flex-col items-center justify-center space-y-1 focus:outline-none focus:ring-4 focus:ring-spiritual-saffron/40 transition-shadow"
          >
            <Heart size={28} className="fill-white/20 animate-pulse" />
            <span>श्री राधा</span>
            <span className="text-xs font-normal tracking-wide opacity-90">Tap to Count</span>
          </motion.button>
        </div>

        {/* Secondary Controls (+1 & Undo) */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleUndo}
            disabled={lastAction === null}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${lastAction !== null ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed'}`}
          >
            Undo Last
          </button>
          <button
            onClick={handleJap}
            className="flex-1 bg-spiritual-darkMaroon text-spiritual-cream hover:bg-spiritual-sension py-2.5 rounded-xl text-sm font-semibold shadow transition"
          >
            1
          </button>
        </div>

        {/* Statistics Footer */}
        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-spiritual-cream/50 p-3 rounded-xl border border-spiritual-golden/10">
            <span className="text-xs text-gray-500 block">Completed Malas</span>
            <span className="text-lg font-bold text-spiritual-darkMaroon">{completedMalas}</span>
          </div>
          <div className="bg-spiritual-cream/50 p-3 rounded-xl border border-spiritual-golden/10">
            <span className="text-xs text-gray-500 block">Lifetime Jap</span>
            <span className="text-lg font-bold text-spiritual-saffron">{totalLifetime}</span>
          </div>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-spiritual-golden/30 text-center space-y-4"
            >
              <h3 className="text-lg font-bold text-spiritual-darkMaroon">Counter Reset Karein?</h3>
              <p className="text-xs text-gray-600">
                Kya aap apne current session ka counter zero (0) karna chahte hain?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition text-sm shadow"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}