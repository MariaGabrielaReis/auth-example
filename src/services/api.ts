import axios, { AxiosError } from "axios";
import { setCookie, parseCookies } from "nookies";

let cookies = parseCookies();

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
          });
      } else {
      }
    }
  },
);
