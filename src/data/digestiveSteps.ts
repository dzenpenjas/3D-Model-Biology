import * as THREE from 'three';
import { DigestiveStep, AccessoryOrganInfo, DigestiveStageId, AccessoryOrganId } from '../types';

export const DIGESTIVE_STEPS: DigestiveStep[] = [
  {
    id: 'mouth',
    index: 0,
    name: 'Mulut',
    latinName: 'Cavum Oris',
    description:
      'Pintu gerbang utama sistem pencernaan manusia. Di dalam rongga mulut terjadi proses pencernaan mekanik (oleh gigi dan lidah) serta pencernaan kimiawi pertama (oleh saliva/air liur).',
    function:
      'Mengunyah makanan menjadi partikel lebih kecil, membasahinya dengan saliva, dan memulai pemecahan karbohidrat menjadi molekul gula sederhana sebelum ditelan.',
    foodState: 'Bolus (Gumpalan makanan halus & licin berbentuk bulat lonjong)',
    durationNote: '± 10 - 60 Detik',
    keyEnzymes: [
      'Enzim Ptialin / Amilase Saliva (Memecah amilum jadi maltosa)',
      'Musin / Mukus (Glikoprotein pelumas & pelindung mukosa)',
      'Lisozim (Antibakteri alami dalam air liur)',
    ],
    processDetails: [
      'Pencernaan Mekanik: Gigi seri memotong, gigi taring merobek, dan gigi geraham menggilas makanan menjadi partikel halus.',
      'Peran Lidah: Mengaduk makanan, merasakan cita rasa (papila gustatori), dan mendorong bolus ke faring.',
      'Sekresi Kelenjar Saliva: Kelenjar parotis, submandibularis, dan sublingualis memproduksi ±1.5 liter saliva per hari.',
      'Pencernaan Kimiawi: Ptialin bekerja optimal pada pH netral (6.8–7.0) mengubah karbohidrat kompleks menjadi maltosa.',
    ],
    cameraPosition: [0, 3.6, 2.8],
    cameraTarget: [0, 3.35, 0.15],
    pathProgressRange: [0.0, 0.12],
    color: '#f87171',
    accentColor: '#fb7185',
    organ3DPosition: [0, 3.4, 0.2],
  },
  {
    id: 'esophagus',
    index: 1,
    name: 'Kerongkongan',
    latinName: 'Esofagus',
    description:
      'Saluran tabung berotot sepanjang ±25 cm berdiameter ±2 cm yang menghubungkan rongga faring di leher dengan lambung di rongga dada-perut.',
    function:
      'Menghantarkan bolus makanan menuju lambung melalui gerakan gelombang kontraksi otot polos sirkuler dan longitudinal yang disebut gerak peristaltik.',
    foodState: 'Bolus yang didorong berirama menuju sfingter esofagus bawah',
    durationNote: '± 4 - 8 Detik',
    keyEnzymes: [
      'Mukus / Lendir Esofagus (Pelumas dinding saluran tanpa enzim pencernaan baru)',
    ],
    processDetails: [
      'Refleks Menelan: Epiglotis otomatis menutup trakea (tenggorokan) sehingga makanan aman meluncur ke esofagus tanpa tersedak.',
      'Gerakan Peristaltik: Otot sirkuler di belakang bolus berkontraksi menyempit, sementara otot di depan bolus berelaksasi melebar.',
      'Sifat Saluran: Tidak ada penyerapan nutrisi atau sekresi enzim pemecah baru di organ ini.',
      'Sfingter Kardia / LES: Cincin otot di ujung esofagus membuka sejenak untuk meloloskan bolus masuk ke lambung, lalu menutup rapat mencegah asam lambung naik (refluks).',
    ],
    cameraPosition: [0, 2.0, 3.2],
    cameraTarget: [0, 1.85, 0.0],
    pathProgressRange: [0.12, 0.28],
    color: '#fb923c',
    accentColor: '#fdba74',
    organ3DPosition: [0, 1.85, 0],
  },
  {
    id: 'stomach',
    index: 2,
    name: 'Lambung',
    latinName: 'Ventrikulus / Gaster',
    description:
      'Organ berongga berbentuk huruf J elastis yang terletak di kuadran kiri atas abdomen. Memiliki dinding berotot 3 lapis (longitudinal, sirkuler, oblik) dengan kapasitas 1.5–2 liter.',
    function:
      'Menampung makanan, mencampur bolus dengan getah lambung (asam klorida & enzim) melalui kontraksi mekanik kuat, dan mengubahnya menjadi cairan kental asam (kimus/chyme).',
    foodState: 'Kimus / Chyme (Bubur kental semi-cair bersifat sangat asam, pH 1.5 - 2.0)',
    durationNote: '± 2 - 4 Jam',
    keyEnzymes: [
      'Asam Klorida (HCl - pH 1.5-2: membunuh patogen & aktivasi pepsinogen)',
      'Pepsin (Memecah protein kompleks jadi peptida/pepton)',
      'Renin (Menggumpalkan kasein susu pada bayi)',
      'Lipase Gastrik (Memecah trigliserida rantai pendek dalam jumlah kecil)',
    ],
    processDetails: [
      'Pencernaan Mekanik (Churning): 3 lapisan otot dinding lambung memeras, mengocok, dan menggiling bolus menjadi partikel mikro.',
      'Aktivasi Kimiawi: Sel parietal menyekresi HCl yang mengubah pepsinogen inaktif menjadi enzim pepsin aktif.',
      'Perlindungan Mukosa: Sel goblet menghasilkan lapisan mukus bikarbonat tebal guna melindungi dinding lambung dari korosi asam sendiri.',
      'Pengeluaran Terkontrol: Sfingter pilorus membuka bertahap menyemprotkan kimus per mililiter ke dalam duodenum usus halus.',
    ],
    cameraPosition: [-0.6, 0.15, 2.8],
    cameraTarget: [-0.28, 0.05, 0.12],
    pathProgressRange: [0.28, 0.48],
    color: '#e11d48',
    accentColor: '#f43f5e',
    organ3DPosition: [-0.3, 0.05, 0.12],
  },
  {
    id: 'smallIntestine',
    index: 3,
    name: 'Usus Halus',
    latinName: 'Intestinum Tenue',
    description:
      'Saluran pencernaan terpanjang (±6 meter) dengan lipatan jonjot usus (vili & mikrovili) yang memperluas area penyerapan hingga ±250 m² (setara lapangan tenis). Terdiri dari Duodenum (12 jari), Jejunum (kosong), dan Ileum (penyerapan).',
    function:
      'Tempat terjadinya puncak pencernaan kimiawi serta penyerapan lebih dari 90% seluruh nutrisi (glukosa, asam amino, asam lemak, vitamin, dan mineral) ke pembuluh darah dan limfa.',
    foodState: 'Cairan sari makanan terlarut; makronutrien dipecah jadi monomer yang siap diserap kapiler',
    durationNote: '± 3 - 5 Jam',
    keyEnzymes: [
      'Getah Empedu dari Hati: Mengemulsi lemak menjadi tetesan kecil',
      'Tripsin, Kimotripsin, Karboksipeptidase (Pankreas): Memecah peptida jadi asam amino',
      'Amilase Pankreas: Memecah sisa amilum jadi maltosa',
      'Lipase Pankreas: Memecah lemak jadi asam lemak & gliserol',
      'Maltase, Sukrase, Laktase (Dinding Usus): Memecah disakarida jadi monosakarida',
      'Peptidase & Enterokinase (Dinding Usus): Pemecahan protein tahap akhir',
    ],
    processDetails: [
      'Netralisasi Asam: Duodenum menerima bikarbonat dari pankreas untuk menaikkan pH kimus dari asam (2) menjadi basa ramah enzim (7.5-8.0).',
      'Pencernaan Komprehensif: Emulsi empedu + enzim pankreas + enzim usus menuntaskan pemecahan karbohidrat, protein, dan lemak.',
      'Penyerapan Vili: Glukosa, asam amino, vitamin B & C diserap pembuluh darah kapiler menuju vena porta hepatika ke hati.',
      'Penyerapan Lemak: Asam lemak & gliserol diserap oleh pembuluh kil (lakteal/limfa) bersama vitamin larut lemak (A, D, E, K).',
    ],
    cameraPosition: [0, -1.15, 3.2],
    cameraTarget: [0, -1.15, 0.18],
    pathProgressRange: [0.48, 0.74],
    color: '#f59e0b',
    accentColor: '#fbbf24',
    organ3DPosition: [0, -1.15, 0.18],
  },
  {
    id: 'largeIntestine',
    index: 4,
    name: 'Usus Besar',
    latinName: 'Intestinum Crassum / Kolon',
    description:
      'Saluran berdiameter ±6.5 cm sepanjang ±1.5 meter yang membingkai rongga perut, terdiri dari Sekum (+ Apendiks), Kolon Asenden (naik), Kolon Transversum (mendatar), Kolon Desenden (turun), dan Kolon Sigmoid (huruf S).',
    function:
      'Menyerap kembali kelebihan air (±1.5-2 liter/hari) dan elektrolit dari sisa pencernaan, membusukkan ampas makanan dengan bantuan bakteri komensal, serta membentuk massa feses padat.',
    foodState: 'Massa feses semi-padat yang mengalami pemadatan & fermentasi serat',
    durationNote: '± 10 - 24 Jam',
    keyEnzymes: [
      'Bakteri Probiotik / Escherichia coli (Fermentasi sisa serat & sintesis Vitamin K dan Vitamin B12)',
      'Mukus Kolon (Pelumas dinding usus untuk melancarkan lintasan feses padat)',
    ],
    processDetails: [
      'Reabsorpsi Air & Garam: Air dan natrium diserap kembali secara efisien ke pembuluh darah untuk menjaga hidrasi tubuh.',
      'Aktivitas Mikrobioma: Bakteri usus memfermentasi sisa serat tak tercerna menghasilkan gas dan asam lemak rantai pendek (SCFA).',
      'Pembentukan Feses: Ampas makanan yang terdiri dari serat mati, sel epitel rontok, bakteri, dan pigmen empedu (sterkobilin penentu warna cokelat) dipadatkan.',
      'Gerakan Massa (Mass Movement): Kontraksi peristaltik kuat 2-3 kali sehari mendorong feses dari kolon transversum menuju sigmoid dan rektum.',
    ],
    cameraPosition: [0, -1.05, 3.5],
    cameraTarget: [0, -1.05, 0.1],
    pathProgressRange: [0.74, 0.92],
    color: '#84cc16',
    accentColor: '#a3e635',
    organ3DPosition: [0, -1.05, 0.08],
  },
  {
    id: 'rectum',
    index: 5,
    name: 'Rektum & Anus',
    latinName: 'Rektum & Kanalis Analis',
    description:
      'Segmen terminal saluran pencernaan sepanjang ±12-15 cm yang berakhir di lubang luar anus. Memiliki ampula rektum sebagai kantung penampung dan dua cincin sfingter pengatur pengeluaran.',
    function:
      'Menampung feses sementara waktu hingga volume mencukupi untuk memicu refleks buang air besar (defekasi), kemudian mengeluarkannya secara teratur dan higienis.',
    foodState: 'Feses padat teratur yang siap dikeluarkan dari tubuh melalui lubang anus',
    durationNote: 'Penyimpanan periodik',
    keyEnzymes: [
      'Tidak ada enzim pencernaan (Murni fungsi ekskresi mekanik)',
    ],
    processDetails: [
      'Peregangan Ampula: Ketika dinding ampula rektum terisi feses, reseptor regang mengirim impuls ke medula spinalis.',
      'Refleks Defekasi: Otot dinding rektum berkontraksi, sfingter ani internus (otot polos involunter) otomatis berelaksasi terbuka.',
      'Kontrol Sadar: Sfingter ani eksternus (otot lurik volunter) dapat ditahan secara sadar oleh otak sampai waktu yang tepat tiba.',
      'Pengeluaran: Tekanan intra-abdomen dibantu diafragma dan otot perut (manuver Valsalva) mendorong feses keluar secara tuntas.',
    ],
    cameraPosition: [0, -2.65, 2.6],
    cameraTarget: [0, -2.75, 0.0],
    pathProgressRange: [0.92, 1.0],
    color: '#06b6d4',
    accentColor: '#22d3ee',
    organ3DPosition: [0, -2.75, 0.0],
  },
];

