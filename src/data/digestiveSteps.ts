import * as THREE from 'three';
import { DigestiveStep, AccessoryOrganInfo, DigestiveStageId, AccessoryOrganId } from '../types';

export const DIGESTIVE_STEPS: DigestiveStep[] = [
  {
    id: 'mouth',
    index: 0,
    name: 'Mulut',
    latinName: 'Cavum Oris',
    description:
      'Pintu masuk utama makanan ke dalam tubuh. Di sini terjadi proses pencernaan mekanik dan kimiawi sekaligus.',
    function:
      'Makanan dikunyah menjadi bagian lebih kecil oleh gigi. Air liur membantu membasahi makanan dan mulai mencerna karbohidrat.',
    foodState: 'Bolus (Gumpalan makanan lembut yang siap ditelan)',
    durationNote: '± 10 - 60 Detik',
    keyEnzymes: ['Enzim Ptialin (Amilase Saliva)', 'Musin (Pelumas Saliva)'],
    processDetails: [
      'Gigi memotong dan melumat makanan secara mekanik.',
      'Lidah mengaduk dan membantu pembentukan bolus.',
      'Kelenjar ludah menyekresikan saliva untuk melarutkan makanan.',
      'Enzim ptialin mengubah amilum (karbohidrat kompleks) menjadi maltosa.',
    ],
    cameraPosition: [0, 3.8, 3.2],
    cameraTarget: [0, 3.4, 0.2],
    pathProgressRange: [0.0, 0.12],
    color: '#f87171', // soft coral red
    accentColor: '#fb7185',
    organ3DPosition: [0, 3.4, 0.3],
  },
  {
    id: 'esophagus',
    index: 1,
    name: 'Kerongkongan',
    latinName: 'Esofagus',
    description:
      'Saluran berotot sepanjang ±25 cm yang menghubungkan rongga mulut dengan lambung.',
    function:
      'Makanan bergerak menuju lambung melalui gerakan otot bergelombang yang disebut gerakan peristaltik.',
    foodState: 'Bolus yang didorong perlahan menuju sfingter kardia lambung',
    durationNote: '± 4 - 8 Detik',
    keyEnzymes: ['Lendir / Mukus (Pelumas dinding esofagus)'],
    processDetails: [
      'Epiglotis menutup tenggorokan saat menelan agar makanan tidak masuk ke saluran pernapasan.',
      'Otot sirkuler dan longitudinal berkontraksi secara ritmis (peristaltik).',
      'Tidak terjadi pencernaan kimiawi baru di organ ini.',
      'Sfingter esofagus bawah membuka untuk memasukkan bolus ke lambung.',
    ],
    cameraPosition: [0, 2.0, 3.8],
    cameraTarget: [0, 1.8, 0],
    pathProgressRange: [0.12, 0.28],
    color: '#fb923c', // soft orange
    accentColor: '#fdba74',
    organ3DPosition: [0, 1.8, 0],
  },
  {
    id: 'stomach',
    index: 2,
    name: 'Lambung',
    latinName: 'Ventrikulus',
    description:
      'Organ berbentuk kantung berotot tebal di sisi kiri rongga perut tempat pencernaan kimiawi intensif berlangsung.',
    function:
      'Makanan bercampur dengan asam lambung dan enzim. Gerakan otot lambung membantu menghancurkan dan mencampur makanan.',
    foodState: 'Kimus / Chyme (Cairan kental seperti bubur bersifat asam)',
    durationNote: '± 2 - 4 Jam',
    keyEnzymes: [
      'Asam Klorida (HCl - Membunuh kuman & mengaktifkan enzim)',
      'Pepsin (Memecah protein menjadi pepton)',
      'Renin (Menggumpalkan protein susu kasein)',
    ],
    processDetails: [
      'Dinding lambung berkontraksi kuat mengaduk makanan secara mekanik.',
      'HCl menciptakan kondisi asam ekstrem (pH 1.5 - 2.0).',
      'Pepsin memecah rantai ikatan protein menjadi peptida lebih pendek.',
      'Lapisan mukus tebal melindungi dinding lambung dari asam korosif.',
    ],
    cameraPosition: [-0.6, 0.2, 3.0],
    cameraTarget: [-0.3, 0.1, 0.1],
    pathProgressRange: [0.28, 0.48],
    color: '#e11d48', // ruby rose
    accentColor: '#f43f5e',
    organ3DPosition: [-0.35, 0.1, 0.15],
  },
  {
    id: 'smallIntestine',
    index: 3,
    name: 'Usus Halus',
    latinName: 'Intestinum Tenue',
    description:
      'Saluran terpanjang (±6 meter) yang terdiri dari Duodenum (12 jari), Jejunum (kosong), dan Ileum (penyerapan).',
    function:
      'Sebagian besar proses pencernaan kimiawi dan penyerapan nutrisi (karbohidrat, protein, lemak, vitamin) terjadi di usus halus.',
    foodState: 'Cairan nutrisi terlarut yang diserap kapiler dan pembuluh kil',
    durationNote: '± 3 - 5 Jam',
    keyEnzymes: [
      'Cairan Empedu (Emulsifikasi lemak dari hati)',
      'Amilase, Lipase, Tripsin (Dari pankreas)',
      'Maltase, Sukrase, Laktase, Peptidase (Dari dinding usus)',
    ],
    processDetails: [
      'Duodenum menetralkan asam kimus dengan bikarbonat dan getah empedu.',
      'Enzim pankreas dan usus memecah nutrisi menjadi molekul paling sederhana.',
      'Mikrovili (jonjot usus) memperluas area penyerapan hingga seukuran lapangan tenis.',
      'Nutrisi diserap ke aliran darah untuk diedarkan ke seluruh tubuh.',
    ],
    cameraPosition: [0, -1.2, 3.4],
    cameraTarget: [0, -1.2, 0.2],
    pathProgressRange: [0.48, 0.74],
    color: '#f59e0b', // amber gold
    accentColor: '#fbbf24',
    organ3DPosition: [0, -1.2, 0.2],
  },
  {
    id: 'largeIntestine',
    index: 4,
    name: 'Usus Besar',
    latinName: 'Kolon / Intestinum Crassum',
    description:
      'Saluran berdiameter lebih lebar berbentuk bingkai (kolon asenden, transversum, desenden, dan sigmoid).',
    function:
      'Air dan sebagian mineral diserap kembali ke tubuh. Sisa makanan dibusukkan oleh bakteri baik dan mulai membentuk feses.',
    foodState: 'Massa feses semi-padat yang telah kehilangan sebagian besar air',
    durationNote: '± 10 - 24 Jam',
    keyEnzymes: [
      'Bakteri Escherichia coli (Pembusukan & sintesis Vitamin K/B12)',
      'Mukus (Pelumas dinding kolon)',
    ],
    processDetails: [
      'Menyerap kembali kelebihan air dan elektrolit dari sisa pencernaan.',
      'Bakteri komensal memfermentasi sisa serat dan menghasilkan vitamin esensial.',
      'Gerakan massa mendorong sisa makanan secara berkala ke arah rektum.',
      'Feses dipadatkan menjadi bentuk padat teratur.',
    ],
    cameraPosition: [0, -1.0, 3.8],
    cameraTarget: [0, -1.0, 0.1],
    pathProgressRange: [0.74, 0.92],
    color: '#84cc16', // lime olive
    accentColor: '#a3e635',
    organ3DPosition: [0, -1.0, 0.05],
  },
  {
    id: 'rectum',
    index: 5,
    name: 'Rektum & Anus',
    latinName: 'Rektum & Anus',
    description:
      'Bagian akhir dari saluran pencernaan yang berfungsi sebagai tempat penampungan sementara dan saluran pengeluaran sisa makanan.',
    function:
      'Feses disimpan sementara di rektum sampai timbul rangsangan untuk dikeluarkan (defekasi) melalui anus.',
    foodState: 'Feses yang siap dikeluarkan dari tubuh',
    durationNote: 'Penyimpanan berkala',
    keyEnzymes: ['Tidak ada enzim pencernaan'],
    processDetails: [
      'Dinding rektum meregang saat terisi, memicu sinyal saraf ke otak (refleks defekasi).',
      'Sfingter internal (involunter) dan sfingter eksternal (volunter) mengatur penahanan dan pelepasan feses.',
      'Otot panggul bekerja sama mendorong feses keluar tubuh secara higienis.',
    ],
    cameraPosition: [0, -2.6, 2.8],
    cameraTarget: [0, -2.6, 0],
    pathProgressRange: [0.92, 1.0],
    color: '#06b6d4', // cyan
    accentColor: '#22d3ee',
    organ3DPosition: [0, -2.6, 0.05],
  },
];

