import { AuthProvider } from "@/components/context/AuthContext";
import { AuthGuard } from "@/components/guard/authGuard";
import "@/styles/fonts.css";
import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps & { Component: any }) {
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
