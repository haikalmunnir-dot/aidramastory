# AI DRAMA STUDIO

Aplikasi web untuk membuat cerita drama AI dengan prompt video yang berkesinambungan.

## 📦 Cara Mendapatkan File ZIP

### ⚡ Metode 1: Menggunakan ZIP Generator (Paling Mudah)

1. Jalankan aplikasi: `npm run dev`
2. Buka browser ke: `http://localhost:3000/zip-generator.html`
3. Klik tombol "📦 Download ZIP"
4. File ZIP akan otomatis terdownload

### Metode 2: Menggunakan Terminal (Linux/Mac/Windows with Git Bash)

```bash
# Di folder proyek, jalankan:
zip -r ai-drama-studio.zip . -x "node_modules/*" -x "dist/*" -x ".git/*"
```

### Metode 3: Menggunakan File Manager

**Windows:**
1. Buka folder proyek
2. Tekan `Ctrl + A` untuk pilih semua
3. Klik kanan → "Send to" → "Compressed (zipped) folder"
4. Rename menjadi `ai-drama-studio.zip`

**Mac:**
1. Buka folder proyek
2. Klik kanan folder → "Compress"
3. Rename menjadi `ai-drama-studio.zip`

**Linux:**
```bash
cd ..
zip -r ai-drama-studio.zip ai-drama-studio -x "*/node_modules/*" -x "*/dist/*"
```

### Metode 4: Menggunakan PowerShell (Windows)

```powershell
Compress-Archive -Path .\* -DestinationPath .\ai-drama-studio.zip -Force
```

## 🚀 Cara Menjalankan

### Development Mode
```bash
npm install
npm run dev
```
Buka http://localhost:3000

### Production Build
```bash
npm install
npm run build
```
File hasil build ada di folder `dist/`

## 📋 Struktur File

```
src/
├── App.tsx                      # Komponen utama
├── main.tsx                     # Entry point
├── index.css                    # Styling
├── types.ts                     # TypeScript types
└── services/
    ├── characterAnalyzer.ts     # Analisis karakter
    ├── storyGenerator.ts        # Generator cerita & prompt
    ├── validator.ts             # Validasi konsistensi
    └── storage.ts               # Penyimpanan & ekspor
```

## ✨ Fitur Utama

1. **Input Karakter Fleksibel** - Deskripsi bebas, AI menganalisis
2. **Analisis Karakter Otomatis** - Memisahkan ciri user vs AI
3. **Character Lock** - Konsistensi visual di semua scene
4. **Satu Prompt Final Utuh** - Siap salin per scene
5. **Tanpa API Key** - Mode demo langsung bisa digunakan
6. **Durasi 10 Detik** - Setiap scene tepat 10 detik
7. **Dialog di Setiap Scene** - Dengan timecode dan emosi
8. **Kesinambungan Cerita** - Ending state & continuity link
9. **Ekspor TXT & JSON** - Format lengkap
10. **Validasi Konsistensi** - Memeriksa konflik

## 🔧 Teknologi

- React 18 + TypeScript
- Tailwind CSS 4
- Vite 6
- Lucide React (icons)

## 📝 Catatan Penting

- **Mode Demo**: Aplikasi menggunakan template cerita, bukan AI generatif sungguhan
- **Bahasa**: UI dalam Bahasa Indonesia, prompt video dalam Bahasa Inggris
- **Konsistensi**: Character Lock menjaga identitas visual di semua scene
- **Durasi**: Setiap scene tepat 10 detik (total = jumlah scene × 10)

## 📄 Lisensi

MIT License - Bebas digunakan dan dimodifikasi
