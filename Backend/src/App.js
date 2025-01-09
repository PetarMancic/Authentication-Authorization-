import logo from './logo.svg';
import Register from './Register'
import './App.css';
import React, { useEffect, useState } from 'react';
import { api } from './constants/constant';


function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
    .get(`users/prezime1/${2}`)
    .then((response) => setMessage(response.data.prezime))
    .catch((error) => console.error('Error fetching data:', error));
  }, []);
  return (
    <main className="App">
      <h1>Message from NestJS:</h1>
      <p>{message}</p>

    <Register />
  </main>
  );
}

export default App;
