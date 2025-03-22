import {
  createMiddleware,
  type MiddlewareFunctionProps,
  type MiddlewareConfig,
} from "@rescale/nemo";
import { NextResponse } from "next/server";

const middlewares = {
  "{/:team}": [
    async ({ request, forward }: MiddlewareFunctionProps) => {
      if (request.url.includes("/accounts")) {
        const response = NextResponse.next();
        return forward(response);
      }

      const token = request.cookies.get("at");
      if (!token) {
        return NextResponse.redirect(new URL("/accounts", request.url));
      }

      const response = NextResponse.next();
      response.headers.set("x-pathname", request.nextUrl.pathname);
      return forward(response);
    },
  ],
  "/accounts{/:team}": [
    async ({ request, forward }: MiddlewareFunctionProps) => {
      const token = request.cookies.get("at");
      if (token) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const response = NextResponse.next();
      response.headers.set("x-pathname", request.nextUrl.pathname);
      return forward(response);
    },
  ],
} satisfies MiddlewareConfig;

export const middleware = createMiddleware(middlewares);

export const config = {
  matcher: ["/((?!api/|_next/|_static|assets|_vercel|[\\w-]+\\.\\w+).*)"],
};
