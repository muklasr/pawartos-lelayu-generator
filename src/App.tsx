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
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s+/g, '_')}`,
  });

  return (
    <div className="app-container">
      <div className="form-pane">
        <div className="pane-header">
          <h1>Pawartos Lelayu Generator</h1>
          <button className="btn" onClick={handlePrint}>
            <Download size={18} /> Export / Print
          </button>
        </div>

        <DocumentForm data={data} onChange={setData} />
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
