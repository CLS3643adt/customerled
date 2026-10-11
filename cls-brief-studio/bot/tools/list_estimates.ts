import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { listEstimates } from "../lib/store.js";
import { totals } from "../lib/types.js";

export default defineTool({
  description: prompt`
    List stored work estimates with totals.
  `,
  effect: "read",
  inputSchema: z.object({}).optional(),
  async execute(_input, ctx) {
    const estimates = await listEstimates(ctx.host.kv);
    return {
      count: estimates.length,
      estimates: estimates.map((e) => {
        const summary = totals(e);
        return {
          id: e.id,
          title: e.title,
          briefId: e.briefId,
          streamCount: e.streams.length,
          bucketCount: e.buckets.length,
          totalDays: summary.totalDays,
          updatedAt: e.updatedAt,
        };
      }),
    };
  },
});
