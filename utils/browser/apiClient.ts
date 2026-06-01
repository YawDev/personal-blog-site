import axios from "axios";

const apiClient = axios.create({
  timeout: 5000,
  withCredentials: true,
});

export default apiClient;
