import AuthComponent from "@/components/auth/authComponent";
import styles from "./accounts.module.scss";
import SiteIcon from "@/components/icons/site/siteIcon";
import { useRouter } from "next/router";
import Head from "next/head";
import GenerateAlternateLinks from "@/components/alternate/alternate";
import { GetServerSideProps } from "next";
import { getLang } from "@/utils/multi";
import { serverSideTranslations } from "@/libs/i18n";
import { useTranslation } from "@/hooks/useTranslations";
import Image from "next/image";
import { useTheme } from "@/components/context/ThemeContext";
import { ThemeMode } from "@/utils/enums";

function Acconts() {
  const router = useRouter();
  const { t, lang } = useTranslation("authentication");
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Head>
        <title>{t("main.meta.title")}</title>
        <meta name="description" content={t("main.text")} />
        <meta name="keywords" content={t("main.meta.keywords")} />
        <meta property="og:title" content={t("main.meta.title")} />
        <meta property="og:description" content={t("main.meta.description")} />
        <meta
          property="og:image"
          content={`${process.env.SITE_URL}/android-chrome-192x192.png`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={process.env.SITE_URL + router.asPath}
        />
        <meta
          name="twitter:url"
          content={process.env.SITE_URL + router.asPath}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t("main.meta.title")} />
        <meta name="twitter:description" content={t("main.meta.description")} />
        <meta
          name="twitter:image"
          content={`${process.env.SITE_URL}/android-chrome-192x192.png`}
        />
        <meta name="robots" content="noindex, nofollow" />
        {GenerateAlternateLinks()}
      </Head>
      <AuthComponent>
        <div className={styles.top}>
          <div className={styles.lang}>
            <Image
              src="/assets/icons/lang.svg"
              alt="lang"
              height={25}
              width={25}
              draggable={false}
            />
            <span>{lang.toLocaleUpperCase()}</span>
            <Image
              src="/assets/icons/selectArrow.svg"
              alt="selectArrow"
              height={10}
              width={10}
              draggable={false}
            />
          </div>
          <div className={styles.theme} onClick={toggleTheme}>
            {theme === ThemeMode.LIGHT ? (
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
        <SiteIcon style={{ marginBottom: "40px" }} />
        <p className={styles.description}>{t("main.text")}</p>
        <div className={styles.button_block}>
          <button
            className={`button_bg ${styles.button}`}
            onClick={() => router.push("accounts/signin")}
          >
            {t("main.btn1")}
          </button>
          <button
            className={`button_ebg ${styles.button}`}
            onClick={() => router.push("accounts/signup")}
          >
            {t("main.btn2")}
          </button>
        </div>
      </AuthComponent>
    </>
  );
}

Acconts.requireAuth = false;

export default Acconts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lng = getLang(context);
  const translations = await serverSideTranslations(lng, ["authentication"]);

  return {
    props: {
      translations,
      lang: lng,
    },
  };
};
