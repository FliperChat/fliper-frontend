"use server";

import axios from "axios";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { at: string };
}): Promise<Metadata> {
  const at = (await searchParams)?.at;

  const t = await getTranslations("Auth.confirm");
  const pathname = (await headers()).get("x-pathname") as string;

  const url = `${process.env.SITE_URL}${pathname}?at=${at}`;

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),

    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: "/assets/images/fliper.png",
      type: "website",
      url: url,
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

export default async function SingUpConfirm({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!searchParams) {
    notFound();
  }

  const at = (await searchParams)?.at;
  if (!at) {
    notFound();
  }

  const lang = (await cookies()).get("lang")?.value || "en";

  let status;
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/confirm-reg?at=${at}&lang=${lang}`,
      null,
      {
        headers: {
          "X-Lang": lang,
        },
      }
    );
    status = response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404 || error.response?.status === 406) {
        notFound();
      }
    }
  }

  if (status === 202) redirect("/accounts/signin");

  return null;
}
