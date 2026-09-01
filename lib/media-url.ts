export function formatMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Relative paths, data URLs, and blob URLs can be used directly
  if (trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // If the image URL is plain HTTP (e.g. MinIO IP or port 9000), proxy it via /api/media to prevent mixed content blocking on HTTPS deployments
  if (
    trimmed.startsWith("http://") &&
    (trimmed.includes("51.79.146.203") || trimmed.includes(":9000") || trimmed.includes("minio") || trimmed.includes("localhost"))
  ) {
    return `/api/media?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
