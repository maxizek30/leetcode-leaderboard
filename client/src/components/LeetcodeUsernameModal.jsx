import { useState } from "react";
import { useModal } from "../contexts/ModalContext";

export default function LeetcodeUsernameModal(props) {
  const { handleClose, isOpen } = useModal();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const leetcodeApiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event, "leetcodeUsernameModal");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`${leetcodeApiUrl}/${username}`);

      const data = await response.json();

      console.log(data);
      if (!data?.username || data?.errors || data?.data?.matchedUser === null) {
        throw new Error("User not found");
      }

      document.cookie = `leetcodeUsername=${username}; path=/; max-age=300`;

      setError(null);
      handleLogin();
    } catch (err) {
      setError("Leetcode user not found.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = () => {
    window.location.href = `${apiUrl}/oauth2/authorization/github`;
  };
  return (
    <dialog
      onClick={handleClickOverlay}
      open={isOpen("leetcodeUsernameModal")}
      {...props}
    >
      <article>
        <header>
          <button
            aria-label="Close"
            rel="prev"
            onClick={(e) => handleClose(e, "leetcodeUsernameModal")}
          ></button>
          <h3>Enter your Leetcode username</h3>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset role="group">
            <input
              name="first_name"
              placeholder="Leetcode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="submit"
              value={isChecking ? "Checking..." : "Continue"}
            />
          </fieldset>
          <small id="username-helper">{error != null ? error : ""}</small>
        </form>
        <footer></footer>
      </article>
    </dialog>
  );
}
