import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://outagemap.vercel.app"),
  title: {
    template: "%s | Outage Map",
    default: "Outage Map - Real-Time Dashboard",
  },
  description:
    "Curated directory of official status pages and real-time operational monitoring for major cloud and SaaS services.",
  keywords: [
    "outage map",
    "service status",
    "system down",
    "cloud monitoring",
    "uptime",
    "SaaS status",
  ],
  authors: [{ name: "Asim" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://outagemap.vercel.app",
    title: "Outage Map - Live Status Monitor",
    description:
      "Monitor real-time statuses of cloud and SaaS services with the Outage Map.",
    siteName: "Outage Map",
    images: [
      {
        url: "/Meta.png",
        width: 1200,
        height: 630,
        alt: "Outage Map Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outage Map - Live Status Monitor",
    description:
      "Monitor real-time statuses of cloud and SaaS services with the Outage Map.",
    images: ["/Meta.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Outage Map",
  },
  verification: {
    google: "24c34Rx6jo-1JjJvDSNh0oEo1Tg_J8my2TJknJ8WPUM",
  },
};
