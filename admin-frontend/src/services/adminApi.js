// src/services/adminApi.js
import axios from "axios";

// ✅ Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// ✅ Interceptor to include token dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Requests APIs ----
export const fetchRequests = async () => {
  try {
    const res = await API.get("/requests");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    throw error;
  }
};

export const approveRequest = async (id, collector_info) => {
  try {
    const res = await API.post(`/requests/${id}/approve`, { collector_info });
    return res.data;
  } catch (error) {
    console.error(`Failed to approve request ${id}:`, error);
    throw error;
  }
};

export const completeRequest = async (id) => {
  try {
    const res = await API.post(`/requests/${id}/complete`);
    return res.data;
  } catch (error) {
    console.error(`Failed to complete request ${id}:`, error);
    throw error;
  }
};

// ---- Dashboard Stats ----
// adminApi.js
export const fetchRequestStats = async () => {
  const res = await API.get("/requests");

  // ✅ Support nested structure
  const requests = res.data.requests || res.data;

  // ✅ Make status comparison case-insensitive
  const total = requests.length;
  const pending = requests.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;
  const approved = requests.filter(
    (r) => r.status?.toLowerCase() === "approved"
  ).length;
  const completed = requests.filter(
    (r) => r.status?.toLowerCase() === "completed"
  ).length;

  return { total, pending, approved, completed };
};

// ---- Users (Manage Users page) ----
export const fetchUsers = async () => {
  try {
    const res = await API.get("/users");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

// ---- Reports (reuse requests for charting) ----
export const fetchReports = async () => {
  try {
    const res = await API.get("/requests");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return [];
  }
};

// ---- Logout ----
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login"; // ✅ redirect to admin login
};
