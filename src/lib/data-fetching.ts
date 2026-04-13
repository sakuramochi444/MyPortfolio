import aboutDataDefault from "@/data/about.json";
import worksDataDefault from "@/data/works.json";
import { AboutData, WorkItem } from "@/types";

// For Cloudflare KV support
export async function getAboutData(): Promise<AboutData> {
  if (process.env.PORTFOLIO_DATA) {
    const kv = (process.env.PORTFOLIO_DATA as any) as KVNamespace;
    const data = await kv.get("about", "json");
    if (data) return data as AboutData;
  }
  return aboutDataDefault as AboutData;
}

export async function getWorksData(): Promise<WorkItem[]> {
  if (process.env.PORTFOLIO_DATA) {
    const kv = (process.env.PORTFOLIO_DATA as any) as KVNamespace;
    const data = await kv.get("works", "json");
    if (data) return data as WorkItem[];
  }
  return worksDataDefault as WorkItem[];
}
