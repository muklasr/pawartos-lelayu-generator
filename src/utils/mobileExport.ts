import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// @ts-ignore – pdfmake standard font container (no type defs)
import timesFontContainer from 'pdfmake/build/standard-fonts/Times';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ObituaryData, Receiver } from '../types';
import { strings } from './i18n';


// ── Layout constants (mirror the CSS) ─────────────────────────────────────
// .doc-section grid-template-columns: 180px 1fr
const LABEL_WIDTH = 150; // points — mirrors the fixed 180px left column

/** Shared body style: serif 12pt using PDF built-in Times (alias for Times New Roman) */
const BODY = { font: 'Times', fontSize: 12, lineHeight: 1.3 };

/** Two-column label:value row — mirrors .doc-section grid */
const labelRow = (label: string, value: string): Content => ({
  columns: [
    { text: label, width: LABEL_WIDTH, ...BODY },
    { text: `: ${value}`, width: '*', ...BODY },
  ],
  columnGap: 0,
  margin: [0, 3, 0, 0] as [number, number, number, number],
});

/** Build the content nodes for a single page / recipient */
function buildPageContent(data: ObituaryData, receiver?: Receiver): Content[] {
  const t = strings[data.language];

  const receiverName = receiver
    ? `${t.receiverName}: ${receiver.name}`
    : `${t.receiverName}...............................................`;

  const receiverAddress = receiver
    ? `${t.wonten_ing}: ${receiver.address || ''}`
    : `${t.wonten_ing}................................................`;

  const familyItems =
    data.keluarga && data.keluarga.length > 0
      ? data.keluarga.map((m, i) => ({
        columns: [
          { text: `${i + 1}. ${m.name || '[Nama]'}`, width: 160, ...BODY },
          { text: m.relation ? `(${m.relation})` : '', width: '*', ...BODY },
        ],
        columnGap: 0,
        margin: [0, 2, 0, 2] as [number, number, number, number],
      }))
      : [{
        columns: [
          { text: '1. [Nama]', width: 160, ...BODY },
          { text: '', width: '*', ...BODY },
        ],
        columnGap: 0,
        margin: [0, 2, 0, 2] as [number, number, number, number],
      }];

  return [
    // ── Title ────────────────────────────────────────────────────────────
    {
      text: t.title,
      font: 'Times', fontSize: 18, bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Katur ────────────────────────────────────────────────────────────
    {
      stack: [
        { text: t.katur, ...BODY },
        { text: receiverName, ...BODY, bold: !!receiver },
        { text: receiverAddress, ...BODY },
      ],
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Salam ─────────────────────────────────────────────────────────────
    {
      text: t.salam,
      ...BODY,
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Innalillahi (centred + italic) ────────────────────────────────────
    {
      text: t.innalillahi,
      font: 'Times', fontSize: 12, italics: true,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Opening ───────────────────────────────────────────────────────────
    {
      text: t.opening,
      ...BODY,
      margin: [0, 0, 0, 18] as [number, number, number, number],
    },

    // ── Name (large, bold, underlined, centred) ───────────────────────────
    {
      text: data.namaAlmarhum || '[NAMA ALMARHUM]',
      font: 'Times', fontSize: 22, bold: true,
      decoration: 'underline',
      alignment: 'center',
      margin: [0, 12, 0, 4] as [number, number, number, number],
    },

    // ── Age ───────────────────────────────────────────────────────────────
    {
      text: `${t.yuswo}: ${data.umur || '[Umur]'} ${t.tahun}`,
      ...BODY,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Tilar donya ───────────────────────────────────────────────────────
    {
      stack: [
        { text: t.tilar_donya, ...BODY, margin: [0, 0, 0, 2] as [number, number, number, number] },
        labelRow(t.rikolo_dinten, data.meninggalDinten || '[Hari, tgl meninggal]'),
        labelRow(t.wanci_tabuh, data.meninggalWaktu || '[hh:mm WIB]'),
        labelRow(t.wonten_ing_place, data.meninggalAlamat || '[Alamat meninggal]'),
      ],
      margin: [0, 0, 0, 16] as [number, number, number, number],
    },

    // ── Pemakaman ─────────────────────────────────────────────────────────
    {
      stack: [
        { text: t.kasareaken, ...BODY, margin: [0, 0, 0, 2] as [number, number, number, number] },
        labelRow(t.dinten, data.pemakamanDinten || '[Hari, tgl pemakaman]'),
        labelRow(t.wanci_tabuh, data.pemakamanWaktu || '[hh:mm WIB]'),
        labelRow(t.saking_griyo, data.pemakamanRumahDuka || '[Alamat rumah duka]'),
        labelRow(t.wonten, data.pemakamanMakam || '[Alamat makam]'),
      ],
      margin: [0, 0, 0, 16] as [number, number, number, number],
    },

    // ── Closing paragraph ─────────────────────────────────────────────────
    {
      text: t.closing,
      ...BODY,
      alignment: 'justify',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Family ────────────────────────────────────────────────────────────
    {
      stack: [
        { text: t.sungkowo, ...BODY },
        { stack: familyItems, margin: [24, 6, 0, 0] as [number, number, number, number] },
      ],
    },
  ];
}

/**
 * Register the PDF standard built-in Times font with pdfmake.
 * Uses pdfmake's addFontContainer API (the same mechanism Times.js uses
 * when loaded as a script tag) to inject Times AFM metrics — no network needed.
 */
let fontsReady = false;
export function ensureFonts(): void {
  if (fontsReady) return;
  fontsReady = true;

  // Ensure base VFS (Roboto) is present
  if (!(pdfMake as any).vfs) {
    (pdfMake as any).vfs = (pdfFonts as any).vfs ?? {};
  }

  // Resolve the font container — Vite may wrap CJS exports under .default
  const container = (timesFontContainer as any)?.default ?? timesFontContainer;

  // Primary: use pdfmake's official addFontContainer API
  if (typeof (pdfMake as any).addFontContainer === 'function') {
    (pdfMake as any).addFontContainer(container);
  } else if (container?.vfs && typeof container.vfs === 'object') {
    // Fallback: merge the VFS directly
    Object.assign((pdfMake as any).vfs, container.vfs);
    if (container?.fonts) {
      (pdfMake as any).fonts = { ...(pdfMake as any).fonts, ...container.fonts };
    }
  }

  // Always register the font mapping explicitly so pdfmake knows the file names
  (pdfMake as any).fonts = {
    ...(pdfMake as any).fonts,
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic',
    },
  };
}

/**
 * Generate a Base64 data URI for the obituary PDF.
 * To be used in a two-step download flow to preserve user gesture.
 */
export async function generateMobilePdfBase64(data: ObituaryData): Promise<string> {
  ensureFonts();

  const pages =
    data.penerima && data.penerima.length > 0 ? data.penerima : [undefined];

  const content: Content[] = [];
  pages.forEach((receiver, index) => {
    const nodes = buildPageContent(data, receiver ?? undefined);
    if (index > 0) (nodes[0] as any).pageBreak = 'before';
    content.push(...nodes);
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    // 20mm left/right, 25mm top/bottom — mirrors `.a4-container { padding: 25mm 20mm }`
    pageMargins: [56.7, 70.9, 56.7, 70.9],
    content,
    defaultStyle: { font: 'Times', fontSize: 12 },
  };

  const base64Data = await pdfMake.createPdf(docDefinition).getBase64();
  return `data:application/octet-stream;base64,${base64Data}`;
}
