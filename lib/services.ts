export type ServiceStatus =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance"
  | "fetch_failed";

export type ServiceCategory =
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
  icon: string;
  /** Optional override for display (unused when using dynamic status). */
  status?: Exclude<ServiceStatus, "fetch_failed">;
  /** Override status API URL when default derivation fails (e.g. Instatus, Google). */
  statusApiUrl?: string;
  /** API format so the fetcher can parse the response. */
  statusApiType?: StatusApiType;
};

/** Unique key for a service (for dynamic status lookup). */
export function getServiceKey(service: Service): string {
  return `${service.name}|${service.category}`;
}

export const CATEGORIES: ServiceCategory[] = [
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
  // Cloud
  {
    name: "AWS",
    category: "Cloud",
    url: "https://health.aws.amazon.com/health/status",
    icon: "cloud",
    statusApiUrl: "https://status.aws.amazon.com/rss/all.rss",
    statusApiType: "rss",
  },
  {
    name: "Google Cloud",
    category: "Cloud",
    url: "https://status.cloud.google.com/",
    icon: "cloud",
    statusApiUrl: "https://status.cloud.google.com/incidents.json",
    statusApiType: "google",
  },
  {
    name: "Microsoft Azure",
    category: "Cloud",
    url: "https://status.azure.com/",
    icon: "cloud",
    statusApiUrl: "https://status.azure.com/en-us/status/feed/",
    statusApiType: "rss",
  },
  {
    name: "DigitalOcean",
    category: "Cloud",
    url: "https://status.digitalocean.com/",
    icon: "cloud",
  },
  {
    name: "Vercel",
    category: "Cloud",
    url: "https://www.vercel-status.com/",
    icon: "cloud",
  },
  {
    name: "Netlify",
    category: "Cloud",
    url: "https://www.netlifystatus.com/",
    icon: "cloud",
  },

  {
    name: "Render",
    category: "Cloud",
    url: "https://status.render.com/",
    icon: "cloud",
  },
  {
    name: "Railway",
    category: "Cloud",
    url: "https://railway.instatus.com/",
    icon: "cloud",
    statusApiUrl: "https://railway.instatus.com/summary.json",
    statusApiType: "instatus",
  },
  // Developer Tools
  {
    name: "GitHub",
    category: "Developer Tools",
    url: "https://www.githubstatus.com/",
    icon: "code",
  },
  {
    name: "GitLab",
    category: "Developer Tools",
    url: "https://status.gitlab.com/",
    icon: "code",
    statusApiUrl:
      "https://status.gitlab.com/1.0/status/5b36dc6502d06804c08349f7",
    statusApiType: "statusio",
  },
  {
    name: "Bitbucket",
    category: "Developer Tools",
    url: "https://bitbucket.status.atlassian.com/",
    icon: "code",
    statusApiUrl: "https://bitbucket.status.atlassian.com/api/v2/summary.json",
    statusApiType: "atlassian_summary",
  },
  {
    name: "NPM",
    category: "Developer Tools",
    url: "https://status.npmjs.org/",
    icon: "package",
  },
  {
    name: "Heroku",
    category: "Cloud",
    url: "https://status.heroku.com/",
    icon: "cloud",
    statusApiUrl: "https://status.heroku.com/api/v4/current-status",
    statusApiType: "heroku",
  },
  {
    name: "Docker",
    category: "Developer Tools",
    url: "https://www.dockerstatus.com/",
    icon: "box",
    statusApiUrl:
      "https://www.dockerstatus.com/pages/533c6539221ae15e3f000031/rss",
    statusApiType: "rss",
  },
  // CDN & DNS
  {
    name: "Cloudflare",
    category: "CDN & DNS",
    url: "https://www.cloudflarestatus.com/",
    icon: "globe",
  },
  {
    name: "Cloudinary",
    category: "CDN & DNS",
    url: "https://status.cloudinary.com/",
    icon: "globe",
  },
  // Communication
  {
    name: "Slack",
    category: "Communication",
    url: "https://status.slack.com/",
    icon: "message-circle",
    statusApiUrl: "https://slack-status.com/api/v2.0.0/current",
    statusApiType: "slack",
  },
  {
    name: "Discord",
    category: "Communication",
    url: "https://discordstatus.com/",
    icon: "message-circle",
  },
  {
    name: "Zoom",
    category: "Communication",
    url: "https://status.zoom.us/",
    icon: "video",
  },
  {
    name: "Twilio",
    category: "Communication",
    url: "https://status.twilio.com/",
    icon: "phone",
  },
  // CI/CD
  {
    name: "CircleCI",
    category: "CI/CD",
    url: "https://status.circleci.com/",
    icon: "workflow",
  },
  {
    name: "GitHub Actions",
    category: "CI/CD",
    url: "https://www.githubstatus.com/",
    icon: "workflow",
  },
  // Databases
  {
    name: "MongoDB",
    category: "Databases",
    url: "https://status.cloud.mongodb.com/",
    icon: "database",
  },
  {
    name: "Supabase",
    category: "Databases",
    url: "https://status.supabase.com/",
    icon: "database",
  },
  {
    name: "Firebase",
    category: "Databases",
    url: "https://status.firebase.google.com/",
    icon: "database",
    statusApiUrl: "https://status.firebase.google.com/incidents.json",
    statusApiType: "google",
  },
  {
    name: "PlanetScale",
    category: "Databases",
    url: "https://www.planetscalestatus.com/",
    icon: "database",
  },
  // Email
  {
    name: "SendGrid",
    category: "Email",
    url: "https://status.sendgrid.com/",
    icon: "mail",
  },
  {
    name: "Mailgun",
    category: "Email",
    url: "https://status.mailgun.com/",
    icon: "mail",
  },
  // Analytics
  {
    name: "Datadog",
    category: "Analytics",
    url: "https://status.datadoghq.com/",
    icon: "bar-chart-2",
  },
  {
    name: "Sentry",
    category: "Analytics",
    url: "https://status.sentry.io/",
    icon: "bar-chart-2",
  },
];
