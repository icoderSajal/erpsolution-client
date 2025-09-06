// import axios from "axios";

// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL || "/api",
//     headers: {
//         "Content-Type": "application/json"
//     }
// });

// // request interceptor to set authorization header
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// export default api;


import axios from "axios";

// Vite uses import.meta.env instead of process.env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to set the Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

