import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { shortId, slugify } from "../lib/brand.js";
import { getEstimate, saveEstimate } from "../lib/store.js";
import type { WorkEstimate } from "../lib/types.js";
import { totals } from "../lib/types.js";

const confidence = z.enum(["low", "medium", "high"]);

export default defineTool({
  description: prompt`
    Create or update a work estimate with streams and effort buckets (days).
    Use after a brief exists or when the user asks to size delivery work.
    Pass id to update; omit id to create.
  `,
  effect: "write",
  inputSchema: z.object({
    id: z.string().optional(),
    briefId: z.string().nullable().optional(),
    title: z.string().min(1),
    streams: z
      .array(
        z.object({
          name: z.string().min(1),
          summary: z.string().default(""),
        }),
      )
      .min(1),
    buckets: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string().min(1),
          stream: z.string().min(1),
          description: z.string().default(""),
          effortDays: z.number().positive(),
          confidence: confidence.default("medium"),
          assumptions: z.array(z.string()).default([]),
        }),
      )
      .min(1),
    contingencyPercent: z.number().min(0).max(50).default(15),
    notes: z.array(z.string()).default([]),
  }),
  async execute(input, ctx) {
    const now = new Date().toISOString();
    const existing = input.id
      ? await getEstimate(ctx.host.kv, input.id)
      : null;
    const id =
      existing?.id ?? `${slugify(input.title)}-est-${shortId()}`;

    const estimate: WorkEstimate = {
      id,
      briefId: input.briefId ?? existing?.briefId ?? null,
      title: input.title,
      streams: input.streams,
      buckets: input.buckets.map((b, i) => ({
        id: b.id ?? `b${i + 1}-${shortId()}`,
        name: b.name,
        stream: b.stream,
        description: b.description,
        effortDays: b.effortDays,
        confidence: b.confidence,
        assumptions: b.assumptions,
      })),
      contingencyPercent: input.contingencyPercent,
      notes: input.notes,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await saveEstimate(ctx.host.kv, estimate);
    const summary = totals(estimate);
    await ctx.artifacts.tag({
      kind: "estimate",
      key: `estimate:${estimate.id}`,
      title: estimate.title,
      data: {
        id: estimate.id,
        title: estimate.title,
        briefId: estimate.briefId,
        totalDays: summary.totalDays,
      },
    });

    return {
      estimate,
      summary,
      created: !existing,
      message: existing
        ? `Updated estimate ${estimate.id}`
        : `Created estimate ${estimate.id}`,
    };
  },
});
