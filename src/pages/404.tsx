import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./404.module.scss";
import Head from "next/head";
import GenerateAlternateLinks from "@/components/alternate/alternate";

function NotFound() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page not found | Fliper</title>
        <meta
          name="description"
          content="Something went wrong and we couldn't find this page, please try again later or contact the owner."
        />
        <meta
          name="keywords"
          content="404, not_found, nf, flip, fliper, error, bad"
        />
        <meta property="og:title" content="Page not found | Fliper" />
        <meta
          property="og:description"
          content="Something went wrong and we couldn't find this page, please try again later or contact the owner."
        />
        <meta
          property="og:image"
          content={`${process.env.SITE_URL}/android-chrome-192x192.png`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={process.env.SITE_URL + router.asPath}
        />
        <meta
          name="twitter:url"
          content={process.env.SITE_URL + router.asPath}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Page not found | Fliper" />
        <meta
          name="twitter:description"
          content="Something went wrong and we couldn't find this page, please try again later or contact the owner."
        />
        <meta
          name="twitter:image"
          content={`${process.env.SITE_URL}/android-chrome-192x192.png`}
        />
        <meta name="robots" content="noindex, nofollow" />
        {GenerateAlternateLinks()}
      </Head>
      <div className={styles.error_page}>
        <div className={styles.error_back} onClick={() => router.back()}>
          <Image
            src="/assets/icons/arrowLeftBack.svg"
            alt="arrowLeftIcon"
            width={10}
            height={15}
            draggable={false}
          />
          <span>Back</span>
        </div>
        <div className={styles.error_block}>
          <h1 className={styles.error_title}>404</h1>
          <Image
            src="/assets/icons/404.svg"
            alt="errorIcon"
            width={100}
            height={100}
            className={styles.error_image}
            draggable={false}
          />
          <p className={styles.error_description}>Not found</p>
        </div>
      </div>
    </>
  );
}

NotFound.requireAuth = false;

export default NotFound;
