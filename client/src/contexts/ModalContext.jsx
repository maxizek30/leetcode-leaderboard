import { createContext, useContext, useEffect, useState } from "react";
import getScrollBarWidth from "./utils/GetScrollBarWidth";

const ModalContext = createContext({});
const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children, ...props }) => {
  const isSSR = typeof window === "undefined";
  const htmlTag = !isSSR && document.querySelector("html");
  const [modals, setModals] = useState({});
  const modalAnimationDuration = 400;

  const handleOpen = (event, modalName) => {
    event?.preventDefault?.();
    if (htmlTag) {
      setModals((prev) => ({ ...prev, [modalName]: true }));
      htmlTag.classList.add("modal-is-open", "modal-is-opening");
      setTimeout(() => {
        htmlTag.classList.remove("modal-is-opening");
      }, modalAnimationDuration);
    }
  };

  const handleClose = (event, modalName) => {
    event?.preventDefault?.();
    if (htmlTag) {
      htmlTag.classList.add("modal-is-closing");
      setTimeout(() => {
        setModals((prev) => {
          const newModals = { ...prev, [modalName]: false };
          const anyModalStillOpen = Object.values(newModals).some(Boolean);
          if (!anyModalStillOpen) {
            htmlTag.classList.remove("modal-is-open", "modal-is-closing");
          } else {
            htmlTag.classList.remove("modal-is-closing");
          }
          return newModals;
        });
      }, modalAnimationDuration);
    }
  };

  const isOpen = (modalName) => !!modals[modalName];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (!Object.values(modals).some(Boolean)) return;
      if (event.key === "Escape") {
        // Close all open modals
        Object.keys(modals).forEach((modalName) => {
          if (modals[modalName]) {
            handleClose(event, modalName);
          }
        });
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modals]);

  // Set scrollbar width on mount
  useEffect(() => {
    const scrollBarWidth = getScrollBarWidth();
    htmlTag.style.setProperty("--pico-scrollbar-width", `${scrollBarWidth}px`);
    return () => {
      htmlTag.style.removeProperty("--pico-scrollbar-width");
    };
  }, []);

  return (
    <ModalContext.Provider
      value={{
        modals,
        handleOpen,
        handleClose,
        isOpen,
        modalAnimationDuration,
        ...props,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, useModal };
