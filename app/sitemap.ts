import { MetadataRoute } from "next";

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `https://chefoodai.vercel.app/`,
      lastModified: new Date(),
    },
  ];
}
