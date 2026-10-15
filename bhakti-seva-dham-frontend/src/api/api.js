// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Helper to retrieve auth headers with Bearer token
const getAuthHeaders = () => {
  const saved = localStorage.getItem("bhakti_devotee");
  let token = null;

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      token = parsed?.token;
    } catch {
      token = null;
    }
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authAPI = {
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
};

export const quizAPI = {
  // score is sent with token; backend derives identity via req.user
  submitScore: async (score) => {
    const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ score }),
    });
    return res.json();
  },
};

export const japAPI = {
  // completedMalas & lifetimeJap sent with token; backend updates req.user
  syncSadhana: async (completedMalas, lifetimeJap) => {
    const res = await fetch(`${API_BASE_URL}/jap/sync`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ completedMalas, lifetimeJap }),
    });
    return res.json();
  },
};

export const leaderboardAPI = {
  // Public endpoint
  getLeaderboard: async (filter = "all") => {
    const res = await fetch(`${API_BASE_URL}/leaderboard?filter=${filter}`);
    return res.json();
  },
};

export const sevaAPI = {
  recordPledge: async (amount) => {
    const res = await fetch(`${API_BASE_URL}/seva/pledge`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    return res.json();
  },
};

export const profileAPI = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export const adminAPI = {
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  getDevotees: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/devotees`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  addQuestion: async (questionData) => {
    const res = await fetch(`${API_BASE_URL}/admin/questions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    return res.json();
  },
};
