import PptxGenJS from "pptxgenjs";
import { CLS_BRAND } from "./brand.js";
import type { PresentationSlide } from "./types.js";

const C = CLS_BRAND.colors;

function addChrome(slide: PptxGenJS.Slide, footer?: string): void {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 0.12,
    fill: { color: C.purple },
    line: { color: C.purple },
  });
  slide.addShape("rect", {
    x: 0,
    y: 5.4,
    w: 10,
    h: 0.22,
    fill: { color: C.purpleDark },
    line: { color: C.purpleDark },
  });
  slide.addText(CLS_BRAND.name, {
    x: 0.35,
    y: 5.42,
    w: 5,
    h: 0.18,
    fontSize: 9,
    fontFace: CLS_BRAND.fonts.body,
    color: C.white,
    margin: 0,
  });
  if (footer) {
    slide.addText(footer, {
      x: 5.2,
      y: 5.42,
      w: 4.45,
      h: 0.18,
      fontSize: 9,
      fontFace: CLS_BRAND.fonts.body,
      color: C.orange,
      align: "right",
      margin: 0,
    });
  }
}

function renderTitle(pres: PptxGenJS, slide: PresentationSlide): void {
  const s = pres.addSlide();
  s.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.purpleDark },
    line: { color: C.purpleDark },
  });
  s.addShape("rect", {
    x: 0,
    y: 4.9,
    w: 10,
    h: 0.725,
    fill: { color: C.orange },
    line: { color: C.orange },
  });
  s.addText(CLS_BRAND.name, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    h: 0.4,
    fontSize: 16,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.orange,
    bold: true,
    margin: 0,
  });
  s.addText(slide.title, {
    x: 0.6,
    y: 1.8,
    w: 8.8,
    h: 1.4,
    fontSize: 36,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.white,
    bold: true,
    margin: 0,
  });
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.6,
      y: 3.4,
      w: 8.8,
      h: 0.7,
      fontSize: 16,
      fontFace: CLS_BRAND.fonts.body,
      color: C.purpleLight,
      margin: 0,
    });
  }
  s.addText(CLS_BRAND.tagline, {
    x: 0.6,
    y: 5.1,
    w: 8.8,
    h: 0.35,
    fontSize: 12,
    fontFace: CLS_BRAND.fonts.body,
    color: C.white,
    margin: 0,
  });
}

function renderBullets(pres: PptxGenJS, slide: PresentationSlide): void {
  const s = pres.addSlide();
  s.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.white },
    line: { color: C.white },
  });
  addChrome(s, slide.footer);
  s.addText(slide.title, {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.55,
    fontSize: 26,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.purpleDark,
    bold: true,
    margin: 0,
  });
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.5,
      y: 0.95,
      w: 9,
      h: 0.35,
      fontSize: 13,
      fontFace: CLS_BRAND.fonts.body,
      color: C.textWeak,
      margin: 0,
    });
  }
  const bullets = slide.bullets ?? [];
  s.addText(
    bullets.map((b) => ({
      text: b,
      options: { bullet: true, breakLine: true },
    })),
    {
      x: 0.55,
      y: slide.subtitle ? 1.45 : 1.15,
      w: 8.9,
      h: 3.7,
      fontSize: 16,
      fontFace: CLS_BRAND.fonts.body,
      color: C.text,
      paraSpaceAfter: 8,
      valign: "top",
    },
  );
}