export const ACCESSORY_ORGANS: AccessoryOrganInfo[] = [
  {
    id: 'liver',
    name: 'Hati',
    latinName: 'Hepar',
    role: 'Organ Aksesori Utama',
    description:
      'Kelenjar terbesar dalam tubuh manusia yang terletak di bagian kanan atas rongga perut di bawah diafragma.',
    function:
      'Memproduksi cairan empedu untuk mencerna lemak, menyaring racun dari darah, dan menyimpan glukosa dalam bentuk glikogen.',
    secretion: 'Cairan Empedu (Bile Salt) ± 600 - 1000 mL per hari',
    color: '#b91c1c', // deep rich red-brown
    cameraPosition: [1.2, 0.6, 2.8],
    cameraTarget: [0.65, 0.45, 0.15],
    organ3DPosition: [0.65, 0.45, 0.2],
  },
  {
    id: 'gallbladder',
    name: 'Kantong Empedu',
    latinName: 'Vesica Fellea',
    role: 'Penyimpan Getah Empedu',
    description:
      'Organ kecil berbentuk buah pir yang menempel di bawah lobus kanan hati.',
    function:
      'Menampung, memekatkan, dan melepaskan cairan empedu ke duodenum saat makanan berlemak masuk ke usus halus.',
    secretion: 'Getah empedu terkonsentrasi yang dialirkan melalui duktus koledokus',
    color: '#10b981', // emerald green
    cameraPosition: [0.9, 0.1, 2.5],
    cameraTarget: [0.4, 0.08, 0.3],
    organ3DPosition: [0.42, 0.08, 0.32],
  },
  {
    id: 'pancreas',
    name: 'Pankreas',
    latinName: 'Pancreas',
    role: 'Kelenjar Eksokrin & Endokrin',
    description:
      'Kelenjar memanjang berbentuk daun pipih yang terletak di belakang lambung dan berdekatan dengan lengkungan duodenum.',
    function:
      'Menghasilkan enzim pencernaan kunci (amilase, tripsin, lipase) dan natrium bikarbonat untuk menetralkan asam lambung di usus.',
    secretion: 'Getah Pankreas (Bikarbonat + Enzim Lipase, Amilase, Protease)',
    color: '#f59e0b', // amber yellow
    cameraPosition: [-0.2, -0.2, 2.8],
    cameraTarget: [-0.05, -0.25, -0.05],
    organ3DPosition: [-0.05, -0.25, -0.05],
  },
];

