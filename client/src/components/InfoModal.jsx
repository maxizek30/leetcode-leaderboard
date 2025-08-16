import { useModal } from "../contexts/ModalContext";

export default function InfoModal() {
  const { handleClose, isOpen } = useModal();

  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event, "infoModal");
    }
  };

  return (
    <div>
      <dialog onClick={handleClickOverlay} open={isOpen("infoModal")}>
        <article>
          <header>
            <button
              aria-label="Close"
              rel="prev"
              onClick={(e) => handleClose(e, "infoModal")}
            ></button>
            <h3>About LeetCode Leaderboard</h3>
          </header>

          <p>
            This is a weekly leaderboard that tracks LeetCode problem solving
            progress. The leaderboard resets every week, giving everyone a fresh
            start to compete!
          </p>

          <p>
            <strong>Getting Started:</strong>
            <br />
            If you haven&apos;t already, click the user icon in the top right to
            login with GitHub and add your LeetCode username to join the
            competition.
          </p>

          <p>
            <small>
              <em>
                Your progress is tracked from the moment you join until the
                weekly reset.
              </em>
            </small>
          </p>
        </article>
      </dialog>
    </div>
  );
}
