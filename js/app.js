// ============================================
//  ART FOR AWARENESS — Core App & Router
//  Fixed: Auth, XSS, Modals, Certificates, Validation
// ============================================

// ─── Utility: HTML escaping (prevents XSS) ───
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Utility: Email validation ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Utility: Password hash (demo — production needs server-side bcrypt) ───
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

// ═══════════════════════════════════════════════
//  GOOGLE SIGN-IN (Google Identity Services)
// ═══════════════════════════════════════════════
// INSTRUCTIONS: Replace this with your Google Cloud Console Client ID.
// 1. Go to https://console.cloud.google.com/apis/credentials
// 2. Create a project (or select existing)
// 3. Configure OAuth Consent Screen (External, add your domain)
// 4. Create OAuth 2.0 Client ID (Web application)
// 5. Add Authorized JavaScript Origins:
//    - http://localhost:8090 (for local dev)
//    - https://yourdomain.com (for production)
// 6. Copy the Client ID and paste it below.
const GOOGLE_CLIENT_ID = ''; // <-- PASTE YOUR CLIENT ID HERE

let _googleInitialized = false;

function initGoogleSignIn() {
  if (_googleInitialized || !GOOGLE_CLIENT_ID || typeof google === 'undefined') return;
  _googleInitialized = true;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
  });

  // Render button in login modal
  const loginBtn = document.getElementById('google-signin-btn');
  if (loginBtn) {
    google.accounts.id.renderButton(loginBtn, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: 320,
    });
  }

  // Render button in signup modal
  const signupBtn = document.getElementById('google-signup-btn');
  if (signupBtn) {
    google.accounts.id.renderButton(signupBtn, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      shape: 'rectangular',
      width: 320,
    });
  }
}

// Decode JWT without external library (Google ID tokens are base64url-encoded JSON)
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(payload);
  } catch (e) { return null; }
}

function handleGoogleCredential(response) {
  const payload = decodeJwt(response.credential);
  if (!payload || !payload.email) {
    showToast('Google sign-in failed. Please try again.', 'error');
    return;
  }

  const email = payload.email;
  const name = payload.name || email.split('@')[0];
  const picture = payload.picture || '';

  // Check if user already exists
  let stored = JSON.parse(localStorage.getItem('aba_user_' + email) || 'null');

  if (!stored) {
    // Create new account from Google
    stored = {
      name: name,
      email: email,
      mobile: '',
      provider: 'Google',
      picture: picture,
      googleId: payload.sub,
      joined: new Date().toLocaleDateString('en-IN'),
    };
    localStorage.setItem('aba_user_' + email, JSON.stringify(stored));
  } else {
    // Update existing account with latest Google info
    stored.picture = picture;
    stored.googleId = payload.sub;
    if (!stored.provider) stored.provider = 'Google';
    localStorage.setItem('aba_user_' + email, JSON.stringify(stored));
  }

  // Save session
  AUTH.save({ name: stored.name, email: stored.email, mobile: stored.mobile, provider: 'Google', picture: picture, joined: stored.joined });
  closeModal('login-modal');
  closeModal('signup-modal');
  updateHeaderAuth();
  showToast('Signed in as ' + escapeHtml(stored.name) + '!', 'success');
  navigate('dashboard');
}

// Initialize Google Sign-In when the page loads and when modals open
document.addEventListener('DOMContentLoaded', () => {
  // Retry initialization periodically until Google SDK loads
  const interval = setInterval(() => {
    if (typeof google !== 'undefined' && google.accounts) {
      initGoogleSignIn();
      clearInterval(interval);
    }
  }, 500);
  // Stop retrying after 10 seconds
  setTimeout(() => clearInterval(interval), 10000);
});

// Re-render Google buttons when modals open (they get destroyed on modal close/reopen)
const _origOpenModal = typeof openModal === 'function' ? openModal : null;

// ─── Carousel interval tracker (cleared on page nav) ───
let _carouselInterval = null;

// ─── Router ───
function navigate(page) {
  window.location.hash = page;
}

