import { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${apiUrl}/user`, {
      credentials: "include", // Important! This sends cookies
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.log("User not logged in or error:", err);
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) return <div>Loading...</div>;

  const handleLogin = () => {
    // Direct redirect to the backend auth endpoint
    window.location.href = `${apiUrl}/oauth2/authorization/github`;
  };

  return (
    <nav style={{ marginLeft: "40px", marginRight: "40px" }}>
      <ul>
        <li>
          <strong style={{ fontSize: "40px" }}>Leetcode-Leaderboard</strong>
        </li>
      </ul>
      <ul>
        <li>
          {user ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
              onClick={() => {
                // Handle profile click
              }}
            />
          ) : (
            <IoPersonCircle
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={handleLogin}
            />
          )}
        </li>
      </ul>
    </nav>
  );
}
