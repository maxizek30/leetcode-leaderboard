import { useState } from "react";
import "./App.css";
import "@picocss/pico";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <main className="container" style={{ backgroundColor: "red" }}>
        Hello World
      </main>
    </>
  );
}

export default App;
