(function () {
  // Simple admin block management for Realtime DB at /blockedUsers
  let blockedRef;

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
            if (v) blockUserPrompt(v);
          }
        });
      }

      const blockBtn = document.getElementById('block-user-btn');
      if (blockBtn) {
        blockBtn.addEventListener('click', () => {
          const v = searchInput ? searchInput.value.trim() : '';
          if (v) blockUserPrompt(v);
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
        const identifier = data.identifier || data.userName || '(tidak diketahui)';

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

  function blockUserPrompt(identifier) {
    const name = identifier.trim();
    if (!name) return;
    if (!blockedRef) {
      showBlockStatus('Database belum siap. Coba reload halaman.', 'error');
      return;
    }

    const newRef = blockedRef.push();
    newRef.set({
      identifier: name,
      blockedAt: Date.now()
    }).then(() => {
      renderBlockedPanel();
      const el = document.getElementById('search-user');
      if (el) el.value = '';
      showBlockStatus('✅ ' + name + ' berhasil diblokir', 'success');
      console.log('User diblokir:', name);
    }).catch((err) => {
      console.error('Gagal memblokir user:', err);
      // Friendly message for permission denied
      if (err && err.code === 'PERMISSION_DENIED') {
        showBlockStatus('Izin database ditolak. Periksa Firebase Rules.', 'error');
      } else {
        showBlockStatus('Gagal memblokir: ' + (err.message || err), 'error');
      }
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
