import { Follow, ComicDetail, ProcessedRecommendation } from "@/types";

class RateLimitedFetcher {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private readonly delay: number;

  constructor(requestsPerSecond = 10) {
    this.delay = 1000 / requestsPerSecond;
  }

  async fetch<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("NOT_FOUND");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        if (this.queue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.delay));
        }
      }
    }

    this.processing = false;
  }
}

const fetcher = new RateLimitedFetcher(8);

export function extractUserIdFromInput(input: string): string {
  const trimmed = input.trim();

  if (trimmed.includes("comick.io/user/")) {
    const match = trimmed.match(/comick\.io\/user\/([a-f0-9-]+)/);
    return match ? match[1] : trimmed;
  }

  return trimmed;
}

export async function fetchUserFollows(userId: string): Promise<Follow[]> {
  const follows = await fetcher.fetch<Follow[]>(`/api/user/${userId}/follows`);

  return follows.filter(
    (follow) =>
      follow.md_comics?.title && !follow.md_comics.title.includes("NotFound")
  );
}

export async function fetchComicDetails(slug: string): Promise<ComicDetail> {
  return fetcher.fetch<ComicDetail>(`/api/comic/${slug}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidRecommendation(rec: any): boolean {
  return (
    rec?.relates?.title &&
    rec?.relates?.slug &&
    rec?.relates?.hid &&
    !rec.relates.title.includes("NotFound") &&
    rec.total > 0
  );
}

export async function processRecommendations(
  follows: Follow[],
  onProgress?: (processed: number, total: number) => void
): Promise<ProcessedRecommendation[]> {
  const userSlugs = new Set(follows.map((follow) => follow.md_comics.slug));
  const recommendationCounts = new Map<
    string,
    {
      count: number;
      title: string;
      hid: string;
      coverUrl: string;
    }
  >();

  const chunks = chunkArray(follows, 5);
  let processedCount = 0;

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (follow) => {
        try {
          const comicDetail = await fetchComicDetails(follow.md_comics.slug);

          if (
            !comicDetail?.comic?.title ||
            comicDetail.comic.title.includes("NotFound")
          ) {
            processedCount++;
            onProgress?.(processedCount, follows.length);
            return;
          }

          if (comicDetail.comic?.recommendations) {
            comicDetail.comic.recommendations.forEach((rec) => {
              if (
                !isValidRecommendation(rec) ||
                userSlugs.has(rec.relates.slug)
              ) {
                return;
              }

              const existing = recommendationCounts.get(rec.relates.slug);
              const coverUrl = rec.relates.md_covers?.[0]?.b2key
                ? `https://meo.comick.pictures/${rec.relates.md_covers[0].b2key}`
                : "";

              if (existing) {
                existing.count += rec.total;
              } else {
                recommendationCounts.set(rec.relates.slug, {
                  count: rec.total,
                  title: rec.relates.title,
                  hid: rec.relates.hid,
                  coverUrl,
                });
              }
            });
          }

          processedCount++;
          onProgress?.(processedCount, follows.length);
        } catch (error) {
          if (error instanceof Error && error.message === "NOT_FOUND") {
            console.log(`Comic not found: ${follow.md_comics.slug}`);
          } else {
            console.error(
              `Error fetching details for ${follow.md_comics.slug}:`,
              error
            );
          }
          processedCount++;
          onProgress?.(processedCount, follows.length);
        }
      })
    );
  }

  return Array.from(recommendationCounts.entries())
    .map(([slug, data]) => ({
      slug,
      title: data.title,
      hid: data.hid,
      count: data.count,
      coverUrl: data.coverUrl,
    }))
    .filter((rec) => rec.title && !rec.title.includes("NotFound"))
    .sort((a, b) => b.count - a.count);
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
