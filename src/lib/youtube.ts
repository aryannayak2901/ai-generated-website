export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration?: string;
  category?: string;
}

export interface YouTubeChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Helper to get reliable thumbnail
export function getYoutubeThumbnail(videoId: string, quality: 'maxres' | 'hq' | 'mq' | 'default' = 'hq'): string {
  if (quality === 'maxres') return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  if (quality === 'hq') return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  if (quality === 'mq') return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  return `https://img.youtube.com/vi/${videoId}/default.jpg`;
}

// Mock data based on extracted content
export const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: "SpRQaDjgqu8",
    title: "Supreme Court Dynasties: Families that Shaped the Indian Judiciary",
    description: "Legacy on the Bench: Families in the Supreme Court 'In the hallowed halls of the Supreme Court of India, law and legacy often...'",
    thumbnail: getYoutubeThumbnail("SpRQaDjgqu8", "hq"),
    publishedAt: "2025-06-07T00:00:00Z",
    viewCount: "136",
    likeCount: "5",
    category: "Criminal Defense",
  },
  {
    id: "Ozm504DzVy4",
    title: "3 Supreme Court Judges who became Governors...",
    description: "Detailed analysis of Supreme Court judges transitioning to political roles.",
    thumbnail: getYoutubeThumbnail("Ozm504DzVy4", "hq"),
    publishedAt: "2025-06-06T00:00:00Z",
    viewCount: "220",
    likeCount: "9",
    category: "Criminal Defense",
  },
  {
    id: "MBk2yEg_Sus",
    title: "Unknown Facts about Kesavanda Bharti Judgment",
    description: "A look into the historic Kesavananda Bharati case.",
    thumbnail: getYoutubeThumbnail("MBk2yEg_Sus", "hq"),
    publishedAt: "2025-06-04T00:00:00Z",
    viewCount: "212",
    likeCount: "14",
    category: "General Legal",
  },
  {
    id: "SpRQaDjgqu8_2",
    title: "Unique and unknown facts about Kesavananda Bharti Judgment",
    description: "More insights into the landmark judgment that shaped the Basic Structure doctrine.",
    thumbnail: getYoutubeThumbnail("MBk2yEg_Sus", "hq"),
    publishedAt: "2025-06-04T00:00:00Z",
    viewCount: "674",
    likeCount: "3",
    category: "General Legal",
  },
  {
    id: "3Yi2x9DezhA",
    title: "46th CJI Ranjan Gogoi Track Record",
    description: "Evaluation of Justice Ranjan Gogoi's tenure as Chief Justice of India.",
    thumbnail: getYoutubeThumbnail("3Yi2x9DezhA", "hq"),
    publishedAt: "2023-12-13T00:00:00Z",
    viewCount: "95",
    likeCount: "6",
    category: "Criminal Defense",
  },
  // Adding more mock items to test pagination (20 per page)
  ...Array.from({ length: 25 }).map((_, i) => ({
    id: `example-${i}`,
    title: `Legal Education Series Part ${i + 6}: Mastering Case Law`,
    description: `Deep dive into the nuances of Indian legal precedents and their practical applications.`,
    thumbnail: getYoutubeThumbnail("Ozm504DzVy4", "hq"), // Reusing a valid thumbnail
    publishedAt: new Date(2023, 11, 1 - i).toISOString(),
    viewCount: Math.floor(Math.random() * 1000).toString(),
    likeCount: Math.floor(Math.random() * 100).toString(),
    category: i % 2 === 0 ? "Criminal Defense" : "General Legal",
  }))
];

interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
  }>;
  error?: unknown;
}

interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        maxres?: { url: string };
        high?: { url: string };
      };
      publishedAt: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
  error?: unknown;
}

export async function getLatestVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  if (!API_KEY || !CHANNEL_ID) {
    console.warn("YouTube API key or Channel ID not set, returning mock data.");
    return MOCK_VIDEOS.slice(0, maxResults);
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    const response = await fetch(url);
    const data = (await response.json()) as YouTubeSearchResponse;

    if (data.error) {
       console.error("YouTube API Error:", data.error);
       return MOCK_VIDEOS.slice(0, maxResults);
    }

    const videoIds = data.items.map((item) => item.id.videoId).join(",");
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
    const statsResponse = await fetch(statsUrl);
    const statsData = (await statsResponse.json()) as YouTubeVideoResponse;

    return statsData.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || getYoutubeThumbnail(item.id, "hq"),
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      duration: item.contentDetails.duration,
      category: "General Legal", // YouTube search API doesn't easily give channel-specific categories without extra logic
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return MOCK_VIDEOS.slice(0, maxResults);
  }
}

export async function getChannelStats(): Promise<YouTubeChannelStats | null> {
  if (!API_KEY || !CHANNEL_ID) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=statistics`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.items?.[0]) return null;

    const stats = data.items[0].statistics;
    return {
      subscriberCount: stats.subscriberCount,
      viewCount: stats.viewCount,
      videoCount: stats.videoCount,
    };
  } catch (error) {
    console.error("Error fetching YouTube stats:", error);
    return null;
  }
}
