import { useRouter } from "next/router";
import { i18n } from "../../../next-i18next.config";
import { JSX } from "react";

const generateAlternateLinks = () => {
  const { asPath } = useRouter();
  const languages = i18n.locales;
  const siteUrl = process.env.SITE_URL;

  let alternates: JSX.Element[] = [
    <link
      rel="alternate"
      hrefLang="x-default"
      href={process.env.SITE_URL + asPath}
    />,
  ];

  alternates.push(
    ...languages.map((lang) => {
      const langPath = `/${lang}${asPath}`;
      return (
        <link rel="alternate" hrefLang={lang} href={`${siteUrl}${langPath}`} />
      );
    })
  );

  return alternates;
};

export default generateAlternateLinks;
