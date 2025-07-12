import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_LEETCODE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user/public/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then(async (data) => {
        const enhancedUsers = await Promise.all(
          data.map(async (user) => {
            try {
              const res = await fetch(
                `${leetcodeApiUrl}/${user.leetcodeUsername}/solved`
              );
              const live = await res.json();
              console.log(
                `User: ${user.leetcodeUsername}, Easy: ${live.easySolved - user.snapshotEasyCount}, Medium: ${live.mediumSolved - user.snapshotMediumCount}, Hard: ${live.hardSolved - user.snapshotHardCount}`
              );
              const diffStats = {
                easy: live.easySolved - user.snapshotEasyCount,
                medium: live.mediumSolved - user.snapshotMediumCount,
                hard: live.hardSolved - user.snapshotHardCount,
              };
              return { ...user, diffStats };
            } catch (err) {
              console.log("Failed to fetch stats for", user.leetcodeUsername);
              return { ...user, diffStats: null };
            }
          })
        );
        setUsers(enhancedUsers);
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
  // Sort users by total diffStats (easy + medium + hard) descending
  const sortedUsers = users
    .filter((user) => user.leetcodeUsername)
    .sort((a, b) => {
      const aTotal =
        (a.diffStats?.easy || 0) +
        (a.diffStats?.medium || 0) +
        (a.diffStats?.hard || 0);
      const bTotal =
        (b.diffStats?.easy || 0) +
        (b.diffStats?.medium || 0) +
        (b.diffStats?.hard || 0);
      return bTotal - aTotal;
    });

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">#</th>
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
        {sortedUsers.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td scope="row">
              <img
                src={user.avatarUrl}
                alt={`${user.login}'s avatar`}
                style={{ width: "100px" }}
              />
            </td>
            <td>{user.name}</td>
            <td>{user.leetcodeUsername}</td>
            <td>{user.diffStats?.easy ?? 0}</td>
            <td>{user.diffStats?.medium ?? 0}</td>
            <td>{user.diffStats?.hard ?? 0}</td>
            <td>
              {(user.diffStats?.easy ?? 0) +
                (user.diffStats?.medium ?? 0) +
                (user.diffStats?.hard ?? 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserList;
