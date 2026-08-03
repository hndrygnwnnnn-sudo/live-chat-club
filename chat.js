// Minimal chat client untuk Realtime Database (Firebase)
// Fitur: kirim pesan, ubah nama (lokal), hitung karakter (0-200),
// render pesan realtime (child_added), auto-scroll, warna nama konsisten.

(function () {
  // Konfigurasi/ketergantungan:
  // - Pastikan firebase-app-compat.js dan firebase-database-compat.js sudah dimuat
  // - Pastikan firebase-config.js memanggil firebase.initializeApp({...})

  const MAX_LEN = 200;
  const messagesPath = 'messages';

  // elemen DOM (sesuaikan id di HTML jika berbeda)
  const el = {
    messagesList: () => document.getElementById('messagesList'),
    input: () => document.getElementById('chatInput'),
    sendBtn: () => document.getElementById('sendBtn'),
    charCount: () => document.getElementById('charCount'),
    displayName: () => document.getElementById('displayName'),
    changeNameBtn: () => document.getElementById('changeNameBtn')
  };

  // util: format waktu jadi HH.MM (contoh layar)
  function fmtTime(ts) {
    try {
      const d = new Date(ts);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}.${mm}`;
    } catch (e) {
      return '';
    }
  }

  // util: warna dari nama (deterministic)
  function nameToColor(name) {
    const palette = [
      '#ff00ff', '#00ffff', '#ff4444', '#ffaa00',
      '#9b59b6', '#1abc9c', '#3498db', '#e74c3c'
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }

  // local storage untuk nama pengirim
  function getLocalName() {
    return localStorage.getItem('livechat_name') || 'Pengirim';
  }
  function setLocalName(n) {
    localStorage.setItem('livechat_name', n);
    renderDisplayName();
  }

  function renderDisplayName() {
    const elName = el.displayName();
    if (!elName) return;
    elName.textContent = getLocalName();
    elName.style.color = nameToColor(getLocalName());
  }

  // update counter
  function updateCounter() {
    const cntEl = el.charCount();
    const input = el.input();
    if (!cntEl || !input) return;
    const len = input.value.length;
    cntEl.textContent = `${len}/${MAX_LEN}`;
    if (len > MAX_LEN) {
      cntEl.style.color = '#ff4444';
      el.sendBtn().disabled = true;
    } else {
      cntEl.style.color = '';
      el.sendBtn().disabled = false;
    }
  }

  // kirim pesan ke Firebase
  async function sendMessage() {
    const input = el.input();
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    if (text.length > MAX_LEN) {
      alert('Pesan terlalu panjang (' + text.length + ' > ' + MAX_LEN + ')');
      return;
    }

    const payload = {
      name: getLocalName(),
      text: text,
      ts: Date.now()
    };

    try {
      el.sendBtn().disabled = true;
      el.sendBtn().textContent = 'Mengirim...';
      const dbRef = firebase.database().ref(messagesPath);
      await dbRef.push(payload);
      input.value = '';
      updateCounter();
      el.input().focus();
    } catch (err) {
      console.error('Gagal kirim pesan', err);
      alert('Gagal mengirim pesan: ' + (err.message || err));
    } finally {
      el.sendBtn().disabled = false;
      el.sendBtn().textContent = 'KIRIM';
    }
  }

  // render 1 pesan ke DOM
  function renderMessageItem(key, msg) {
    const container = el.messagesList();
    if (!container) return;

    // Create message card
    const card = document.createElement('div');
    card.className = 'chat-message-card';
    card.dataset.key = key;

    const header = document.createElement('div');
    header.className = 'chat-message-header';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'chat-name';
    nameSpan.textContent = msg.name || 'Anon';
    nameSpan.style.color = nameToColor(msg.name || 'Anon');

    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-time';
    timeSpan.textContent = msg.ts ? fmtTime(msg.ts) : '';

    header.appendChild(nameSpan);
    header.appendChild(timeSpan);

    const body = document.createElement('div');
    body.className = 'chat-text';
    body.textContent = msg.text || '';

    card.appendChild(header);
    card.appendChild(body);

    container.appendChild(card);

    // auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  // init listeners dari Firebase
  function listenMessages() {
    const dbRef = firebase.database().ref(messagesPath).limitToLast(200);
    // child_added untuk append
    dbRef.on('child_added', (snap) => {
      const key = snap.key;
      const data = snap.val();
      renderMessageItem(key, data);
    });
    // child_removed -> hapus node DOM jika diperlukan
    dbRef.on('child_removed', (snap) => {
      const key = snap.key;
      const node = el.messagesList().querySelector(`[data-key="${key}"]`);
      if (node) node.remove();
    });
    // child_changed bisa di-handle kalau mau edit pesan
  }

  // hook event UI
  function bindUI() {
    const input = el.input();
    if (input) {
      input.addEventListener('input', updateCounter);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    const sendBtn = el.sendBtn();
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    const changeNameBtn = el.changeNameBtn();
    if (changeNameBtn) {
      changeNameBtn.addEventListener('click', () => {
        const cur = getLocalName();
        const n = prompt('Masukkan nama pengirim:', cur);
        if (n && n.trim()) setLocalName(n.trim());
      });
    }

    // ketika halaman sudah siap, tampilkan nama dan counter
    renderDisplayName();
    updateCounter();
  }

  // init public
  function init() {
    if (!window.firebase || !firebase.database) {
      console.error('Firebase belum diinisialisasi. Pastikan firebase-config.js sudah ter-load dan memanggil firebase.initializeApp().');
      return;
    }
    bindUI();
    listenMessages();
  }

  // expose init ke window agar dapat dipanggil setelah firebase-config load
  window.initLiveChat = init;
})();
