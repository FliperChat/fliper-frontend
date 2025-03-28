"use server";

import { cookies, headers } from "next/headers";

const COOKIE_NAME = "lang";

function langConvert(lang: string) {
  switch (lang) {
    case "uk":
      return "ua";
    default:
      return lang;
  }
}

export async function getUserLocale() {
  return (
    (await cookies()).get(COOKIE_NAME)?.value ||
    langConvert(
      (await headers())
        .get("accept-language")
        ?.split(",")[0]
        ?.split("-")[0] as string
    ) ||
    "en"
  );
}

export async function setUserLocale(locale: string) {
  (await cookies()).set(COOKIE_NAME, locale);
}
