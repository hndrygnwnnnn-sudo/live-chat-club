(function () {
  // Simple admin block management for Realtime DB at /blockedUsers
  let blockedRef;

  function initAdminBlock() {
    if (typeof firebase === 'undefined') {
      console.error('Firebase not loaded');
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
  }

  function renderBlockedPanel() {
    const listEl = document.getElementById('blocked-list');
    if (!listEl) return;
    listEl.innerHTML = 'Memuat...';

    blockedRef.once('value').then((snap) => {
      listEl.innerHTML = '';
      if (!snap.exists()) {
        listEl.innerHTML = '<div>Tidak ada user yang diblokir</div>';
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
    }).catch((err) => {
      console.error('Gagal memuat blocked list', err);
      listEl.innerHTML = '<div>Error memuat daftar blokir</div>';
    });
  }

  function blockUserPrompt(identifier) {
    const name = identifier.trim();
    if (!name) return;
    const newRef = blockedRef.push();
    newRef.set({
      identifier: name,
      blockedAt: Date.now()
    }).then(() => {
      renderBlockedPanel();
      const el = document.getElementById('search-user');
      if (el) el.value = '';
      console.log('User diblokir:', name);
    }).catch((err) => {
      console.error('Gagal memblokir user:', err);
      alert('Gagal memblokir: ' + err.message);
    });
  }

  function unblockUser(id) {
    blockedRef.child(id).remove().then(() => {
      renderBlockedPanel();
    }).catch((err) => {
      console.error('Gagal unblock:', err);
      alert('Gagal unblock: ' + err.message);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.initAdminBlock = initAdminBlock;
})();
