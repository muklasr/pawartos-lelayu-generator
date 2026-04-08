export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
}

export interface Receiver {
  id: string;
  name: string;
  address: string;
}

export interface ObituaryData {
  language: 'jw' | 'id';
  namaAlmarhum: string;
  umur: string;

  meninggalDinten: string;
  meninggalWaktu: string;
  meninggalAlamat: string;

  pemakamanDinten: string;
  pemakamanWaktu: string;
  pemakamanRumahDuka: string;
  pemakamanMakam: string;

  keluarga: FamilyMember[];
  penerima: Receiver[];
}

export const getPasaran = (d: Date): string => {
  const pasaranArr = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"];
  const dLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const epochLocal = new Date(2000, 0, 1);
  const diffDays = Math.round((dLocal.getTime() - epochLocal.getTime()) / 86400000);
  const index = ((diffDays % 5) + 5) % 5;
  return pasaranArr[index];
};

export const formatWithPasaran = (d: Date): string => {
  const dayName = d.toLocaleDateString('id-ID', { weekday: 'long' });
  const dateRest = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const pasaran = getPasaran(d);
  return `${dayName} ${pasaran}, ${dateRest}`;
};

export const formatStandard = (d: Date): string => {
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const getDefaultObituaryData = (): ObituaryData => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    language: 'jw',
    namaAlmarhum: '',
    umur: '',

    meninggalDinten: formatWithPasaran(today),
    meninggalWaktu: '',
    meninggalAlamat: '',

    pemakamanDinten: formatWithPasaran(tomorrow),
    pemakamanWaktu: '14:00 WIB',
    pemakamanRumahDuka: '',
    pemakamanMakam: '',

    keluarga: [],
    penerima: []
  };
};
