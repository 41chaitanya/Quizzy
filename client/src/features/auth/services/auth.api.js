import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    withCredentials: true,
});

export const loginApi = async (data) => {
    const response = await API.post('/api/auth/login', data);
    return response.data;
};

export const registerApi = async (data) => {
    const response = await API.post('/api/auth/register', data);
    return response.data;
};


