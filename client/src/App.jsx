import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import { ModalProvider } from "./contexts/ModalContext";
import UserModal from "./components/UserModal";
import { UserProvider } from "./contexts/UserContext";
import LeetcodeUsernameModal from "./components/LeetcodeUsernameModal";
import CoderModal from "./components/CoderModal";
import InfoModal from "./components/InfoModal";

function App() {
  return (
    <>
      <UserProvider>
        <ModalProvider>
          <NavBar />
          <main
            className="container"
            style={{
              padding: "20px",
              borderRadius: "25px",
            }}
          >
            <article>
              <UserList />
            </article>
          </main>
          <UserModal />
          <InfoModal />
          <CoderModal />
          <LeetcodeUsernameModal />
        </ModalProvider>
      </UserProvider>
    </>
  );
}

export default App;
