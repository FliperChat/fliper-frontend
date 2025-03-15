import { TranslationContextType, TranslationType } from "@/utils/types";
import axios from "axios";
import { setCookie } from "cookies-next/client";
import { createContext, useState } from "react";

export const TranslationContext = createContext<TranslationContextType>({
  translations: {},
  lang: "en",
  setLang: () => Promise.resolve(),
});

export const TranslationProvider = ({
  translations,
  lang,
  children,
}: {
  translations: TranslationType;
  lang: string;
  children: React.ReactNode;
}) => {
  const [currentLang, setCurrentLang] = useState(lang);
  const [currentTranslations, setCurrentTranslations] = useState(translations);

  const changeLanguage = async (
    newLang: string,
    namespaces: string[] = ["common"]
  ) => {
    if (newLang === currentLang) return;

    try {
      const newTranslations: Record<string, any> = {};

      for (const ns of namespaces) {
        const res = await axios.get(`/locales/${newLang}/${ns}.json`);
        newTranslations[ns] = await res.data;
        sessionStorage?.setItem(`translations-${ns}`, JSON.stringify(res.data));
      }

      setCurrentTranslations(newTranslations);
      setCurrentLang(newLang);
      setCookie("lang", newLang, { maxAge: 60 * 60 * 24 * 365 * 1000 });
    } catch (error) {
      console.error(`Ошибка загрузки перевода (${newLang}):`, error);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        translations: currentTranslations,
        lang: currentLang,
        setLang: changeLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
