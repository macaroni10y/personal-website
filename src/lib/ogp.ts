import * as cheerio from "cheerio";

export interface OGPData {
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  publishedTime?: string;
  url: string;
}

// In-memory cache for build-time OGP data
const ogpCache = new Map<string, OGPData | null>();

/**
 * Fetch OGP data from a URL with retry logic.
 */
export async function fetchOGP(
  url: string,
  options: { retries?: number; timeout?: number } = {}
): Promise<OGPData | null> {
  const { retries = 2, timeout = 5000 } = options;

  // Check cache first
  if (ogpCache.has(url)) {
    return ogpCache.get(url) ?? null;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(timeout),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      const data: OGPData = {
        url,
        title:
          $('meta[property="og:title"]').attr("content") ||
          $("title").text() ||
          url,
        description:
          $('meta[property="og:description"]').attr("content") ||
          $('meta[name="description"]').attr("content") ||
          "",
        image: $('meta[property="og:image"]').attr("content"),
        siteName: $('meta[property="og:site_name"]').attr("content"),
        publishedTime: $('meta[property="article:published_time"]').attr(
          "content"
        ),
      };

      // Cache successful result
      ogpCache.set(url, data);
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 500)
        );
      }
    }
  }

  // Cache failure to avoid repeated retries
  ogpCache.set(url, null);
  console.warn(`Failed to fetch OGP for ${url}:`, lastError?.message);
  return null;
}

/**
 * Fetch OGP data for multiple URLs with concurrency limit.
 */
export async function fetchOGPBatch(
  urls: string[],
  options: { concurrency?: number; retries?: number; timeout?: number } = {}
): Promise<(OGPData | null)[]> {
  const { concurrency = 5, ...fetchOptions } = options;
  const results: (OGPData | null)[] = [];
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      if (url) {
        const result = await fetchOGP(url, fetchOptions);
        results.push(result);
      }
    }
  }

  // Start concurrent workers
  const workers = Array(Math.min(concurrency, urls.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  // Preserve original order
  return urls.map((url) => ogpCache.get(url) ?? null);
}
