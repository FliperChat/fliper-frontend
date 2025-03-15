import Document, { Html, Head, Main, NextScript } from "next/document";
import { getCookie } from "cookies-next";
import { ThemeMode } from "@/utils/enums";
import { getLang } from "@/utils/multi";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const theme =
      (await getCookie("theme", { req: ctx.req, res: ctx.res })) ||
      ThemeMode.DARK;

    const initialProps = await Document.getInitialProps(ctx);

    const lang = getLang(ctx);

    return { ...initialProps, initialTheme: theme, lang };
  }

  render() {
    const { lang, initialTheme } = this.props as any;

    return (
      <Html lang={lang}>
        <Head>
          <meta name="language" content={lang} />
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
          <meta property="og:locale" content={lang} />
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
            href="/assets/fonts/Jua/Jua-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="preload" href="/assets/icons/siteIcon.svg" as="image" />
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          {/* <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains"/> */}
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'self'; script-src 'self' ${process.env.SITE_URL} ${process.env.API_URL}; connect-src 'self' ${process.env.API_URL}; style-src 'self' 'unsafe-inline'; object-src 'none';`}
          />
        </Head>
        <body data-theme={initialTheme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
