import { AuthProvider } from "@/components/context/AuthContext";
import { ThemeProvider } from "@/components/context/ThemeContext";
import { TranslationProvider } from "@/components/context/TranslationContext";
import { AuthGuard } from "@/components/guard/authGuard";
import "@/styles/fonts.scss";
import "@/styles/globals.scss";
import "@/styles/responsive.scss";
import { ThemeMode } from "@/utils/enums";
import { getCookie } from "cookies-next";
import { NextPage } from "next";
import type { AppProps } from "next/app";

function App({
  Component,
  pageProps,
  initialTheme,
}: AppProps & {
  Component: NextPage & { requireAuth?: boolean };
  initialTheme: ThemeMode | string;
}) {
  return (
    <>
      <TranslationProvider
        translations={pageProps.translations || {}}
        lang={pageProps.lang}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <AuthProvider>
            {Component.requireAuth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </AuthProvider>
        </ThemeProvider>
      </TranslationProvider>
    </>
  );
}

App.getInitialProps = async ({ ctx }: any) => {
  const theme =
    (await getCookie("theme", { req: ctx.req, res: ctx.res })) ||
    ThemeMode.DARK;

  return { initialTheme: theme };
};

export default App;
