import { forwardRef } from 'react';
import type { ObituaryData, Receiver } from '../types';

interface DocumentProps {
  data: ObituaryData;
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentProps>(({ data }, ref) => {
  
  const renderPage = (receiver?: Receiver, key?: string) => (
    <div className="a4-container" key={key || 'default'}>
      <h1 className="doc-title">PAWARTOS LELAYU</h1>
      
      <div className="doc-katur">
        <div>Katur Dhumateng</div>
        {receiver ? (
           <>
             <div style={{ fontWeight: 'bold' }}>Bpk/Ibu/Sdr: {receiver.name}</div>
             {receiver.address ? <div>Wonten ing: {receiver.address}</div> : <div><br/></div>}
           </>
        ) : (
           <>
             <div>Bpk/Ibu/Sdr...............................................</div>
             <div>Wonten ing................................................</div>
           </>
        )}
      </div>
      
      <div className="doc-salam">
        Assalamu'alaikum Wr. Wb.
      </div>
      
      <div className="doc-innalillahi">
        INNALILLAHI WAINNA ILLAIHI ROJI'UN
      </div>
      
      <div className="doc-opening">
        Sampun Kapundhut wangsul dumateng Ngarso dalem Allah SWT, panjenenganipun:
      </div>
      
      <div className="doc-name">
        {data.namaAlmarhum || '[NAMA ALMARHUM]'}
      </div>
      <div className="doc-age">
        Yuswo: {data.umur || '[Umur]'} tahun
      </div>
      
      <div className="doc-section">
        <div className="doc-section-title">Tilar donya,</div>
        <div>Rikolo Dinten</div>
        <div>: {data.meninggalDinten || '[EEEE OOOO, dd MMMM yyyy]'}</div>
        
        <div>Wanci Tabuh</div>
        <div>: {data.meninggalWaktu || '[hh:mm WIB]'}</div>
        
        <div>Wonten ing</div>
        <div>: {data.meninggalAlamat || '[Alamat meninggal]'}</div>
      </div>
      
      <div className="doc-section">
        <div className="doc-section-title">Jenazah badhe kasareaken:</div>
        <div>Dinten</div>
        <div>: {data.pemakamanDinten || '[EEEE OOOO, dd MMMM yyyy]'}</div>
        
        <div>Wanci Tabuh</div>
        <div>: {data.pemakamanWaktu || '[hh:mm WIB]'}</div>
        
        <div>Saking griyo dhukhito</div>
        <div>: {data.pemakamanRumahDuka || '[Alamat rumah duka]'}</div>
        
        <div>Wonten</div>
        <div>: {data.pemakamanMakam || '[Alamat makam]'}</div>
      </div>
      
      <div className="doc-paragraph">
        Kanthi pawartos lelayu meniko, dumateng Bpk/Ibu/Sederek sedaya kasuwun paring
        panjurung do'a saha paring pakurmatan ingkang pungkasan dumateng Almarhum.
        Wassalamu'alaikum Wr. Wb.
      </div>
      
      <div className="doc-family-section">
        <div>Ingkang nandang sungkowo:</div>
        <div className="doc-family-list">
          {data.keluarga && data.keluarga.length > 0 ? (
            data.keluarga.map((member, index) => (
              <div key={member.id} className="doc-family-item">
                <div>{index + 1}. {member.name || '[Nama]'}</div>
                <div>({member.relation || 'Hubungan dengan almarhum'})</div>
              </div>
            ))
          ) : (
             <div className="doc-family-item">
               <div>1. [Nama]</div>
               <div>(Hubungan dengan almarhum)</div>
             </div>
          )}
        </div>
      </div>
      
    </div>
  );

  return (
    <div ref={ref} className="print-document-list">
      {data.penerima && data.penerima.length > 0
        ? data.penerima.map(rec => renderPage(rec, rec.id))
        : renderPage()}
    </div>
  );
});

DocumentPreview.displayName = 'DocumentPreview';
