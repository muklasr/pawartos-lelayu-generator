import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download } from 'lucide-react';
import { DocumentPreview } from './components/Document';
import { DocumentForm } from './components/Form';
import { getDefaultObituaryData } from './types';
import type { ObituaryData } from './types';
import './index.css';

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
    { key: 'namaAlmarhum',      label: 'Nama Almarhum' },
    { key: 'umur',              label: 'Umur' },
    { key: 'meninggalDinten',   label: 'Tanggal Meninggal' },
    { key: 'meninggalWaktu',    label: 'Waktu Meninggal' },
    { key: 'meninggalAlamat',   label: 'Tempat Meninggal' },
    { key: 'pemakamanDinten',   label: 'Tanggal Pemakaman' },
    { key: 'pemakamanWaktu',    label: 'Waktu Pemakaman' },
    { key: 'pemakamanRumahDuka',label: 'Alamat Rumah Duka' },
    { key: 'pemakamanMakam',    label: 'Alamat Makam' },
  ];

  const handleExport = () => {
    const missing = requiredFields.filter(f => !String(data[f.key]).trim());
    if (missing.length > 0) {
      setErrors(new Set(missing.map(f => f.key)));
      alert(`Mohon lengkapi data berikut sebelum export:\n\n• ${missing.map(f => f.label).join('\n• ')}`);
      return;
    }
    setErrors(new Set());
    handlePrint();
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
          <button className="btn" onClick={handleExport} disabled={printing}>
            <Download size={18} /> {printing ? 'Menyiapkan...' : 'Export / Print'}
          </button>
        </div>

        <DocumentForm data={data} onChange={handleDataChange} errors={errors} />
      </div>

      <div className="preview-pane">
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={16} /> Preview (A4 Setup)
        </div>
        <div className="preview-scroll-wrapper">
          <DocumentPreview data={data} ref={printRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
