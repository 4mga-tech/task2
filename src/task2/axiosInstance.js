import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://jsonplaceholder.typicode.com",
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  withCredentials: true,
});

export default axiosInstance; 