function getPage() {
  const page = window.location.hash.replace('#', '') || 'home';
  // Contact has been merged into About — render About page when hash is #contact
  if (page === 'contact') {
    setTimeout(() => {
      const target = document.getElementById('get-in-touch');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
    return 'about';
  }
  return page;
}

function renderPage() {
  const page = getPage();
  const outlet = document.getElementById('page-content');

  // Clean up previous page resources
  if (_carouselInterval) { clearInterval(_carouselInterval); _carouselInterval = null; }

  // Update nav active state — use raw hash for contact (since it renders 'about')
  const rawHash = window.location.hash.replace('#', '') || 'home';
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === rawHash);
  });

  // Close mobile menu on navigate
  const mobileNav = document.getElementById('main-nav');
  if (mobileNav) mobileNav.classList.remove('open');

  // Update header buttons based on auth
  updateHeaderAuth();

  // Dashboard guard
  if (page === 'dashboard' && !AUTH.isLoggedIn()) {
    openLoginModal();
    window.location.hash = 'home';
    return;
  }

  const pages = {
    home: renderHome,
    events: renderEvents,
    results: renderResults,
    gallery: renderGallery,
    organization: renderOrganization,
    about: renderAbout,
    dashboard: renderDashboard,
  };

  const fn = pages[page] || (typeof render404 === 'function' ? render404 : renderHome);
  outlet.innerHTML = '';

  // Re-trigger fade animation on SPA navigation
  outlet.style.animation = 'none';
  outlet.offsetHeight; // force reflow
  outlet.style.animation = '';

  outlet.appendChild(fn());
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Run page-specific post-render hooks
  if (page === 'home') initHome();
  if (page === 'events') initCalendar();
  if (page === 'gallery') initGallery();
}

window.addEventListener('hashchange', renderPage);
window.addEventListener('DOMContentLoaded', renderPage);

// ─── Auth UI ───
function updateHeaderAuth() {
  const loginBtn = document.getElementById('btn-header-login');
  const dashBtn = document.getElementById('btn-header-dash');
  const loggedIn = AUTH.isLoggedIn();
  if (loginBtn) loginBtn.classList.toggle('hidden', loggedIn);
  if (dashBtn) dashBtn.classList.toggle('hidden', !loggedIn);
}

// ─── Modal helpers ───
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Re-render Google Sign-In buttons when auth modals open
  if ((id === 'login-modal' || id === 'signup-modal') && GOOGLE_CLIENT_ID && typeof google !== 'undefined') {
    setTimeout(() => initGoogleSignIn(), 200);
  }
  // Focus first focusable element
  setTimeout(() => {
    const focusable = el.querySelector('input:not([type="hidden"]):not([style*="display:none"]), select, textarea, button.form-submit');
    if (focusable) focusable.focus();
  }, 300);
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
  // Reset login form fields
  if (id === 'login-modal') {
    const e1 = document.getElementById('login-email');
    const e2 = document.getElementById('login-password');
    if (e1) e1.value = '';
    if (e2) e2.value = '';
  }
  // Reset signup form fields
  if (id === 'signup-modal') {
    ['signup-name', 'signup-email', 'signup-mobile', 'signup-password'].forEach(fid => {
      const f = document.getElementById(fid);
      if (f) f.value = '';
    });
  }
  // Reset registration wizard state
  if (id === 'reg-modal') {
    regStep = 1;
    regData = {};
  }
}

// Click overlay to close
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});

// Escape key closes the topmost open modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal-overlay.open');
    if (openModals.length) closeModal(openModals[openModals.length - 1].id);
  }
});

// Focus trap inside open modals
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const openEl = document.querySelector('.modal-overlay.open');
  if (!openEl) return;
  const focusable = openEl.querySelectorAll('input:not([style*="display:none"]), button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

function openLoginModal() { openModal('login-modal'); }
function switchToSignup() { closeModal('login-modal'); openModal('signup-modal'); }
function switchToLogin() { closeModal('signup-modal'); openModal('login-modal'); }

// ─── Auth actions ───
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  if (!email || !pass) { showToast('Please fill in all fields', 'error'); return; }
  if (!isValidEmail(email)) { showToast('Please enter a valid email address', 'error'); return; }

  const stored = JSON.parse(localStorage.getItem('aba_user_' + email) || 'null');
  if (!stored) {
    showToast('No account found with this email. Please sign up first.', 'error');
    return;
  }
  // Check hashed password (new accounts)
  if (stored.passwordHash) {
    if (stored.passwordHash !== hashPassword(pass)) {
      showToast('Incorrect password. Please try again.', 'error');
      return;
    }
  }
  // Legacy plaintext password migration
  else if (stored.password) {
    if (stored.password !== pass) {
      showToast('Incorrect password. Please try again.', 'error');
      return;
    }
    // Migrate to hashed
    stored.passwordHash = hashPassword(pass);
    delete stored.password;
    localStorage.setItem('aba_user_' + email, JSON.stringify(stored));
  }
  // Social login accounts (no password)
  else if (!stored.provider) {
    showToast('Incorrect password. Please try again.', 'error');
    return;
  }

  // Save session (without password hash)
  const session = { name: stored.name, email: stored.email, mobile: stored.mobile, joined: stored.joined, provider: stored.provider };
  AUTH.save(session);
  closeModal('login-modal');
  updateHeaderAuth();
  showToast('Welcome back, ' + escapeHtml(stored.name) + '!', 'success');
}

function doSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();
  const city = document.getElementById('signup-city')?.value.trim() || '';
  const state = document.getElementById('signup-state')?.value || '';
  const pass = document.getElementById('signup-password').value;
  const terms = document.getElementById('signup-terms')?.checked;

  if (!name || !email || !pass) { showToast('Please fill all required fields', 'error'); return; }
  if (!isValidEmail(email)) { showToast('Please enter a valid email address', 'error'); return; }
  if (pass.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
  if (!terms) { showToast('Please agree to the Terms & Conditions', 'error'); return; }

  if (localStorage.getItem('aba_user_' + email)) {
    showToast('An account with this email already exists. Please sign in.', 'error');
    return;
  }

  const user = { name, email, mobile, city, state, passwordHash: hashPassword(pass), joined: new Date().toLocaleDateString('en-IN') };
  localStorage.setItem('aba_user_' + email, JSON.stringify(user));
  AUTH.save({ name, email, mobile, city, state, joined: user.joined });
  closeModal('signup-modal');
  updateHeaderAuth();
  showToast('Account created! Welcome, ' + escapeHtml(name) + '!', 'success');
  // Redirect new user to dashboard
  navigate('dashboard');
}

function doLogout() {
  AUTH.logout();
  updateHeaderAuth();
  navigate('home');
  showToast('Signed out successfully', 'info');
}

// ─── Toast (XSS-safe, with exit animation and limit) ───
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  // Limit to 5 toasts
  while (c.children.length >= 5) c.removeChild(c.firstChild);

  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.setAttribute('role', 'alert');
  const icons = { success: '\u2713', error: '\u2717', info: 'i' };
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.textContent = icons[type] || 'i';
  const textSpan = document.createElement('span');
  textSpan.textContent = msg; // textContent — XSS safe
  t.appendChild(iconSpan);
  t.appendChild(textSpan);
  c.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(40px)';
    t.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ─── Newsletter ───
function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  const email = input?.value.trim();
  if (!email) { showToast('Please enter your email', 'error'); return; }
  if (!isValidEmail(email)) { showToast('Please enter a valid email address', 'error'); return; }
  // Persist subscriber
  try {
    const subs = JSON.parse(localStorage.getItem('aba_newsletter_subscribers') || '[]');
    if (!subs.includes(email)) { subs.push(email); localStorage.setItem('aba_newsletter_subscribers', JSON.stringify(subs)); }
  } catch (e) { /* quota */ }
  showToast('Subscribed! Thank you!', 'success');
  if (input) input.value = '';
}

// ─── Registration flow ───
let regStep = 1;
let regData = {};

function startRegistration() {
  if (!AUTH.isLoggedIn()) { openLoginModal(); return; }
  regStep = 1;
  regData = {};
  renderRegStep();
  openModal('reg-modal');
}

