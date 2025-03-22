import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/not-found",
          "/accounts",
          "/accounts/signin",
          "/accounts/signup",
          "/accounts/confirm",
        ],
      },
    ],
    sitemap: `${process.env.SITE_URL}/sitemap.xml`,
    host: process.env.SITE_URL,
  };
}
