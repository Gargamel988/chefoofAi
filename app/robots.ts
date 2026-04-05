import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    host: "https://chefoodai.com",
    sitemap: "https://chefoodai.com/sitemap.xml",
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/profile/",
          "/users/",
          "/onboarding/",
          "/publish/",
          "/checkout/",
        ],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: ["/"],
        disallow: [
          "/api/",
          "/profile/",
          "/users/",
          "/onboarding/",
          "/publish/",
          "/checkout/",
        ],
      },
    ],
  };
}
