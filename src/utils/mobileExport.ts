import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// @ts-ignore – pdfmake standard font container (no type defs)
import timesFontContainer from 'pdfmake/build/standard-fonts/Times';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ObituaryData, Receiver } from '../types';


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
  const receiverName = receiver
    ? `Bpk/Ibu/Sdr: ${receiver.name}`
    : 'Bpk/Ibu/Sdr...............................................';

  const receiverAddress = receiver
    ? `Wonten ing: ${receiver.address || ''}`
    : 'Wonten ing................................................';

  const familyItems =
    data.keluarga && data.keluarga.length > 0
      ? data.keluarga.map((m, i) => ({
        columns: [
          { text: `${i + 1}. ${m.name || '[Nama]'}`, width: 160, ...BODY },
          { text: `(${m.relation || 'Hubungan dengan almarhum'})`, width: '*', ...BODY },
        ],
        columnGap: 0,
        margin: [0, 2, 0, 2] as [number, number, number, number],
      }))
      : [{
        columns: [
          { text: '1. [Nama]', width: 160, ...BODY },
          { text: '(Hubungan dengan almarhum)', width: '*', ...BODY },
        ],
        columnGap: 0,
        margin: [0, 2, 0, 2] as [number, number, number, number],
      }];

  return [
    // ── Title ────────────────────────────────────────────────────────────
    {
      text: 'PAWARTOS LELAYU',
      font: 'Times', fontSize: 18, bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Katur ────────────────────────────────────────────────────────────
    {
      stack: [
        { text: 'Katur Dhumateng', ...BODY },
        { text: receiverName, ...BODY, bold: !!receiver },
        { text: receiverAddress, ...BODY },
      ],
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Salam ─────────────────────────────────────────────────────────────
    {
      text: "Assalamu'alaikum Wr. Wb.",
      ...BODY,
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Innalillahi (centred + italic) ────────────────────────────────────
    {
      text: "INNALILLAHI WAINNA ILLAIHI ROJI'UN",
      font: 'Times', fontSize: 12, italics: true,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Opening ───────────────────────────────────────────────────────────
    {
      text: 'Sampun Kapundhut wangsul dumateng Ngarso dalem Allah SWT, panjenenganipun:',
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
      text: `Yuswo: ${data.umur || '[Umur]'} tahun`,
      ...BODY,
      alignment: 'center',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Tilar donya ───────────────────────────────────────────────────────
    {
      stack: [
        { text: 'Tilar donya,', ...BODY, margin: [0, 0, 0, 2] as [number, number, number, number] },
        labelRow('Rikolo Dinten', data.meninggalDinten || '[EEEE OOOO, dd MMMM yyyy]'),
        labelRow('Wanci Tabuh', data.meninggalWaktu || '[hh:mm WIB]'),
        labelRow('Wonten ing', data.meninggalAlamat || '[Alamat meninggal]'),
      ],
      margin: [0, 0, 0, 16] as [number, number, number, number],
    },

    // ── Pemakaman ─────────────────────────────────────────────────────────
    {
      stack: [
        { text: 'Jenazah badhe kasareaken:', ...BODY, margin: [0, 0, 0, 2] as [number, number, number, number] },
        labelRow('Dinten', data.pemakamanDinten || '[EEEE OOOO, dd MMMM yyyy]'),
        labelRow('Wanci Tabuh', data.pemakamanWaktu || '[hh:mm WIB]'),
        labelRow('Saking griyo dhukhito', data.pemakamanRumahDuka || '[Alamat rumah duka]'),
        labelRow('Wonten', data.pemakamanMakam || '[Alamat makam]'),
      ],
      margin: [0, 0, 0, 16] as [number, number, number, number],
    },

    // ── Closing paragraph ─────────────────────────────────────────────────
    {
      text: "Kanthi pawartos lelayu meniko, dumateng Bpk/Ibu/Sederek sedaya kasuwun paring panjurung do'a saha paring pakurmatan ingkang pungkasan dumateng Almarhum. Wassalamu'alaikum Wr. Wb.",
      ...BODY,
      alignment: 'justify',
      margin: [0, 0, 0, 24] as [number, number, number, number],
    },

    // ── Family ────────────────────────────────────────────────────────────
    {
      stack: [
        { text: 'Ingkang nandang sungkowo:', ...BODY },
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
function ensureFonts(): void {
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
 * Export the obituary as a PDF using pdfmake (mobile-optimised).
 * Uses the PDF standard built-in Times font — no network requests needed.
 */
export async function exportMobilePdf(data: ObituaryData): Promise<void> {
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

  const filename = `Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s+/g, '_')}.pdf`;
  pdfMake.createPdf(docDefinition).download(filename);
}
