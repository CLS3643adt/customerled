import { prompt } from "@cursor/bdk";
import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { shortId, slugify } from "../lib/brand.js";
import { persistDeliverable } from "../lib/deliverable.js";
import { buildPresentation } from "../lib/pptx.js";
import type { PresentationSlide } from "../lib/types.js";

const slideSchema = z.object({
  kind: z
    .enum([
      "title",
      "agenda",
      "section",
      "bullets",
      "two_column",
      "table",
      "closing",
    ])
    .default("bullets"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  leftTitle: z.string().optional(),
  leftBullets: z.array(z.string()).optional(),
  rightTitle: z.string().optional(),
  rightBullets: z.array(z.string()).optional(),
  tableHeaders: z.array(z.string()).optional(),
  tableRows: z.array(z.array(z.string())).optional(),
  footer: z.string().optional(),
});

export default defineTool({
  description: prompt`
    Render a Customer Led Strategy branded PowerPoint (.pptx).
    Pass a consistent slide list (title, agenda, content, closing).
    Prefer the cls-presentations skill for slide structure before calling.
  `,
  effect: "write",
  inputSchema: z.object({
    title: z.string().min(1),
    slides: z.array(slideSchema).min(1),
    fileName: z.string().optional(),
  }),
  async execute(input, ctx) {
    const id = `${slugify(input.title)}-${shortId()}`;
    const fileName =
      input.fileName ??
      `${slugify(input.title)}-${id.slice(-6)}.pptx`;
    const slides = input.slides as PresentationSlide[];
    const bytes = await buildPresentation(input.title, slides);
    const saved = await persistDeliverable({
      workspaceDir: ctx.workspaceDir,
      files: ctx.host.files,
      artifacts: ctx.artifacts,
      kind: "presentation",
      id,
      title: input.title,
      fileName,
      bytes,
      contentType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      data: {
        id,
        title: input.title,
        fileName,
        slideCount: slides.length,
      },
    });

    return {
      id,
      title: input.title,
      slideCount: slides.length,
      ...saved,
      contentType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      message: `Created branded PowerPoint at ${saved.workspacePath}`,
    };
  },
});
