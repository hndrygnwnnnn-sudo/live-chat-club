# 🎵 Live Chat Club - Simple Version

Sistem live chat real-time untuk club dengan QR code. **100% Gratis!**

## ✨ Fitur

- ✅ Live chat real-time
- ✅ QR code auto-generate
- ✅ Gratis selamanya (Firebase + Netlify)
- ✅ Responsive (mobile-friendly)
- ✅ Holographic design
- ✅ Tanpa backend server
- ✅ 24/7 online

## 📦 File Structure

```
Live-Chat-Simple/
├── index.html          # Homepage
├── display.html        # Layar besar club (tampilkan chat + QR)
├── chat.html          # User chat (scan QR masuk ke sini)
├── styles.css         # CSS untuk semua halaman
├── firebase-config.js # Config Firebase (HARUS DIISI!)
└── README.md          # Dokumentasi ini
```

## 🚀 Cara Setup (5 Menit)

### **Step 1: Setup Firebase (Gratis)**

1. **Buat akun Firebase:**
   - Buka: https://console.firebase.google.com
   - Login dengan Google
   - Klik "Add project" / "Tambah project"

2. **Buat project baru:**
   - Nama project: `live-chat-club` (atau terserah)
   - Disable Google Analytics (tidak perlu)
   - Klik "Create project"

3. **Setup Realtime Database:**
   - Di sidebar, klik "Build" → "Realtime Database"
   - Klik "Create Database"
   - Pilih location: `asia-southeast1` (Singapore)
   - Start in **test mode** (untuk development)
   - Klik "Enable"

4. **Setup Database Rules:**
   - Klik tab "Rules"
   - Copy paste rules ini:
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
   - Klik "Publish"

5. **Copy Firebase Config:**
   - Klik icon ⚙️ (Settings) → "Project settings"
   - Scroll ke bawah, klik icon `</>` (Web)
   - Register app: nama `live-chat-club`
   - Copy semua config (apiKey, authDomain, dll)
   - **Paste ke file `firebase-config.js`**

### **Step 2: Edit firebase-config.js**

Buka file `firebase-config.js` dan ganti dengan config Anda:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "live-chat-club-xxxxx.firebaseapp.com",
  databaseURL: "https://live-chat-club-xxxxx-default-rtdb.firebaseio.com",
  projectId: "live-chat-club-xxxxx",
  storageBucket: "live-chat-club-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**PENTING:** Ganti semua `YOUR_XXX` dengan config Anda!

### **Step 3: Test Lokal (Opsional)**

Sebelum deploy, test dulu di komputer:

1. **Install Live Server (VS Code):**
   - Buka VS Code
   - Install extension "Live Server"
   - Right click `index.html` → "Open with Live Server"

2. **Atau pakai Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Buka browser: http://localhost:8000
   ```

3. **Test:**
   - Buka `display.html` di browser
   - Buka `chat.html` di tab baru (atau scan QR)
   - Ketik pesan → Harus muncul di display!

### **Step 4: Deploy ke Netlify (Gratis)**

1. **Buat akun Netlify:**
   - Buka: https://www.netlify.com
   - Sign up (gratis)

2. **Deploy via Drag & Drop:**
   - Login ke Netlify
   - Klik "Add new site" → "Deploy manually"
   - **Drag & drop folder `Live-Chat-Simple`** ke area upload
   - Tunggu 30 detik
   - Done! Dapat URL: `https://your-site-name.netlify.app`

3. **Custom Domain (Opsional):**
   - Klik "Domain settings"
   - Klik "Add custom domain"
   - Masukkan domain Anda
   - Follow instruksi DNS

## 🎯 Cara Pakai di Club

### **Setup Layar Besar:**

1. Buka browser di laptop/PC yang terhubung ke layar besar
2. Buka URL: `https://your-site-name.netlify.app/display.html`
3. Tekan **F11** untuk fullscreen
4. QR code akan muncul di bawah chat panel

### **Pengunjung Chat:**

