import axios from 'axios';

let API = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.response = {
        ...error.response,
        data: 'Request timed out. Please try again later.',
      };
    }
    return Promise.reject(error);
  }
);

export { API };