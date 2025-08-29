// src/pages/AdminRequests.jsx
import { useEffect, useState, useMemo } from "react";
import {
  fetchRequests,
  approveRequest,
  completeRequest,
} from "../services/adminApi";
import {
  FaCheckCircle,
  FaClipboardCheck,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState("user");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchRequests();
      setRequests(data?.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    const collector = prompt("Enter Collector Info (Name - +91XXXXXXXXXX):");
    if (!collector) return;
    try {
      await approveRequest(id, collector);
      loadRequests();
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request");
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Mark this request as completed?")) return;
    try {
      await completeRequest(id);
      loadRequests();
    } catch (err) {
      console.error("Error completing request:", err);
      alert("Failed to complete request");
    }
  };

  // Filtered + Sorted
  const processedRequests = useMemo(() => {
    console.log(requests, "----rerrrrrrrrrr");
    let filtered = requests?.filter((req) => {
      const matchesSearch =
        (req.user?.name?.toLowerCase().includes(search.toLowerCase()) ??
          false) ||
        (req.location?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (req.phone?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesFilter = filter === "all" || req.status === filter;
      return matchesSearch && matchesFilter;
    });

    filtered?.sort((a, b) => {
      const aField =
        sortField === "user"
          ? a.user?.name || ""
          : sortField === "location"
          ? a.location || ""
          : sortField === "status"
          ? a.status || ""
          : "";
      const bField =
        sortField === "user"
          ? b.user?.name || ""
          : sortField === "location"
          ? b.location || ""
          : sortField === "status"
          ? b.status || ""
          : "";
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [requests, search, filter, sortField, sortOrder]);

  const totalPages = Math.ceil(processedRequests?.length / pageSize);
  const currentRequests = processedRequests?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📝 Manage Requests
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, location, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-500">Loading requests...</div>
      ) : currentRequests.length === 0 ? (
        <div className="text-center text-gray-500">
          No matching requests found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left cursor-pointer">
                <th
                  className="p-4 text-sm font-semibold text-gray-600"
                  onClick={() => handleSort("user")}
                >
                  User{" "}
                  {sortField === "user"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="p-4 text-sm font-semibold text-gray-600"
                  onClick={() => handleSort("location")}
                >
                  Location{" "}
                  {sortField === "location"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Notes
                </th>
                <th
                  className="p-4 text-sm font-semibold text-gray-600"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req, index) => (
                <tr
                  key={req._id || index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">{req.user?.name || "N/A"}</td>
                  <td className="p-4">{req.location || "N/A"}</td>
                  <td className="p-4">{req.phone || "N/A"}</td>
                  <td className="p-4">{req.notes || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : req.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {req.status === "pending" && (
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                    )}
                    {req.status === "approved" && (
                      <button
                        onClick={() => handleComplete(req._id)}
                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                      >
                        <FaClipboardCheck /> Complete
                      </button>
                    )}
                    {req.status === "completed" && (
                      <span className="text-gray-400 italic">✔ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            <FaArrowLeft /> Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
