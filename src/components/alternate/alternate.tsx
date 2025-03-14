import { useRouter } from "next/router";
import { JSX } from "react";
import { LOCALES } from "@/utils/constants";

const GenerateAlternateLinks = () => {
  const { asPath } = useRouter();
  const siteUrl = process.env.SITE_URL;

  const alternates: JSX.Element[] = [
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={process.env.SITE_URL + asPath}
    />,
  ];

  alternates.push(
    ...LOCALES.map((lang) => {
      const langPath = `/${lang}${asPath}`;
      return (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${siteUrl}${langPath}`}
        />
      );
    })
  );

  return alternates;
};

export default GenerateAlternateLinks;
