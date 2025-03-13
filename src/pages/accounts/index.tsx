import AuthComponent from "@/components/auth/authComponent";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./accounts.module.scss";
import SiteIcon from "@/components/icons/site/siteIcon";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import GenerateAlternateLinks from "@/components/alternate/alternate";

function Acconts() {
  const router = useRouter();
  const { t } = useTranslation("authentication");

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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["authentication"])),
    },
  };
}
