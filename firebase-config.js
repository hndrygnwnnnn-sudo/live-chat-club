// ========================================
// FIREBASE CONFIGURATION
// ========================================
// 
// CARA SETUP:
// 1. Buat akun Firebase: https://console.firebase.google.com
// 2. Buat project baru (gratis)
// 3. Pilih "Realtime Database"
// 4. Copy config dari Project Settings
// 5. Paste di bawah ini
//
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyANDQTyiYPzbrk7f8BYKO0saBmAfWPdM_w",
  authDomain: "live-chat-club-e251e.firebaseapp.com",
  databaseURL: "https://live-chat-club-e251e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "live-chat-club-e251e",
  storageBucket: "live-chat-club-e251e.firebasestorage.app",
  messagingSenderId: "1070110118628",
  appId: "1:1070110118628:web:b6c1aeafd59ff2fd4d92f1",
  measurementId: "G-PEHV4KNELM"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('✅ Firebase initialized');

// ========================================
// SETUP FIREBASE RULES (PENTING!)
// ========================================
//
// Buka Firebase Console → Realtime Database → Rules
// Copy paste rules ini:
//
// {
//   "rules": {
//     "messages": {
//       ".read": true,
//       ".write": true,
//       "$messageId": {
//         ".validate": "newData.hasChildren(['userName', 'message', 'timestamp'])"
//       }
//     }
//   }
// }
//
// Rules ini membolehkan semua orang read/write messages
// Untuk production, tambahkan rate limiting atau auth
//
// ========================================
