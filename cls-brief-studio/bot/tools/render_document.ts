import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { shortId, slugify } from "../lib/brand.js";
import { persistDeliverable } from "../lib/deliverable.js";
import { buildWordDocument } from "../lib/docx.js";
import type { DocumentSection } from "../lib/types.js";

const sectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
});

export default defineTool({
  description: prompt`
    Render a Customer Led Strategy branded Word document (.docx).
    Use for consultancy briefs, estimate packs, or stakeholder notes.
    Prefer the cls-presentations / consultancy-brief skills for structure.
  `,
  effect: "write",
  inputSchema: z.object({
    title: z.string().min(1),
    client: z.string().optional(),
    subtitle: z.string().optional(),
    sections: z.array(sectionSchema).min(1),
    metaRows: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    fileName: z.string().optional(),
  }),
  async execute(input, ctx) {
    const id = `${slugify(input.title)}-${shortId()}`;
    const fileName =
      input.fileName ??
      `${slugify(input.title)}-${id.slice(-6)}.docx`;
    const sections = input.sections as DocumentSection[];
    const bytes = await buildWordDocument({
      title: input.title,
      client: input.client,
      subtitle: input.subtitle,
      sections,
      metaRows: input.metaRows,
    });
    const saved = await persistDeliverable({
      workspaceDir: ctx.workspaceDir,
      files: ctx.host.files,
      artifacts: ctx.artifacts,
      kind: "document",
      id,
      title: input.title,
      fileName,
      bytes,
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      data: {
        id,
        title: input.title,
        fileName,
        sectionCount: sections.length,
      },
    });

    return {
      id,
      title: input.title,
      sectionCount: sections.length,
      ...saved,
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      message: `Created branded Word document at ${saved.workspacePath}`,
    };
  },
});