function renderTwoColumn(pres: PptxGenJS, slide: PresentationSlide): void {
  const s = pres.addSlide();
  s.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.white },
    line: { color: C.white },
  });
  addChrome(s, slide.footer);
  s.addText(slide.title, {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.5,
    fontSize: 26,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.purpleDark,
    bold: true,
    margin: 0,
  });

  s.addShape("rect", {
    x: 0.45,
    y: 1.15,
    w: 4.4,
    h: 3.9,
    fill: { color: C.purpleLight },
    line: { color: C.purpleLight },
  });
  s.addShape("rect", {
    x: 5.15,
    y: 1.15,
    w: 4.4,
    h: 3.9,
    fill: { color: C.orangeLight },
    line: { color: C.orangeLight },
  });

  s.addText(slide.leftTitle ?? "Left", {
    x: 0.65,
    y: 1.3,
    w: 4,
    h: 0.4,
    fontSize: 16,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.purpleDark,
    bold: true,
    margin: 0,
  });
  s.addText(
    (slide.leftBullets ?? []).map((b) => ({
      text: b,
      options: { bullet: true, breakLine: true },
    })),
    {
      x: 0.65,
      y: 1.8,
      w: 4,
      h: 3,
      fontSize: 13,
      fontFace: CLS_BRAND.fonts.body,
      color: C.text,
      paraSpaceAfter: 6,
      valign: "top",
    },
  );

  s.addText(slide.rightTitle ?? "Right", {
    x: 5.35,
    y: 1.3,
    w: 4,
    h: 0.4,
    fontSize: 16,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.orangeDark,
    bold: true,
    margin: 0,
  });
  s.addText(
    (slide.rightBullets ?? []).map((b) => ({
      text: b,
      options: { bullet: true, breakLine: true },
    })),
    {
      x: 5.35,
      y: 1.8,
      w: 4,
      h: 3,
      fontSize: 13,
      fontFace: CLS_BRAND.fonts.body,
      color: C.text,
      paraSpaceAfter: 6,
      valign: "top",
    },
  );
}

function renderTable(pres: PptxGenJS, slide: PresentationSlide): void {
  const s = pres.addSlide();
  s.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.white },
    line: { color: C.white },
  });
  addChrome(s, slide.footer);
  s.addText(slide.title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.45,
    fontSize: 24,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.purpleDark,
    bold: true,
    margin: 0,
  });

  const headers = slide.tableHeaders ?? [];
  const rows = slide.tableRows ?? [];
  const tableRows: PptxGenJS.TableRow[] = [
    headers.map((h) => ({
      text: h,
      options: {
        fill: { color: C.purple },
        color: C.white,
        bold: true,
        align: "left",
        valign: "middle",
      },
    })),
    ...rows.map((row, i) =>
      row.map((cell) => ({
        text: cell,
        options: {
          fill: { color: i % 2 === 0 ? C.purpleLight : C.white },
          color: C.text,
          align: "left" as const,
          valign: "middle" as const,
        },
      })),
    ),
  ];

  s.addTable(tableRows, {
    x: 0.4,
    y: 1.0,
    w: 9.2,
    colW: headers.map(() => 9.2 / Math.max(headers.length, 1)),
    border: [
      { pt: 0.5, color: C.border },
      { pt: 0.5, color: C.border },
      { pt: 0.5, color: C.border },
      { pt: 0.5, color: C.border },
    ],
    fontFace: CLS_BRAND.fonts.body,
    fontSize: 12,
  });
}

function renderClosing(pres: PptxGenJS, slide: PresentationSlide): void {
  const s = pres.addSlide();
  s.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.purple },
    line: { color: C.purple },
  });
  s.addText(CLS_BRAND.name, {
    x: 0.6,
    y: 1.6,
    w: 8.8,
    h: 0.4,
    fontSize: 16,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.orange,
    bold: true,
    margin: 0,
  });
  s.addText(slide.title, {
    x: 0.6,
    y: 2.2,
    w: 8.8,
    h: 0.9,
    fontSize: 32,
    fontFace: CLS_BRAND.fonts.heading,
    color: C.white,
    bold: true,
    margin: 0,
  });
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.6,
      y: 3.3,
      w: 8.8,
      h: 0.6,
      fontSize: 15,
      fontFace: CLS_BRAND.fonts.body,
      color: C.purpleLight,
      margin: 0,
    });
  }
}

export async function buildPresentation(
  deckTitle: string,
  slides: PresentationSlide[],
): Promise<Uint8Array> {
  const pres = new PptxGenJS();
  pres.author = CLS_BRAND.name;
  pres.title = deckTitle;
  pres.subject = CLS_BRAND.tagline;
  pres.layout = "LAYOUT_WIDE";

  for (const slide of slides) {
    switch (slide.kind) {
      case "title":
        renderTitle(pres, slide);
        break;
      case "closing":
        renderClosing(pres, slide);
        break;
      case "two_column":
        renderTwoColumn(pres, slide);
        break;
      case "table":
        renderTable(pres, slide);
        break;
      case "agenda":
      case "section":
      case "bullets":
      default:
        renderBullets(pres, slide);
        break;
    }
  }

  const buffer = (await pres.write({ outputType: "nodebuffer" })) as Buffer;
  return new Uint8Array(buffer);
}
