// src/services/adminApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

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
  // ⚠️ You need a backend route for this: /api/user/all
  const res = await axios.get("http://localhost:5000/api/user/all");
  return res.data;
};

// ---- Reports (reuse requests for charting) ----
export const fetchReports = async () => {
  const res = await API.get("/requests");
  return res.data;
};
