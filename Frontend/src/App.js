import logo from "./logo.svg";
import Register from "./components/Register";
import "./App.css";
import React, { useEffect, useState } from "react";
import { api } from "./constants/constant";
import SignIn from "./components/SignIn";

import { useDispatch, useSelector } from "react-redux";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "./api/axios";
import { setRememberMe } from "./Redux/RememberMeSlice";
function App() {
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const validateAndSet = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        console.log("Token postoji i njegova vrednost je:", token);
        dispatch(setRememberMe(true));
        try {
          // Poziv metode za validaciju tokena
          const isValidObject = await validateToken(token);
          console.log(
            "u local storage remember je ",
            localStorage.getItem("rememberMe")
          );
          if (isValidObject.isValid == true && localStorage.getItem("rememberMe")
          ) {
            console.log("Token je validan.");
            dispatch(setRememberMe(true)); // Ažuriraj Redux stanje
             const UserInfo = await axios.get("auth/profile", {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
          } else {
            console.log("Token nije validan.");
            dispatch(setRememberMe(false));
            localStorage.clear();
          }
        } catch (error) {
          console.error(
            "Greška prilikom validacije tokena:",
            error.response?.data || error.message
          );
          dispatch(setRememberMe(false));
        }
      }
    };

    validateAndSet(); // Poziv asinhrone funkcije
  }, [dispatch]);

  const validateToken = async (token) => {
    const url = "auth/validate-token";

    try {
      const response = await axios.post(url, { token });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("There was an error with the Axios request:", error);
    }
  };

  return (
    <Router>
      <main className="App">
        {/* Navigacija */}
        {/* Prikaz trenutnog sadržaja */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
