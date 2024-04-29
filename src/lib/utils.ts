import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NOTE: This is written taking Vercel as a deployment platform. If you are using another platform, you can replace the Vercel URL with your own domain.
export function absoluteUrl(path: string): string {
  // If running on the client-side, return the path as is.
  if (typeof window !== "undefined") return path;

  // Trim trailing slash or add a slash in front of the path
  path = path.replace(/\/+$/, ""); // Remove trailing slashes
  path = path.startsWith("/") ? path : `/${path}`;

  // Get base URL
  const baseUrl =
    `https://${process.env.VERCEL_URL}` || `http://localhost:${process.env.PORT ?? 3000}`;

  // Sanitize base URL
  const sanitizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  // Construct and return absolute URL
  return `${sanitizedBaseUrl}${path}`;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMetadata({
  title = "PDFwhisper - Chat with your PDF files",
  description = "PDFwhisper allows you to have a conversation with your PDF docs. Finding info on your PDF files is now easier than ever.",

  // TODO: These images do not exist. Replace them with the real images when we have them.
  image = "/thumbnail.png",
  icons = "/favicon.ico",

  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@shricodev",
    },
    icons,
    // TODO: Add the actual base url to the application.
    metadataBase: new URL(absoluteUrl("/")),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
