import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserRole } from "../services/userService"; // Double check this path!

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminRole = async () => {
      try {
        const response = await getCurrentUserRole();
        
        const userRole = response.data.role; 

        if (userRole === "ROLE_ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        setIsAdmin(false); 
      } finally {
        setLoading(false);
      }
    }; // <-- The definition ends cleanly here

    // 2. Invocation of the function inside the correct hook scope
    verifyAdminRole();
  }, []); 

  // 3. Render state layout controls
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isAdmin) {
    return children;
  }

  return <Navigate to="/home" replace />;
}

export default AdminRoute;