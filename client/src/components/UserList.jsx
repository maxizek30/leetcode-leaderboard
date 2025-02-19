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
    <table>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col">Easy</th>
          <th scope="col">Medium</th>
          <th scope="col">Hard</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <th scope="row">
              <img
                src={user.avatarUrl}
                alt={`${user.login}'s avatar`}
                style={{ width: "100px" }}
              />
            </th>
            <td>{user.name}</td>
            <td>{user.login}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserList;
