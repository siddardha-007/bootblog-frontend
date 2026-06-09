import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllUsers } from "../../services/adminService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching user catalog database list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Module Header block Section */}
        <div className="mb-8 relative flex flex-col gap-2.5">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Manage Users
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-900 text-white px-2.5 py-1 rounded-md ml-3 align-middle">
              Directory Desk
            </span>
          </h1>
          <div className="w-20 h-1 bg-[#5ea134] rounded-full"></div>
        </div>

        {/* Core Table Viewport Layer */}
        <div className="bg-white rounded-2xl shadow-xs border border-emerald-900/5 overflow-hidden w-full">
          {isLoading ? (
            <div className="p-12 space-y-4 w-full">
              <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-full"></div>
              <div className="h-12 bg-gray-50 rounded-xl animate-pulse w-full"></div>
              <div className="h-12 bg-gray-50 rounded-xl animate-pulse w-full"></div>
              <div className="h-12 bg-gray-50 rounded-xl animate-pulse w-full"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm font-semibold text-gray-400">
              No registered user accounts found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-emerald-900/5 border-b border-emerald-900/10 text-xs font-black uppercase tracking-wider text-emerald-950">
                    <th className="p-4 pl-6 font-mono w-32">User ID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4 pr-6">Email Address</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-emerald-50/20 transition-colors group"
                    >
                      {/* ID Row Column */}
                      <td className="p-4 pl-6 font-mono text-xs text-gray-400 font-bold group-hover:text-[#4c8529]">
                        #{user.userId}
                      </td>

                      {/* Username Row Column */}
                      <td className="p-4 font-bold text-gray-900 truncate max-w-50">
                        {user.username}
                      </td>

                      {/* Email Row Column with defensive wrap controls */}
                      <td
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                        className="p-4 pr-6 font-medium text-gray-500 whitespace-normal max-w-75"
                      >
                        {user.email || (
                          <span className="text-xs font-bold text-gray-300 italic uppercase tracking-wider">
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
