// ============================================
//  AWARENESS BY ART — Admin Panel
// ============================================

// ─── Utility ───
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function showToast(msg, type) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  while (c.children.length >= 5) c.removeChild(c.firstChild);
  const t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  t.setAttribute('role', 'alert');
  const icons = { success: '\u2713', error: '\u2717', info: 'i' };
  const ic = document.createElement('span');
  ic.className = 'toast-icon';
  ic.textContent = icons[type] || 'i';
  const tx = document.createElement('span');
  tx.textContent = msg;
  t.appendChild(ic);
  t.appendChild(tx);
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; t.style.transition = 'opacity 0.3s,transform 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── Admin Auth ───
const ADMIN_CRED = { email: 'admin@awarenessbyart.in', passHash: 'h_' + Math.abs((() => { let h = 0; for (let i = 0; i < 'admin123'.length; i++) { h = ((h << 5) - h) + 'admin123'.charCodeAt(i); h |= 0; } return h; })()).toString(36) };

function hashPassword(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return 'h_' + Math.abs(h).toString(36);
}

function isAdminLoggedIn() {
  return localStorage.getItem('aba_admin_session') === 'active';
}

function adminLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const pass = document.getElementById('admin-pass').value;
  if (!email || !pass) { showToast('Please fill in all fields', 'error'); return; }
  if (email !== ADMIN_CRED.email || hashPassword(pass) !== ADMIN_CRED.passHash) {
    showToast('Invalid admin credentials', 'error');
    return;
  }
  localStorage.setItem('aba_admin_session', 'active');
  showAdminApp();
  showToast('Welcome, Admin!', 'success');
}

function adminLogout() {
  localStorage.removeItem('aba_admin_session');
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('admin-login-screen').style.display = 'flex';
  showToast('Signed out', 'info');
}

function showAdminApp() {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-app').style.display = 'block';
  switchAdminTab('dashboard');
}

// Enter key for login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.target.id === 'admin-email' || e.target.id === 'admin-pass')) {
    e.preventDefault();
    adminLogin();
  }
});

// Auto-login check
document.addEventListener('DOMContentLoaded', () => {
  if (isAdminLoggedIn()) showAdminApp();
});

// ─── Data Layer: Read all users and submissions across localStorage ───
function getAllUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Individual user records are stored at "aba_user_{email}"
    // Skip: session key "aba_user", submissions keys "aba_submissions_*", admin keys
    if (!key.startsWith('aba_user_')) continue;
    if (key === 'aba_user') continue;
    try {
      const u = JSON.parse(localStorage.getItem(key));
      if (!u || !u.email) continue;
      // Exclude admin account from users list
      if (u.email === ADMIN_CRED.email) continue;
      users.push(u);
    } catch (e) { /* skip */ }
  }
  return users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

function getAllSubmissions() {
  const all = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('aba_submissions_')) {
      const email = key.replace('aba_submissions_', '');
      try {
        const subs = JSON.parse(localStorage.getItem(key) || '[]');
        subs.forEach(s => all.push({ ...s, userEmail: email }));
      } catch (e) { /* skip */ }
    }
  }
  return all.sort((a, b) => (b.id || 0) - (a.id || 0));
}

function updateSubmission(userEmail, submissionId, updates) {
  const key = 'aba_submissions_' + userEmail;
  const subs = JSON.parse(localStorage.getItem(key) || '[]');
  const sub = subs.find(s => s.id === submissionId);
  if (!sub) return false;
  Object.assign(sub, updates);
  localStorage.setItem(key, JSON.stringify(subs));
  return true;
}

function deleteSubmission(userEmail, submissionId) {
  const key = 'aba_submissions_' + userEmail;
  let subs = JSON.parse(localStorage.getItem(key) || '[]');
  subs = subs.filter(s => s.id !== submissionId);
  localStorage.setItem(key, JSON.stringify(subs));
}

function getEvents() {
  const custom = JSON.parse(localStorage.getItem('aba_admin_events') || '[]');
  return [...DATA.events, ...custom];
}

function saveCustomEvents(events) {
  localStorage.setItem('aba_admin_events', JSON.stringify(events));
}

function getCustomEvents() {
  return JSON.parse(localStorage.getItem('aba_admin_events') || '[]');
}

