import axios from 'axios';

export const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("nexus_token");
    // Do something before the request is sent
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }   
    return config;
  },
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  },
);