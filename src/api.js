import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:9090/api",
});

export default api;
