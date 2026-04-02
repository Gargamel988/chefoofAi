import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/profile/", "/onboarding/", "/publish/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: "https://chefoodai.com/sitemap.xml",
  };
}
