import axios from "axios";

// ✅ Create axios instance with base URL and dynamic Authorization header
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
  const res = await API.get("/requests");
  return res.data;
};

export const approveRequest = async (id, collector_info) => {
  const res = await API.post(`/requests/${id}/approve`, { collector_info });
  return res.data;
};

export const completeRequest = async (id) => {
  const res = await API.post(`/requests/${id}/complete`);
  return res.data;
};

// ---- Dashboard Stats ----
export const fetchRequestStats = async () => {
  const res = await API.get("/requests");
  const requests = res.data;

  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };
};

// ---- Users (Manage Users page) ----
export const fetchUsers = async () => {
  const res = await API.get("/users"); // backend route: /api/admin/users
  return res.data;
};

// ---- Reports (reuse requests for charting) ----
export const fetchReports = async () => {
  const res = await API.get("/requests");
  return res.data;
};

// ---- Logout ----
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login"; // ✅ redirect to admin login
};
