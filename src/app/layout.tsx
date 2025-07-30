import "../styles/globals.scss";
import "../styles/fonts.scss";
import "../styles/responsive.scss";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/context/ThemeContext";
import { getTheme } from "@/services/theme";
import { Metadata } from "next";
import { getUserLocale } from "@/services/locale";
import { AuthProvider } from "@/components/context/AuthContext";
import { getAuth } from "@/services/auth";
import QueryProvider from "@/components/context/QueryContext";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getUserLocale();

  return {
    metadataBase: new URL(process.env.SITE_URL as string),
    creator: "ReveinOff",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    applicationName: "Fliper",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
    },
    openGraph: {
      siteName: "Fliper",
      locale: lang,
    },
    twitter: {
      site: process.env.TWITTER,
    },
    other: {
      language: lang,
      "apple-mobile-web-app-capable": "yes",
      "mobile-web-app-capable": "yes",
      "theme-color": "#2F2F2F",
      "msapplication-TileColor": "#2F2F2F",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const theme = await getTheme();
  const auth = await getAuth();

  return (
    <html lang={locale}>
      <head>
        <meta
          httpEquiv="Strict-Transport-Security"
          content="max-age=31536000; includeSubDomains"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body data-theme={theme}>
        <QueryProvider>
          <NextIntlClientProvider>
            <ThemeProvider initialTheme={theme}>
              <AuthProvider auth={auth}>{children}</AuthProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
