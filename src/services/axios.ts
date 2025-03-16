import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie("at");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = getCookie("rt");
          if (!refreshToken) throw new Error("No refresh token");

          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_SITE_URL}/refresh-token`,
            {
              refreshToken,
            }
          );

          setCookie("at", data.accessToken, {
            maxAge: 24 * 60 * 60,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
          });

          setCookie("rt", data.refreshToken, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
          });

          onRefreshed(data.accessToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          console.error("Refresh token expired", err);
          deleteCookie("at");
          deleteCookie("rt");
          window.location.href = "/accounts";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
