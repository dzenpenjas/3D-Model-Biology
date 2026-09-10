import * as THREE from 'three';
import { DigestiveStep, AccessoryOrganInfo, DigestiveStageId } from '../types';

export const DIGESTIVE_STEPS: DigestiveStep[] = [
  {
    id: 'mouth',
    index: 0,
    name: 'Mulut',
    latinName: 'Cavum Oris & Faring',
    mainFunction: 'Menghancurkan makanan secara mekanik dan membasahinya dengan saliva untuk mempermudah penelanan.',
    foodAction: 'Mengubah makanan padat menjadi bolus licin yang siap didorong melewati faring menuju esofagus.',
    keyFact: 'Pencernaan kimiawi karbohidrat pertama kali dimulai di mulut oleh enzim amilase saliva.',
    description:
      'Pintu gerbang utama saluran pencernaan manusia yang terdiri dari rongga mulut, gigi, lidah, kelenjar saliva, serta saluran faring sebagai jalur penelanan.',
    function:
      'Mengunyah makanan menjadi partikel lebih kecil, membasahi dengan saliva, dan memulai pemecahan pati sebelum bolus didorong melewati faring ke esofagus.',
    foodState: 'Bolus (Gumpalan makanan lembut & licin)',
    durationNote: '± 10 - 60 Detik',
    keyEnzymes: [
      'Amilase Saliva / Ptialin (Mulai memecah pati menjadi maltosa dan oligosakarida yang lebih kecil)',
      'Mukus / Musin (Glikoprotein pelumas pelindung mukosa)',
      'Lisozim (Zat antibakteri alami dalam saliva)',
    ],
    processDetails: [
      'Pencernaan Mekanik: Gigi seri memotong, gigi taring merobek, dan gigi geraham menggilas makanan menjadi partikel halus.',
      'Peran Lidah: Mengaduk makanan, mengecap rasa, dan mendorong bolus ke belakang menuju faring.',
      'Sekresi Saliva: Kelenjar parotis, submandibularis, dan sublingualis memproduksi saliva untuk membasahi makanan.',
      'Refleks Menelan di Faring: Bolus meluncur melewati faring, sementara epiglotis menutup saluran napas agar tidak tersedak.',
    ],
    cameraPosition: [0, 3.4, 2.5],
    cameraTarget: [0, 3.3, 0.1],
    pathProgressRange: [0.0, 0.12],
    color: '#f87171',
    accentColor: '#fb7185',
    organ3DPosition: [0, 3.38, 0.18],
  },
  {
    id: 'esophagus',
    index: 1,
    name: 'Kerongkongan',
    latinName: 'Esofagus',
    mainFunction: 'Menyalurkan bolus makanan dari rongga faring menuju lambung.',
    foodAction: 'Bolus didorong ke bawah melalui kontraksi gelombang otot polos (gerak peristaltik).',
    keyFact: 'Di esofagus tidak terjadi pencernaan kimiawi baru maupun penyerapan nutrisi.',
    description:
      'Saluran tabung berotot elastis sepanjang ±25 cm yang menghubungkan bagian bawah faring di leher dengan kardia lambung di rongga abdomen.',
    function:
      'Menghantarkan bolus makanan ke lambung melalui gelombang kontraksi teratur otot sirkuler dan longitudinal (gerak peristaltik).',
    foodState: 'Bolus yang didorong berirama menuju lambung',
    durationNote: '± 4 - 8 Detik',
    keyEnzymes: [
      'Mukus / Lendir Esofagus (Pelumas dinding saluran tanpa enzim pencernaan baru)',
    ],
    processDetails: [
      'Relaksasi Sfingter Atas: Sfingter esofagus atas membuka sejenak untuk menerima bolus dari faring.',
      'Gelombang Peristaltik: Otot polos berkontraksi tepat di belakang bolus dan berelaksasi di depannya, mendorong bolus meluncur ke bawah.',
      'Sifat Saluran: Dinding esofagus dilapisi epitel berlapis pipih tebal yang tahan gesekan saat bolus lewat.',
      'Sfingter Kardia (LES): Cincin otot di ujung bawah membuka memasukkan bolus ke lambung lalu menutup rapat mencegah asam lambung naik (refluks).',
    ],
    cameraPosition: [0, 2.0, 2.9],
    cameraTarget: [0, 1.8, 0.0],
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
    mainFunction: 'Mencerna makanan secara mekanik (churning) dan kimiawi dengan getah lambung.',
    foodAction: 'Bolus dipecah dan diaduk menjadi cairan asam kental yang disebut kimus (chyme).',
    keyFact: 'Lapisan mukus tebal melindungi dinding lambung dari korosi asam klorida (HCl).',
    description:
      'Organ berongga berbentuk huruf J di kuadran kiri atas abdomen dengan tiga lapisan otot dinding yang tebal dan mukosa berlipat (rugae).',
    function:
      'Menampung makanan, mencampur bolus dengan getah lambung melalui kontraksi mekanik kuat, serta mengubahnya menjadi kimus (chyme).',
    foodState: 'Kimus / Chyme (Cairan kental semi-cair bersifat asam)',
    durationNote: '± 2 - 4 Jam',
    keyEnzymes: [
      'Asam Klorida (HCl - Membantu menciptakan lingkungan asam dan mengaktifkan pepsin)',
      'Pepsin (Memecah protein kompleks menjadi rantai peptida lebih pendek)',
      'Mukus Lambung (Lapisan bikarbonat pelindung dinding dari asam lambung)',
      'Kimosin / Chymosin (Menggumpalkan kasein susu pada bayi - info tambahan)',
    ],
    processDetails: [
      'Pencernaan Mekanik (Churning): Kontraksi tiga lapis otot lambung meremas dan mengaduk bolus secara berkala.',
      'Lingkungan Asam: Sel parietal menyekresi HCl. pH lambung sangat asam dan berubah tergantung kondisi serta isi lambung.',
      'Aktivasi Pepsin: Pepsinogen inaktif diubah oleh HCl menjadi enzim pepsin aktif untuk memulai pencernaan protein.',
      'Pengeluaran Teratur: Sfingter pilorus membuka sedikit demi sedikit mengalirkan kimus ke duodenum usus halus.',
    ],
    cameraPosition: [-0.4, 0.2, 2.7],
    cameraTarget: [-0.2, 0.1, 0.1],
    pathProgressRange: [0.28, 0.48],
    color: '#e11d48',
    accentColor: '#f43f5e',
    organ3DPosition: [-0.3, 0.05, 0.12],
  },
  {
    id: 'smallIntestine',
    index: 3,
    name: 'Usus Halus',
    latinName: 'Intestinum Tenue (Duodenum, Jejunum, Ileum)',
    mainFunction: 'Menuntaskan pencernaan kimiawi dan menyerap lebih dari 90% seluruh nutrisi ke tubuh.',
    foodAction: 'Kimus dipecah menjadi monomer nutrisi (glukosa, asam amino, asam lemak) yang diserap vili usus.',
    keyFact: 'Permukaan jonjot vili dan mikrovili memperluas area penyerapan usus halus hingga seluas lapangan tenis.',
    description:
      'Saluran berkelok sepanjang ±6 meter yang terdiri dari Duodenum (usus 12 jari), Jejunum (usus kosong), dan Ileum (usus penyerapan).',
    function:
      'Melakukan pencernaan kimiawi intensif dengan bantuan getah empedu dan enzim pankreas, lalu menyerap sari makanan ke peredaran darah dan limfa.',
    foodState: 'Sari Makanan (Nutrisi terlarut siap diserap)',
    durationNote: '± 3 - 5 Jam',
    keyEnzymes: [
      'Getah Empedu (Dari hati/kantong empedu: mengemulsi lemak)',
      'Enzim Pankreas (Amilase, Tripsin, Lipase pankreas, dan Bikarbonat penetral asam)',
      'Enzim Dinding Usus (Maltase, Sukrase, Laktase, Peptidase, Enterokinase)',
    ],
    processDetails: [
      'Pencernaan Duodenum: Menerima bikarbonat penetral asam dari pankreas serta cairan empedu dari hati untuk emulsi lemak.',
      'Penyerapan Karbohidrat & Protein: Glukosa dan asam amino diserap sel epitel vili langsung menuju pembuluh kapiler darah.',
      'Penyerapan Lemak: Lemak banyak masuk ke sistem limfa dalam bentuk kilomikron. (Sebagian besar lemak rantai panjang diserap enterosit, dibentuk kembali menjadi trigliserida, dikemas jadi kilomikron, lalu masuk pembuluh lakteal).',
      'Penyelesaian di Ileum: Menyerap kembali garam empedu dan vitamin tertentu sebelum ampas masuk ke usus besar.',
    ],
    cameraPosition: [0, -1.0, 3.0],
    cameraTarget: [0, -1.0, 0.15],
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
    mainFunction: 'Menyerap kembali kelebihan air dan mineral serta membentuk massa feses padat.',
    foodAction: 'Ampas sisa pencernaan mengalami fermentasi serat oleh mikrobiota usus dan pemadatan menjadi feses.',
    keyFact: 'Reabsorpsi air di kolon sangat penting untuk mencegah tubuh mengalami dehidrasi.',
    description:
      'Saluran berdiameter lebih lebar yang membingkai rongga perut: terdiri dari Sekum (+ Apendiks), Kolon Asenden, Transversum, Desenden, dan Sigmoid.',
    function:
      'Menyerap kembali air dan elektrolit dari sisa pencernaan, membusukkan serat dengan bantuan mikrobiota usus, serta memadatkan feses.',
    foodState: 'Sisa pencernaan (Mengalami pemadatan & fermentasi)',
    durationNote: '± 10 - 24 Jam',
    keyEnzymes: [
      'Mukus Kolon (Pelumas dinding usus untuk mempermudah luncuran feses padat)',
    ],
    processDetails: [
      'Reabsorpsi Air & Elektrolit: Usus besar menyerap kembali 1-2 liter air per hari ke peredaran darah.',
      'Peran Mikrobiota Usus: Mikrobiota usus membantu memfermentasi sisa serat dan menghasilkan berbagai metabolit, termasuk asam lemak rantai pendek. Sebagian bakteri juga menghasilkan bentuk vitamin tertentu seperti vitamin K.',
      'Pembentukan Feses: Ampas tak tercerna (serat kasar, bakteri mati, sel epitel) dipadatkan dan diberi pigmen warna oleh sterkobilin.',
      'Gerakan Massa: Gelombang peristaltik kuat mendorong feses secara periodik menuju kolon sigmoid dan rektum.',
    ],
    cameraPosition: [0, -1.1, 3.6],
    cameraTarget: [0, -1.1, 0.1],
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
    mainFunction: 'Menampung feses sementara sebelum dikeluarkan melalui proses defekasi.',
    foodAction: 'Feses padat ditahan di ampula rektum hingga siap dikeluarkan melalui lubang anus.',
    keyFact: 'Defekasi diatur oleh kerja sama sfingter ani internus (otomatis) dan sfingter ani eksternus (sadar).',
    description:
      'Bagian ujung akhir saluran pencernaan yang terdiri dari ruang penampung (ampula rektum) dan saluran pembuangan akhir (anus).',
    function:
      'Menyimpan feses secara sementara, mendeteksi kepenuhan saluran, dan mengeluarkan feses secara terkendali saat buang air besar.',
    foodState: 'Feses (Massa padat siap dikeluarkan)',
    durationNote: 'Penyimpanan periodik',
    keyEnzymes: [
      'Tidak ada enzim pencernaan (Murni fungsi penampungan & ekskresi mekanik)',
    ],
    processDetails: [
      'Peregangan Dinding: Masuknya feses meregangkan ampula rektum dan mengirim sinyal rangsang buang air besar ke saraf tulang belakang.',
      'Relaksasi Sfingter Internus: Otot polos sfingter ani internus secara otomatis berelaksasi terbuka.',
      'Kontrol Sadar Sfingter Eksternus: Otot lurik sfingter ani eksternus dikontrol secara sadar hingga kondisi memungkinkan untuk defekasi.',
      'Pengeluaran: Kontraksi rektum dibantu dorongan otot dinding abdomen mengeluarkan feses secara higienis.',
    ],
    cameraPosition: [0, -2.5, 2.4],
    cameraTarget: [0, -2.6, 0.0],
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
    role: 'Kelenjar Metabolisme & Penghasil Empedu',
    mainFunction: 'Memproduksi getah empedu untuk emulsifikasi lemak dan memproses nutrisi dari darah usus.',
    keyFact: 'Hati adalah organ internal terbesar manusia dengan berat sekitar 1.5 kilogram.',
    description:
      'Kelenjar terbesar dalam tubuh manusia yang terletak di kuadran kanan atas abdomen, tepat di bawah diafragma. Terdiri dari lobus kanan besar dan lobus kiri.',
    function:
      'Memproduksi getah empedu secara terus-menerus, memproses zat gizi dari vena porta hepatika, detoksifikasi racun, serta menyimpan glikogen dan vitamin.',
    secretion: 'Getah Empedu (Garam empedu untuk memecah tetesan lemak menjadi emulsi)',
    color: '#991b1b',
    cameraPosition: [1.1, 0.55, 2.6],
    cameraTarget: [0.55, 0.42, 0.15],
    organ3DPosition: [0.55, 0.42, 0.15],
  },
  {
    id: 'gallbladder',
    name: 'Kantong Empedu',
    latinName: 'Vesica Fellea',
    role: 'Penyimpan & Pemekat Getah Empedu',
    mainFunction: 'Menampung, memekatkan, dan menyemprotkan cairan empedu ke duodenum saat makanan berlemak tiba.',
    keyFact: 'Empedu dipekatkan hingga 5–10 kali lipat di dalam kantong empedu sebelum dialirkan ke usus.',
    description:
      'Organ kecil berbentuk buah pir yang menempel di lekukan permukaan bawah lobus kanan hati.',
    function:
      'Menampung getah empedu dari hati, menyerap airnya agar lebih pekat, dan mengontraksikan diri melepaskan empedu melalui duktus koledokus ke duodenum.',
    secretion: 'Getah empedu pekat kaya garam empedu, kolesterol, dan pigmen bilirubin',
    color: '#059669',
    cameraPosition: [0.85, 0.1, 2.3],
    cameraTarget: [0.38, 0.1, 0.28],
    organ3DPosition: [0.38, 0.1, 0.28],
  },
  {
    id: 'pancreas',
    name: 'Pankreas',
    latinName: 'Pancreas',
    role: 'Kelenjar Enzim Pencernaan & Hormon',
    mainFunction: 'Menghasilkan getah pankreas kaya enzim pencernaan dan bikarbonat penetral asam lambung.',
    keyFact: 'Pankreas memiliki fungsi ganda: eksokrin (enzim pencernaan) dan endokrin (insulin & glukagon).',
    description:
      'Kelenjar berbentuk pipih memanjang yang terletak melintang di belakang lambung dengan kepala dilingkari lengkungan duodenum.',
    function:
      'Fungsi Eksokrin: Menghasilkan natrium bikarbonat (penetral asam) dan enzim (amilase, tripsin, lipase). Fungsi Endokrin: Memproduksi hormon insulin dan glukagon pengatur gula darah.',
    secretion: 'Getah Pankreas (Bikarbonat + Enzim Amilase, Tripsinogen, Lipase, Nuklease)',
    color: '#d97706',
    cameraPosition: [-0.15, -0.2, 2.5],
    cameraTarget: [-0.05, -0.25, 0.02],
    organ3DPosition: [-0.05, -0.25, 0.02],
  },
];

