import { useModal } from "../contexts/ModalContext";
import { useUser } from "../contexts/UserContext";

export default function UserModal(props) {
  const { modalIsOpen, handleClose } = useModal();
  const { user } = useUser();

  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event);
    }
  };

  return (
    <dialog onClick={handleClickOverlay} open={modalIsOpen} {...props}>
      <article>
        <header>
          <button aria-label="Close" rel="prev" onClick={handleClose}></button>
          <h3>User Information</h3>
        </header>
        {user ? <p>Welcome, {user.name}!</p> : <p>No user data available.</p>}
        <footer>
          <button className="secondary" onClick={handleClose}>
            Delete account
          </button>
          <button onClick={handleClose}>Exit</button>
        </footer>
      </article>
    </dialog>
  );
}
