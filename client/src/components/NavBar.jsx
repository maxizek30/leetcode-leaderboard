import { IoPersonCircle } from "react-icons/io5";
import { useUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";

export default function NavBar() {
  const { user, loading } = useUser();
  const { handleOpen } = useModal();

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  if (loading) return <div>Loading...</div>;

  const handleLogin = () => {
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
            <a
              data-tooltip="Settings"
              data-placement="bottom"
              style={{ cursor: "pointer" }}
            >
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
                onClick={handleOpen}
              />
            </a>
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
