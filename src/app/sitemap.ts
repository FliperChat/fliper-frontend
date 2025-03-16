import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "http://localhost:3000/", lastModified: new Date(), priority: 1 },
    { url: "http://localhost:3000/not-found", lastModified: new Date() },
  ];
}
