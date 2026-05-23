# 🚀 Setup Guide - GitHub Pages

Panduan deploy Live Chat Club ke GitHub Pages (100% GRATIS!)

## 📋 Yang Sudah Dimodifikasi

✅ Password admin sudah di-set: **`ADM_NOYU`**  
✅ Sistem reset chat langsung pakai Firebase (tanpa serverless function)  
✅ Siap deploy ke GitHub Pages

---

## 1️⃣ Setup Firebase (Sama seperti sebelumnya)

Ikuti langkah 1 di **SETUP-GUIDE.md** untuk:
- Buat Firebase project
- Setup Realtime Database
- Setup Database Rules
- Copy Firebase Config
- Edit `firebase-config.js`

---

## 2️⃣ Upload ke GitHub

### **A. Buat Repository Baru**

1. Buka: https://github.com/new
2. Repository name: `live-chat-club` (atau terserah)
3. **Public** (harus public untuk GitHub Pages gratis)
4. **JANGAN** centang "Add a README file"
5. Klik **"Create repository"**

### **B. Upload Files**

**Opsi 1: Via GitHub Web (Mudah)**

1. Di halaman repository baru, klik **"uploading an existing file"**
2. **Drag & drop semua file** dari folder `noyuberisik-main` ke browser
   - Pastikan semua file dan folder ter-upload
3. Scroll ke bawah, klik **"Commit changes"**
4. Tunggu upload selesai

**Opsi 2: Via Git Command Line**

```bash
cd noyuberisik-main
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/live-chat-club.git
git push -u origin main
```

*(Ganti `USERNAME` dengan username GitHub Anda)*

---

## 3️⃣ Aktifkan GitHub Pages

1. Di repository, klik tab **"Settings"**
2. Scroll ke bawah, klik **"Pages"** di sidebar kiri
3. Di section **"Source"**:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
4. Klik **"Save"**
5. Tunggu 1-2 menit
6. Refresh halaman
7. Akan muncul URL: `https://USERNAME.github.io/live-chat-club/`

---

## 4️⃣ Test Website

### **Buka URL Anda:**

- **Home**: `https://USERNAME.github.io/live-chat-club/`
- **Display**: `https://USERNAME.github.io/live-chat-club/display.html`
- **Chat**: `https://USERNAME.github.io/live-chat-club/chat.html`
- **Admin**: `https://USERNAME.github.io/live-chat-club/admin.html`

### **Test Admin Panel:**

1. Buka: `https://USERNAME.github.io/live-chat-club/admin.html`
2. Masukkan password: **`ADM_NOYU`**
3. Klik **"Masuk"**
4. Klik **"Reset Chat"**
5. Konfirmasi **"Ya, Hapus Semua"**
6. ✅ Semua pesan terhapus!

---

## 5️⃣ Custom Domain (Opsional)

Jika punya domain sendiri (misal: `livechat.club`):

1. Di GitHub Pages settings, masukkan domain di **"Custom domain"**
2. Klik **"Save"**
3. Di DNS provider domain Anda, tambahkan CNAME record:
   - Name: `www` atau `@`
   - Value: `USERNAME.github.io`
4. Tunggu DNS propagasi (5-30 menit)
5. Centang **"Enforce HTTPS"**

---

## ⚙️ Cara Ganti Password Admin

Password admin saat ini: **`ADM_NOYU`**

### **Untuk menggantinya:**

1. Buka file **`admin.html`**
2. Cari baris ini (sekitar baris 73):

```javascript
const CORRECT_PASSWORD = 'ADM_NOYU'; // Password admin yang benar
```

3. Ganti `'ADM_NOYU'` dengan password baru, misal:

```javascript
const CORRECT_PASSWORD = 'PasswordBaru123'; // Password admin yang benar
```

4. Save file
5. Upload ulang ke GitHub (commit & push)
6. Tunggu 1-2 menit untuk GitHub Pages update

---

## 🔒 Keamanan Password

⚠️ **PENTING:**

Password di-hardcode di file HTML, artinya **siapa saja bisa lihat password** jika mereka buka source code (View Page Source).

### **Solusi untuk keamanan lebih baik:**

1. **Gunakan password yang panjang dan acak**
   - Contoh: `ADM_NOYU_2024_SecurePass_XyZ123`

2. **Ganti password secara berkala**
   - Setiap bulan atau setelah event besar

3. **Jangan share link admin.html ke publik**
   - Hanya admin yang tahu URL admin panel

4. **Gunakan Firebase Security Rules yang lebih ketat**
   - Batasi write access berdasarkan kondisi tertentu

### **Alternatif: Firebase Authentication (Advanced)**

Untuk keamanan maksimal, gunakan Firebase Authentication:
- User harus login dengan email/password
- Password tidak terlihat di source code
- Lebih aman tapi setup lebih kompleks

---

## 📱 Cara Pakai di Club

### **Setup Layar Besar:**

1. Buka browser di laptop yang terhubung ke layar besar
2. Buka: `https://USERNAME.github.io/live-chat-club/display.html`
3. Tekan **F11** untuk fullscreen
4. QR code muncul di bawah chat panel

### **Audience Scan QR:**

1. Buka kamera HP
2. Scan QR code
3. Ketik nama dan pesan
4. Pesan langsung muncul di layar! ✨

---

## ✅ Checklist Final

- [ ] Firebase project dibuat dan dikonfigurasi
- [ ] `firebase-config.js` sudah diisi
- [ ] Repository GitHub dibuat
- [ ] Semua file ter-upload ke GitHub
- [ ] GitHub Pages diaktifkan
- [ ] Website bisa diakses via URL GitHub Pages
- [ ] Admin panel bisa login dengan password `ADM_NOYU`
- [ ] Reset chat berfungsi dengan baik
- [ ] QR code muncul di display
- [ ] Chat dari HP muncul di layar

---

## 🔧 Troubleshooting

### **"Firebase not loaded"**
- Cek `firebase-config.js` sudah benar
- Cek koneksi internet
- Hard refresh: Ctrl+F5

### **"Permission denied" saat reset chat**
- Cek Firebase Rules sudah published
- Pastikan rules allow write: `".write": true`

### **Password admin tidak diterima**
- Pastikan ketik **persis**: `ADM_NOYU` (huruf besar semua)
- Cek tidak ada spasi di awal/akhir
- Cek file `admin.html` sudah ter-upload dengan benar

### **Website tidak update setelah push**
- Tunggu 1-2 menit untuk GitHub Pages rebuild
- Hard refresh: Ctrl+Shift+R
- Clear browser cache

### **QR code tidak muncul**
- Buka Console (F12) → Lihat error
- Pastikan QRCode library loaded
- Hard refresh: Ctrl+F5

---

## 🎉 Selesai!

Website Anda sekarang online 24/7 di GitHub Pages!

**URL Anda:**
- Home: `https://USERNAME.github.io/live-chat-club/`
- Display: `https://USERNAME.github.io/live-chat-club/display.html`
- Chat: `https://USERNAME.github.io/live-chat-club/chat.html`
- Admin: `https://USERNAME.github.io/live-chat-club/admin.html`

**Password Admin:** `ADM_NOYU`

**Bookmark URL display untuk akses cepat di club!** 🚀

---

## 📞 Update Website

Setiap kali ada perubahan:

1. Edit file yang ingin diubah
2. Commit & push ke GitHub:
   ```bash
   git add .
   git commit -m "Update files"
   git push
   ```
3. Tunggu 1-2 menit
4. Website otomatis update!

**Selamat mencoba!** ✨
