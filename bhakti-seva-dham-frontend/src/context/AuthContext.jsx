import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [devotee, setDevotee] = useState(() => {
    const saved = localStorage.getItem("bhakti_devotee");
    return saved ? JSON.parse(saved) : null;
  });

  // Global modal state accessible by any button on any page
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginDevotee = (userData) => {
    setDevotee(userData);
    localStorage.setItem("bhakti_devotee", JSON.stringify(userData));
    if (userData?.name) {
      localStorage.setItem("bhakti_devotee_name", userData.name);
    }
    setIsAuthModalOpen(false);
  };

  const logoutDevotee = () => {
    setDevotee(null);
    localStorage.removeItem("bhakti_devotee");
    localStorage.removeItem("bhakti_devotee_name");
    localStorage.removeItem("jap_lifetime_count");
    localStorage.removeItem("jap_leaderboard");
    localStorage.removeItem("quiz_leaderboard");
  };

  return (
    <AuthContext.Provider
      value={{
        devotee,
        loginDevotee,
        logoutDevotee,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
