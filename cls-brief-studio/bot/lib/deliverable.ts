import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ArtifactsApi } from "@cursor/bdk/artifacts";
import type { HostFilesApi, JsonObject } from "@cursor/bdk";

export async function persistDeliverable(input: {
  workspaceDir: string;
  files: HostFilesApi;
  artifacts: ArtifactsApi;
  kind: "presentation" | "document";
  id: string;
  title: string;
  fileName: string;
  bytes: Uint8Array;
  contentType: string;
  data: JsonObject;
}): Promise<{
  artifactId: string;
  workspacePath: string;
  hostPath: string;
  fileName: string;
  bytes: number;
}> {
  const relative = path.posix.join("deliverables", input.fileName);
  const absolute = path.join(input.workspaceDir, "deliverables", input.fileName);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, input.bytes);

  // Deployment scope so direct `bdk call` (no session) and multi-session
  // follow-ups can both reach the same durable bytes.
  await input.files.write(relative, input.bytes, { scope: "deployment" });

  const tagged = await input.artifacts.tag({
    kind: input.kind,
    key: `${input.kind}:${input.id}`,
    title: input.title,
    data: {
      ...input.data,
      fileName: input.fileName,
      workspacePath: relative,
    },
    contents: input.bytes,
    contentType: input.contentType,
  });

  return {
    artifactId: tagged.id,
    workspacePath: relative,
    hostPath: relative,
    fileName: input.fileName,
    bytes: input.bytes.byteLength,
  };
}
