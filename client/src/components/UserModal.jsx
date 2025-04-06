import { useModal } from "../contexts/ModalContext";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

export default function UserModal(props) {
  const { handleClose, isOpen } = useModal();
  const { user, setUser } = useUser();
  const [actualStats, setActualStats] = useState(null);
  const [diffStats, setDiffStats] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.leetcodeUsername) return;

      try {
        const response = await fetch(
          `${leetcodeApiUrl}/${user.leetcodeUsername}/solved`
        );
        const data = await response.json();
        if (data && data.easySolved != null) {
          setActualStats(data);
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

  console.log(user);
  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event, "userModal");
    }
  };
  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        handleClose(null, "userModal");
        setUser(null);
        window.location.reload;
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error: ", err);
    }
  };
  const deleteUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        handleClose(null, "userModal");
        setUser(null);
        window.location.reload;
      } else {
        const error = await response.text();
        alert("Error deleting user: " + error);
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  return (
    <dialog onClick={handleClickOverlay} open={isOpen("userModal")} {...props}>
      <article>
        <header>
          <button
            aria-label="Close"
            rel="prev"
            onClick={(e) => handleClose(e, "userModal")}
          ></button>

          {user ? (
            <>
              <img src={user.avatarUrl} width={"100px"} />
              <h3>{user.name}</h3>
              <p>@{user.leetcodeUsername}</p>
            </>
          ) : (
            <h3>Loading User</h3>
          )}
        </header>
        {user ? (
          <>
            {diffStats && (
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
                    <th scope="row">+{diffStats.easy}</th>
                    <td>+{diffStats.medium}</td>
                    <td>+{diffStats.hard}</td>
                    <td>
                      +{diffStats.easy + diffStats.medium + diffStats.hard}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p>No user data available.</p>
        )}
        <footer>
          <button className="secondary" onClick={deleteUser}>
            Delete account
          </button>
          <button onClick={logout}>Log out</button>
          <button onClick={(e) => handleClose(e, "userModal")}>Exit</button>
        </footer>
      </article>
    </dialog>
  );
}
