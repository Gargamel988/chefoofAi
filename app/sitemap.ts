export default function sitemap() {
  const baseUrl = "https://chefoodai.com";
  const lastModified = new Date();

  const routes = [
    "/",
    "/auth",
    "/discover",
    "/favorites",
    "/pricing",
    "/recipe",
    "/weekly-plan",
    "/whatever-cook",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));
}
