import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { getBrief } from "../lib/store.js";

export default defineTool({
  description: prompt`
    Fetch one consultancy brief by id.
    Use before estimating work or rendering documents for an existing brief.
  `,
  effect: "read",
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  async execute({ id }, ctx) {
    const brief = await getBrief(ctx.host.kv, id);
    if (!brief) {
      return { found: false, id, brief: null };
    }
    return { found: true, id, brief };
  },
});
