import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import { ModalProvider } from "./contexts/ModalContext";
import UserModal from "./components/UserModal";
import { UserProvider } from "./contexts/UserContext";
import LeetcodeUsernameModal from "./components/LeetcodeUsernameModal";
import { useModal } from "./contexts/ModalContext";

function App() {
  const { modals } = useModal();

  return (
    <>
      <UserProvider>
        <ModalProvider>
          <NavBar />
          <main className="container" style={{ backgroundColor: "red" }}>
            <UserList />
          </main>
          <UserModal />
          <LeetcodeUsernameModal />
        </ModalProvider>
      </UserProvider>
    </>
  );
}

export default App;
