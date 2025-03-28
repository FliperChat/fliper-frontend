import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Metadata } from "next";
import SignInClient from "./clientRender";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.login");
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

function SignIn() {
  return <SignInClient />;
}

export default SignIn;
