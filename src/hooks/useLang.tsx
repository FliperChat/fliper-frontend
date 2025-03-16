"use client";

import { setUserLocale } from "@/services/locale";
import { Locale } from "@/utils/types";
import { useTransition } from "react";

export default function useLang() {
  const [isPending, startTransition] = useTransition();

  function changeLang(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return { isPending, changeLang };
}
