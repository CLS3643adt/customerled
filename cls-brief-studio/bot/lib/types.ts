export type BriefStatus = "draft" | "review" | "approved";

export type ConsultancyBrief = {
  id: string;
  title: string;
  client: string;
  problem: string;
  outcome: string;
  principles: string[];
  scope: string[];
  outOfScope: string[];
  successSignals: string[];
  assumptions: string[];
  risks: string[];
  nextSteps: string[];
  status: BriefStatus;
  createdAt: string;
  updatedAt: string;
};

export type EffortConfidence = "low" | "medium" | "high";

export type WorkBucket = {
  id: string;
  name: string;
  stream: string;
  description: string;
  effortDays: number;
  confidence: EffortConfidence;
  assumptions: string[];
};

export type WorkStream = {
  name: string;
  summary: string;
};

export type WorkEstimate = {
  id: string;
  briefId: string | null;
  title: string;
  streams: WorkStream[];
  buckets: WorkBucket[];
  contingencyPercent: number;
  notes: string[];
  createdAt: string;
  updatedAt: string;
};

export type SlideKind =
  | "title"
  | "agenda"
  | "section"
  | "bullets"
  | "two_column"
  | "table"
  | "closing";

export type PresentationSlide = {
  kind: SlideKind;
  title: string;
  subtitle?: string;
  bullets?: string[];
  leftTitle?: string;
  leftBullets?: string[];
  rightTitle?: string;
  rightBullets?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  footer?: string;
};

export type DocumentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function totals(estimate: WorkEstimate): {
  baseDays: number;
  contingencyDays: number;
  totalDays: number;
} {
  const baseDays = estimate.buckets.reduce((sum, b) => sum + b.effortDays, 0);
  const contingencyDays =
    Math.round(baseDays * (estimate.contingencyPercent / 100) * 10) / 10;
  return {
    baseDays: Math.round(baseDays * 10) / 10,
    contingencyDays,
    totalDays: Math.round((baseDays + contingencyDays) * 10) / 10,
  };
}
