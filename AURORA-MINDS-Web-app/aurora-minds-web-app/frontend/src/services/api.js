import axios from 'axios';
import {ACCESS_TOKEN} from "../utils/constants.js";


/**
 * Creates an Axios instance with a base URL.
 * The base URL is retrieved from environment variables.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // TODO: Update this baseURL for prod
});

/**
 * Interceptor to include the Authorization header with the JWT token
 * for each request if the token exists in localStorage.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
