import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import SignUpClient from "./clientRender";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.reg");
  const pathname = (await headers()).get("x-pathname") as string;

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

function SignUp() {
  return <SignUpClient />;
}

export default SignUp;
