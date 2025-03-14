import { TranslationContextType, TranslationType } from "@/utils/types";
import { createContext } from "react";

export const TranslationContext = createContext<TranslationContextType>({
  translations: {},
  lang: "en",
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
  return (
    <TranslationContext.Provider value={{ translations, lang }}>
      {children}
    </TranslationContext.Provider>
  );
};
