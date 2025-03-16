import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.scss";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  const pathname = (await headers()).get("x-pathname") || "/not-found";

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),

    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: "/assets/images/fliper.png",
      type: "website",
      url: process.env.SITE_URL + pathname,
    },

    twitter: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: "/assets/images/fliper.png",
      card: "summary",
    },

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: process.env.SITE_URL + pathname,
    },
  };
}

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className={styles.error_page}>
      <Link className={styles.error_back} href="/">
        <Image
          src="/assets/icons/arrowLeftBack.svg"
          alt="arrowLeftIcon"
          width={10}
          height={15}
          draggable={false}
        />
        <span>{t("back")}</span>
      </Link>
      <div className={styles.error_block}>
        <h1 className={styles.error_title}>404</h1>
        <Image
          src="/assets/icons/404.svg"
          alt="errorIcon"
          width={100}
          height={100}
          className={styles.error_image}
          draggable={false}
        />
        <p className={styles.error_description}>{t("text")}</p>
      </div>
    </div>
  );
}