// Continuous 3D Catmull-Rom Curve through exact anatomical lumen coordinates
export const DIGESTIVE_PATH_POINTS: [number, number, number][] = [
  // 1. Mouth (Cavum Oris) -> Pharynx [Progress: 0.00 -> 0.12]
  [0.0, 3.42, 0.34],   // Front lips
  [0.0, 3.36, 0.18],   // Oral cavity center (above tongue)
  [0.0, 3.25, 0.04],   // Oropharynx
  [0.0, 2.98, -0.04],  // Epiglottis / Laryngopharynx junction

  // 2. Esophagus (Esofagus) [Progress: 0.12 -> 0.28]
  [0.0, 2.7, -0.05],   // Cervical esophagus
  [0.01, 2.2, -0.05],  // Upper thoracic esophagus
  [0.0, 1.7, -0.04],   // Mid thoracic esophagus
  [-0.04, 1.2, -0.02], // Lower thoracic esophagus (leaning left)
  [-0.14, 0.72, 0.05], // Lower esophageal sphincter / Cardia entrance

  // 3. Stomach (Ventrikulus / J-Shape) [Progress: 0.28 -> 0.48]
  [-0.22, 0.65, 0.1],  // Cardia / Upper dome
  [-0.44, 0.42, 0.15], // Fundus to upper body
  [-0.56, 0.12, 0.18], // Greater curvature apex (left body)
  [-0.46, -0.16, 0.16],// Lower body / Angular incisure
  [-0.22, -0.28, 0.12],// Pyloric antrum sweeping right
  [-0.04, -0.32, 0.1], // Pyloric sphincter

  // 4. Small Intestine (Intestinum Tenue) [Progress: 0.48 -> 0.74]
  // Duodenum (C-loop around pancreas)
  [0.15, -0.34, 0.12], // Superior duodenal flexure
  [0.32, -0.48, 0.14], // Descending duodenum (receives bile & pancreatic ducts)
  [0.22, -0.66, 0.16], // Horizontal / inferior duodenal flexure
  [-0.06, -0.7, 0.18], // Ascending duodenum / Duodenojejunal flexure
  // Jejunum anatomical coils
  [-0.32, -0.84, 0.22],
  [-0.12, -1.02, 0.25],
  [0.22, -0.96, 0.25],
  [0.34, -1.18, 0.22],
  // Ileum anatomical coils
  [0.06, -1.35, 0.24],
  [-0.24, -1.45, 0.22],
  [0.1, -1.6, 0.2],
  [0.52, -1.72, 0.16], // Ileocecal junction (entering cecum)

  // 5. Large Intestine (Kolon framing periphery) [Progress: 0.74 -> 0.92]
  [0.7, -1.78, 0.14],  // Cecum (Right lower quadrant)
  [0.75, -1.4, 0.11],  // Ascending colon lower
  [0.77, -0.95, 0.08], // Ascending colon upper
  [0.72, -0.55, 0.08], // Right colic / Hepatic flexure
  [0.36, -0.5, 0.12],  // Transverse colon right
  [0.0, -0.55, 0.14],  // Transverse colon center
  [-0.38, -0.5, 0.12], // Transverse colon left
  [-0.72, -0.55, 0.08],// Left colic / Splenic flexure
  [-0.75, -0.95, 0.08],// Descending colon upper
  [-0.72, -1.4, 0.1],  // Descending colon lower
  [-0.62, -1.75, 0.11],// Iliac colon
  [-0.36, -1.96, 0.07],// Sigmoid colon loop
  [-0.12, -2.08, 0.04],// Sigmoid curve towards midline
  [0.0, -2.25, 0.02],  // Rectosigmoid junction

  // 6. Rectum & Anus [Progress: 0.92 -> 1.00]
  [0.0, -2.45, -0.01], // Upper rectum
  [0.0, -2.72, -0.02], // Rectal ampulla
  [0.0, -3.05, 0.0],   // Anal canal & external orifice
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
  return step ? step.pathProgressRange[0] + 0.002 : 0;
}
