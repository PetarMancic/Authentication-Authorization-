import logo from "./logo.svg";
import Register from "./components/Register";
import "./App.css";
import React, { useEffect, useState } from "react";
import { api } from "./constants/constant";
import SignIn from "./components/SignIn";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`users/prezime1/${2}`)
      .then((response) => setMessage(response.data.prezime))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <Router>
      <main className="App">
        {/* Navigacija */}

        {/* Prikaz trenutnog sadržaja */}
        <Routes>
          
          <Route path="/" element={<Register />} />
          <Route path="/signIn" element= {<SignIn/>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
