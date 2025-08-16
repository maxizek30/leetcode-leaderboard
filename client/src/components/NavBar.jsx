import { IoPersonCircle } from "react-icons/io5";
import { useUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";
import leetcodeLogo from "../assets/LeetCode.png";

export default function NavBar() {
  const { user, loading } = useUser();
  const { handleOpen } = useModal();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  if (loading) return <div>Loading...</div>;

  const handleLogin = () => {
    window.location.href = `${apiUrl}/oauth2/authorization/github`;
  };

  return (
    <nav style={{ marginLeft: "40px", marginRight: "40px" }}>
      <ul>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={leetcodeLogo}
            alt="Leetcode Logo"
            style={{ width: 40, height: 40 }}
          />
          <strong style={{ fontSize: "40px" }}>Leetcode Leaderboard</strong>
        </li>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            background: "grey",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            marginLeft: "8px",
            cursor: "pointer",
          }}
          onClick={(e) => handleOpen(e, "infoModal")}
          data-tooltip="info"
          data-placement="right"
        >
          i
        </span>
      </ul>
      <ul>
        <li>
          {user ? (
            <a
              data-tooltip="Profile"
              data-placement="bottom"
              style={{ cursor: "pointer" }}
            >
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
                onClick={(e) => handleOpen(e, "userModal")}
              />
            </a>
          ) : (
            <a data-tooltip="Sign In" data-placement="bottom">
              <IoPersonCircle
                style={{ fontSize: "40px", cursor: "pointer" }}
                onClick={handleLogin}
              />
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}
