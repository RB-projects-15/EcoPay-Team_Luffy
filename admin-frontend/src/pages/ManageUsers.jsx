// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import { fetchUsers } from "../services/adminApi";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`border-t hover:bg-gray-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-3 text-gray-700">{user.name}</td>
                  <td className="px-6 py-3 text-gray-700">{user.email}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-green-700">
                    {user.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
