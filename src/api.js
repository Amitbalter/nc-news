import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? "https://news-website-ch7z.onrender.com/api" : "http://localhost:9090/api",
});

export default api;
