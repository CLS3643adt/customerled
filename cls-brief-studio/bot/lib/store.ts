import type { ConsultancyBrief, WorkEstimate } from "./types.js";

type Kv = {
  get(key: string): Promise<unknown>;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
};

const BRIEF_PREFIX = "cls:brief:";
const BRIEF_INDEX = "cls:brief:index";
const ESTIMATE_PREFIX = "cls:estimate:";
const ESTIMATE_INDEX = "cls:estimate:index";

async function readIndex(kv: Kv, key: string): Promise<string[]> {
  const value = await kv.get(key);
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string");
}

async function writeIndex(kv: Kv, key: string, ids: string[]): Promise<void> {
  await kv.put(key, [...new Set(ids)]);
}

export async function saveBrief(kv: Kv, brief: ConsultancyBrief): Promise<void> {
  await kv.put(`${BRIEF_PREFIX}${brief.id}`, brief);
  const index = await readIndex(kv, BRIEF_INDEX);
  if (!index.includes(brief.id)) {
    index.unshift(brief.id);
    await writeIndex(kv, BRIEF_INDEX, index);
  }
}

export async function getBrief(
  kv: Kv,
  id: string,
): Promise<ConsultancyBrief | null> {
  const value = await kv.get(`${BRIEF_PREFIX}${id}`);
  if (!value || typeof value !== "object") return null;
  return value as ConsultancyBrief;
}

export async function listBriefs(kv: Kv): Promise<ConsultancyBrief[]> {
  const index = await readIndex(kv, BRIEF_INDEX);
  const briefs: ConsultancyBrief[] = [];
  for (const id of index) {
    const brief = await getBrief(kv, id);
    if (brief) briefs.push(brief);
  }
  return briefs;
}

export async function saveEstimate(
  kv: Kv,
  estimate: WorkEstimate,
): Promise<void> {
  await kv.put(`${ESTIMATE_PREFIX}${estimate.id}`, estimate);
  const index = await readIndex(kv, ESTIMATE_INDEX);
  if (!index.includes(estimate.id)) {
    index.unshift(estimate.id);
    await writeIndex(kv, ESTIMATE_INDEX, index);
  }
}

export async function getEstimate(
  kv: Kv,
  id: string,
): Promise<WorkEstimate | null> {
  const value = await kv.get(`${ESTIMATE_PREFIX}${id}`);
  if (!value || typeof value !== "object") return null;
  return value as WorkEstimate;
}

export async function listEstimates(kv: Kv): Promise<WorkEstimate[]> {
  const index = await readIndex(kv, ESTIMATE_INDEX);
  const estimates: WorkEstimate[] = [];
  for (const id of index) {
    const estimate = await getEstimate(kv, id);
    if (estimate) estimates.push(estimate);
  }
  return estimates;
}
