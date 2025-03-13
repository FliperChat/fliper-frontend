import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./404.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import generateAlternateLinks from "@/components/alternate/alternate";

function NotFound() {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("not_found.meta.title")}</title>
        <meta name="description" content={t("not_found.meta.description")} />
        <meta name="keywords" content={t("not_found.meta.keywords")} />
        <meta property="og:title" content={t("not_found.meta.title")} />
        <meta
          property="og:description"
          content={t("not_found.meta.description")}
        />
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
        <meta name="twitter:title" content={t("not_found.meta.title")} />
        <meta
          name="twitter:description"
          content={t("not_found.meta.description")}
        />
        <meta
          name="twitter:image"
          content={`${process.env.SITE_URL}/android-chrome-192x192.png`}
        />
        <meta name="robots" content="noindex, nofollow" />
        {generateAlternateLinks()}
      </Head>
      <div className={styles.error_page}>
        <div className={styles.error_back} onClick={() => router.back()}>
          <Image
            src="/assets/icons/arrowLeftBack.svg"
            alt="arrowLeftIcon"
            width={10}
            height={15}
          />
          <span>{t("not_found.back")}</span>
        </div>
        <div className={styles.error_block}>
          <h1 className={styles.error_title}>404</h1>
          <Image
            src="/assets/icons/404.svg"
            alt="errorIcon"
            width={100}
            height={100}
            className={styles.error_image}
          />
          <p className={styles.error_description}>{t("not_found.text")}</p>
        </div>
      </div>
    </>
  );
}

NotFound.requireAuth = false;

export default NotFound;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