function renderRegStep() {
  const content = document.getElementById('reg-wizard-content');
  if (!content) return;

  const steps = ['Personal Info', 'Event', 'Upload Artwork', 'Submit'];
  const stepsHTML = steps.map((s, i) => `
    <div class="wizard-step">
      <div class="step-circle ${regStep > i + 1 ? 'done' : regStep === i + 1 ? 'active' : ''}">${regStep > i + 1 ? '\u2713' : i + 1}</div>
      ${i < steps.length - 1 ? `<div class="step-connector ${regStep > i + 1 ? 'done' : ''}"></div>` : ''}
    </div>`).join('');

  const user = AUTH.user;
  let body = '';

  if (regStep === 1) {
    // Only carry over fields the user has actively typed during this wizard session.
    // Do NOT pre-fill from logged-in account (avoids stale "Google User" defaults).
    body = `
      <h3 style="margin-bottom:24px">Personal Information</h3>
      <div class="form-row">
        <div class="form-group"><label class="form-label" for="rf-name">Full Name *</label>
          <input id="rf-name" class="form-input" value="${escapeHtml(regData.name || '')}" placeholder="Student's full name"/></div>
        <div class="form-group"><label class="form-label" for="rf-dob">Date of Birth *</label>
          <input id="rf-dob" class="form-input" type="date" value="${regData.dob || ''}" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label" for="rf-age">Age</label>
          <input id="rf-age" class="form-input" type="number" min="6" max="17" placeholder="6–17" value="${regData.age || ''}" /></div>
        <div class="form-group"><label class="form-label" for="rf-cat">Category *</label>
          <select id="rf-cat" class="form-select">
            <option value="">Select Age Category</option>
            ${['Ages 6\u20137 (Young Explorers)','Ages 8\u20139 (Creative Sparks)','Ages 10\u201311 (Rising Artists)','Ages 12\u201313 (The Rising Tide)','Ages 14\u201315 (Vanguard Academy)','Ages 16\u201317 (Open Canvas)'].map(o =>
              `<option ${regData.category === o ? 'selected' : ''}>${o}</option>`
            ).join('')}
          </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label" for="rf-email">Email *</label>
          <input id="rf-email" class="form-input" type="email" value="${escapeHtml(regData.email || '')}" placeholder="you@example.com" /></div>
        <div class="form-group"><label class="form-label" for="rf-mobile">Mobile</label>
          <input id="rf-mobile" class="form-input" type="tel" value="${escapeHtml(regData.mobile || '')}" placeholder="+91 XXXXXXXXXX" /></div>
      </div>
      <div class="form-group"><label class="form-label" for="rf-school">School Name *</label>
        <input id="rf-school" class="form-input" placeholder="Your school name" value="${escapeHtml(regData.school || '')}" /></div>
      <button class="form-submit" onclick="regNext()">Continue \u2192</button>`;
  } else if (regStep === 2) {
    // Only show upcoming or current-month competitions (not past events)
    const now = new Date();
    const evts = DATA.events.filter(e => {
      if (e.type !== 'competition') return false;
      const evDate = new Date(e.year, (e.month || 1) - 1, e.day || 28); // use late in month to be lenient
      return evDate >= new Date(now.getFullYear(), now.getMonth(), 1); // from start of current month
    });
    body = `
      <h3 style="margin-bottom:24px">Select Event &amp; Theme</h3>
      <div class="form-group"><label class="form-label" for="rf-event">Competition Event *</label>
        <select id="rf-event" class="form-select">
          <option value="">Select Event</option>
          ${evts.map(e => `<option value="${escapeHtml(e.title)}" ${regData.event === e.title ? 'selected' : ''}>${escapeHtml(e.title)} \u2014 ${e.monthName} ${e.year}</option>`).join('')}
        </select></div>
      <div class="form-group" id="rf-event-info" style="display:none;background:var(--primary-pale);border-radius:var(--radius-md);padding:16px">
        <p id="rf-event-desc" style="color:var(--primary);font-size:0.9rem;font-weight:500"></p>
        <p id="rf-event-prize" style="color:var(--navy);font-weight:700;margin-top:8px;font-size:0.88rem"></p>
      </div>
      <div class="form-group"><label class="form-label" for="rf-medium">Art Medium / Technique</label>
        <select id="rf-medium" class="form-select">
          ${['Watercolor','Oil Pastel','Acrylic','Charcoal','Colored Pencil','Digital Art','Mixed Media','Ink & Pen','Other'].map(o =>
            `<option ${regData.medium === o ? 'selected' : ''}>${o}</option>`
          ).join('')}
        </select></div>
      <div style="display:flex;gap:12px;margin-top:8px">
        <button class="btn btn-outline" onclick="regBack()">\u2190 Back</button>
        <button class="form-submit" onclick="regNext()">Continue \u2192</button>
      </div>`;
  } else if (regStep === 3) {
    body = `
      <h3 style="margin-bottom:24px">Upload Your Artwork</h3>
      <div class="upload-zone" id="upload-zone" onclick="document.getElementById('rf-file').click()"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="handleDrop(event)">
        <div class="upload-icon">\uD83D\uDDBC\uFE0F</div>
        <h4>Click to upload or drag &amp; drop</h4>
        <p>JPG, PNG or WEBP &middot; Max 10MB</p>
        <input id="rf-file" type="file" accept=".jpg,.jpeg,.png,.webp" style="display:none" onchange="handleFileSelect(this)" />
      </div>
      <div class="upload-preview" id="upload-preview" ${regData.fileDataUrl ? 'style="display:block"' : ''}>
        <img id="upload-preview-img" src="${regData.fileDataUrl || ''}" alt="Preview" />
      </div>
      <div id="upload-error" style="color:var(--error);font-size:0.85rem;margin-top:8px;display:none"></div>
      <div class="form-group" style="margin-top:20px"><label class="form-label" for="rf-art-title">Artwork Title *</label>
        <input id="rf-art-title" class="form-input" placeholder="Give your artwork a title" value="${escapeHtml(regData.artTitle || '')}" /></div>
      <div class="form-group"><label class="form-label" for="rf-art-desc">Brief Description (optional)</label>
        <textarea id="rf-art-desc" class="form-textarea" placeholder="What inspired this artwork?" style="min-height:70px">${escapeHtml(regData.artDesc || '')}</textarea></div>
      <div style="display:flex;gap:12px;margin-top:8px">
        <button class="btn btn-outline" onclick="regBack()">\u2190 Back</button>
        <button class="form-submit" onclick="regNext()">Submit Artwork \u2192</button>
      </div>`;
  } else if (regStep === 4) {
    const artPreview = regData.fileDataUrl
      ? `<div style="margin:0 auto 24px;max-width:280px;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);border:3px solid var(--primary-pale)">
           <img src="${regData.fileDataUrl}" alt="Your artwork" style="width:100%;display:block" />
         </div>`
      : '';
    body = `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:3.5rem;margin-bottom:12px">\u2705</div>
        <h2 style="color:var(--primary);margin-bottom:8px">Thank You for Submitting!</h2>
        <p style="color:var(--text-secondary);margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto">
          Your artwork has been received successfully. Our jury will review all submissions and results will be announced soon.
        </p>

        ${artPreview}

        <div style="background:var(--bg);border-radius:var(--radius-lg);padding:20px;max-width:400px;margin:0 auto 20px;text-align:left">
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="color:var(--text-muted);font-size:0.85rem">Artwork</span>
            <span style="font-weight:600;color:var(--navy);font-size:0.85rem">${escapeHtml(regData.artTitle || 'Your Artwork')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="color:var(--text-muted);font-size:0.85rem">Event</span>
            <span style="font-weight:600;color:var(--navy);font-size:0.85rem">${escapeHtml(regData.event || 'Competition')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="color:var(--text-muted);font-size:0.85rem">Category</span>
            <span style="font-weight:600;color:var(--navy);font-size:0.85rem">${escapeHtml(regData.category || '-')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="color:var(--text-muted);font-size:0.85rem">Medium</span>
            <span style="font-weight:600;color:var(--navy);font-size:0.85rem">${escapeHtml(regData.medium || '-')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0">
            <span style="color:var(--text-muted);font-size:0.85rem">Status</span>
            <span class="pill pill-gold" style="font-size:0.7rem">Under Review</span>
          </div>
        </div>

        <div style="background:var(--primary-pale);border-radius:var(--radius-lg);padding:16px 20px;margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto">
          <p style="color:var(--primary);font-weight:600;font-size:0.88rem;margin-bottom:4px">\uD83C\uDF0D Your art spreads awareness!</p>
          <p style="font-size:0.82rem;color:var(--text-secondary)">Every submission helps build environmental awareness through creative expression.</p>
        </div>

        <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:20px">
          Certificates will be available after results are declared. Check the <strong>Results</strong> tab in your dashboard.
        </p>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="closeModal('reg-modal');navigate('dashboard')">Go to My Dashboard</button>
          <button class="btn btn-outline" onclick="closeModal('reg-modal');navigate('events')">View More Events</button>
        </div>
      </div>`;
  }

  content.innerHTML = `<div class="wizard-steps">${stepsHTML}</div>${body}`;

  // Bind event change for step 2
  const evtSel = document.getElementById('rf-event');
  if (evtSel) {
    evtSel.addEventListener('change', function () {
      const ev = DATA.events.find(e => e.title === this.value);
      const info = document.getElementById('rf-event-info');
      if (ev && info) {
        info.style.display = 'block';
        document.getElementById('rf-event-desc').textContent = ev.description;
        document.getElementById('rf-event-prize').textContent = '\uD83C\uDFC6 Prize: ' + (ev.prize || 'Certificate');
      } else if (info) {
        info.style.display = 'none';
      }
    });
    // Show info if already selected (navigating back)
    if (evtSel.value) evtSel.dispatchEvent(new Event('change'));
  }
}

