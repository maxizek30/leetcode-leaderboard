import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import { ModalProvider } from "./contexts/ModalContext";
import UserModal from "./components/UserModal";
import { UserProvider } from "./contexts/UserContext";
import LeetcodeUsernameModal from "./components/LeetcodeUsernameModal";
import CoderModal from "./components/CoderModal";

function App() {
  return (
    <>
      <UserProvider>
        <ModalProvider>
          <NavBar />
          <main className="container" style={{ backgroundColor: "red" }}>
            <UserList />
          </main>
          <UserModal />
          <CoderModal />
          <LeetcodeUsernameModal />
        </ModalProvider>
      </UserProvider>
    </>
  );
}

export default App;
