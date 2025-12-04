import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext<AuthType | null>(null);
export type AuthType = {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  rating: number;
  rating_count: number;
  address: string;
  date_of_birth: string;
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthType | null>(null);
  const location = useLocation();
  async function getUserData() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    console.log("User data fetched:");

    getUserData();
  }, [location.pathname]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
