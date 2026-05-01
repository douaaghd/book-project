// src/services/auth.js
import axios from 'axios';

// On retire le "/api" car tes logs NestJS ne le mentionnent pas
const API_URL = 'http://127.0.0.1:3000/auth'; 

export const authService = {
  async signin(credentials) {
    // Cela appellera : http://127.0.0.1:3000/auth/signin
    return axios.post(`${API_URL}/signin`, credentials);
  },

  async signup(userData) {
    return axios.post(`${API_URL}/signup`, userData);
  }
};