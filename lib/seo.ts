import type { Metadata } from "next";

const SITE_URL = "https://chefoodai.com";
const DEFAULT_TITLE = "CheFood AI | Yapay Zeka Destekli Yemek Tarifleri";
const SITE_SHORT_TITLE = "CheFood AI";
const DEFAULT_DESCRIPTION =
  "CheFood AI ile malzemelerinizi girin, size özel yapay zeka destekli tarifler oluşturun. Mutfaktaki en akıllı asistanınızla tanışın.";
const DEFAULT_TWITTER = "@Hatayyazilim";
const DEFAULT_OG_IMAGE = {
  url: "/fotochef.webp",
  width: 1200,
  height: 630,
  alt: "CheFood AI - Yapay Zeka Destekli Yemek Tarifi Platformu",
};

type OgImageDescriptor = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: OgImageDescriptor;
  noIndex?: boolean;
};

const absoluteUrl = (pathOrUrl?: string) => {
  if (!pathOrUrl) return SITE_URL;
  try {
    return new URL(pathOrUrl, SITE_URL).toString();
  } catch {
    return SITE_URL;
  }
};

const normalizeImage = (image?: OgImageDescriptor) => {
  const img = image ?? DEFAULT_OG_IMAGE;
  return {
    url: absoluteUrl(img.url),
    width: img.width ?? DEFAULT_OG_IMAGE.width,
    height: img.height ?? DEFAULT_OG_IMAGE.height,
    alt: img.alt ?? DEFAULT_OG_IMAGE.alt,
  };
};

const buildCanonical = (path?: string) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_SHORT_TITLE}`,
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: "Hatay Yazılım", url: SITE_URL }],
  creator: "Hatay Yazılım",
  publisher: "CheFood AI",
  keywords: [
    "yapay zeka yemek tarifi",
    "ai tarif asistanı",
    "online yemek tarifleri",
    "kolay yemek tarifleri",
    "hızlı tarifler",
    "malzeme bazlı tarif",
    "yemek nasıl yapılır",
    "türk mutfağı tarifleri",
    "dünya mutfağı",
    "pratik tarifler",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_SHORT_TITLE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [normalizeImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: DEFAULT_TWITTER,
    creator: DEFAULT_TWITTER,
    images: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "food and drink",
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  keywords,
  image,
  noIndex,
}: BuildMetadataOptions): Metadata => {
  const metaDescription = description ?? DEFAULT_DESCRIPTION;
  const canonicalPath = buildCanonical(path);
  const ogImage = normalizeImage(image);
  const absoluteCanonical = absoluteUrl(canonicalPath);

  const metadata: Metadata = {
    title,
    description: metaDescription,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      siteName: SITE_SHORT_TITLE,
      title,
      description: metaDescription,
      url: absoluteCanonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      site: DEFAULT_TWITTER,
      creator: DEFAULT_TWITTER,
      images: [ogImage.url],
    },
  };

  if (typeof noIndex === "boolean") {
    metadata.robots = {
      index: !noIndex,
      follow: !noIndex,
    };
  }

  return metadata;
};

type BuildArticleMetadataOptions = BuildMetadataOptions & {
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export const buildArticleMetadata = ({
  title,
  description,
  path,
  keywords,
  image,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex,
}: BuildArticleMetadataOptions): Metadata => {
  const baseMetadata = buildPageMetadata({
    title,
    description,
    path,
    keywords,
    image,
    noIndex,
  });

  const normalizedAuthors = authors?.length ? authors : ["CheFood AI"];

  return {
    ...baseMetadata,
    openGraph: {
      ...(baseMetadata.openGraph ?? {}),
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime ?? publishedTime,
      authors: normalizedAuthors,
      tags,
    },
  };
};
