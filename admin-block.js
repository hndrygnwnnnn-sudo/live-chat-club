(function () {
  // Admin block management: block by uid. If admin inputs a display name, we resolve uids from messages.
  let blockedRef;
  let messagesRef;

  function showBlockStatus(msg, type) {
    const el = document.getElementById('blockStatus');
    if (!el) return;
    if (!msg) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    el.textContent = msg;
    el.className = 'admin-status-msg ' + (type || '');
    el.style.display = 'block';
  }

  function initAdminBlock() {
    try {
      if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded');
        showBlockStatus('Firebase belum dimuat. Coba reload halaman.', 'error');
        return;
      }
      blockedRef = firebase.database().ref('blockedUsers');
      messagesRef = firebase.database().ref('messages');

      // Render initially
      renderBlockedPanel();

      // Hook search + block button
      const searchInput = document.getElementById('search-user');
      const refreshBtn = document.getElementById('refresh-blocks');
      if (searchInput) {
        // Enter to block
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const v = searchInput.value.trim();
            if (v) resolveAndBlock(v);
          }
        });
      }

      const blockBtn = document.getElementById('block-user-btn');
      if (blockBtn) {
        blockBtn.addEventListener('click', () => {
          const v = searchInput ? searchInput.value.trim() : '';
          if (v) resolveAndBlock(v);
        });
      }

      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => renderBlockedPanel());
      }

      // Expose render so admin.html can call Refresh
      window.renderBlockedPanel = renderBlockedPanel;
      showBlockStatus('', '');
    } catch (err) {
      console.error('initAdminBlock error', err);
      showBlockStatus('Terjadi error saat inisialisasi panel blokir: ' + err.message, 'error');
    }
  }

  // Try to resolve input to uid(s). If input looks like a uid (long-ish), block directly.
  // Otherwise search recent messages for matching userName and block matching uids.
  function resolveAndBlock(input) {
    if (!input) return;
    // heuristic: uid in Firebase is usually longer than 10 chars and not just a name
    if (input.length > 10 && /[a-zA-Z0-9_-]/.test(input)) {
      // treat as uid
      blockUid(input, input);
      return;
    }

    showBlockStatus('Mencari pengguna dengan nama "' + input + '"...', '');
    // Search messages for matching userName (case-insensitive)
    messagesRef.orderByChild('timestamp').limitToLast(1000).once('value').then((snap) => {
      const uids = new Set();
      snap.forEach((c) => {
        const m = c.val();
        if (!m) return;
        if (m.userName && m.userName.toLowerCase() === input.toLowerCase()) {
          if (m.userId) uids.add(m.userId);
        }
      });

      if (uids.size === 0) {
        // no uids found — ask to block by name fallback: create a special entry with key 'name:...'
        if (confirm('Tidak menemukan uid untuk nama ini. Anda ingin memblokir berdasarkan nama? (Ini dapat dipalsukan)')) {
          blockByName(input);
        } else {
          showBlockStatus('Tidak ada uid ditemukan untuk nama tersebut.', 'error');
        }
        return;
      }

      // Block all found uids
      Array.from(uids).forEach((uid) => {
        blockUid(uid, input);
      });

    }).catch((err) => {
      console.error('Error searching messages:', err);
      showBlockStatus('Gagal mencari pesan: ' + err.message, 'error');
    });
  }

  function blockUid(uid, label) {
    if (!blockedRef) {
      showBlockStatus('Database belum siap. Coba reload halaman.', 'error');
      return;
    }
    const data = { identifier: label || uid, blockedAt: Date.now() };
    blockedRef.child(uid).set(data).then(() => {
      showBlockStatus('✅ UID ' + uid + ' diblokir (' + (label || uid) + ')', 'success');
      renderBlockedPanel();
      const el = document.getElementById('search-user'); if (el) el.value = '';
    }).catch((err) => {
      console.error('Gagal memblokir uid:', err);
      showBlockStatus('Gagal memblokir uid: ' + (err.message || err), 'error');
    });
  }

  function blockByName(name) {
    if (!blockedRef) return;
    // store fallback entry under a special key so frontends can also check name-blocks
    const key = 'name:' + name.toLowerCase();
    blockedRef.child(key).set({ identifier: name, blockedAt: Date.now(), byName: true }).then(() => {
      showBlockStatus('✅ Nama "' + name + '" diblokir (by-name fallback)', 'success');
      renderBlockedPanel();
      const el = document.getElementById('search-user'); if (el) el.value = '';
    }).catch((err) => {
      console.error('Gagal memblokir nama:', err);
      showBlockStatus('Gagal memblokir nama: ' + (err.message || err), 'error');
    });
  }

  function renderBlockedPanel() {
    const listEl = document.getElementById('blocked-list');
    if (!listEl) return;
    listEl.innerHTML = 'Memuat...';

    if (!blockedRef) {
      listEl.innerHTML = '<div>Panel blokir belum siap (firebase belum terhubung)</div>';
      showBlockStatus('Database belum tersedia. Pastikan Firebase terhubung.', 'error');
      return;
    }

    blockedRef.once('value').then((snap) => {
      listEl.innerHTML = '';
      if (!snap.exists()) {
        listEl.innerHTML = '<div>Tidak ada user yang diblokir</div>';
        showBlockStatus('', '');
        return;
      }

      snap.forEach((child) => {
        const id = child.key;
        const data = child.val() || {};
        const identifier = data.identifier || '(tidak diketahui)';

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '8px';
        row.style.background = 'rgba(255,255,255,0.02)';
        row.style.borderRadius = '8px';

        const info = document.createElement('div');
        info.innerHTML = `<div><strong>${escapeHtml(identifier)}</strong>
                          <span class="blocked-tag">DIBLOKIR</span></div>
                          <div style="font-size:0.85em;color:#aaa;">${new Date(data.blockedAt||0).toLocaleString()}</div>`;

        const btn = document.createElement('button');
        btn.className = 'btn-unblock';
        btn.textContent = 'Unblock';
        btn.addEventListener('click', () => {
          if (!confirm('Yakin ingin membuka blokir untuk ' + identifier + ' ?')) return;
          unblockUser(id);
        });

        row.appendChild(info);
        row.appendChild(btn);
        listEl.appendChild(row);
      });
      showBlockStatus('', '');
    }).catch((err) => {
      console.error('Gagal memuat blocked list', err);
      listEl.innerHTML = '<div>Error memuat daftar blokir</div>';
      showBlockStatus('Gagal memuat daftar blokir: ' + err.message, 'error');
    });
  }

  function unblockUser(id) {
    if (!blockedRef) {
      showBlockStatus('Database belum siap. Coba reload halaman.', 'error');
      return;
    }
    blockedRef.child(id).remove().then(() => {
      renderBlockedPanel();
      showBlockStatus('Pengguna berhasil dibuka blokir', 'success');
    }).catch((err) => {
      console.error('Gagal unblock:', err);
      showBlockStatus('Gagal unblock: ' + (err.message || err), 'error');
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.initAdminBlock = initAdminBlock;
})();
