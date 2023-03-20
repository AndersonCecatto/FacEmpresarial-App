import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:16612/api/'
});

export default api;