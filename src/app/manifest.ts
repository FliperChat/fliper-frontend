import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fliper",
    short_name: "Flip",
    description: "Share joy, laughter and fun with Fliper",
    start_url: "/",
    theme_color: "#2F2F2F",
    background_color: "#2F2F2F",
    display: "standalone",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
