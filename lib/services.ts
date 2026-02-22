import React from "react";
import Claude from "@/components/icons/Claude";
import AWS from "@/components/icons/AWS";
import ChatGPT from "@/components/icons/GPT";
import DeepSeek from "@/components/icons/DeepSeek";
import Docker from "@/components/icons/Docker";
import Figma from "@/components/icons/Figma";
import GitHub from "@/components/icons/GitHub";
import MongoDB from "@/components/icons/MongoDB";
import Netlify from "@/components/icons/Netlify";
import Supabase from "@/components/icons/Supabase";
import Vercel from "@/components/icons/Vercel";
import Perplexity from "@/components/icons/Perplexcity";
import GoogleCloud from "@/components/icons/GoogleCloud";
import Azure from "@/components/icons/Azure";
import DigitalOcean from "@/components/icons/Digital";
import Render from "@/components/icons/Render";
import Railway from "@/components/icons/Railway";
import Gitlab from "@/components/icons/Gitlab";
import Bitbucket from "@/components/icons/Bitbucket";
import Npm from "@/components/icons/Npm";
import Heroku from "@/components/icons/Heroku";
import Cloudflare from "@/components/icons/Cloudflare";
import Cloudinary from "@/components/icons/Cloudinary";
import Slack from "@/components/icons/Slack";
import Discord from "@/components/icons/Discord";
import Zoom from "@/components/icons/Zoom";
import Twilio from "@/components/icons/Twilio";
import CircleCI from "@/components/icons/CircleCI";
import Firebase from "@/components/icons/Firebase";
import PlanetScale from "@/components/icons/PlanetScale";
import SendGrid from "@/components/icons/SendGrid";
import Mailgun from "@/components/icons/Mailgun";
import Datadog from "@/components/icons/Datadog";
import Sentry from "@/components/icons/Sentry";
import Groq from "@/components/icons/Groq";

export type ServiceStatus =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance"
  | "fetch_failed";

export type ServiceCategory =
  | "AI"
  | "Cloud"
  | "Developer Tools"
  | "CDN & DNS"
  | "CI/CD"
  | "Communication"
  | "Databases"
  | "Email"
  | "Analytics";

export type StatusApiType =
  | "statuspage"
  | "instatus"
  | "google"
  | "atlassian_summary"
  | "rss"
  | "heroku"
  | "statusio"
  | "slack";

export type Service = {
  name: string;
  category: ServiceCategory;
  url: string;
  icon: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;

  status?: Exclude<ServiceStatus, "fetch_failed">;

  statusApiUrl?: string;

  statusApiType?: StatusApiType;
};

export function getServiceKey(service: Service): string {
  return `${service.name}|${service.category}`;
}

export const CATEGORIES: ServiceCategory[] = [
  "AI",
  "Cloud",
  "Developer Tools",
  "CDN & DNS",
  "CI/CD",
  "Communication",
  "Databases",
  "Email",
  "Analytics",
];

