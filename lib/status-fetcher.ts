import type { ServiceStatus, StatusApiType, Service } from "./services";

const FETCH_TIMEOUT_MS = 30000;

/**
 * Statuspage.io / Atlassian status API: { status: { indicator: "none"|"minor"|"major"|"critical"|"maintenance" } }
 */
function parseStatuspage(body: unknown): ServiceStatus | null {
  if (!body || typeof body !== "object" || !("status" in body)) return null;
  const s = (body as { status?: { indicator?: string } }).status;
  if (!s || typeof s.indicator !== "string") return null;
  const indicator = s.indicator.toLowerCase();
  if (indicator === "none") return "operational";
  if (indicator === "minor") return "degraded";
  if (indicator === "major" || indicator === "critical") return "outage";
  if (indicator === "maintenance") return "maintenance";
  return "operational";
}

/**
 * Atlassian summary.json has same status.indicator as status.json
 */
function parseAtlassianSummary(body: unknown): ServiceStatus | null {
  return parseStatuspage(body);
}

/**
 * Instatus summary.json: { page: { status: "UP"|"HASISSUES"|"UNDERMAINTENANCE" } }
 */
function parseInstatus(body: unknown): ServiceStatus | null {
  if (!body || typeof body !== "object" || !("page" in body)) return null;
  const page = (body as { page?: { status?: string } }).page;
  if (!page || typeof page.status !== "string") return null;
  const s = page.status.toUpperCase();
  if (s === "UP") return "operational";
  if (s === "HASISSUES") return "degraded";
  if (s === "UNDERMAINTENANCE") return "maintenance";
  return "operational";
}

/**
 * Google / Firebase incidents.json: array of incidents; check most_recent_update.status and status_impact for active issues
 */
function parseGoogleIncidents(body: unknown): ServiceStatus | null {
  if (!Array.isArray(body)) return null;
  for (const inc of body) {
    if (!inc || typeof inc !== "object") continue;
    const update = (
      inc as {
        most_recent_update?: { status?: string };
        status_impact?: string;
      }
    ).most_recent_update;
    const impact = (inc as { status_impact?: string }).status_impact;
    const status = update?.status;
    if (status && status !== "AVAILABLE") {
      if (impact === "SERVICE_OUTAGE" || impact === "OUTAGE") return "outage";
      if (impact === "SERVICE_DISRUPTION" || impact === "SERVICE_INFORMATION")
        return "degraded";
      return "degraded";
    }
  }
  return "operational";
}

/**
 * RSS Feed Parser (for AWS, Azure)
 * Naive regex-based parser to avoid XML dependencies.
 */
function parseRss(body: unknown): ServiceStatus | null {
  if (typeof body !== "string") return null;
  const items = body.match(/<item>[\s\S]*?<\/item>/g);
  if (!items || items.length === 0) return "operational";

  for (const item of items) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    const descMatch = item.match(/<description>(.*?)<\/description>/);
    const content = (
      (titleMatch ? titleMatch[1] : "") + (descMatch ? descMatch[1] : "")
    ).toLowerCase();

    // Check for "resolved" or "monitoring" which might still be active incidents but less severe?
    // Actually, usually if it's in the RSS feed, it's an active or recent incident.
    // AWS/Azure RSS usually lists recent events. We need to check if they are "active".
    // For simplicity: if it says "resolved", we might ignore it?
    // But usually RSS feeds contain history.
    // Let's refine: AWS RSS title usually: "Service is operating normally: [Region]" or "Informational message: [Service]"
    // If we simply look for negative keywords in the *latest* items?

    if (
      content.includes("resolved") ||
      content.includes("operating normally") ||
      content.includes("informational") ||
      content.includes("completed")
    ) {
      continue;
    }

    if (
      content.includes("outage") ||
      content.includes("error") ||
      content.includes("failure")
    )
      return "outage";
    if (
      content.includes("degraded") ||
      content.includes("issue") ||
      content.includes("warning") ||
      content.includes("latency") ||
      content.includes("slow")
    )
      return "degraded";
    if (content.includes("maintenance")) return "maintenance";
  }

  return "operational";
}

/**
 * Heroku API: { status: [{ system: "Apps", status: "green" }, ...], incidents: [] }
 */
