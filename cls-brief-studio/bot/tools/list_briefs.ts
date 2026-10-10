import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { listBriefs } from "../lib/store.js";

export default defineTool({
  description: prompt`
    List stored consultancy briefs (id, title, client, status, updatedAt).
    Use when the user asks what briefs exist or which one to continue.
  `,
  effect: "read",
  inputSchema: z.object({}).optional(),
  async execute(_input, ctx) {
    const briefs = await listBriefs(ctx.host.kv);
    return {
      count: briefs.length,
      briefs: briefs.map((b) => ({
        id: b.id,
        title: b.title,
        client: b.client,
        status: b.status,
        updatedAt: b.updatedAt,
      })),
    };
  },
});
