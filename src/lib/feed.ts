import { XMLParser } from "fast-xml-parser";
import type { OGPData } from "./ogp";

interface AtomLink {
  "@_href": string;
  "@_rel"?: string;
  "@_type"?: string;
}

interface AtomEntry {
  title: string;
  link: AtomLink | AtomLink[];
  summary?: string;
  published?: string;
  updated?: string;
}

interface AtomFeed {
  feed: {
    title: string;
    entry?: AtomEntry | AtomEntry[];
  };
}

// In-memory cache for build-time feed data
let feedCache: OGPData[] | null = null;

/**
 * Fetch blog articles from Atom feed with retry logic.
 */
export async function fetchFeedArticles(
  options: { retries?: number; timeout?: number } = {}
): Promise<OGPData[]> {
  const { retries = 2, timeout = 10000 } = options;

  // Check cache first
  if (feedCache !== null) {
    return feedCache;
  }

  const feedUrl = import.meta.env.BLOG_FEED_URL;
  if (!feedUrl) {
    console.warn("BLOG_FEED_URL is not set");
    return [];
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(timeout),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const xml = await res.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const parsed: AtomFeed = parser.parse(xml);

      const entries = parsed.feed.entry;
      if (!entries) {
        feedCache = [];
        return [];
      }

      const entryArray = Array.isArray(entries) ? entries : [entries];

      const articles: OGPData[] = entryArray.map((entry) => {
        // Handle link which can be a single object or array
        const links = Array.isArray(entry.link) ? entry.link : [entry.link];
        const pageLink = links.find(
          (l) => !l["@_rel"] || l["@_rel"] === "alternate"
        );
        const enclosureLink = links.find((l) => l["@_rel"] === "enclosure");

        return {
          title: entry.title || "",
          description: entry.summary || "",
          url: pageLink?.["@_href"] || "",
          image: enclosureLink?.["@_href"],
          publishedTime: entry.published || entry.updated,
          siteName: parsed.feed.title,
        };
      });

      // Cache successful result
      feedCache = articles;
      return articles;
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

  // Cache empty result to avoid repeated retries
  feedCache = [];
  console.warn(`Failed to fetch feed from ${feedUrl}:`, lastError?.message);
  return [];
}