export const ACCESSORY_ORGANS: AccessoryOrganInfo[] = [
  {
    id: 'liver',
    name: 'Hati',
    latinName: 'Hepar',
    role: 'Kelenjar Metabolisme Utama',
    description:
      'Kelenjar terbesar dalam tubuh manusia (±1.5 kg) yang menempati kuadran kanan atas abdomen di bawah diafragma. Terdiri dari lobus kanan besar dan lobus kiri.',
    function:
      'Memproduksi getah empedu secara terus-menerus untuk mencerna lemak, memproses dan menyimpan nutrisi dari vena porta hepatika, menetralkan racun (detoksifikasi), serta menyimpan glikogen dan vitamin.',
    secretion: 'Getah Empedu (Bile Salt) ± 800 - 1000 mL / hari untuk emulsifikasi lemak',
    color: '#b91c1c',
    cameraPosition: [1.1, 0.55, 2.6],
    cameraTarget: [0.55, 0.42, 0.15],
    organ3DPosition: [0.55, 0.42, 0.15],
  },
  {
    id: 'gallbladder',
    name: 'Kantong Empedu',
    latinName: 'Vesica Fellea',
    role: 'Penyimpan & Pemekat Getah Empedu',
    description:
      'Organ kecil berongga berbentuk buah pir sepanjang ±7-10 cm yang melekat erat di lekukan permukaan bawah lobus kanan hati.',
    function:
      'Menampung getah empedu dari hati, memekatkannya hingga 5-10 kali lipat dengan menyerap air, dan mengontraksikan diri melepaskan empedu melalui duktus koledokus ke duodenum saat makanan berlemak tiba.',
    secretion: 'Getah empedu terkonsentrasi yang kaya garam empedu, bilirubin, dan kolesterol',
    color: '#10b981',
    cameraPosition: [0.85, 0.1, 2.3],
    cameraTarget: [0.38, 0.1, 0.28],
    organ3DPosition: [0.38, 0.1, 0.28],
  },
  {
    id: 'pancreas',
    name: 'Pankreas',
    latinName: 'Pancreas',
    role: 'Kelenjar Eksokrin & Endokrin Kunci',
    description:
      'Kelenjar memanjang berbentuk pipih (seperti lidah/daun) sepanjang ±15 cm yang terletak melintang di belakang lambung dengan kepala dilingkari lengkungan C duodenum.',
    function:
      'Fungsi Eksokrin: Menghasilkan getah pankreas kaya natrium bikarbonat (menetralkan asam lambung) dan enzim pencernaan utama (amilase, tripsin, lipase). Fungsi Endokrin: Memproduksi hormon insulin dan glukagon pengatur gula darah.',
    secretion: 'Getah Pankreas (Bikarbonat cair + Amilase, Tripsinogen, Lipase, Nuklease)',
    color: '#f59e0b',
    cameraPosition: [-0.15, -0.2, 2.5],
    cameraTarget: [-0.05, -0.25, 0.02],
    organ3DPosition: [-0.05, -0.25, 0.02],
  },
];

