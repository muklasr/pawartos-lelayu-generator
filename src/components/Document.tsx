import { forwardRef } from 'react';
import type { ObituaryData, Receiver } from '../types';
import { strings } from '../utils/i18n';

interface DocumentProps {
  data: ObituaryData;
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentProps>(({ data }, ref) => {
  const t = strings[data.language];

  const renderPage = (receiver?: Receiver, key?: string) => (
    <div className="a4-container" key={key || 'default'}>
      <h1 className="doc-title">{t.title}</h1>
      
      <div className="doc-katur">
        <div>{t.katur}</div>
        {receiver ? (
           <>
             <div style={{ fontWeight: 'bold' }}>{t.receiverName}: {receiver.name}</div>
             {receiver.address ? <div>{t.wonten_ing}: {receiver.address}</div> : <div><br/></div>}
           </>
        ) : (
           <>
             <div>{t.receiverName}...............................................</div>
             <div>{t.wonten_ing}................................................</div>
           </>
        )}
      </div>
      
      <div className="doc-salam">
        {t.salam}
      </div>
      
      <div className="doc-innalillahi">
        {t.innalillahi}
      </div>
      
      <div className="doc-opening">
        {t.opening}
      </div>
      
      <div className="doc-name">
        {data.namaAlmarhum || '[NAMA ALMARHUM]'}
      </div>
      <div className="doc-age">
        {t.yuswo}: {data.umur || '[Umur]'} {t.tahun}
      </div>
      
      <div className="doc-section">
        <div className="doc-section-title">{t.tilar_donya}</div>
        <div>{t.rikolo_dinten}</div>
        <div>: {data.meninggalDinten || '[Hari, tgl meninggal]'}</div>
        
        <div>{t.wanci_tabuh}</div>
        <div>: {data.meninggalWaktu || '[hh:mm WIB]'}</div>
        
        <div>{t.wonten_ing_place}</div>
        <div>: {data.meninggalAlamat || '[Alamat meninggal]'}</div>
      </div>
      
      <div className="doc-section">
        <div className="doc-section-title">{t.kasareaken}</div>
        <div>{t.dinten}</div>
        <div>: {data.pemakamanDinten || '[Hari, tgl pemakaman]'}</div>
        
        <div>{t.wanci_tabuh}</div>
        <div>: {data.pemakamanWaktu || '[hh:mm WIB]'}</div>
        
        <div>{t.saking_griyo}</div>
        <div>: {data.pemakamanRumahDuka || '[Alamat rumah duka]'}</div>
        
        <div>{t.wonten}</div>
        <div>: {data.pemakamanMakam || '[Alamat makam]'}</div>
      </div>
      
      <div className="doc-paragraph">
        {t.closing}
      </div>
      
      <div className="doc-family-section">
        <div>{t.sungkowo}</div>
        <div className="doc-family-list">
          {data.keluarga && data.keluarga.length > 0 ? (
            data.keluarga.map((member, index) => (
              <div key={member.id} className="doc-family-item">
                <div>{index + 1}. {member.name || '[Nama]'}</div>
                <div>{member.relation ? `(${member.relation})` : ''}</div>
              </div>
            ))
          ) : (
             <div className="doc-family-item">
               <div>1. [Nama]</div>
               <div></div>
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
