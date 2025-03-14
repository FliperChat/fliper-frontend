import { AuthProvider } from "@/components/context/AuthContext";
import { TranslationProvider } from "@/components/context/TranslationContext";
import { AuthGuard } from "@/components/guard/authGuard";
import "@/styles/fonts.scss";
import "@/styles/globals.scss";
import { NextPage } from "next";
import type { AppProps } from "next/app";

function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & { requireAuth?: boolean };
}) {
  return (
    <>
      <TranslationProvider
        translations={pageProps.translations || {}}
        lang={pageProps.lang}
      >
        <AuthProvider>
          {Component.requireAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </TranslationProvider>
    </>
  );
}

export default App;
