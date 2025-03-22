import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.SITE_URL as string,
      lastModified: new Date(),
      priority: 1,
    },
    { url: `${process.env.SITE_URL}/not-found`, lastModified: new Date() },
    { url: `${process.env.SITE_URL}/accounts`, lastModified: new Date() },
    {
      url: `${process.env.SITE_URL}/accounts/signin`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.SITE_URL}/accounts/signup`,
      lastModified: new Date(),
    },
  ];
}
