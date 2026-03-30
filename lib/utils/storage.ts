export function getSafePublicUrl(url: string) {
  if (!url) return "";
  
  // If URL doesn't contain /public/ after /object/, insert it
  // This handles cases where getPublicUrl might return a non-public formatted URL for public buckets
  if (url.includes("/storage/v1/object/") && !url.includes("/storage/v1/object/public/")) {
    return url.replace("/storage/v1/object/", "/storage/v1/object/public/");
  }
  
  return url;
}
