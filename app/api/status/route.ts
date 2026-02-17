import { NextResponse } from "next/server";
import { services, getServiceKey, type ServiceStatus } from "@/lib/services";
import { getStatusApiConfig, fetchServiceStatus } from "@/lib/status-fetcher";

export const dynamic = "force-dynamic";
// Revalidate every 60 seconds
export const revalidate = 60;

export async function GET() {
  const apiUrlToConfig = new Map<
    string,
    { type: ReturnType<typeof getStatusApiConfig>["type"]; keys: string[] }
  >();

  for (const service of services) {
    const key = getServiceKey(service);
    const { url, type } = getStatusApiConfig(service);
    const existing = apiUrlToConfig.get(url);
    if (existing) {
      existing.keys.push(key);
    } else {
      apiUrlToConfig.set(url, { type, keys: [key] });
    }
  }

  const uniqueUrls = Array.from(apiUrlToConfig.keys());
  const results = await Promise.allSettled(
    uniqueUrls.map((url) => {
      const { type } = apiUrlToConfig.get(url)!;
      return fetchServiceStatus(url, type);
    }),
  );

  const urlToStatus = new Map<string, ServiceStatus | null>();
  uniqueUrls.forEach((url, i) => {
    const result = results[i];
    const status = result.status === "fulfilled" ? result.value : null;
    urlToStatus.set(url, status);
  });

  const statusByKey: Record<string, ServiceStatus> = {};
  for (const service of services) {
    const key = getServiceKey(service);
    const { url } = getStatusApiConfig(service);
    const fetched = urlToStatus.get(url);
    statusByKey[key] = fetched ?? "fetch_failed";
  }

  return NextResponse.json({
    services: statusByKey,
    lastUpdated: new Date().toISOString(),
  });
}
