// src/utils/api.js
import axios from 'axios';
import { URL } from '../url';

const api = axios.create({
    baseURL: URL,
});

export default api;


// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token'); 
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

//export default api;