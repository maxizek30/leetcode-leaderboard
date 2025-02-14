import { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    // Attempt to fetch the current user - if we have a valid session, we get data
    // If not logged in, we get a 401 or 403, which triggers an error.
    fetch(`${apiUrl}/user`, {
      // credentials: "include", // if you're using session cookies
    })
      .then((response) => {
        if (!response.ok) {
          // Not logged in
          throw new Error("Not logged in");
        }
        return response.json();
      })
      .then((data) => {
        // Logged in successfully
        setUser(data);
      })
      .catch((err) => {
        console.log("User not logged in or error:", err);
        // We do NOT do an XHR-based redirect to GitHub. We just remain in a "not logged in" state.
        // user stays null, meaning we will show IoPersonCircle.
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) return <div>Loading...</div>;

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
                // E.g., open a profile page or modal
              }}
            />
          ) : (
            <IoPersonCircle
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={() => {
                // When not logged in, do a top-level redirect to the OAuth login
                // (NOT an XHR fetch). This avoids the CORS error to GitHub.
                window.location.href = `${apiUrl}/user`;
              }}
            />
          )}
        </li>
      </ul>
    </nav>
  );
}
