import { signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { setCookie, parseCookies } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;

type FailedRequest = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};
let failedRequestsQueue: FailedRequest[] = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["auth-example.token"]}`,
  },
});

interface AxiosErrorResponse {
  code?: string;
}

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === "token.expired") {
        cookies = parseCookies();

        const { "auth-example.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("/refresh", {
              refreshToken,
            })
            .then(response => {
              const { token } = response.data;

              setCookie(undefined, "auth-example.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              });
              setCookie(
                undefined,
                "auth-example.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                },
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              failedRequestsQueue.forEach(request => request.onSuccess(token));
              failedRequestsQueue = [];
            })
            .catch(error => {
              failedRequestsQueue.forEach(request => request.onFailure(error));
              failedRequestsQueue = [];
            })
            .finally(() => (isRefreshing = false));
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (!originalConfig?.headers) return;
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => reject(error),
          });
        });
      } else {
        signOut();
      }
    }

    return Promise.reject(error);
  },
);
