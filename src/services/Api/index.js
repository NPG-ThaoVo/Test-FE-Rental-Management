import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiInstance = axios.create({
  baseURL: API_URL,
});

//interceptors: setting error
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
