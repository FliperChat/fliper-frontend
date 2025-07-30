"use server";

import { cookies, headers } from "next/headers";

const COOKIE_NAME = "lang";

export async function getUserLocale() {
  return (
    (await cookies()).get(COOKIE_NAME)?.value ||
    ((await headers())
      .get("accept-language")
      ?.split(",")[0]
      ?.split("-")[0] as string) ||
    "en"
  );
}

export async function setUserLocale(locale: string) {
  (await cookies()).set(COOKIE_NAME, locale);
}
