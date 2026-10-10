import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { CLS_BRAND } from "./brand.js";
import type { DocumentSection } from "./types.js";

const C = CLS_BRAND.colors;

function brandHeader(title: string, client?: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: CLS_BRAND.name.toUpperCase(),
          bold: true,
          color: C.purple,
          size: 20,
          font: CLS_BRAND.fonts.heading,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 18, color: C.orange },
      },
      children: [
        new TextRun({
          text: title,
          bold: true,
          color: C.purpleDark,
          size: 36,
          font: CLS_BRAND.fonts.heading,
        }),
      ],
    }),
    ...(client
      ? [
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Client: ${client}`,
                color: C.textWeak,
                size: 22,
                font: CLS_BRAND.fonts.body,
              }),
            ],
          }),
        ]
      : [new Paragraph({ spacing: { after: 240 }, children: [] })]),
  ];
}

function sectionBlocks(section: DocumentSection): Paragraph[] {
  const out: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 280, after: 120 },
      children: [
        new TextRun({
          text: section.heading,
          bold: true,
          color: C.purpleDark,
          size: 26,
          font: CLS_BRAND.fonts.heading,
        }),
      ],
    }),
  ];

  for (const p of section.paragraphs ?? []) {
    out.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: p,
            color: C.text,
            size: 22,
            font: CLS_BRAND.fonts.body,
          }),
        ],
      }),
    );
  }

  for (const bullet of section.bullets ?? []) {
    out.push(
      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        children: [
          new TextRun({
            text: `• ${bullet}`,
            color: C.text,
            size: 22,
            font: CLS_BRAND.fonts.body,
          }),
        ],
      }),
    );
  }

  return out;
}

function metaTable(rows: { label: string; value: string }[]): Table {
  const border = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: C.border,
  };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      (row) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: {
                top: border,
                bottom: border,
                left: border,
                right: border,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: row.label,
                      bold: true,
                      color: C.purple,
                      size: 20,
                      font: CLS_BRAND.fonts.body,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 72, type: WidthType.PERCENTAGE },
              borders: {
                top: border,
                bottom: border,
                left: border,
                right: border,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: row.value,
                      color: C.text,
                      size: 20,
                      font: CLS_BRAND.fonts.body,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
    ),
  });
}

export async function buildWordDocument(input: {
  title: string;
  client?: string;
  subtitle?: string;
  sections: DocumentSection[];
  metaRows?: { label: string; value: string }[];
}): Promise<Uint8Array> {
  const children: (Paragraph | Table)[] = [
    ...brandHeader(input.title, input.client),
  ];

  if (input.subtitle) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: input.subtitle,
            italics: true,
            color: C.textWeak,
            size: 22,
            font: CLS_BRAND.fonts.body,
          }),
        ],
      }),
    );
  }

  if (input.metaRows?.length) {
    children.push(metaTable(input.metaRows));
    children.push(new Paragraph({ children: [] }));
  }

  for (const section of input.sections) {
    children.push(...sectionBlocks(section));
  }

  children.push(
    new Paragraph({
      spacing: { before: 400 },
      alignment: AlignmentType.LEFT,
      border: {
        top: { style: BorderStyle.SINGLE, size: 12, color: C.purple },
      },
      children: [
        new TextRun({
          text: `${CLS_BRAND.name} · ${CLS_BRAND.tagline}`,
          color: C.textWeak,
          size: 18,
          font: CLS_BRAND.fonts.body,
        }),
      ],
    }),
  );

  const doc = new Document({
    creator: CLS_BRAND.name,
    title: input.title,
    description: CLS_BRAND.tagline,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
