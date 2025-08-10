import { useEffect, useState } from "react";

function CoderStatsTable({ user }) {
  const [diffStats, setDiffStats] = useState(null);
  const [actualStats, setActualStats] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_LEETCODE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      console.log("User in coderstats", user);
      if (!user?.leetcodeUsername) return;

      try {
        const response = await fetch(
          `${leetcodeApiUrl}/${user.leetcodeUsername}/solved`
        );
        const data = await response.json();
        if (data && data.easySolved != null) {
          setActualStats(data);
          console.log("Diff", {
            easy: data.easySolved - user.snapshotEasyCount,
            medium: data.mediumSolved - user.snapshotMediumCount,
            hard: data.hardSolved - user.snapshotHardCount,
          });
          const diff = {
            easy: data.easySolved - user.snapshotEasyCount,
            medium: data.mediumSolved - user.snapshotMediumCount,
            hard: data.hardSolved - user.snapshotHardCount,
          };

          setDiffStats(diff);
        }
      } catch (err) {
        console.error("Failed to fetch LeetCode stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <>
      {user && diffStats && (
        <table>
          <thead>
            <tr>
              <th scope="col">Easy</th>
              <th scope="col">Medium</th>
              <th scope="col">Hard</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr key={user.id}>
              <th scope="row">{diffStats.easy}</th>
              <td>{diffStats.medium}</td>
              <td>{diffStats.hard}</td>
              <td>{diffStats.easy + diffStats.medium + diffStats.hard}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default CoderStatsTable;
