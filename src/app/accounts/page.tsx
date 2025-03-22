import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getUserLocale } from "@/services/locale";
import ClientAcconts from "@/components/clientAccount/clientAcconts";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.main");
  const pathname = (await headers()).get("x-pathname") as string;

  return {
    title: t("meta.title"),
    description: t("text"),
    keywords: t("meta.keywords"),

    openGraph: {
      title: t("meta.title"),
      description: t("text"),
      images: "/assets/images/fliper.png",
      type: "website",
      url: process.env.SITE_URL + pathname,
    },

    twitter: {
      title: t("meta.title"),
      description: t("text"),
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

async function Acconts() {
  const lang = await getUserLocale();

  return <ClientAcconts lang={lang} />;
}

export default Acconts;
