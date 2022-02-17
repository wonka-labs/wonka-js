import { DefaultSeoProps } from "next-seo";

const APP_DESCRIPTION = "wagmify.me is an experimental art project. Season 1 consists of 128 one-of-kind avatars, loosely based on your appearance using webcam input."
const APP_DEFAULT_SEO: DefaultSeoProps = {
  title: "wagmify.me",
  titleTemplate: "%s",
  description: APP_DESCRIPTION,
  canonical: "https://wagmify.me",
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "preload",
      href: "/fonts/smallest_pixel-7.ttf",
      as: "font",
      type: "font/ttf",
      crossOrigin: "anonymous",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "wagmify.me",
    title: "wagmify.me",
    description: APP_DESCRIPTION,
    images: [
      {
        url: "https://www.wagmify.app/assets/og-cover-photo.png",
        width: 2000,
        height: 1000,
        alt: "wagmify.me avatar photo",
        type: "image/jpeg",
        secureUrl: "https://www.wagmify.app/assets/og-cover-photo.png",
      },
    ],
    site_name: "wagmify.me",
  },
  twitter: {
    handle: "@wagmify",
    site: "@wagmify",
    cardType: "summary_large_image",
  },
};

export default APP_DEFAULT_SEO;