import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${apiUrl}/user/public/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="user-list">
      <h2>Users</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img
              src={user.avatarUrl}
              alt={`${user.login}'s avatar`}
              className="user-avatar"
            />
            <h3>{user.name || user.login}</h3>
            {user.email && <p>{user.email}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
