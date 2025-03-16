"use server";

import { Themes } from "@/utils/types";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "theme";

export async function getTheme() {
  return (
    (await cookies()).get(COOKIE_NAME)?.value ||
    (await headers()).get("Sec-CH-Prefers-Color-Scheme") ||
    "en"
  );
}

export async function setTheme(theme: Themes) {
  (await cookies()).set(COOKIE_NAME, theme);
}
