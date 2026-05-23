# 🚀 Setup Guide - Live Chat Club

Panduan lengkap setup dari nol sampai online!

## 📋 Checklist

- [ ] Setup Firebase (5 menit)
- [ ] Edit firebase-config.js
- [ ] Test lokal (opsional)
- [ ] Deploy ke Netlify (2 menit)
- [ ] Test di club

---

## 1️⃣ Setup Firebase

### **A. Buat Project Firebase**

1. Buka: https://console.firebase.google.com
2. Klik **"Add project"**
3. Nama project: `live-chat-club` (atau terserah)
4. Disable Google Analytics
5. Klik **"Create project"**
6. Tunggu 30 detik
7. Klik **"Continue"**

### **B. Setup Realtime Database**

1. Di sidebar kiri, klik **"Build"** → **"Realtime Database"**
2. Klik **"Create Database"**
3. Location: **"asia-southeast1 (Singapore)"**
4. Security rules: **"Start in test mode"**
5. Klik **"Enable"**
6. Tunggu database dibuat

### **C. Setup Database Rules**

1. Klik tab **"Rules"** (di atas)
2. Hapus semua text yang ada
3. Copy paste rules ini:

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true,
      "$messageId": {
        ".validate": "newData.hasChildren(['userName', 'message', 'timestamp'])"
      }
    }
  }
}
```

4. Klik **"Publish"**
5. Klik **"Publish"** lagi untuk konfirmasi

### **D. Copy Firebase Config**

1. Klik icon **⚙️** (Settings) di sidebar
2. Klik **"Project settings"**
3. Scroll ke bawah
4. Di section **"Your apps"**, klik icon **`</>`** (Web)
5. App nickname: `live-chat-club`
6. **JANGAN** centang "Firebase Hosting"
7. Klik **"Register app"**
8. Copy semua config yang muncul:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "live-chat-club-xxxxx.firebaseapp.com",
  databaseURL: "https://live-chat-club-xxxxx-default-rtdb.firebaseio.com",
  projectId: "live-chat-club-xxxxx",
  storageBucket: "live-chat-club-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxx"
};
```

9. **SIMPAN CONFIG INI!** (paste ke Notepad dulu)

---

## 2️⃣ Edit firebase-config.js

1. Buka file **`firebase-config.js`** dengan text editor
2. Cari bagian ini:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...
};
```

3. **Ganti semua** dengan config yang tadi Anda copy
4. **Save file**

**Contoh hasil akhir:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",
  authDomain: "live-chat-club-12345.firebaseapp.com",
  databaseURL: "https://live-chat-club-12345-default-rtdb.firebaseio.com",
  projectId: "live-chat-club-12345",
  storageBucket: "live-chat-club-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

---

## 3️⃣ Test Lokal (Opsional)

### **Opsi A: Pakai Live Server (VS Code)**

1. Buka VS Code
2. Install extension **"Live Server"**
3. Right click file **`index.html`**
4. Klik **"Open with Live Server"**
5. Browser otomatis buka

### **Opsi B: Pakai Python**

```bash
# Buka terminal di folder Live-Chat-Simple
python -m http.server 8000

# Buka browser: http://localhost:8000
```

### **Test:**

1. Buka **`display.html`**
2. Buka tab baru, buka **`chat.html`**
3. Ketik nama: "Test"
4. Ketik pesan: "Halo!"
5. **Pesan harus muncul di display!** ✅

Kalau tidak muncul:
- Buka Console (F12) → Lihat error
- Cek firebase-config.js sudah benar
- Cek Firebase Rules sudah di-publish

---

## 4️⃣ Deploy ke Netlify

### **A. Buat Akun Netlify**

1. Buka: https://www.netlify.com
2. Klik **"Sign up"**
3. Sign up dengan GitHub/Google/Email
4. Verify email (cek inbox)

### **B. Deploy via Drag & Drop**

1. Login ke Netlify
2. Klik **"Add new site"** → **"Deploy manually"**
3. **Drag & drop folder `Live-Chat-Simple`** ke area upload
   - Drag **SELURUH FOLDER**, bukan file satu-satu
4. Tunggu upload selesai (30 detik)
5. Tunggu deploy selesai (30 detik)
6. **Done!** Dapat URL: `https://random-name-12345.netlify.app`

### **C. Custom Site Name (Opsional)**

1. Klik **"Site settings"**
2. Klik **"Change site name"**
3. Ganti jadi: `live-chat-club-yourname`
4. Save
5. URL jadi: `https://live-chat-club-yourname.netlify.app`

---

## 5️⃣ Test di Club

### **Setup Layar Besar:**

1. Buka browser di laptop yang terhubung ke layar besar
2. Buka URL: `https://your-site-name.netlify.app/display.html`
3. Tekan **F11** untuk fullscreen
4. QR code muncul di bawah chat panel

### **Test dengan HP:**

1. Buka kamera HP
2. Scan QR code di layar
3. Browser otomatis buka
4. Ketik nama Anda
5. Ketik pesan
6. **Pesan langsung muncul di layar!** ✨

---

## ✅ Checklist Final

- [ ] Firebase project dibuat
- [ ] Realtime Database enabled
- [ ] Database Rules published
- [ ] firebase-config.js sudah diisi
- [ ] Test lokal berhasil (opsional)
- [ ] Deploy ke Netlify berhasil
- [ ] QR code muncul di display
- [ ] Chat dari HP muncul di layar

---

## 🎉 Selesai!

Sekarang sistem live chat Anda sudah online 24/7!

**URL Anda:**
- Display: `https://your-site-name.netlify.app/display.html`
- Chat: `https://your-site-name.netlify.app/chat.html`
- Home: `https://your-site-name.netlify.app`

**Bookmark URL display untuk akses cepat di club!**

---

## 🔧 Troubleshooting

### **"Firebase not loaded"**
- Cek koneksi internet
- Cek firebase-config.js sudah benar
- Hard refresh: Ctrl+F5

### **Pesan tidak muncul**
- Buka Firebase Console → Realtime Database → Data
- Lihat apakah messages masuk ke database
- Kalau tidak masuk: cek Rules sudah published
- Kalau masuk tapi tidak tampil: refresh display

### **QR code tidak muncul**
- Buka Console (F12) → Lihat error
- Pastikan QRCode library loaded
- Hard refresh: Ctrl+F5

### **"Permission denied"**
- Firebase Rules belum di-publish
- Buka Firebase Console → Realtime Database → Rules
- Publish rules lagi

---

## 📞 Need Help?

Cek:
1. Browser Console (F12) → Lihat error
2. Firebase Console → Realtime Database → Data
3. Firebase Console → Realtime Database → Rules

**Selamat mencoba!** 🚀
