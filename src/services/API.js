import axios from "axios";

let API = axios.create({
  baseURL: "https://hacknroll-backend-rj4t.onrender.com/api",
  // baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      error.response = {
        ...error.response,
        data: "Request timed out. Please try again later.",
      };
    }
    return Promise.reject(error);
  }
);

export { API };
