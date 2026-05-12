import { Metadata } from "next";

export function constructMetadata({
  title,
  fullTitle,
    description =
      "VideoTrack is a high-performance link shortening and analytics platform for video creators and agencies. Track clicks, geography, devices, and conversions.",
    image = "https://assets.vtrack.io/thumbnail.jpg",
  video,
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "https://assets.dub.co/favicons/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "https://assets.dub.co/favicons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "https://assets.dub.co/favicons/favicon-16x16.png",
    },
  ],
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
} = {}): Metadata {
  return {
    title:
      fullTitle ||
      (title ? `${title} | VideoTrack` : "VideoTrack — Link Analytics for Video Creators"),
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@inspiriastudios",
    },
    icons,
    metadataBase: new URL("https://dub.co"),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  };
}
