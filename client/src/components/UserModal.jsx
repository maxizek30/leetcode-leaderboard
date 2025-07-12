import { useModal } from "../contexts/ModalContext";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

export default function UserModal(props) {
  const { handleClose, isOpen } = useModal();
  const { user, setUser } = useUser();
  const [actualStats, setActualStats] = useState(null);
  const [diffStats, setDiffStats] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_LEETCODE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      console.log("User", user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // First, verify the LeetCode username exists
      const response = await fetch(`${leetcodeApiUrl}/${username}`);
      const data = await response.json();

      if (!data?.username || data?.errors || data?.data?.matchedUser === null) {
        throw new Error("User not found");
      }

      // If username exists, call the backend API to update it
      const updateResponse = await fetch(`${apiUrl}/user/leetcode-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          leetcodeUsername: username,
        }),
      });

      const updateResult = await updateResponse.json();

      if (updateResponse.ok && updateResult.success) {
        // Update the user context with the new user data
        setUser(updateResult.user);
        setSuccessMessage("LeetCode username updated successfully!");
        setUsername(""); // Clear the input
        setError(null);

        // Optional: Close modal after a brief delay to show success message
        setTimeout(() => {
          handleClose(null, "userModal");
        }, 1500);
      } else {
        throw new Error(updateResult.message || "Failed to update username");
      }
    } catch (err) {
      console.error("Error updating LeetCode username:", err);
      setError(
        err.message === "User not found"
          ? "LeetCode user not found."
          : "Failed to update username. Please try again."
      );
      setSuccessMessage(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleChangeUsername = () => {
    // Allow user to change their existing username
    setUser({ ...user, leetcodeUsername: null });
    setError(null);
    setSuccessMessage(null);
    setUsername("");
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
        </header>
        {user ? (
          user.leetcodeUsername ? (
            <>
              <img src={user.avatarUrl} width={"100px"} />
              <h3>{user.name}</h3>
              <p>@{user.leetcodeUsername}</p>
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
              <footer>
                <button
                  className="secondary"
                  onClick={handleChangeUsername}
                  style={{ marginRight: "10px" }}
                >
                  Change Username
                </button>
              </footer>
            </>
          ) : (
            <>
              <h3>Enter your LeetCode username</h3>
              <form onSubmit={handleSubmit}>
                <fieldset role="group">
                  <input
                    name="leetcode_username"
                    placeholder="LeetCode username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isChecking}
                  />
                  <input
                    type="submit"
                    value={isChecking ? "Checking..." : "Continue"}
                    disabled={isChecking}
                  />
                </fieldset>
                <small id="username-helper">
                  {error && <span style={{ color: "red" }}>{error}</span>}
                  {successMessage && (
                    <span style={{ color: "green" }}>{successMessage}</span>
                  )}
                </small>
              </form>
            </>
          )
        ) : (
          <p>No user data available.</p>
        )}
        <footer>
          <button className="secondary" onClick={deleteUser}>
            Delete account
          </button>
          <button onClick={logout}>Log out</button>
        </footer>
      </article>
    </dialog>
  );
}