function parseHeroku(body: unknown): ServiceStatus | null {
  if (!body || typeof body !== "object") return null;
  const status = (body as { status?: { status?: string }[] }).status;
  const incidents = (body as { incidents?: unknown[] }).incidents;

  if (Array.isArray(incidents) && incidents.length > 0) return "outage";

  if (Array.isArray(status)) {
    for (const s of status) {
      if (s.status === "red") return "outage";
      if (s.status === "yellow" || s.status === "blue") return "degraded";
    }
  }

  return "operational";
}

/**
 * Status.io (GitLab): { result: { status_overall: { status: "Operational"|"Degraded Performance"|... } } }
 */
function parseStatusIo(body: unknown): ServiceStatus | null {
  if (!body || typeof body !== "object" || !("result" in body)) return null;
  const result = (body as { result?: { status_overall?: { status?: string } } })
    .result;
  const status = result?.status_overall?.status;

  if (!status) return null;

  switch (status) {
    case "Operational":
      return "operational";
    case "Degraded Performance":
      return "degraded";
    case "Partial Service Disruption":
      return "degraded";
    case "Service Disruption":
      return "outage";
    case "Security Event":
      return "outage";
    case "Maintenance":
      return "maintenance";
    default:
      return "operational";
  }
}

/**
 * Slack API: { status: "ok", active_incidents: [] }
 */
function parseSlack(body: unknown): ServiceStatus | null {
  if (!body || typeof body !== "object") return null;
  const status = (body as { status?: string }).status;
  const incidents = (body as { active_incidents?: unknown[] }).active_incidents;

  if (status === "ok" && (!incidents || incidents.length === 0))
    return "operational";
  if (incidents && incidents.length > 0) return "outage"; // Assume outage if incidents exist, or could check types

  return "degraded"; // Fallback if status not ok
}

function parseByType(
  body: unknown,
  apiType: StatusApiType,
): ServiceStatus | null {
  switch (apiType) {
    case "statuspage":
      return parseStatuspage(body);
    case "atlassian_summary":
      return parseAtlassianSummary(body);
    case "instatus":
      return parseInstatus(body);
    case "google":
      return parseGoogleIncidents(body);
    case "rss":
      return parseRss(body);
    case "heroku":
      return parseHeroku(body);
    case "statusio":
      return parseStatusIo(body);
    case "slack":
      return parseSlack(body);
    default:
      return parseStatuspage(body);
  }
}

/**
 * Resolve status API URL and type for a service. Uses statusApiUrl/statusApiType when set.
 */
export function getStatusApiConfig(service: Service): {
  url: string;
  type: StatusApiType;
} {
  const base = service.url.replace(/\/$/, "");
  if (service.statusApiUrl)
    return {
      url: service.statusApiUrl,
      type: service.statusApiType ?? "statuspage",
    };
  if (service.statusApiType === "instatus")
    return { url: `${base}/summary.json`, type: "instatus" };
  if (service.statusApiType === "google" && service.statusApiUrl)
    return { url: service.statusApiUrl, type: "google" };
  if (service.statusApiType === "atlassian_summary")
    return { url: `${base}/api/v2/summary.json`, type: "atlassian_summary" };
  if (service.statusApiType === "rss")
    return { url: service.statusApiUrl!, type: "rss" }; // Should be set in config
  if (service.statusApiType === "heroku")
    return { url: service.statusApiUrl!, type: "heroku" };
  if (service.statusApiType === "statusio")
    return { url: service.statusApiUrl!, type: "statusio" };
  if (service.statusApiType === "slack")
    return { url: service.statusApiUrl!, type: "slack" };

  return { url: `${base}/api/v2/status.json`, type: "statuspage" };
}

/**
 * Fetch status from a status API URL. Returns null on error or timeout.
 */
export async function fetchServiceStatus(
  apiUrl: string,
  apiType: StatusApiType = "statuspage",
): Promise<ServiceStatus | null> {
  const RETRIES = 1;

  for (let i = 0; i <= RETRIES; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept:
            apiType === "rss"
              ? "application/xml, text/xml, */*"
              : "application/json",
        },
        next: { revalidate: 60 }, // Cache on Next.js level for 60s
      });
      clearTimeout(timeout);
      if (!res.ok) {
        if (i < RETRIES) continue; // Retry on non-200
        return null;
      }

      let body: unknown;
      if (apiType === "rss") {
        body = await res.text();
      } else {
        body = await res.json();
      }
      return parseByType(body, apiType);
    } catch {
      clearTimeout(timeout);
      if (i < RETRIES) continue; // Retry on network error/timeout
      return null;
    }
  }
  return null;
}
