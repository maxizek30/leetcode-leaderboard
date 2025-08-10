import { useModal } from "../contexts/ModalContext";
import CoderStatsTable from "./CoderStatsTable";

function CoderModal(props) {
  const { handleClose, isOpen, getModalProps } = useModal();
  const modalProps = getModalProps("coderModal");
  const user = modalProps.user;

  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event, "coderModal");
    }
  };

  return (
    modalProps &&
    modalProps.user && (
      <dialog
        onClick={handleClickOverlay}
        open={isOpen("coderModal")}
        {...props}
      >
        <article>
          <header style={{ height: "45px" }}>
            <button
              aria-label="Close"
              rel="prev"
              onClick={(e) => handleClose(e, "coderModal")}
            ></button>
          </header>
          <div style={{ display: "flex", gap: "20px" }}>
            <img src={user.avatarUrl} style={{ width: "30%" }} />
            <CoderStatsTable user={user} />
          </div>

          <h4 style={{ marginBottom: "0px" }}>{user.name}</h4>
          <p>@{user.leetcodeUsername}</p>
        </article>
      </dialog>
    )
  );
}

export default CoderModal;
