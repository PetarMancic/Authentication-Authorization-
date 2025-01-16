import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setRememberMe } from "../Redux/RememberMeSlice";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();

  //const rememberMe = useSelector((state) => state.data.rememberMe);

  //console.log(rememberMe);

  const reducer = () => {
    dispatch(setRememberMe()); // dohvatili smo reducer
  };

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  // const [success, setSuccess] = useState(false);
  const success = useSelector((state) => state.rememberMe.rememberMe);

  const [name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    //setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const logIhHandler = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    console.log(user, pwd,checked);
    try {
      const response = await axios.post(
        "auth/login",
        JSON.stringify({ username: user, password: pwd, rememberMe: checked }), // Objekat kreiran direktno
        {
          headers: { "Content-Type": "application/json" }, // Zaglavlja
          withCredentials: true, // Ako koristite kolačiće ili sesije
        }
      );
      const token = response.data.access_token;

      if (response.status === 200) {
        const UserInfo = await axios.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setName(UserInfo.data.name);
        

        if (checked) {
          console.log("postavljam localstorage ");
          localStorage.setItem("rembemberMe", true);
          localStorage.setItem("authToken", token);
        }
      }
      dispatch(setRememberMe(true)); //ovde

      // console.log(response?.data);
      // console.log(response?.accessToken);
      // console.log(JSON.stringify(response));
      //setSuccess(true);

      // if (response.data.access_token) {
      //   sessionStorage.clear();
      //   sessionStorage.setItem("authToken", response.data.access_token);
      // }

      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  const logOutHandle = () => {
    localStorage.clear();
    dispatch(setRememberMe(false));

    console.log(success);
  };

  const prikaziPodatke = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Dohvatanje tokena iz sessionStorage
      console.log("Token je pblika ", token, " iz auth/profile");

      if (!token) {
        throw new Error("Token nije pronađen u sessionStorage");
      }
      console.log("Sada cu da prikazem podatke i saljem token :", token);
      const response = await axios.get("auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Dodavanje tokena u Authorization header
        },
      });

      console.log("response.data je ", response.data);
    } catch (error) {
      console.error("Greška prilikom poziva API-ja:", error);

      alert("Došlo je do greške prilikom dobijanja podataka!");
    }
  };

  const vratiUsera = () => {
    const token = sessionStorage.getItem("authToken"); // Dohvatanje tokena iz sessionStorage
    console.log("Token je pblika ", token, " iz users/getUser");

    if (!token) {
      alert("Token nije pronađen u sessionStorage");
      return;
    }

    axios
      .get("users/getUser/2", {
        headers: {
          Authorization: `Bearer ${token}`, // šaljem token pošto imamo autentifikaciju
        },
      })
      .then((response) => {
        // Ispisujemo odgovor sa servera (response.data)
        console.log("response.data je:", response.data);

        // Ako želite specifično polje iz response.data
        console.log("Korisničko ime:", response.data.username); // primer ako backend šalje "username"
      })
      .catch((error) => {
        console.error("Greška prilikom poziva API-ja:", error);

        if (error.response) {
          alert(`Error: ${error.response.data.message || error.response.data}`);
        }
      });
  };

  const checkBoxHandler = (event) => {
    // dispatch(setRememberMe(true));

    setChecked(event.target.checked);
    localStorage.setItem("rememberMe", true);
    console.log("Checked:", event.target.checked);
  };

  const klikni = async () => {
    const token = localStorage.getItem("authToken");
    try {
      // Slanje POST zahteva sa tokenom u body
      const response = await axios.post(
        "auth/validate-token", // URL do tvoje metode
        { token } // Poslati token u body zahteva
      );

      if (response.data.valid) {
        console.log("Token is valid.");
        return true; // Token je validan, možeš nastaviti sa daljim akcijama
      } else {
        console.log("Invalid token. Logging out.");
        // Ukloni token iz localStorage/sessionStorage, ako je nevalidan
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      // Ako je došlo do greške (npr. server nije dostupan)
    }
  };

  return (
    <>
      {success ? (
        <section className="bg-blue-800">
          <h1>Welcome {name}!</h1>
          <p> You logged successfully!</p>
          <p>
            <div className="flex flex-col space-y-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={prikaziPodatke}
              >
                auth/profile{" "}
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={vratiUsera}
              >
                users/getUser/5{" "}
              </button>
            </div>
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={logOutHandle}
          >
            {" "}
            Log out
          </button>

          <button onClick={klikni}> proveri metodu </button>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign in</h1>
          <form onSubmit={logIhHandler}>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className="text-black"
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="text-black"
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <label>
              <Checkbox
                checked={checked}
                onChange={checkBoxHandler}
                color="primary"
              />
              Remember me
            </label>
            <div className="flex items-center justify-between">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded  
                        ${
                          !validName || !validPwd
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-700"
                        }`}
                disabled={!validName || !validPwd}
                type="submit"
              >
                Sign In
              </button>
              <button onClick={reducer}> Klikni</button>
              {/* <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a> */}
              <Link to="/register" className="hover:underline blue-500">
                Forgot password?
              </Link>{" "}
              //todo
            </div>
          </form>

          <p>
            You dont have an account?
            <br />
            <span className="line">
              <Link to="/register" className="hover:underline blue-500">
                Register now
              </Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
