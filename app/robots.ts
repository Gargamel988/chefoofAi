import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  const privateRoutes = [
    "/api",
    "/profile",
    "/users",
    "/onboarding",
    "/publish",
    "/checkout",
    "/favorites",
    "/weekly-plan",
  ];

  return {
    host: "https://chefoodai.com",
    sitemap: "https://chefoodai.com/sitemap.xml",
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: privateRoutes,
      },
      {
        userAgent: "Mediapartners-Google",
        allow: ["/"],
        disallow: privateRoutes,
      },
    ],
  };
}
