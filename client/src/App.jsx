import { useState } from "react";
import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";

function App() {
  return (
    <>
      <NavBar />
      <main className="container" style={{ backgroundColor: "red" }}>
        <UserList />
      </main>
    </>
  );
}

export default App;
