import { useModal } from "../contexts/ModalContext";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import CoderStatsTable from "./CoderStatsTable";

export default function UserModal(props) {
  const { handleClose, isOpen } = useModal();
  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_LEETCODE_URL;

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
        <header style={{ height: "45px" }}>
          <button
            aria-label="Close"
            rel="prev"
            onClick={(e) => handleClose(e, "userModal")}
          ></button>
        </header>
        {user ? (
          user.leetcodeUsername ? (
            <>
              <div style={{ display: "flex", gap: "20px" }}>
                <img src={user.avatarUrl} style={{ width: "30%" }} />{" "}
                <CoderStatsTable user={user} />
              </div>

              <h4 style={{ marginBottom: "0px" }}>{user.name}</h4>
              <p>@{user.leetcodeUsername}</p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3>Enter your LeetCode username</h3>
                <button
                  aria-label="Close"
                  rel="prev"
                  onClick={(e) => handleClose(e, "userModal")}
                ></button>
              </div>

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
          {user && user.leetcodeUsername && (
            <button className="secondary" onClick={handleChangeUsername}>
              Change Username
            </button>
          )}
          <button className="secondary" onClick={deleteUser}>
            Delete account
          </button>
          <button onClick={logout}>Log out</button>
        </footer>
      </article>
    </dialog>
  );
}