export const services: Service[] = [
  // AI
  {
    name: "Claude",
    category: "AI",
    url: "https://status.claude.com/",
    icon: Claude,
  },
  {
    name: "OpenAI",
    category: "AI",
    url: "https://status.openai.com/",
    icon: ChatGPT,
  },
  {
    name: "DeepSeek",
    category: "AI",
    url: "https://status.deepseek.com/",
    icon: DeepSeek,
  },
  { name: "Groq", category: "AI", url: "https://groqstatus.com/", icon: Groq },
  {
    name: "Perplexity",
    category: "AI",
    url: "https://status.perplexity.com/",
    icon: Perplexity,
    statusApiUrl: "https://status.perplexity.com/summary.json",
    statusApiType: "instatus",
  },
  // Cloud
  {
    name: "AWS",
    category: "Cloud",
    url: "https://health.aws.amazon.com/health/status",
    icon: AWS,
    statusApiUrl: "https://status.aws.amazon.com/rss/all.rss",
    statusApiType: "rss",
  },
  {
    name: "Google Cloud",
    category: "Cloud",
    url: "https://status.cloud.google.com/",
    icon: GoogleCloud,
    statusApiUrl: "https://status.cloud.google.com/incidents.json",
    statusApiType: "google",
  },
  {
    name: "Microsoft Azure",
    category: "Cloud",
    url: "https://status.azure.com/",
    icon: Azure,
    statusApiUrl: "https://status.azure.com/en-us/status/feed/",
    statusApiType: "rss",
  },
  {
    name: "DigitalOcean",
    category: "Cloud",
    url: "https://status.digitalocean.com/",
    icon: DigitalOcean,
  },
  {
    name: "Vercel",
    category: "Cloud",
    url: "https://www.vercel-status.com/",
    icon: Vercel,
  },
  {
    name: "Netlify",
    category: "Cloud",
    url: "https://www.netlifystatus.com/",
    icon: Netlify,
  },

  {
    name: "Render",
    category: "Cloud",
    url: "https://status.render.com/",
    icon: Render,
  },
  {
    name: "Railway",
    category: "Cloud",
    url: "https://railway.instatus.com/",
    icon: Railway,
    statusApiUrl: "https://railway.instatus.com/summary.json",
    statusApiType: "instatus",
  },
  // Developer Tools
  {
    name: "GitHub",
    category: "Developer Tools",
    url: "https://www.githubstatus.com/",
    icon: GitHub,
  },
  {
    name: "GitLab",
    category: "Developer Tools",
    url: "https://status.gitlab.com/",
    icon: Gitlab,
    statusApiUrl:
      "https://status.gitlab.com/1.0/status/5b36dc6502d06804c08349f7",
    statusApiType: "statusio",
  },
  {
    name: "Bitbucket",
    category: "Developer Tools",
    url: "https://bitbucket.status.atlassian.com/",
    icon: Bitbucket,
    statusApiUrl: "https://bitbucket.status.atlassian.com/api/v2/summary.json",
    statusApiType: "atlassian_summary",
  },
  {
    name: "NPM",
    category: "Developer Tools",
    url: "https://status.npmjs.org/",
    icon: Npm,
  },
  {
    name: "Figma",
    category: "Developer Tools",
    url: "https://status.figma.com/",
    icon: Figma,
  },
  {
    name: "Heroku",
    category: "Cloud",
    url: "https://status.heroku.com/",
    icon: Heroku,
    statusApiUrl: "https://status.heroku.com/api/v4/current-status",
    statusApiType: "heroku",
  },
  {
    name: "Docker",
    category: "Developer Tools",
    url: "https://www.dockerstatus.com/",
    icon: Docker,
    statusApiUrl:
      "https://www.dockerstatus.com/pages/533c6539221ae15e3f000031/rss",
    statusApiType: "rss",
  },
  // CDN & DNS
  {
    name: "Cloudflare",
    category: "CDN & DNS",
    url: "https://www.cloudflarestatus.com/",
    icon: Cloudflare,
  },
  {
    name: "Cloudinary",
    category: "CDN & DNS",
    url: "https://status.cloudinary.com/",
    icon: Cloudinary,
  },
  // Communication
  {
    name: "Slack",
    category: "Communication",
    url: "https://status.slack.com/",
    icon: Slack,
    statusApiUrl: "https://slack-status.com/api/v2.0.0/current",
    statusApiType: "slack",
  },
  {
    name: "Discord",
    category: "Communication",
    url: "https://discordstatus.com/",
    icon: Discord,
  },
  {
    name: "Zoom",
    category: "Communication",
    url: "https://status.zoom.us/",
    icon: Zoom,
  },
  {
    name: "Twilio",
    category: "Communication",
    url: "https://status.twilio.com/",
    icon: Twilio,
  },
  // CI/CD
  {
    name: "CircleCI",
    category: "CI/CD",
    url: "https://status.circleci.com/",
    icon: CircleCI,
  },
  // Databases
  {
    name: "MongoDB",
    category: "Databases",
    url: "https://status.cloud.mongodb.com/",
    icon: MongoDB,
  },
  {
    name: "Supabase",
    category: "Databases",
    url: "https://status.supabase.com/",
    icon: Supabase,
  },
  {
    name: "Firebase",
    category: "Databases",
    url: "https://status.firebase.google.com/",
    icon: Firebase,
    statusApiUrl: "https://status.firebase.google.com/incidents.json",
    statusApiType: "google",
  },
  {
    name: "PlanetScale",
    category: "Databases",
    url: "https://www.planetscalestatus.com/",
    icon: PlanetScale,
  },
  // Email
  {
    name: "SendGrid",
    category: "Email",
    url: "https://status.sendgrid.com/",
    icon: SendGrid,
  },
  {
    name: "Mailgun",
    category: "Email",
    url: "https://status.mailgun.com/",
    icon: Mailgun,
  },
  // Analytics
  {
    name: "Datadog",
    category: "Analytics",
    url: "https://status.datadoghq.com/",
    icon: Datadog,
  },
  {
    name: "Sentry",
    category: "Analytics",
    url: "https://status.sentry.io/",
    icon: Sentry,
  },
];
