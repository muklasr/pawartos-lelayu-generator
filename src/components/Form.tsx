import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, ChevronDown, ChevronRight, Languages } from 'lucide-react';
import type { ObituaryData, FamilyMember, Receiver } from '../types';
import { formatWithPasaran, formatStandard } from '../types';

interface FormProps {
  data: ObituaryData;
  onChange: (data: ObituaryData) => void;
  errors?: Set<string>;
}

export const DocumentForm: React.FC<FormProps> = ({ data, onChange, errors = new Set() }) => {
  const [openPanels, setOpenPanels] = useState({
    almarhum: true,
    meninggal: true,
    pemakaman: true,
    keluarga: true,
    penerima: true
  });

  // Auto-expand panels that contain error fields
  useEffect(() => {
    if (errors.size === 0) return;
    const panelFields: Record<string, string[]> = {
      almarhum: ['namaAlmarhum', 'umur'],
      meninggal: ['meninggalDinten', 'meninggalWaktu', 'meninggalAlamat'],
      pemakaman: ['pemakamanDinten', 'pemakamanWaktu', 'pemakamanRumahDuka', 'pemakamanMakam'],
    };
    const forceOpen: Partial<typeof openPanels> = {};
    Object.entries(panelFields).forEach(([panel, fields]) => {
      if (fields.some(f => errors.has(f))) {
        forceOpen[panel as keyof typeof openPanels] = true;
      }
    });
    if (Object.keys(forceOpen).length > 0) {
      setOpenPanels(prev => ({ ...prev, ...forceOpen }));
    }
  }, [errors]);

  const togglePanel = (panel: keyof typeof openPanels) => {
    setOpenPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Helper: return 'input-error' class name when field has an error
  const err = (field: string) => errors.has(field) ? 'input-error' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleLanguageChange = (lang: 'jw' | 'id') => {
    onChange({ ...data, language: lang });
  };

  const handleMeninggalDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      const formatted = data.language === 'jw' ? formatWithPasaran(date) : formatStandard(date);
      onChange({ ...data, meninggalDinten: formatted });
    }
  };

  const handleMeninggalTimePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange({ ...data, meninggalWaktu: `${e.target.value} WIB` });
    }
  };

  const handlePemakamanDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      const formatted = data.language === 'jw' ? formatWithPasaran(date) : formatStandard(date);
      onChange({ ...data, pemakamanDinten: formatted });
    }
  };

  const handlePemakamanTimePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange({ ...data, pemakamanWaktu: `${e.target.value} WIB` });
    }
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      relation: ''
    };
    onChange({ ...data, keluarga: [...data.keluarga, newMember] });
  };

  const removeFamilyMember = (id: string) => {
    if (window.confirm('Hapus anggota keluarga ini?')) {
      onChange({ ...data, keluarga: data.keluarga.filter(member => member.id !== id) });
    }
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    onChange({
      ...data,
      keluarga: data.keluarga.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  const addReceiver = () => {
    const newReceiver: Receiver = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Takmir',
      address: 'Masjid'
    };
    onChange({ ...data, penerima: [...data.penerima, newReceiver] });
  };

  const removeReceiver = (id: string) => {
    if (window.confirm('Hapus penerima ini?')) {
      onChange({ ...data, penerima: data.penerima.filter(r => r.id !== id) });
    }
  };

  const updateReceiver = (id: string, field: keyof Receiver, value: string) => {
    onChange({
      ...data,
      penerima: data.penerima.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    });
  };

  return (
    <>
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
            <Languages size={18} /> Bahasa Konten PDF
          </div>
          <div className="lang-selector">
            <button 
              className={`lang-btn ${data.language === 'jw' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('jw')}
            >
              Jawa
            </button>
            <button 
              className={`lang-btn ${data.language === 'id' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('id')}
            >
              Indonesia
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="panel-header" onClick={() => togglePanel('almarhum')}>
          <h2>Data Almarhum/Almarhumah</h2>
          {openPanels.almarhum ? <ChevronDown size={20} color="#e2e8f0" /> : <ChevronRight size={20} color="#e2e8f0" />}
        </div>

        {openPanels.almarhum && (
          <div className="panel-content">
            <div className="form-group">
              <label>Nama Almarhum</label>
              <input
                type="text"
                name="namaAlmarhum"
                value={data.namaAlmarhum}
                onChange={handleChange}
                placeholder="Himmel"
                className={err('namaAlmarhum')}
              />
            </div>
            <div className="form-group">
              <label>Umur (Tahun)</label>
              <input
                type="number"
                name="umur"
                value={data.umur}
                onChange={handleChange}
                placeholder="76"
                className={err('umur')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel">
        <div className="panel-header" onClick={() => togglePanel('meninggal')}>
          <h2>Waktu & Tempat Meninggal</h2>
          {openPanels.meninggal ? <ChevronDown size={20} color="#e2e8f0" /> : <ChevronRight size={20} color="#e2e8f0" />}
        </div>

        {openPanels.meninggal && (
          <div className="panel-content">
            <div className="form-group flex-row">
              <div style={{ flex: 1 }}>
                <label>Hari, Tanggal</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="meninggalDinten"
                    value={data.meninggalDinten}
                    onChange={handleChange}
                    placeholder="Jumat Kliwon, 12 Agustus 2024"
                    className={err('meninggalDinten')}
                  />
                  <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--accent)', borderRadius: '8px', flexShrink: 0 }}>
                    <Calendar size={18} color="white" />
                    <input type="date" onChange={handleMeninggalDatePick} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0, padding: 0 }} title="Pilih Tanggal" />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group flex-row">
              <div style={{ flex: 1 }}>
                <label>Waktu (Jam)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="meninggalWaktu"
                    value={data.meninggalWaktu}
                    onChange={handleChange}
                    placeholder="09:00 WIB"
                    className={err('meninggalWaktu')}
                  />
                  <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--accent)', borderRadius: '8px', flexShrink: 0 }}>
                    <Clock size={18} color="white" />
                    <input type="time" onChange={handleMeninggalTimePick} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0, padding: 0 }} title="Pilih Waktu" />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Tempat Meninggal</label>
              <input
                type="text"
                name="meninggalAlamat"
                value={data.meninggalAlamat}
                onChange={handleChange}
                placeholder="RSUD Dr. Sardjito Yogyakarta"
                className={err('meninggalAlamat')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel">
        <div className="panel-header" onClick={() => togglePanel('pemakaman')}>
          <h2>Informasi Pemakaman</h2>
          {openPanels.pemakaman ? <ChevronDown size={20} color="#e2e8f0" /> : <ChevronRight size={20} color="#e2e8f0" />}
        </div>

        {openPanels.pemakaman && (
          <div className="panel-content">
            <div className="form-group flex-row">
              <div style={{ flex: 1 }}>
                <label>Hari, Tanggal</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="pemakamanDinten"
                    value={data.pemakamanDinten}
                    onChange={handleChange}
                    placeholder="Sabtu Legi, 13 Agustus 2024"
                    className={err('pemakamanDinten')}
                  />
                  <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--accent)', borderRadius: '8px', flexShrink: 0 }}>
                    <Calendar size={18} color="white" />
                    <input type="date" onChange={handlePemakamanDatePick} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0, padding: 0 }} title="Pilih Tanggal" />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group flex-row">
              <div style={{ flex: 1 }}>
                <label>Waktu Berangkat (Jam)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="pemakamanWaktu"
                    value={data.pemakamanWaktu}
                    onChange={handleChange}
                    placeholder="10:00 WIB"
                    className={err('pemakamanWaktu')}
                  />
                  <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--accent)', borderRadius: '8px', flexShrink: 0 }}>
                    <Clock size={18} color="white" />
                    <input type="time" defaultValue="14:00" onChange={handlePemakamanTimePick} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', left: 0, top: 0, padding: 0 }} title="Pilih Waktu" />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Alamat Rumah Duka</label>
              <input
                type="text"
                name="pemakamanRumahDuka"
                value={data.pemakamanRumahDuka}
                onChange={handleChange}
                placeholder="Jl. Prontera No. 12, Bantul"
                className={err('pemakamanRumahDuka')}
              />
            </div>
            <div className="form-group">
              <label>Alamat Makam</label>
              <input
                type="text"
                name="pemakamanMakam"
                value={data.pemakamanMakam}
                onChange={handleChange}
                placeholder="Sasonoloyo Prontera, Bantul"
                className={err('pemakamanMakam')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel">
        <div className="panel-header" onClick={() => togglePanel('keluarga')}>
          <h2 style={{ margin: 0 }}>Keluarga yang Ditinggalkan</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {openPanels.keluarga ? <ChevronDown size={20} color="#e2e8f0" /> : <ChevronRight size={20} color="#e2e8f0" />}
          </div>
        </div>

        {openPanels.keluarga && (
          <div className="panel-content">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }} onClick={addFamilyMember}>
                <Plus size={16} /> Tambah
              </button>
            </div>

            <datalist id="relations-list">
              <option value="Bapak" />
              <option value="Ibu" />
              <option value="Suami" />
              <option value="Istri" />
              <option value="Anak" />
              <option value="Menantu" />
              <option value="Anak/Menantu" />
              <option value="Cucu" />
              <option value="Kakak" />
              <option value="Adik" />
              <option value="Kakak/Ipar" />
              <option value="Adik/Ipar" />
              <option value="Saudara" />
              <option value="Keponakan" />
            </datalist>

            {data.keluarga.map((member, i) => (
              <div key={member.id} className="family-row">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                  placeholder={`Nama ${i + 1}`}
                />
                <input
                  type="text"
                  list="relations-list"
                  value={member.relation}
                  onChange={(e) => updateFamilyMember(member.id, 'relation', e.target.value)}
                  placeholder="Hubungan"
                />
                <button className="btn btn-danger" onClick={() => removeFamilyMember(member.id)} title="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel">
        <div className="panel-header" onClick={() => togglePanel('penerima')}>
          <h2 style={{ margin: 0 }}>Penerima Surat (Opsional)</h2>
          {openPanels.penerima ? <ChevronDown size={20} color="#e2e8f0" /> : <ChevronRight size={20} color="#e2e8f0" />}
        </div>

        {openPanels.penerima && (
          <div className="panel-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Jika diisi, PDF akan terbuat menjadi beberapa halaman per penerima.
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }} onClick={addReceiver}>
                <Plus size={16} /> Tambah
              </button>
            </div>

            {data.penerima.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                Dikosongi (halaman akan mencetak titik-titik untuk ditulis manual).
              </div>
            )}

            {data.penerima.map((member, i) => (
              <div key={member.id} className="family-row">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateReceiver(member.id, 'name', e.target.value)}
                  placeholder={`Bpk/Ibu/Sdr ${i + 1}`}
                />
                <input
                  type="text"
                  value={member.address}
                  onChange={(e) => updateReceiver(member.id, 'address', e.target.value)}
                  placeholder="Alamat/Di (opsional)"
                />
                <button className="btn btn-danger" onClick={() => removeReceiver(member.id)} title="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
