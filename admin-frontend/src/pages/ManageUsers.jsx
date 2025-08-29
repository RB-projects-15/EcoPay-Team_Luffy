// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import { fetchUsers } from "../services/adminApi";
import { FaSearch, FaUserAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data?.users);
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
  console.log(users, "---users");
  const filteredUsers = users?.filter((u) =>
    [u.name, u.email, u.phone]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 Manage Users</h1>

      {/* ✅ Search Bar */}
      <div className="relative w-full md:w-1/3 mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* ✅ Users Table */}
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Phone
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Total Requests
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-2">
                    <FaUserAlt className="text-gray-400" /> {user.name || "N/A"}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />{" "}
                    {user.email || "N/A"}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <FaPhone className="text-gray-400" /> {user.phone || "N/A"}
                  </td>
                  <td className="p-4 text-center">{user.totalRequests || 0}</td>
                  <td className="p-4">
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
