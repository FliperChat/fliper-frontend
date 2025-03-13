import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ locale }: { locale: string }) {
  return (
    <Html lang={locale}>
      <Head>
        <meta name="language" content={locale} />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
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
        <meta name="msapplication-TileColor" content="#2F2F2F" />
        <meta name="theme-color" content="#2F2F2F" />
        <meta property="og:site_name" content="Fliper" />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:site" content={process.env.TWITTER} />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="preconnect" href={process.env.API_URL} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link
          rel="preload"
          href={`${process.env.SITE_URL}/assets/fonts/Jua/Jua-Regular.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        {/* <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains"/> */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' ${process.env.SITE_URL} ${process.env.API_URL}; connect-src 'self' ${process.env.API_URL}; style-src 'self' 'unsafe-inline'; object-src 'none';`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
