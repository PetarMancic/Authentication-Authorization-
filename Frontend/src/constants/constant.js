import axios from "../api/axios";

export const api = axios.create({
    baseURL: 'http://localhost:3000/',
  });