function regNext() {
  if (regStep === 1) {
    const name = document.getElementById('rf-name')?.value.trim();
    const dob = document.getElementById('rf-dob')?.value;
    const cat = document.getElementById('rf-cat')?.value;
    const school = document.getElementById('rf-school')?.value.trim();
    const email = document.getElementById('rf-email')?.value.trim();
    const age = document.getElementById('rf-age')?.value;
    const mobile = document.getElementById('rf-mobile')?.value.trim();
    if (!name || !cat || !school) { showToast('Please fill Name, Category, and School', 'error'); return; }
    if (email && !isValidEmail(email)) { showToast('Please enter a valid email address', 'error'); return; }
    regData.name = name;
    regData.dob = dob;
    regData.age = age;
    regData.category = cat;
    regData.email = email;
    regData.mobile = mobile;
    regData.school = school;
  } else if (regStep === 2) {
    const event = document.getElementById('rf-event')?.value;
    if (!event) { showToast('Please select an event', 'error'); return; }
    regData.event = event;
    regData.medium = document.getElementById('rf-medium')?.value;
  } else if (regStep === 3) {
    const title = document.getElementById('rf-art-title')?.value.trim();
    if (!title) { showToast('Please enter your artwork title', 'error'); return; }
    if (!regData.fileSelected) { showToast('Please upload your artwork', 'error'); return; }
    regData.artTitle = title;
    regData.artDesc = document.getElementById('rf-art-desc')?.value;
    if (AUTH.isLoggedIn()) {
      try {
        AUTH.addSubmission({
          artTitle: regData.artTitle,
          artDesc: regData.artDesc,
          event: regData.event,
          medium: regData.medium,
          category: regData.category,
          school: regData.school,
          fileDataUrl: regData.fileDataUrl,
        });
      } catch (err) {
        // localStorage quota exceeded — try again without the image
        if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
          showToast('Storage full — saving submission without image preview', 'error');
          AUTH.addSubmission({
            artTitle: regData.artTitle,
            artDesc: regData.artDesc,
            event: regData.event,
            medium: regData.medium,
            category: regData.category,
            school: regData.school,
          });
        } else {
          throw err;
        }
      }
    }
  }
  if (regStep < 4) { regStep++; renderRegStep(); }
}

