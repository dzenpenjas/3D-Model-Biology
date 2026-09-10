# Direktori Model 3D Organ (.glb)

Folder ini disiapkan untuk menampung aset model 3D anatomi berekstensi `.glb` (glTF binary) untuk sistem pencernaan manusia:

### 1. Model Utama (Unified Model):
- **`public/models/digestive-system.glb`**
  Model lengkap sistem pencernaan manusia dalam satu scene (memuat esofagus, lambung, hati, kantong empedu, pankreas, usus halus, usus besar, rektum). Jika model ini tersedia, aplikasi secara otomatis menggunakannya sebagai visual utama.

### 2. Model Parsial Alternatif:
1. `stomach.glb` - Organ Lambung (Ventrikulus)
2. `liver.glb` - Organ Hati (Hepar)
3. `pancreas.glb` - Kelenjar Pankreas
4. `small-intestine.glb` - Usus Halus (Duodenum, Jejunum, Ileum)
5. `large-intestine.glb` - Usus Besar (Kolon & Sekum)

## Catatan Lisensi Asset
> **Penting**: Model 3D eksternal harus memiliki lisensi yang mengizinkan penggunaan pada aplikasi ini (misal: CC-BY, CC0, atau lisensi edukasi resmi). Jangan mengambil model berhak cipta tanpa izin.

## Spesifikasi & Rekomendasi Teknis
- **Ukuran File**: Disarankan `< 5 MB` per organ.
- **Resolusi Tekstur**: Maksimal 1024x1024 atau 2048x2048 (PBR Standard Material).
- **Poligon**: Low/Medium-poly (hindari polygon jutaan agar performa R3F 60 FPS tetap terjaga).
- **Format**: `.glb` (glTF Binary) dengan poros pivot (origin) di tengah organ.

## Mekanisme Fallback
Jika file model di atas belum diletakkan di folder ini, aplikasi **ALCO Biology 3D** secara otomatis menggunakan representasi procedural Three.js bawaan tanpa mengalami error atau crash.
