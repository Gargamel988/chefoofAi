import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/profile/", "/onboarding/", "/publish/", "/checkout/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: ["/api/", "/profile/", "/onboarding/", "/publish/", "/checkout/"],
      },
    ],
    sitemap: "https://chefoodai.com/sitemap.xml",
  };
}
