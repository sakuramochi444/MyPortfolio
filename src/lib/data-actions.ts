"use server";

import fs from "fs/promises";
import path from "path";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

import { getAboutData, getWorksData } from "./data-fetching";

const DATA_DIR = path.join(process.cwd(), "src/data");

async function checkAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function getAllData() {
  await checkAuth();
  const about = await getAboutData();
  const works = await getWorksData();
  return { about, works };
}

async function writeToKV(key: string, data: any) {
  if (process.env.PORTFOLIO_DATA) {
    const kv = (process.env.PORTFOLIO_DATA as any) as KVNamespace;
    await kv.put(key, JSON.stringify(data));
    return true;
  }
  return false;
}

export async function uploadImage(fileBase64: string, fileName: string) {
  await checkAuth();

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "user/repo"
  
  if (!token || !repo) {
    console.warn("GITHUB_TOKEN or GITHUB_REPO not set. Image will be stored as Base64 in JSON.");
    return { success: true, path: fileBase64 };
  }

  try {
    // Remove data:image/xxx;base64, prefix
    const content = fileBase64.split(",")[1];
    const path = `public/images/uploads/${Date.now()}-${fileName}`;
    
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload image: ${fileName}`,
        content: content,
      }),
    });

    if (response.ok) {
      // GitHub image path relative to public
      const savedPath = path.replace("public", "");
      return { success: true, path: savedPath };
    }
    
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  } catch (e) {
    console.error("GitHub Upload Error:", e);
    return { success: false, error: "GitHub upload failed, using Base64 instead.", path: fileBase64 };
  }
}

export async function updateAboutData(data: any) {
  await checkAuth();
  
  // Try KV first
  const kvSuccess = await writeToKV("about", data);
  
  // Try local fs if not on KV (local development)
  if (!kvSuccess) {
    try {
      const filePath = path.join(DATA_DIR, "about.json");
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to write to local fs (likely on Edge):", e);
    }
  }
  
  revalidatePath("/");
  return { success: true };
}

export async function updateWorksData(data: any) {
  await checkAuth();
  
  // Try KV first
  const kvSuccess = await writeToKV("works", data);
  
  if (!kvSuccess) {
    try {
      const filePath = path.join(DATA_DIR, "works.json");
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to write to local fs (likely on Edge):", e);
    }
  }
  
  revalidatePath("/work");
  revalidatePath("/work/[id]");
  return { success: true };
}