// Continuous 3D Catmull-Rom Curve control points for the digestive journey
// Smooth progression from mouth down to rectum
export const DIGESTIVE_PATH_POINTS: [number, number, number][] = [
  // 1. Mouth (Cavum Oris) [Progress ~ 0.00 to 0.12]
  [0.0, 3.45, 0.42], // Front of mouth
  [0.0, 3.38, 0.25], // Center of mouth
  [0.0, 3.25, 0.05], // Back of mouth / Pharynx
  [0.0, 3.0, -0.05], // Epiglottis junction

  // 2. Esophagus (Esofagus) [Progress ~ 0.12 to 0.28]
  [0.0, 2.65, -0.05],
  [0.02, 2.2, -0.05],
  [0.0, 1.7, -0.04],
  [-0.05, 1.2, -0.02],
  [-0.15, 0.75, 0.05], // Approaching cardiac sphincter

  // 3. Stomach (Ventrikulus) - Curves along greater curvature [Progress ~ 0.28 to 0.48]
  [-0.32, 0.55, 0.12], // Fundus
  [-0.58, 0.35, 0.18], // Body left curve
  [-0.65, 0.05, 0.22], // Greater curvature apex
  [-0.52, -0.2, 0.2], // Antrum
  [-0.25, -0.32, 0.15], // Pyloric canal
  [-0.05, -0.35, 0.1], // Pyloric sphincter

  // 4. Small Intestine (Intestinum Tenue) - Loops inside abdomen [Progress ~ 0.48 to 0.74]
  [0.15, -0.38, 0.12], // Duodenum C-loop start
  [0.32, -0.55, 0.15], // Duodenum descending
  [0.2, -0.75, 0.18], // Duodenum horizontal
  [-0.1, -0.78, 0.2], // Duodenojejunal flexure
  [-0.38, -0.95, 0.26], // Jejunum loop 1
  [-0.15, -1.15, 0.28], // Jejunum loop 2
  [0.25, -1.05, 0.28], // Jejunum loop 3
  [0.38, -1.3, 0.25], // Ileum loop 1
  [0.05, -1.45, 0.28], // Ileum loop 2
  [-0.28, -1.55, 0.25], // Ileum loop 3
  [0.12, -1.72, 0.24], // Ileum loop 4
  [0.55, -1.82, 0.2], // Ileocecal junction (approaching cecum on right)

  // 5. Large Intestine (Kolon) - Frames the periphery [Progress ~ 0.74 to 0.92]
  [0.72, -1.88, 0.15], // Cecum
  [0.78, -1.5, 0.12], // Ascending colon lower
  [0.8, -1.0, 0.08], // Ascending colon middle
  [0.75, -0.55, 0.08], // Hepatic flexure (right colic flexure)
  [0.4, -0.52, 0.12], // Transverse colon right
  [0.0, -0.58, 0.15], // Transverse colon center dip
  [-0.45, -0.52, 0.12], // Transverse colon left
  [-0.78, -0.55, 0.08], // Splenic flexure (left colic flexure)
  [-0.8, -1.0, 0.08], // Descending colon middle
  [-0.75, -1.5, 0.1], // Descending colon lower
  [-0.65, -1.85, 0.12], // Iliac crest
  [-0.4, -2.05, 0.08], // Sigmoid loop start
  [-0.15, -2.18, 0.05], // Sigmoid loop apex
  [0.0, -2.35, 0.02], // Rectosigmoid junction

  // 6. Rectum & Anus [Progress ~ 0.92 to 1.00]
  [0.0, -2.55, -0.02], // Upper rectum
  [0.0, -2.85, -0.02], // Rectal ampulla
  [0.0, -3.15, -0.01], // Anal canal / exit
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
  return step ? step.pathProgressRange[0] + 0.01 : 0;
}
