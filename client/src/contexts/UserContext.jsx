import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user/auth-status`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) {
          console.log("Fetched User: ");
          console.log(data.user);
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.log("Error checking auth status:", err);
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