// ─── Tab Navigation ───
let currentAdminTab = 'dashboard';

function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
  // Close mobile sidebar
  document.querySelector('.admin-sidebar')?.classList.remove('open');

  const main = document.getElementById('admin-main');
  if (!main) return;

  const renderers = {
    dashboard: renderAdminDashboard,
    submissions: renderAdminSubmissions,
    results: renderAdminResults,
    users: renderAdminUsers,
    events: renderAdminEvents,
  };

  main.innerHTML = (renderers[tab] || renderAdminDashboard)();
}

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════
function renderAdminDashboard() {
  const subs = getAllSubmissions();
  const users = getAllUsers();
  const events = getEvents();
  const pending = subs.filter(s => !s.resultStatus);
  const declared = subs.filter(s => s.resultStatus);
  const winners = subs.filter(s => s.resultStatus === 'Winner');
  const treesPlanted = subs.length * 3;

  return `
    <div class="admin-header">
      <div>
        <h1>Dashboard</h1>
        <p style="color:var(--text-muted);font-size:0.88rem">Platform overview and recent activity</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="switchAdminTab('results')">Declare Results</button>
      </div>
    </div>

    <div class="admin-stat-grid">
      <div class="admin-stat primary">
        <div class="label">Total Submissions</div>
        <div class="value">${subs.length}</div>
        <div class="sub">${pending.length} pending review</div>
      </div>
      <div class="admin-stat">
        <div class="label">Registered Users</div>
        <div class="value">${users.length}</div>
        <div class="sub">Across all schools</div>
      </div>
      <div class="admin-stat gold">
        <div class="label">Results Declared</div>
        <div class="value">${declared.length}</div>
        <div class="sub">${winners.length} winners</div>
      </div>
      <div class="admin-stat success">
        <div class="label">Trees Funded</div>
        <div class="value">${treesPlanted}</div>
        <div class="sub">Via SankalpTaru</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px">
      <!-- Recent Submissions -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3>Recent Submissions</h3>
          <button class="btn btn-outline btn-xs" onclick="switchAdminTab('submissions')">View All</button>
        </div>
        <div class="admin-card-body flush" style="overflow-x:auto">
          ${subs.length ? `
          <table class="admin-table">
            <thead><tr><th>Artwork</th><th>User</th><th>Event</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${subs.slice(0, 8).map(s => `
                <tr>
                  <td style="font-weight:600;color:var(--navy)">${escapeHtml(s.artTitle)}</td>
                  <td>${escapeHtml(s.userEmail)}</td>
                  <td>${escapeHtml(s.event || '-')}</td>
                  <td style="white-space:nowrap">${s.date || '-'}</td>
                  <td>${statusPill(s)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>` : '<p style="padding:32px;text-align:center;color:var(--text-muted)">No submissions yet</p>'}
        </div>
      </div>

      <!-- Quick Info -->
      <div>
        <div class="admin-card" style="margin-bottom:20px">
          <div class="admin-card-header"><h3>Events</h3></div>
          <div class="admin-card-body">
            <div style="font-family:var(--font-heading);font-size:2rem;font-weight:900;color:var(--primary)">${events.length}</div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Total events configured</p>
            <button class="btn btn-outline btn-sm mt-16" onclick="switchAdminTab('events')">Manage Events</button>
          </div>
        </div>
        <div class="admin-card">
          <div class="admin-card-header"><h3>Pending Actions</h3></div>
          <div class="admin-card-body">
            ${pending.length ? `
              <p style="color:var(--warning);font-weight:700;font-size:1.1rem">${pending.length} submissions</p>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">awaiting result declaration</p>
              <button class="btn btn-warning btn-sm mt-16" style="color:white" onclick="switchAdminTab('results')">Declare Now</button>
            ` : `
              <p style="color:var(--success);font-weight:600">All caught up!</p>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">No pending actions</p>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function statusPill(s) {
  if (s.resultStatus === 'Winner') return '<span class="pill rank-gold">Winner</span>';
  if (s.resultStatus === 'Participated') return '<span class="pill pill-primary">Participated</span>';
  return '<span class="pill pill-gold">Under Review</span>';
}

// ═══════════════════════════════════════════════
//  SUBMISSIONS
// ═══════════════════════════════════════════════
let subFilter = 'all';
let subSearch = '';

function renderAdminSubmissions() {
  const all = getAllSubmissions();
  const filtered = all.filter(s => {
    if (subFilter === 'pending' && s.resultStatus) return false;
    if (subFilter === 'winner' && s.resultStatus !== 'Winner') return false;
    if (subFilter === 'participated' && s.resultStatus !== 'Participated') return false;
    if (subSearch) {
      const q = subSearch.toLowerCase();
      if (!(s.artTitle || '').toLowerCase().includes(q) &&
          !(s.userEmail || '').toLowerCase().includes(q) &&
          !(s.event || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return `
    <div class="admin-header">
      <div>
        <h1>Submissions</h1>
        <p style="color:var(--text-muted);font-size:0.88rem">${all.length} total submissions across all users</p>
      </div>
    </div>

    <div class="admin-filters">
      <input class="admin-search" type="text" placeholder="Search by title, user, or event..." value="${escapeHtml(subSearch)}" oninput="subSearch=this.value;document.getElementById('admin-main').innerHTML=renderAdminSubmissions()" />
      <button class="btn ${subFilter==='all'?'btn-primary':'btn-outline'} btn-sm" onclick="subFilter='all';document.getElementById('admin-main').innerHTML=renderAdminSubmissions()">All (${all.length})</button>
      <button class="btn ${subFilter==='pending'?'btn-warning':'btn-outline'} btn-sm" style="${subFilter==='pending'?'color:white':''}" onclick="subFilter='pending';document.getElementById('admin-main').innerHTML=renderAdminSubmissions()">Pending (${all.filter(s=>!s.resultStatus).length})</button>
      <button class="btn ${subFilter==='winner'?'btn-primary':'btn-outline'} btn-sm" onclick="subFilter='winner';document.getElementById('admin-main').innerHTML=renderAdminSubmissions()">Winners (${all.filter(s=>s.resultStatus==='Winner').length})</button>
      <button class="btn ${subFilter==='participated'?'btn-outline':'btn-outline'} btn-sm" ${subFilter==='participated'?'style="background:var(--primary);color:white"':''} onclick="subFilter='participated';document.getElementById('admin-main').innerHTML=renderAdminSubmissions()">Participated (${all.filter(s=>s.resultStatus==='Participated').length})</button>
    </div>

    <div class="admin-card">
      <div class="admin-card-body flush" style="overflow-x:auto">
        ${filtered.length ? `
        <table class="admin-table">
          <thead><tr><th>Artwork</th><th>User</th><th>Event</th><th>Category</th><th>Medium</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${filtered.map(s => `
              <tr>
                <td style="font-weight:600;color:var(--navy)">${escapeHtml(s.artTitle)}</td>
                <td style="font-size:0.82rem">${escapeHtml(s.userEmail)}</td>
                <td>${escapeHtml(s.event || '-')}</td>
                <td style="font-size:0.82rem">${escapeHtml(s.category || '-')}</td>
                <td style="font-size:0.82rem">${escapeHtml(s.medium || '-')}</td>
                <td style="white-space:nowrap;font-size:0.82rem">${s.date || '-'}</td>
                <td>${statusPill(s)}</td>
                <td>
                  <div class="actions">
                    ${!s.resultStatus ? `
                      <button class="btn btn-success btn-xs" onclick="declareResult('${escapeHtml(s.userEmail)}',${s.id},'Winner')">Winner</button>
                      <button class="btn btn-primary btn-xs" onclick="declareResult('${escapeHtml(s.userEmail)}',${s.id},'Participated')">Participated</button>
                    ` : `
                      <button class="btn btn-outline btn-xs" onclick="undeclareResult('${escapeHtml(s.userEmail)}',${s.id})">Reset</button>
                    `}
                    <button class="btn btn-danger btn-xs" onclick="confirmDeleteSub('${escapeHtml(s.userEmail)}',${s.id})">Del</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>` : '<p style="padding:40px;text-align:center;color:var(--text-muted)">No submissions match your filters</p>'}
      </div>
    </div>
  `;
}

function declareResult(email, subId, status) {
  updateSubmission(email, subId, { resultStatus: status, status: status });
  showToast('Result declared: ' + status, 'success');
  document.getElementById('admin-main').innerHTML = (currentAdminTab === 'results' ? renderAdminResults : renderAdminSubmissions)();
}

function undeclareResult(email, subId) {
  updateSubmission(email, subId, { resultStatus: null, status: 'Under Review' });
  showToast('Result reset to Under Review', 'info');
  document.getElementById('admin-main').innerHTML = (currentAdminTab === 'results' ? renderAdminResults : renderAdminSubmissions)();
}

function confirmDeleteSub(email, subId) {
  if (!confirm('Delete this submission? This cannot be undone.')) return;
  deleteSubmission(email, subId);
  showToast('Submission deleted', 'info');
  document.getElementById('admin-main').innerHTML = renderAdminSubmissions();
}

// ═══════════════════════════════════════════════
//  DECLARE RESULTS (Event-based bulk view)
// ═══════════════════════════════════════════════
let resultsEventFilter = '';

function renderAdminResults() {
  const all = getAllSubmissions();
  // Combine ALL events: competitions from DATA + admin custom events + any event names referenced by submissions
  const allEvents = getEvents().filter(e => e.type === 'competition');
  const eventTitlesFromSubs = [...new Set(all.map(s => s.event).filter(Boolean))];
  const eventTitlesFromEvents = allEvents.map(e => e.title);
  // Merge + dedupe, preserving order (events list first, then orphan event titles from submissions)
  const events = [...new Set([...eventTitlesFromEvents, ...eventTitlesFromSubs])];

  // Default to first event with pending submissions, else first event in list
  if (!resultsEventFilter && events.length) {
    const firstPending = events.find(ev => all.some(s => s.event === ev && !s.resultStatus));
    resultsEventFilter = firstPending || events[0];
  }

  const eventSubs = resultsEventFilter ? all.filter(s => s.event === resultsEventFilter) : [];
  const pending = eventSubs.filter(s => !s.resultStatus);
  const declared = eventSubs.filter(s => s.resultStatus);
  // Find event metadata for the selected event
  const selectedEventMeta = allEvents.find(e => e.title === resultsEventFilter);

  return `
    <div class="admin-header">
      <div>
        <h1>Declare Results</h1>
        <p style="color:var(--text-muted);font-size:0.88rem">Select an event and declare winners &amp; participation results</p>
      </div>
    </div>

    <div class="admin-filters">
      <select class="form-select" style="max-width:360px" onchange="resultsEventFilter=this.value;document.getElementById('admin-main').innerHTML=renderAdminResults()">
        <option value="">Select Event</option>
        ${events.map(ev => {
          const cnt = all.filter(s => s.event === ev).length;
          const pendCnt = all.filter(s => s.event === ev && !s.resultStatus).length;
          const meta = allEvents.find(e => e.title === ev);
          const label = meta ? `${ev} \u2014 ${meta.monthName} ${meta.year}` : ev;
          const suffix = cnt > 0 ? ` (${cnt} submissions, ${pendCnt} pending)` : ' (no submissions yet)';
          return `<option value="${escapeHtml(ev)}" ${resultsEventFilter === ev ? 'selected' : ''}>${escapeHtml(label)}${suffix}</option>`;
        }).join('')}
      </select>
      ${eventSubs.length && pending.length ? `
        <button class="btn btn-primary btn-sm" onclick="bulkDeclare('Participated')">Mark All Remaining as Participated</button>
      ` : ''}
    </div>

    ${!resultsEventFilter ? `
      <div class="admin-card">
        <div class="admin-card-body" style="text-align:center;padding:60px 20px">
          <div style="font-size:3rem;margin-bottom:12px">\uD83C\uDFC6</div>
          <h3 style="margin-bottom:8px">Select an event to manage results</h3>
          <p style="color:var(--text-muted);font-size:0.88rem">${events.length} event${events.length !== 1 ? 's' : ''} available. Pick one from the dropdown above.</p>
        </div>
      </div>
    ` : `
      <!-- Summary bar -->
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div class="admin-stat" style="flex:1">
          <div class="label">Total</div>
          <div class="value" style="font-size:1.5rem">${eventSubs.length}</div>
        </div>
        <div class="admin-stat" style="flex:1;border-left:3px solid var(--warning)">
          <div class="label">Pending</div>
          <div class="value" style="font-size:1.5rem;color:var(--warning)">${pending.length}</div>
        </div>
        <div class="admin-stat" style="flex:1;border-left:3px solid var(--gold)">
          <div class="label">Winners</div>
          <div class="value" style="font-size:1.5rem;color:var(--gold)">${eventSubs.filter(s=>s.resultStatus==='Winner').length}</div>
        </div>
        <div class="admin-stat" style="flex:1;border-left:3px solid var(--primary)">
          <div class="label">Participated</div>
          <div class="value" style="font-size:1.5rem;color:var(--primary)">${eventSubs.filter(s=>s.resultStatus==='Participated').length}</div>
        </div>
      </div>

      ${selectedEventMeta ? `
        <div class="admin-card" style="margin-bottom:16px;background:var(--primary-pale);border-color:var(--primary-light)">
          <div class="admin-card-body" style="padding:16px 24px">
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
              <div>
                <div style="font-size:0.72rem;color:var(--primary);font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Event Info</div>
                <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-top:2px">${escapeHtml(selectedEventMeta.title)}</div>
              </div>
              <div style="color:var(--text-secondary);font-size:0.82rem">
                <strong>Date:</strong> ${selectedEventMeta.monthName} ${selectedEventMeta.day}, ${selectedEventMeta.year}
                ${selectedEventMeta.prize ? ` &middot; <strong>Prize:</strong> ${escapeHtml(selectedEventMeta.prize)}` : ''}
                ${selectedEventMeta.deadline ? ` &middot; <strong>Deadline:</strong> ${escapeHtml(selectedEventMeta.deadline)}` : ''}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="admin-card">
        <div class="admin-card-header">
          <h3>${escapeHtml(resultsEventFilter)} &mdash; Submissions (${eventSubs.length})</h3>
        </div>
        <div class="admin-card-body flush" style="overflow-x:auto">
          ${eventSubs.length === 0 ? `
            <div style="padding:50px 20px;text-align:center">
              <div style="font-size:2.5rem;margin-bottom:12px;opacity:0.5">\uD83D\uDDBC\uFE0F</div>
              <h4 style="color:var(--text-secondary);margin-bottom:8px">No submissions yet for this event</h4>
              <p style="color:var(--text-muted);font-size:0.85rem">Once students start submitting artwork, they'll appear here for result declaration.</p>
            </div>
          ` : `
          <table class="admin-table">
            <thead><tr><th>Artwork</th><th>User</th><th>Category</th><th>Medium</th><th>School</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${eventSubs.map(s => `
                <tr>
                  <td style="font-weight:600;color:var(--navy)">${escapeHtml(s.artTitle)}</td>
                  <td style="font-size:0.82rem">${escapeHtml(s.userEmail)}</td>
                  <td style="font-size:0.82rem">${escapeHtml(s.category || '-')}</td>
                  <td style="font-size:0.82rem">${escapeHtml(s.medium || '-')}</td>
                  <td style="font-size:0.82rem">${escapeHtml(s.school || '-')}</td>
                  <td>${statusPill(s)}</td>
                  <td>
                    <div class="actions">
                      ${!s.resultStatus ? `
                        <button class="btn btn-success btn-xs" onclick="declareResult('${escapeHtml(s.userEmail)}',${s.id},'Winner')">Winner</button>
                        <button class="btn btn-primary btn-xs" onclick="declareResult('${escapeHtml(s.userEmail)}',${s.id},'Participated')">Participated</button>
                      ` : `
                        <button class="btn btn-outline btn-xs" onclick="undeclareResult('${escapeHtml(s.userEmail)}',${s.id})">Reset</button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          `}
        </div>
      </div>
    `}
  `;
}

function bulkDeclare(status) {
  if (!confirm('Mark all remaining pending submissions as "' + status + '"?')) return;
  const all = getAllSubmissions();
  const pending = all.filter(s => s.event === resultsEventFilter && !s.resultStatus);
  pending.forEach(s => {
    updateSubmission(s.userEmail, s.id, { resultStatus: status, status: status });
  });
  showToast(pending.length + ' submissions marked as ' + status, 'success');
  document.getElementById('admin-main').innerHTML = renderAdminResults();
}

// ═══════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════
function renderAdminUsers() {
  const users = getAllUsers();
  const allSubs = getAllSubmissions();

  return `
    <div class="admin-header">
      <div>
        <h1>Users</h1>
        <p style="color:var(--text-muted);font-size:0.88rem">${users.length} registered users</p>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-body flush" style="overflow-x:auto">
        ${users.length ? `
        <table class="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Joined</th><th>Submissions</th><th>Results</th></tr></thead>
          <tbody>
            ${users.map(u => {
              const uSubs = allSubs.filter(s => s.userEmail === u.email);
              const uDeclared = uSubs.filter(s => s.resultStatus);
              const uWins = uSubs.filter(s => s.resultStatus === 'Winner');
              return `
              <tr>
                <td style="font-weight:600;color:var(--navy)">${escapeHtml(u.name)}</td>
                <td style="font-size:0.82rem">${escapeHtml(u.email)}</td>
                <td style="font-size:0.82rem">${escapeHtml(u.mobile || '-')}</td>
                <td style="white-space:nowrap;font-size:0.82rem">${u.joined || '-'}</td>
                <td><span class="pill pill-primary">${uSubs.length}</span></td>
                <td>
                  ${uDeclared.length ? `<span class="pill pill-primary">${uDeclared.length} declared</span>` : '<span style="color:var(--text-muted);font-size:0.82rem">None</span>'}
                  ${uWins.length ? ` <span class="pill rank-gold">${uWins.length} win${uWins.length>1?'s':''}</span>` : ''}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>` : '<p style="padding:40px;text-align:center;color:var(--text-muted)">No users registered yet</p>'}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════════════
let showEventForm = false;
let editingEvent = null;

function renderAdminEvents() {
  const baseEvents = DATA.events;
  const customEvents = getCustomEvents();
  const allEvents = [...baseEvents, ...customEvents];

  let formHtml = '';
  if (showEventForm) {
    const e = editingEvent || {};
    formHtml = `
      <div class="admin-card" style="margin-bottom:24px">
        <div class="admin-card-header"><h3>${editingEvent ? 'Edit Event' : 'Add New Event'}</h3></div>
        <div class="admin-card-body">
          <div class="event-form-grid">
            <div class="form-group">
              <label class="form-label">Event Title *</label>
              <input id="ef-title" class="form-input" value="${escapeHtml(e.title || '')}" placeholder="e.g. Nature's Colors" />
            </div>
            <div class="form-group">
              <label class="form-label">Type *</label>
              <select id="ef-type" class="form-select">
                <option value="competition" ${e.type==='competition'?'selected':''}>Competition</option>
                <option value="workshop" ${e.type==='workshop'?'selected':''}>Workshop</option>
                <option value="special" ${e.type==='special'?'selected':''}>Special Event</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Day *</label>
              <input id="ef-day" class="form-input" type="number" min="1" max="31" value="${e.day || ''}" placeholder="1-31" />
            </div>
            <div class="form-group">
              <label class="form-label">Month *</label>
              <select id="ef-month" class="form-select">
                ${['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) =>
                  `<option value="${i+1}" ${e.month===(i+1)?'selected':''}>${m}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Year *</label>
              <input id="ef-year" class="form-input" type="number" value="${e.year || 2026}" />
            </div>
            <div class="form-group">
              <label class="form-label">Time</label>
              <input id="ef-time" class="form-input" value="${escapeHtml(e.time || '')}" placeholder="e.g. 10:00 AM - 10:00 PM" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea id="ef-desc" class="form-textarea" style="min-height:80px">${escapeHtml(e.description || '')}</textarea>
          </div>
          <div class="event-form-grid">
            <div class="form-group">
              <label class="form-label">Prize (for competitions)</label>
              <input id="ef-prize" class="form-input" value="${escapeHtml(e.prize || '')}" placeholder="e.g. Rs.10,000 + Certificate" />
            </div>
            <div class="form-group">
              <label class="form-label">Deadline</label>
              <input id="ef-deadline" class="form-input" value="${escapeHtml(e.deadline || '')}" placeholder="e.g. April 20, 2026" />
            </div>
          </div>
          <div style="display:flex;gap:12px;margin-top:8px">
            <button class="btn btn-primary" onclick="saveEvent()">Save Event</button>
            <button class="btn btn-outline" onclick="cancelEventForm()">Cancel</button>
          </div>
        </div>
      </div>`;
  }

  const monthNames = ['','JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

  return `
    <div class="admin-header">
      <div>
        <h1>Events</h1>
        <p style="color:var(--text-muted);font-size:0.88rem">${allEvents.length} total events (${baseEvents.length} default + ${customEvents.length} custom)</p>
      </div>
      ${!showEventForm ? `<button class="btn btn-primary btn-sm" onclick="openEventForm()">+ Add Event</button>` : ''}
    </div>

    ${formHtml}

    <div class="admin-card">
      <div class="admin-card-body flush" style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Prize</th><th>Deadline</th><th>Source</th><th>Actions</th></tr></thead>
          <tbody>
            ${allEvents.map((e, i) => {
              const isCustom = !baseEvents.includes(e);
              const typePill = e.type === 'competition' ? 'pill-primary' : e.type === 'workshop' ? 'pill-gold' : 'pill-gray';
              return `
              <tr>
                <td style="font-weight:600;color:var(--navy)">${escapeHtml(e.title)}</td>
                <td><span class="pill ${typePill}">${e.type}</span></td>
                <td style="white-space:nowrap">${e.monthName || monthNames[e.month] || ''} ${e.day}, ${e.year}</td>
                <td style="font-size:0.82rem">${escapeHtml(e.prize || '-')}</td>
                <td style="font-size:0.82rem;white-space:nowrap">${escapeHtml(e.deadline || '-')}</td>
                <td>${isCustom ? '<span class="pill pill-primary">Custom</span>' : '<span class="pill pill-gray">Default</span>'}</td>
                <td>
                  <div class="actions">
                    ${isCustom ? `
                      <button class="btn btn-outline btn-xs" onclick="editEvent(${customEvents.indexOf(e)})">Edit</button>
                      <button class="btn btn-danger btn-xs" onclick="confirmDeleteEvent(${customEvents.indexOf(e)})">Del</button>
                    ` : '<span style="color:var(--text-muted);font-size:0.75rem">Read-only</span>'}
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openEventForm(event) {
  showEventForm = true;
  editingEvent = event || null;
  document.getElementById('admin-main').innerHTML = renderAdminEvents();
}

function cancelEventForm() {
  showEventForm = false;
  editingEvent = null;
  document.getElementById('admin-main').innerHTML = renderAdminEvents();
}

function saveEvent() {
  const title = document.getElementById('ef-title')?.value.trim();
  const type = document.getElementById('ef-type')?.value;
  const day = parseInt(document.getElementById('ef-day')?.value);
  const month = parseInt(document.getElementById('ef-month')?.value);
  const year = parseInt(document.getElementById('ef-year')?.value);
  const time = document.getElementById('ef-time')?.value.trim();
  const description = document.getElementById('ef-desc')?.value.trim();
  const prize = document.getElementById('ef-prize')?.value.trim();
  const deadline = document.getElementById('ef-deadline')?.value.trim();

  if (!title || !type || !day || !month || !year || !description) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const monthNames = ['','JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const eventObj = {
    id: editingEvent?.id || Date.now(),
    title, type, day, month, year,
    monthName: monthNames[month],
    time: time || '10:00 AM \u2013 10:00 PM',
    description,
    prize: prize || undefined,
    deadline: deadline || undefined,
  };

  const custom = getCustomEvents();
  if (editingEvent) {
    const idx = custom.findIndex(e => e.id === editingEvent.id);
    if (idx >= 0) custom[idx] = eventObj;
  } else {
    custom.push(eventObj);
  }
  saveCustomEvents(custom);

  showEventForm = false;
  editingEvent = null;
  showToast(editingEvent ? 'Event updated' : 'Event added', 'success');
  document.getElementById('admin-main').innerHTML = renderAdminEvents();
}

function editEvent(customIdx) {
  const custom = getCustomEvents();
  if (custom[customIdx]) openEventForm(custom[customIdx]);
}

function confirmDeleteEvent(customIdx) {
  if (!confirm('Delete this custom event?')) return;
  const custom = getCustomEvents();
  custom.splice(customIdx, 1);
  saveCustomEvents(custom);
  showToast('Event deleted', 'info');
  document.getElementById('admin-main').innerHTML = renderAdminEvents();
}
