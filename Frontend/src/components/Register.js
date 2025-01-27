import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";
import Alerts from "./Alerts";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const nameRegex = /^[A-Za-z][A-Za-z0-9_-]{3,23}$/; // Prvi karakter slovo, dužina od 4 do 24
const surnameRegex = /^[A-Za-z][A-Za-z0-9_-]{3,23}$/; // Slično za prezime
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validacija za e-mail

const nickNameRegex = /^[A-Za-z][A-Za-z0-9_-]{3,23}$/;

const REGISTER_URL = "/register";

const Register = () => {

 


  const userRef = useRef();
  const errRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const nickNameRef = useRef();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [isValidName, setIsValidName] = useState(false); // Promenjena varijabla za validaciju imena
  const [isValidSurname, setIsValidSurname] = useState(false); // Promenjena varijabla za validaciju prezimena
  const [nameFocus, setNameFocus] = useState(false);
  const [surnameFocus, setSurnameFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [nickName, setNickName] = useState("");
  const [validNickName, setValidNickName] = useState(false);
  const [nickNameFocus, setNickNameFocus] = useState(false);

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleNameChange = (e) => {
    const userName = e.target.value;
    setName(userName);
    setIsValidName(nameRegex.test(userName)); // Ažuriraj za isValidName
  };

  const handleSurnameChange = (e) => {
    const userSurname = e.target.value;
    setSurname(userSurname);
    setIsValidSurname(surnameRegex.test(userSurname)); // Ažuriraj za isValidSurname
  };

  const handleNickNameChange = (e) => {
    const nickName = e.target.value;
    setNickName(nickName);
    setValidNickName(nickNameRegex.test(nickName));
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd, matchPwd]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleEmailChange = (e) => {
    const userEmail = e.target.value;
    setEmail(userEmail);
    setIsValidEmail(emailRegex.test(userEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    console.log(name, surname, username, nickName, email, pwd);
    try {
      const response = await axios.post(
        "/users/createUser", // Dodaj `/` na početak ako je ruta relativna
        {
          name: name,
          surname: surname,
          nickname: nickName,
          email: email,
          username: username,
          password: pwd,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);

      if (response.data.access_token) {
        sessionStorage.setItem("authToken", response.data.access_token);
      }
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUsername("");
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

  const prikaziPodatke = async () => {
    try {
      const token = sessionStorage.getItem("authToken"); // Dohvatanje tokena iz sessionStorage
      console.log("Token je oblika", token);

      if (!token) {
        throw new Error("Token nije pronađen u sessionStorage");
      }

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

  const vratiUsera = async () => {
    try {
      const token = sessionStorage.getItem("authToken"); // Dohvatanje tokena iz sessionStorage
      console.log("Token je oblika", token);

      if (!token) {
        throw new Error("Token nije pronađen u sessionStorage");
      }

      const response = await axios.get("users/getUser/5", {
        headers: {
          Authorization: `Bearer ${token}`, // saljem token posto imamo autentifikaciju
        },
      });

      console.log("response.data je ", response.data);
    } catch (error) {
      // Obrada greške
      console.error("Greška prilikom poziva API-ja:", error);
      
      // Možete ovde postaviti korisničku poruku o grešci ili nešto drugo, na primer:
     // alert("Došlo je do greške prilikom dobijanja podataka!");
    }
  };

  return (
    <>
   
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
            <button onClick={prikaziPodatke}>auth/profile </button>
            <button onClick={vratiUsera}>users/getUser/5 </button>
          </p>
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
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <label htmlFor="name">
              Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidName ? "valid" : "hide"} // Koristi isValidName
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidName || !name ? "hide" : "invalid"} // Koristi isValidName
              />
            </label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              autoComplete="off"
              onChange={handleNameChange}
              value={name}
              required
              aria-invalid={isValidName ? "false" : "true"} // Koristi isValidName
              aria-describedby="nameNote"
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
               className="text-black"
            />
            <p
              id="nameNote"
              className={
                nameFocus && name && !isValidName ? "instructions" : "offscreen"
              } // Koristi isValidName
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            {/* Surname Field */}
            <label htmlFor="surname">
              Surname:
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidSurname ? "valid" : "hide"} // Koristi isValidSurname
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidSurname || !surname ? "hide" : "invalid"} // Koristi isValidSurname
              />
            </label>
            <input
              type="text"
              id="surname"
              ref={surnameRef}
              autoComplete="off"
              onChange={handleSurnameChange}
              value={surname}
              required
              aria-invalid={isValidSurname ? "false" : "true"} // Koristi isValidSurname
              aria-describedby="surnameNote"
              onFocus={() => setSurnameFocus(true)}
              onBlur={() => setSurnameFocus(false)}
               className="text-black"
            />
            <p
              id="surnameNote"
              className={
                surnameFocus && surname && !isValidSurname
                  ? "instructions"
                  : "offscreen"
              } // Koristi isValidSurname
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="name">
              Nickname:
              <FontAwesomeIcon
                icon={faCheck}
                className={validNickName ? "valid" : "hide"} // Koristi isValidName
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validNickName || !nickName ? "hide" : "invalid"} // Koristi isValidName
              />
            </label>
            <input
              type="text"
              id="nickname"
              ref={nickNameRef}
              autoComplete="off"
              onChange={handleNickNameChange}
              value={nickName}
              required
              aria-invalid={validNickName ? "false" : "true"} // Koristi isValidName
              aria-describedby="nameNote"
              onFocus={() => setNickNameFocus(true)}
              onBlur={() => setNickNameFocus(false)}
               className="text-black"
            />
            <p
              id="nameNote"
              className={
                nickNameFocus && nickName && !validNickName
                  ? "instructions"
                  : "offscreen"
              } // Koristi isValidName
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !username ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
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
                userFocus && username && !validName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            {/* Email Field */}
            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={isValidEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={isValidEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={isValidEmail ? "false" : "true"}
              aria-describedby="emailNote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
               className="text-black"
            />
            <p
              id="emailNote"
              className={
                emailFocus && email && !isValidEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please enter a valid email address.
              <br />
              Example: user@example.com
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

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
               className="text-black"
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
            className={`bg-blue-500 text-white px-4 py-2 rounded  
                        ${(!validName || !validPwd || !validMatch) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={!validName || !validPwd || !validMatch}
          >
            Register
          </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/" className="hover:underline blue-500">Sign in</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
