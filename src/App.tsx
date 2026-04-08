import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Smartphone } from 'lucide-react';
import { DocumentPreview } from './components/Document';
import { DocumentForm } from './components/Form';
import { getDefaultObituaryData } from './types';
import { exportMobilePdf } from './utils/mobileExport';
import type { ObituaryData } from './types';
import './index.css';

/** Returns true when the user is on a mobile/tablet touch device. */
const isMobileDevice = (): boolean =>
  /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia('(pointer: coarse)').matches;

function App() {
  const [data, setData] = useState<ObituaryData>(getDefaultObituaryData());
  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s+/g, '_')}`,
    onBeforePrint: () => { setPrinting(true); return Promise.resolve(); },
    onAfterPrint: () => setPrinting(false),
  });

  const [errors, setErrors] = useState<Set<string>>(new Set());

  const requiredFields: { key: keyof ObituaryData; label: string }[] = [
    { key: 'namaAlmarhum', label: 'Nama Almarhum' },
    { key: 'umur', label: 'Umur' },
    { key: 'meninggalDinten', label: 'Tanggal Meninggal' },
    { key: 'meninggalWaktu', label: 'Waktu Meninggal' },
    { key: 'meninggalAlamat', label: 'Tempat Meninggal' },
    { key: 'pemakamanDinten', label: 'Tanggal Pemakaman' },
    { key: 'pemakamanWaktu', label: 'Waktu Pemakaman' },
    { key: 'pemakamanRumahDuka', label: 'Alamat Rumah Duka' },
    { key: 'pemakamanMakam', label: 'Alamat Makam' },
  ];

  const onMobile = isMobileDevice();

  const handleExport = async () => {
    const missing = requiredFields.filter(f => !String(data[f.key]).trim());
    if (missing.length > 0) {
      setErrors(new Set(missing.map(f => f.key)));
      alert(`Mohon lengkapi data berikut sebelum export:\n\n• ${missing.map(f => f.label).join('\n• ')}`);
      return;
    }
    setErrors(new Set());

    if (onMobile) {
      // Mobile: use pdfmake for a reliable direct PDF download
      // (async: fetches Liberation Serif font on first call, cached after)
      setPrinting(true);
      try {
        await exportMobilePdf(data);
      } finally {
        setPrinting(false);
      }
    } else {
      // Desktop: use the browser print dialog (react-to-print)
      handlePrint();
    }
  };

  const handleDataChange = (newData: ObituaryData) => {
    setData(newData);
    // Clear error for any field that now has a value
    if (errors.size > 0) {
      setErrors(prev => {
        const next = new Set(prev);
        requiredFields.forEach(f => {
          if (String(newData[f.key]).trim()) next.delete(f.key);
        });
        return next;
      });
    }
  };

  return (
    <div className="app-container">
      <div className="form-pane">
        <div className="pane-header">
          <h1>Pawartos Lelayu Generator</h1>
        </div>

        <DocumentForm data={data} onChange={handleDataChange} errors={errors} />

        <button className="btn btn-export" onClick={handleExport} disabled={printing}>
          {onMobile ? <Smartphone size={18} /> : <Download size={18} />}
          {printing ? 'Menyiapkan...' : onMobile ? 'Download PDF' : 'Export / Print'}
        </button>
      </div>

      <div className="preview-pane">
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={16} /> Preview (A4 Setup)
        </div>
        <div className="preview-scroll-wrapper" id="pdf-content">
          <DocumentPreview data={data} ref={printRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
