import { AuthTokenError } from "@/services/errors/AuthTokenError";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies, destroyCookie } from "nookies";

export function withSSRAuth<T extends { [key: string]: any }>(
  fn: GetServerSideProps<T>,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["auth-example.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "auth-example.token");
        destroyCookie(ctx, "auth-example.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return {
        redirect: {
          destination: "/error", // in case of other type errors, it redirects to a custom error page
          permanent: false,
        },
      };
    }
  };
}
