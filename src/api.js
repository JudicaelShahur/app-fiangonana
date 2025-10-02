import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { "Content-Type": "application/json" },
});


// Request interceptor: ajouter automatiquement le token si présent
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

// Response interceptor: logout automatique si 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response?.status === 401) {
            localStorage.removeItem('ACCESS_TOKEN');
        }
        return Promise.reject(error);
    }
);


export default api;
