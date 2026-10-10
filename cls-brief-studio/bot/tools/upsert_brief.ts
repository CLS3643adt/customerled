import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { shortId, slugify } from "../lib/brand.js";
import { getBrief, saveBrief } from "../lib/store.js";
import type { BriefStatus, ConsultancyBrief } from "../lib/types.js";

const statusSchema = z.enum(["draft", "review", "approved"]);

export default defineTool({
  description: prompt`
    Create or update a Customer Led Strategy consultancy brief.
    Use when the user wants to draft, refine, or approve a brief.
    Pass id to update an existing brief; omit id to create one.
  `,
  effect: "write",
  inputSchema: z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    client: z.string().default(""),
    problem: z.string().min(1),
    outcome: z.string().min(1),
    principles: z.array(z.string()).default([]),
    scope: z.array(z.string()).default([]),
    outOfScope: z.array(z.string()).default([]),
    successSignals: z.array(z.string()).default([]),
    assumptions: z.array(z.string()).default([]),
    risks: z.array(z.string()).default([]),
    nextSteps: z.array(z.string()).default([]),
    status: statusSchema.default("draft"),
  }),
  async execute(input, ctx) {
    const now = new Date().toISOString();
    const existing = input.id ? await getBrief(ctx.host.kv, input.id) : null;
    const id =
      existing?.id ?? `${slugify(input.title)}-${shortId()}`;

    const brief: ConsultancyBrief = {
      id,
      title: input.title,
      client: input.client,
      problem: input.problem,
      outcome: input.outcome,
      principles: input.principles,
      scope: input.scope,
      outOfScope: input.outOfScope,
      successSignals: input.successSignals,
      assumptions: input.assumptions,
      risks: input.risks,
      nextSteps: input.nextSteps,
      status: input.status as BriefStatus,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await saveBrief(ctx.host.kv, brief);
    await ctx.artifacts.tag({
      kind: "brief",
      key: `brief:${brief.id}`,
      title: brief.title,
      data: {
        id: brief.id,
        title: brief.title,
        client: brief.client,
        status: brief.status,
      },
    });

    return {
      brief,
      created: !existing,
      message: existing
        ? `Updated brief ${brief.id}`
        : `Created brief ${brief.id}`,
    };
  },
});