function regBack() {
  if (regStep > 1) { regStep--; renderRegStep(); }
}

function handleFileSelect(input) {
  validateAndPreviewFile(input.files[0]);
}

function handleDrop(e) {
  e.preventDefault();
  const zone = document.getElementById('upload-zone');
  if (zone) zone.classList.remove('drag-over');
  validateAndPreviewFile(e.dataTransfer.files[0]);
}

function validateAndPreviewFile(file) {
  const errEl = document.getElementById('upload-error');
  const preview = document.getElementById('upload-preview');
  const previewImg = document.getElementById('upload-preview-img');
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!file) return;
  if (!allowed.includes(file.type)) {
    if (errEl) { errEl.textContent = 'Invalid format. Please upload JPG, PNG, or WEBP.'; errEl.style.display = 'block'; }
    regData.fileSelected = false; return;
  }
  if (file.size > 10 * 1024 * 1024) {
    if (errEl) { errEl.textContent = 'File too large. Maximum size is 10MB.'; errEl.style.display = 'block'; }
    regData.fileSelected = false; return;
  }
  if (errEl) errEl.style.display = 'none';

  // Read full image for preview AND generate a compressed thumbnail for storage
  const reader = new FileReader();
  reader.onload = ev => {
    const fullDataUrl = ev.target.result;
    if (previewImg) previewImg.src = fullDataUrl;
    if (preview) preview.style.display = 'block';
    regData.fileSelected = true;

    // Compress to ~800px wide JPEG for localStorage (avoids quota errors)
    compressImage(fullDataUrl, 800, 0.85).then(compressed => {
      regData.fileDataUrl = compressed;
      regData.fileOriginalName = file.name;
      showToast('Artwork uploaded successfully', 'success');
    }).catch(() => {
      // Fallback to full image if compression fails
      regData.fileDataUrl = fullDataUrl;
      regData.fileOriginalName = file.name;
      showToast('Artwork uploaded successfully', 'success');
    });
  };
  reader.readAsDataURL(file);
}

