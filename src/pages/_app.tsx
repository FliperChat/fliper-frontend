import { AuthProvider } from "@/components/context/AuthContext";
import { AuthGuard } from "@/components/guard/authGuard";
import "@/styles/fonts.scss";
import "@/styles/globals.scss";
import { NextPage } from "next";
import { langConvert } from "@/utils/converts";
import { getCookie } from "cookies-next";
import { appWithTranslation, useTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & { requireAuth?: boolean };
}) {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang =
        getCookie("lang")?.toString() ||
        langConvert(navigator.language.split("-")[0]) ||
        "en";

      i18n.changeLanguage(lang);
      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        router.asPath,
        { locale: lang }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AuthProvider>
        {Component.requireAuth ? (
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </>
  );
}

export default appWithTranslation(App);
