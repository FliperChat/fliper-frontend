"use server";

import { Themes } from "@/utils/types";
import { cookies } from "next/headers";

const COOKIE_NAME = "at";

export async function getAuth() {
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function setAuth(theme: Themes) {
  (await cookies()).set(COOKIE_NAME, theme);
}
