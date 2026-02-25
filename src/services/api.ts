import axios from "axios";
import { getToken } from "../utils/config";

export const api = axios.create({
  baseURL:
    "https://eo2od63zwcbr7tbgwpibb6rqti0ucqon.lambda-url.ap-south-1.on.aws/api/v1",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
