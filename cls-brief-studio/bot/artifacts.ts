import { defineArtifacts } from "@cursor/bdk/artifacts";
import { z } from "zod";

export default defineArtifacts({
  kinds: {
    brief: {
      description: "A Customer Led Strategy consultancy brief.",
      schema: z.object({
        id: z.string(),
        title: z.string(),
        client: z.string(),
        status: z.string(),
      }),
    },
    estimate: {
      description: "A work-bucket and stream estimate tied to a brief.",
      schema: z.object({
        id: z.string(),
        title: z.string(),
        briefId: z.string().nullable(),
        totalDays: z.number(),
      }),
    },
    presentation: {
      description: "A branded PowerPoint deck (.pptx).",
      schema: z.object({
        id: z.string(),
        title: z.string(),
        fileName: z.string(),
        slideCount: z.number(),
      }),
    },
    document: {
      description: "A branded Word document (.docx).",
      schema: z.object({
        id: z.string(),
        title: z.string(),
        fileName: z.string(),
        sectionCount: z.number(),
      }),
    },
  },
  agentTool: false,
});
