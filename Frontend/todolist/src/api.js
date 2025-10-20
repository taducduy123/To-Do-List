import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // đổi sang URL server của bạn
    headers: {"Content-Type": "application/json"},
});

export default api;