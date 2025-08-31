// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import { fetchUsers } from "../services/adminApi";
import { FaSearch, FaUserAlt, FaStar } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Filter by search (name, email, phone)
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          Manage Users
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/3 mb-8">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center text-gray-500 italic">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 italic">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                <th className="p-4 text-sm font-semibold text-left">Name</th>
                <th className="p-4 text-sm font-semibold text-left">Email</th>
                <th className="p-4 text-sm font-semibold text-left">Phone</th>
                <th className="p-4 text-sm font-semibold text-center">
                  Total Requests
                </th>
                <th className="p-4 text-sm font-semibold text-center">
                  Points
                </th>
                <th className="p-4 text-sm font-semibold text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  {/* Name */}
                  <td className="p-4 flex items-center gap-2 text-gray-700 font-medium">
                    <FaUserAlt className="text-blue-500" />
                    {user.name || "N/A"}
                  </td>

                  {/* Email & Phone */}
                  <td className="p-4 text-gray-600">{user.email || "N/A"}</td>
                  <td className="p-4 text-gray-600">{user.phone || "N/A"}</td>

                  {/* Total Requests */}
                  <td className="p-4 text-center font-semibold text-gray-800">
                    {user.totalRequests ?? user.requests?.length ?? 0}
                  </td>

                  {/* Points */}
                  <td className="p-4 text-center font-semibold text-yellow-600 flex items-center justify-center gap-1">
                    <FaStar /> {user.points ?? 0}
                  </td>

                  {/* Joined */}
                  <td className="p-4 text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
