export default function sitemap() {
  const baseUrl = "https://chefoodai.vercel.app";
  const lastModified = new Date();

  const routes = [
    "",
    "/discover",
    "/favorites",
    "/recipe",
    "/publish",
    "/about",
    "/weekly-plan",
    "/pricing",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