1. Scan QR code di layar dengan HP
2. Browser otomatis buka halaman chat
3. Ketik nama
4. Ketik pesan
5. Pesan langsung muncul di layar besar! ✨

## 📱 Testing Multi-Device

1. **Laptop:** Buka `display.html`
2. **HP 1:** Scan QR atau buka `chat.html`
3. **HP 2:** Scan QR atau buka `chat.html`
4. **HP 3:** Scan QR atau buka `chat.html`
5. Semua pesan muncul real-time di layar!

## 🔧 Troubleshooting

### **QR Code tidak muncul:**
- Buka Console (F12) → Lihat error
- Pastikan QRCode library loaded
- Hard refresh: Ctrl+F5

### **Pesan tidak muncul di layar:**
- Cek Firebase config sudah benar
- Cek Firebase Rules sudah di-publish
- Buka Console (F12) → Lihat error
- Pastikan Firebase initialized

### **"Firebase not loaded":**
- Cek koneksi internet
- Firebase library load dari CDN
- Coba browser lain

### **Database Rules Error:**
- Buka Firebase Console
- Realtime Database → Rules
- Pastikan rules sudah benar
- Klik "Publish"

## 💰 Biaya

**100% GRATIS selamanya!**

- ✅ Firebase Free Tier:
  - 10GB storage
  - 50K reads/day
  - 20K writes/day
  - Cukup untuk club!

- ✅ Netlify Free Tier:
  - 100GB bandwidth/month
  - Unlimited sites
  - Auto SSL (HTTPS)

## 🎨 Customization

### **Ganti Warna:**

Edit `styles.css`:

```css
/* Ganti cyan (#00ffff) ke warna lain */
color: #00ffff; /* Ganti ini */

/* Ganti magenta (#ff00ff) ke warna lain */
color: #ff00ff; /* Ganti ini */
```

### **Ganti Font:**

Edit `styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=NamaFont:wght@400;700&display=swap');

body {
  font-family: 'NamaFont', sans-serif;
}
```

### **Ganti Ukuran QR:**

Edit `display.html`:

```javascript
new QRCode(document.getElementById('qrcode'), {
  width: 80,  // Ganti ukuran (default: 80)
  height: 80, // Ganti ukuran (default: 80)
  // ...
});
```

## 📊 Firebase Limits (Free Tier)

| Resource | Limit | Cukup untuk |
|----------|-------|-------------|
| Storage | 1GB | ✅ Jutaan pesan |
| Downloads | 10GB/month | ✅ Ribuan users |
| Connections | 100 simultaneous | ✅ 100 users bersamaan |

**Kalau melebihi:** Upgrade ke Blaze plan (pay-as-you-go, masih murah)

## 🔒 Security (Production)

Untuk production, update Firebase Rules:

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": "newData.child('timestamp').val() <= now + 60000",
      ".indexOn": ["timestamp"],
      "$messageId": {
        ".validate": "newData.hasChildren(['userName', 'message', 'timestamp']) && newData.child('userName').isString() && newData.child('userName').val().length > 0 && newData.child('userName').val().length <= 30 && newData.child('message').isString() && newData.child('message').val().length > 0 && newData.child('message').val().length <= 200"
      }
    }
  }
}
```

Rules ini:
- ✅ Validasi nama (max 30 karakter)
- ✅ Validasi pesan (max 200 karakter)
- ✅ Prevent timestamp manipulation
- ✅ Index untuk query cepat

## 📞 Support

Ada masalah? Cek:
1. Firebase Console → Realtime Database → Data (lihat messages masuk)
2. Browser Console (F12) → Lihat error
3. Firebase Console → Realtime Database → Rules (pastikan published)

## 🎉 Done!

Sekarang club Anda punya live chat system yang:
- ✅ Gratis selamanya
- ✅ Real-time
- ✅ 24/7 online
- ✅ Mudah dipakai
- ✅ Professional design

**Selamat mencoba!** 🚀