// Compress a dataURL-encoded image to a smaller JPEG for localStorage storage.
function compressImage(dataUrl, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; // white background for transparent PNGs
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) { reject(err); }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ─── Certificate Generator (Canvas-based real PNG download) ───
function viewCertificate(type, eventName, winner) {
  const user = AUTH.user;
  if (!user) { showToast('Please log in to view certificates', 'error'); return; }
  const certContent = document.getElementById('cert-modal-content');
  if (!certContent) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const isWinner = type === 'winner';
  const safeName = escapeHtml(user.name || 'Artist Name');
  const safeEvent = escapeHtml(eventName || regData.event || "Nature's Colors \u2014 April 2026");
  const safeWinner = escapeHtml(winner || '1st Place');

  // Stable certificate ID
  const seed = (user.email || '') + (eventName || regData.event || '') + type;
  let ch = 0;
  for (let i = 0; i < seed.length; i++) { ch = ((ch << 5) - ch) + seed.charCodeAt(i); ch |= 0; }
  const certId = 'ABA-' + Math.abs(ch).toString(36).toUpperCase().padStart(8, '0');

  certContent.innerHTML = `
    <div id="cert-visual" style="
      background: linear-gradient(135deg, #0D2137 0%, #1a3a55 50%, #2E6B7A 100%);
      border-radius: var(--radius-xl); padding: 40px; text-align: center;
      position: relative; overflow: hidden; color: white; margin-bottom: 24px;
    ">
      <div style="position:absolute;top:-30px;left:-30px;width:120px;height:120px;border-radius:50%;background:rgba(197,160,40,0.15)"></div>
      <div style="position:absolute;bottom:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.05)"></div>
      <div style="position:relative;z-index:1">
        <div style="font-size:2.5rem;margin-bottom:8px">${isWinner ? '\uD83C\uDFC6' : '\uD83C\uDFA8'}</div>
        <p style="color:var(--gold-light);font-size:0.75rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px">Art for Awareness</p>
        <h2 style="color:white;font-size:1.5rem;margin-bottom:4px">${isWinner ? 'Winner Certificate' : 'Certificate of Participation'}</h2>
        <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:24px">This is to certify that</p>
        <h1 style="color:var(--gold-light);font-size:2rem;font-weight:900;margin-bottom:4px">${safeName}</h1>
        <p style="color:rgba(255,255,255,0.8);font-size:0.9rem;margin-bottom:20px">
          ${isWinner ? 'achieved <strong style="color:var(--gold-light)">' + safeWinner + '</strong> in' : 'successfully participated in'}
        </p>
        <div style="background:rgba(255,255,255,0.1);border-radius:var(--radius-md);padding:14px 24px;display:inline-block;margin-bottom:20px">
          <p style="color:white;font-weight:700;font-size:1.05rem">${safeEvent}</p>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:0.78rem">${dateStr}</p>
        <div style="display:flex;justify-content:space-around;margin-top:24px;border-top:1px solid rgba(255,255,255,0.15);padding-top:16px">
          <div><p style="color:rgba(255,255,255,0.5);font-size:0.7rem">Platform Director</p><p style="color:white;font-size:0.85rem;font-weight:700">Art for Awareness</p></div>
          <div style="text-align:right"><p style="color:rgba(255,255,255,0.5);font-size:0.7rem">Certificate ID</p><p style="color:white;font-size:0.85rem;font-weight:700">${certId}</p></div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center">
      <button class="btn btn-primary" onclick="downloadCertificate()">Download as PNG</button>
      <button class="btn btn-outline" onclick="closeModal('cert-modal')">Close</button>
    </div>`;
  openModal('cert-modal');
}

