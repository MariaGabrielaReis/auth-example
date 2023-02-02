import { AuthTokenError } from "@/services/errors/AuthTokenError";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies, destroyCookie } from "nookies";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<T extends { [key: string]: any }>(
  fn: GetServerSideProps<T>,
  options?: WithSSRAuthOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["auth-example.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;
      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions)
        return {
          redirect: {
            destination: "/dashboard",
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