// Continuous 3D Catmull-Rom Curve control points for the digestive journey
// Aligned with the physical 3D procedural geometries of the digestive tract
export const DIGESTIVE_PATH_POINTS: [number, number, number][] = [
  // 1. Mouth (Cavum Oris) [Progress ~ 0.00 to 0.12]
  [0.0, 3.42, 0.38], // Front lips
  [0.0, 3.36, 0.22], // Center tongue / oral cavity
  [0.0, 3.22, 0.06], // Back pharynx
  [0.0, 2.95, -0.04], // Epiglottis junction

  // 2. Esophagus (Esofagus) [Progress ~ 0.12 to 0.28]
  [0.0, 2.6, -0.04],
  [0.01, 2.15, -0.04],
  [0.0, 1.68, -0.03],
  [-0.04, 1.2, -0.01],
  [-0.14, 0.72, 0.06], // Cardiac sphincter inlet

  // 3. Stomach (Ventrikulus) - Curves along greater curvature [Progress ~ 0.28 to 0.48]
  [-0.28, 0.52, 0.12], // Upper Fundus
  [-0.52, 0.32, 0.18], // Body left curve
  [-0.6, 0.04, 0.22], // Greater curvature apex
  [-0.48, -0.22, 0.18], // Antrum
  [-0.24, -0.32, 0.14], // Pyloric canal
  [-0.05, -0.35, 0.1], // Pyloric sphincter

  // 4. Small Intestine (Intestinum Tenue) - Loops inside abdomen [Progress ~ 0.48 to 0.74]
  [0.16, -0.37, 0.12], // Duodenum C-loop top
  [0.34, -0.52, 0.14], // Duodenum right descending
  [0.22, -0.72, 0.16], // Duodenum bottom horizontal
  [-0.1, -0.76, 0.18], // Duodenojejunal flexure
  [-0.36, -0.92, 0.24], // Jejunum loop 1
  [-0.14, -1.12, 0.26], // Jejunum loop 2
  [0.24, -1.02, 0.26], // Jejunum loop 3
  [0.38, -1.26, 0.23], // Ileum loop 1
  [0.06, -1.42, 0.26], // Ileum loop 2
  [-0.26, -1.52, 0.23], // Ileum loop 3
  [0.1, -1.68, 0.22], // Ileum loop 4
  [0.54, -1.8, 0.18], // Ileocecal junction (enters cecum)

  // 5. Large Intestine (Kolon) - Frames the periphery [Progress ~ 0.74 to 0.92]
  [0.72, -1.86, 0.14], // Cecum
  [0.78, -1.46, 0.11], // Ascending colon lower
  [0.8, -0.96, 0.08], // Ascending colon middle
  [0.74, -0.54, 0.08], // Hepatic flexure (right colic angle)
  [0.38, -0.5, 0.12], // Transverse colon right
  [0.0, -0.56, 0.14], // Transverse colon center
  [-0.42, -0.5, 0.12], // Transverse colon left
  [-0.75, -0.54, 0.08], // Splenic flexure (left colic angle)
  [-0.78, -0.96, 0.08], // Descending colon middle
  [-0.74, -1.46, 0.1], // Descending colon lower
  [-0.64, -1.82, 0.11], // Iliac crest
  [-0.38, -2.04, 0.07], // Sigmoid loop start
  [-0.14, -2.16, 0.04], // Sigmoid loop apex
  [0.0, -2.32, 0.02], // Rectosigmoid junction

  // 6. Rectum & Anus [Progress ~ 0.92 to 1.00]
  [0.0, -2.52, -0.01], // Upper rectum
  [0.0, -2.78, -0.02], // Rectal ampulla
  [0.0, -3.12, 0.0], // Anal canal / exit
];

export const digestiveCurve = new THREE.CatmullRomCurve3(
  DIGESTIVE_PATH_POINTS.map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2])),
  false,
  'centripetal',
  0.5
);

export function getStageFromProgress(progress: number): DigestiveStageId {
  const clamped = Math.max(0, Math.min(1, progress));
  for (const step of DIGESTIVE_STEPS) {
    if (clamped >= step.pathProgressRange[0] && clamped <= step.pathProgressRange[1]) {
      return step.id;
    }
  }
  return 'rectum';
}

export function getProgressFromStage(stageId: DigestiveStageId): number {
  const step = DIGESTIVE_STEPS.find((s) => s.id === stageId);
  return step ? step.pathProgressRange[0] + 0.005 : 0;
}
