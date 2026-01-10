import axios from "axios";
import { getToken } from "../utils/config";

export const api = axios.create({
  baseURL: "https://be.apihealthz.com",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
