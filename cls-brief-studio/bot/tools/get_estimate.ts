import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { getEstimate } from "../lib/store.js";
import { totals } from "../lib/types.js";

export default defineTool({
  description: prompt`
    Fetch one work estimate by id, including stream/bucket totals.
  `,
  effect: "read",
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  async execute({ id }, ctx) {
    const estimate = await getEstimate(ctx.host.kv, id);
    if (!estimate) {
      return { found: false, id, estimate: null, summary: null };
    }
    return { found: true, id, estimate, summary: totals(estimate) };
  },
});