function downloadCertificate() {
  const user = AUTH.user;
  const canvas = document.getElementById('cert-canvas');
  if (!canvas || !user) return;

  const ctx = canvas.getContext('2d');
  const W = 1200, H = 800;
  canvas.width = W;
  canvas.height = H;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0D2137');
  grad.addColorStop(0.5, '#1a3a55');
  grad.addColorStop(1, '#2E6B7A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.fillStyle = 'rgba(197,160,40,0.12)';
  ctx.beginPath(); ctx.arc(80, 80, 120, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath(); ctx.arc(W - 80, H - 80, 160, 0, Math.PI * 2); ctx.fill();

  // Gold border
  ctx.strokeStyle = 'rgba(197,160,40,0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = 'rgba(197,160,40,0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  ctx.textAlign = 'center';

  // Platform name
  ctx.fillStyle = '#C5A028';
  ctx.font = '600 14px sans-serif';
  ctx.fillText('A R T   F O R   A W A R E N E S S', W / 2, 140);

  // Certificate type — check the visual modal to determine if winner or participation
  const certVisualEl = document.getElementById('cert-visual');
  const isWinnerCert = certVisualEl && certVisualEl.innerHTML.includes('Winner Certificate');
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 32px sans-serif';
  ctx.fillText(isWinnerCert ? 'Winner Certificate' : 'Certificate of Participation', W / 2, 200);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '400 16px sans-serif';
  ctx.fillText('This is to certify that', W / 2, 270);

  // Name
  ctx.fillStyle = '#f5d76e';
  ctx.font = '900 44px sans-serif';
  ctx.fillText(user.name || 'Artist Name', W / 2, 340);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '400 16px sans-serif';
  ctx.fillText(isWinnerCert ? 'achieved excellence in' : 'successfully participated in', W / 2, 400);

  // Event
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px sans-serif';
  ctx.fillText(regData.event || "Nature's Colors \u2014 April 2026", W / 2, 450);

  // Date
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 14px sans-serif';
  ctx.fillText(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 510);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(200, 570); ctx.lineTo(W - 200, 570); ctx.stroke();

  // Footer left
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 12px sans-serif';
  ctx.fillText('Platform Director', 200, 620);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px sans-serif';
  ctx.fillText('Art for Awareness', 200, 645);

  // Footer right
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 12px sans-serif';
  ctx.fillText('Certificate ID', W - 200, 620);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px sans-serif';
  const certSeed = (user.email || '') + (regData.event || '') + 'participation';
  let certHash = 0;
  for (let i = 0; i < certSeed.length; i++) { certHash = ((certHash << 5) - certHash) + certSeed.charCodeAt(i); certHash |= 0; }
  ctx.fillText('ABA-' + Math.abs(certHash).toString(36).toUpperCase().padStart(8, '0'), W - 200, 645);

  // Download
  const link = document.createElement('a');
  link.download = 'ArtForAwareness_Certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Certificate downloaded!', 'success');
}

// ─── Mobile menu ───
function toggleMobileMenu() {
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.toggle('open');
}

// ─── Forgot Password flow ───
let _resetEmail = '';
let _resetCode = '';

function openForgotPassword() {
  closeModal('login-modal');
  document.getElementById('forgot-step-1').style.display = 'block';
  document.getElementById('forgot-step-2').style.display = 'none';
  document.getElementById('forgot-step-3').style.display = 'none';
  const el = document.getElementById('forgot-email');
  if (el) el.value = '';
  openModal('forgot-modal');
}

function sendResetCode() {
  const email = document.getElementById('forgot-email')?.value.trim();
  if (!email || !isValidEmail(email)) { showToast('Please enter a valid email', 'error'); return; }
  const stored = JSON.parse(localStorage.getItem('aba_user_' + email) || 'null');
  if (!stored) { showToast('No account found with this email', 'error'); return; }
  _resetEmail = email;
  _resetCode = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById('forgot-step-1').style.display = 'none';
  document.getElementById('forgot-step-2').style.display = 'block';
  // Auto-fill the code for this demo (in production, this would be emailed)
  const codeEl = document.getElementById('forgot-code');
  if (codeEl) codeEl.value = _resetCode;
  document.getElementById('forgot-hint').textContent = 'A reset code has been sent to ' + email;
  showToast('Reset code sent to your email', 'success');
}

function verifyResetCode() {
  const code = document.getElementById('forgot-code')?.value.trim();
  if (code !== _resetCode) { showToast('Incorrect code. Please try again.', 'error'); return; }
  document.getElementById('forgot-step-2').style.display = 'none';
  document.getElementById('forgot-step-3').style.display = 'block';
  showToast('Code verified! Set your new password.', 'success');
}

function resetPassword() {
  const pass = document.getElementById('forgot-newpass')?.value;
  const confirm = document.getElementById('forgot-confirm')?.value;
  if (!pass || pass.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
  if (pass !== confirm) { showToast('Passwords do not match', 'error'); return; }
  const stored = JSON.parse(localStorage.getItem('aba_user_' + _resetEmail) || 'null');
  if (!stored) { showToast('Account not found', 'error'); return; }
  stored.passwordHash = hashPassword(pass);
  delete stored.password;
  localStorage.setItem('aba_user_' + _resetEmail, JSON.stringify(stored));
  closeModal('forgot-modal');
  _resetEmail = '';
  _resetCode = '';
  showToast('Password reset successfully! You can now sign in.', 'success');
  openLoginModal();
}

// ─── Enter-key form submission ───
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const t = e.target;
  if (t.id === 'login-email' || t.id === 'login-password') { e.preventDefault(); doLogin(); }
  else if (t.id === 'signup-name' || t.id === 'signup-email' || t.id === 'signup-mobile' || t.id === 'signup-password') { e.preventDefault(); doSignup(); }
  else if (t.id === 'contact-name' || t.id === 'contact-email') { e.preventDefault(); if (typeof submitContactForm === 'function') submitContactForm(); }
  else if (t.id === 'newsletter-email') { e.preventDefault(); subscribeNewsletter(); }
  else if (t.id === 'forgot-email') { e.preventDefault(); sendResetCode(); }
  else if (t.id === 'forgot-code') { e.preventDefault(); verifyResetCode(); }
  else if (t.id === 'forgot-newpass' || t.id === 'forgot-confirm') { e.preventDefault(); resetPassword(); }
});

// ─── Header scroll shadow ───
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
