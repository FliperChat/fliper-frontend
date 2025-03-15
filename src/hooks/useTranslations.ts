import { TranslationContext } from "@/components/context/TranslationContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

export const useTranslation = (namespace: string) => {
  const { translations, lang, setLang } = useContext(TranslationContext);

  const [clientTranslations, setClientTranslations] = useState(
    () => translations?.[namespace] || {}
  );

  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  const t = (key: string) => {
    return (
      getNestedValue(clientTranslations, key) ||
      getNestedValue(translations?.[namespace], key) ||
      key
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = sessionStorage.getItem(`translations-${namespace}`);
    if (cached) {
      setClientTranslations(JSON.parse(cached));
      return;
    }

    axios
      .get(`/locales/${lang || "en"}/${namespace}.json`)
      .then((res) => {
        setClientTranslations(res.data);
        sessionStorage?.setItem(
          `translations-${namespace}`,
          JSON.stringify(res.data)
        );
      })
      .catch((err) =>
        console.error(`Ошибка загрузки перевода ${namespace}:`, err)
      );
  }, [namespace, translations]);

  return { t, lang, setLang };
};
