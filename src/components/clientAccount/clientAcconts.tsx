"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Locale } from "@/utils/types";
import styles from "./accounts.module.scss";
import SiteIcon from "../icons/site/siteIcon";
import useLang from "@/hooks/useLang";
import { useTheme } from "../context/ThemeContext";
import { LOCALES } from "@/utils/constants";
import { useTranslations } from "next-intl";

export default function ClientAcconts({ lang }: { lang: string }) {
  const { theme, toggleTheme } = useTheme();
  const { changeLang } = useLang();
  const [currentLang, setCurrentLang] = useState<Locale>(lang as Locale);
  const t = useTranslations("Auth.main");

  const router = useRouter();

  const switchLanguage = () => {
    const nextIndex =
      (LOCALES.indexOf(currentLang as Locale) + 1) % LOCALES.length;
    const nextLang = LOCALES[nextIndex];

    setCurrentLang(nextLang);
    changeLang(nextLang);
  };

  return (
    <div>
      <div className={styles.top}>
        <div className={styles.lang} onClick={switchLanguage}>
          <Image
            src="/assets/icons/lang.svg"
            alt="lang"
            height={25}
            width={25}
            draggable={false}
          />
          <span>{currentLang.toLocaleUpperCase()}</span>
        </div>
        <div className={styles.theme} onClick={toggleTheme}>
          {theme === "light" ? (
            <Image
              src="/assets/icons/themeLight.svg"
              alt="theme-light"
              height={25}
              width={25}
              draggable={false}
            />
          ) : (
            <Image
              src="/assets/icons/themeDark.svg"
              alt="theme-dark"
              height={25}
              width={25}
              draggable={false}
            />
          )}
        </div>
      </div>
      <SiteIcon className={styles.icon} />
      <p className={styles.description}>{t("text")}</p>
      <div className={styles.button_block}>
        <button
          className={`button_bg ${styles.button}`}
          onClick={() => router.push("accounts/signin")}
        >
          {t("btn1")}
        </button>
        <button
          className={`button_ebg ${styles.button}`}
          onClick={() => router.push("accounts/signup")}
        >
          {t("btn2")}
        </button>
      </div>
    </div>
  );
}
