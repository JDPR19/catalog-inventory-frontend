import axios from 'axios';
import { BaseUrl } from './BaseUrl';

const api = axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default api;
