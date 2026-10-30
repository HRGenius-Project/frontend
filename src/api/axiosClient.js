import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8090", // API Gateway URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("hrgenius_token") ||
      sessionStorage.getItem("hrgenius_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expire ya invalid hone par clean exit
      localStorage.removeItem("hrgenius_token");
      localStorage.removeItem("hrgenius_role");
      localStorage.removeItem("hrgenius_user");
      sessionStorage.removeItem("hrgenius_token");
      sessionStorage.removeItem("hrgenius_role");
      sessionStorage.removeItem("hrgenius_user");

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;