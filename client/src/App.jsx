import { useState } from "react";
import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import { ModalProvider } from "./contexts/ModalContext";
import UserModal from "./components/UserModal";
import { UserProvider } from "./contexts/UserContext";

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
        </ModalProvider>
      </UserProvider>
    </>
  );
}

export default App;
