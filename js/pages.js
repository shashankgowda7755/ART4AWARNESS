// ============================================
//  AWARENESS BY ART — Page Renderers & Init Hooks
// ============================================

// ─── 404 Page ───
function render404() {
  const el = document.createElement('div');
  el.innerHTML = `
    <section style="min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:48px 24px">
      <div>
        <div style="font-size:6rem;margin-bottom:16px;opacity:0.3">🎨</div>
        <h1 style="font-size:4rem;color:var(--primary);margin-bottom:8px">404</h1>
        <h2 style="margin-bottom:16px">Page Not Found</h2>
        <p style="color:var(--text-secondary);max-width:400px;margin:0 auto 32px">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div class="flex-center-wrap">
          <button class="btn btn-primary" onclick="navigate('home')">Go Home</button>
          <button class="btn btn-outline" onclick="navigate('events')">View Events</button>
        </div>
      </div>
    </section>`;
  return el;
}

// ─── Platform-wide computed stats (baseline + real activity) ───
// We blend a baseline (representing historical pilot data) with real submissions
// from localStorage so the home page reflects actual community activity.
function computePlatformStats() {
  const subs = (typeof getAllSubmissionsAcrossUsers === 'function') ? getAllSubmissionsAcrossUsers() : [];
  const users = (typeof getAllRegisteredUsers === 'function') ? getAllRegisteredUsers() : [];
  const realSchools = new Set(subs.map(s => s.school).filter(Boolean));
  const events = DATA.events.filter(e => e.type === 'competition');
  return {
    artworks: subs.length || '0',
    schools: realSchools.size || '0',
    users: users.length || '0',
    themes: events.length,
    hasData: subs.length > 0,
  };
}


// ═══════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════
function renderHome() {
  const el = document.createElement('div');

  const slides = [
    { bg: 'assets/banner1.png', tag: 'APRIL 2026 THEME', title: "Nature's Colors", desc: "Express the beauty of nature through paint, pencil or digital art. Open to all students aged 6–17.", cta1: 'Submit Artwork', cta1Action: 'startRegistration()', cta2: 'View Calendar', cta2Action: 'navigate("events")' },
    { bg: 'assets/banner2.png', tag: 'FREE COMPETITION', title: 'Art for Every Child', desc: "India's premier free monthly art competition. No fees. No barriers. Creativity with a cause.", cta1: 'Register Now', cta1Action: 'startRegistration()', cta2: 'Learn More', cta2Action: 'navigate("about")' },
    { bg: 'assets/banner3.png', tag: 'MONTHLY THEMES', title: 'Creativity Meets Awareness', desc: 'Every month, a new environmental theme. From Earth Day to Ocean Day — your art becomes a voice for the planet.', cta1: 'Get Started', cta1Action: 'startRegistration()', cta2: 'View Themes', cta2Action: 'navigate("events")' },
  ];

  // Show the 3 NEAREST upcoming competitions (future first, then recent past as fallback)
  const today = new Date();
  const allCompetitions = DATA.events.filter(e => e.type === 'competition').map(e => ({
    ...e,
    _date: new Date(e.year, (e.month || 1) - 1, e.day || 1)
  }));
  const upcoming = allCompetitions.filter(e => e._date >= today).sort((a, b) => a._date - b._date);
  const past = allCompetitions.filter(e => e._date < today).sort((a, b) => b._date - a._date);
  const upcomingEvents = [...upcoming, ...past].slice(0, 3);
  // Gallery of Masters — real admin-declared winners first, then static demo winners
  const realWinnerSubs = getAllSubmissionsAcrossUsers().filter(s => s.resultStatus === 'Winner');
  const realWinnerCards = realWinnerSubs.slice(0, 4).map(s => ({
    id: 'real_' + s.id,
    title: s.artTitle || 'Untitled',
    artist: s.userName || (s.userEmail || '').split('@')[0],
    rank: 1,
    category: s.medium || 'Mixed Media',
    ageGroup: s.category || 'Open',
    event: s.event,
    month: s.date,
    gradient: defaultGradient((s.artTitle || '') + (s.userEmail || '')),
    emoji: '🏆',
    fileDataUrl: s.fileDataUrl,
  }));
  const needDemo = Math.max(0, 4 - realWinnerCards.length);
  const winners = [...realWinnerCards, ...DATA.winners.slice(0, needDemo)];
  const categories = DATA.categories;
  const prizes = DATA.prizes;
  const faqs = DATA.faqs;

  el.innerHTML = `
    <!-- HERO CAROUSEL -->
    <section class="hero-carousel">
      <div class="carousel-slides" id="carousel-slides">
        ${slides.map(s => `
          <div class="carousel-slide">
            <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <span class="pill pill-gold slide-tag">${s.tag}</span>
              <h1 class="slide-title">${s.title}</h1>
              <p class="slide-desc">${s.desc}</p>
              <div class="slide-actions">
                <button class="btn btn-primary btn-lg" onclick="${s.cta1Action}">${s.cta1}</button>
                <button class="btn btn-outline" style="color:white;border-color:rgba(255,255,255,0.4)" onclick="${s.cta2Action}">${s.cta2}</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="carousel-arrow arrow-prev" id="carousel-prev" aria-label="Previous slide">&#8249;</button>
      <button class="carousel-arrow arrow-next" id="carousel-next" aria-label="Next slide">&#8250;</button>
      <div class="carousel-dots" id="carousel-dots">
        ${slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
      </div>
    </section>

    <!-- IMPACT STATS -->
    ${(() => {
      const stats = computePlatformStats();
      return `
    <section style="background:var(--bg-white);padding:40px 0">
      <div class="container">
        <div class="impact-stats-grid">
          <div class="impact-stat-card">
            <div class="impact-stat-icon" style="background:rgba(27,107,125,0.1);color:var(--primary)">🎨</div>
            <div class="impact-stat-value" style="color:var(--primary)">${stats.artworks}</div>
            <div class="impact-stat-label">Artworks Submitted</div>
          </div>
          <div class="impact-stat-card">
            <div class="impact-stat-icon" style="background:rgba(255,107,90,0.1);color:var(--secondary)">👨‍🎨</div>
            <div class="impact-stat-value" style="color:var(--secondary)">${stats.users}</div>
            <div class="impact-stat-label">Young Artists</div>
          </div>
          <div class="impact-stat-card">
            <div class="impact-stat-icon" style="background:rgba(255,181,71,0.1);color:var(--accent)">🏫</div>
            <div class="impact-stat-value" style="color:var(--accent)">${stats.schools}</div>
            <div class="impact-stat-label">Schools Registered</div>
          </div>
          <div class="impact-stat-card">
            <div class="impact-stat-icon" style="background:rgba(16,185,129,0.1);color:#10B981">📅</div>
            <div class="impact-stat-value" style="color:#10B981">${stats.themes}</div>
            <div class="impact-stat-label">Monthly Themes</div>
          </div>
        </div>
      </div>
    </section>`;
    })()}

    <!-- UPCOMING EVENTS -->
    <section class="section container" style="padding-top:0">
      <h2 class="section-title">Upcoming Competitions</h2>
      <p class="section-subtitle">Join thousands of young artists from across India in our monthly themed competitions.</p>
      <div class="grid-3">
        ${upcomingEvents.map(e => `
          <div class="event-card ${e.image ? 'has-image' : ''}">
            ${e.image ? `<div class="event-image"><img src="${e.image}" alt="${escapeHtml(e.title)}" loading="lazy" /></div>` : ''}
            <div class="event-card-inner">
              <div class="event-flex">
                <div>
                  <div class="event-date-num">${String(e.day).padStart(2, '0')}</div>
                  <div class="event-month">${e.monthName}</div>
                </div>
                <div style="flex:1">
                  <span class="pill pill-primary" style="margin-bottom:8px">${e.type}</span>
                  <h3 class="event-title">${e.title}</h3>
                  ${e.theme ? `<p style="font-size:0.78rem;color:var(--secondary);font-weight:600;margin-top:4px">${e.theme}</p>` : ''}
                </div>
              </div>
              <p class="event-desc">${e.description}</p>
              <div class="event-card-footer">
                ${e.prize ? `<p style="font-weight:700;color:var(--gold);font-size:0.88rem;margin-bottom:12px">🏆 ${e.prize}</p>` : ''}
                ${e.deadline ? `<p style="font-size:0.82rem;color:var(--text-muted)">Deadline: ${e.deadline}</p>` : ''}
                <button class="btn btn-primary btn-sm mt-8" onclick="startRegistration()">Submit Entry &rarr;</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="text-center mt-32">
        <button class="btn btn-outline" onclick="navigate('events')">View Full Calendar &rarr;</button>
      </div>
    </section>

    <!-- DREAM GENERATOR -->
    <section class="section container">
      <div class="dream-section">
        <div class="dream-content">
          <h2 class="dream-title">&#10024; Dream Generator</h2>
          <p class="dream-desc">Need inspiration? Our AI-powered prompt generator creates unique creative ideas to spark your imagination.</p>
          <button class="btn-generate" id="dream-btn">🎲 Generate an Idea</button>
          <div class="dream-output" id="dream-output">
            <p id="dream-text">Click "Generate" to get a unique art prompt...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WINNERS / CTA -->
    <section class="section container">
      ${winners.length ? `
      <h2 class="section-title">Gallery of Masters</h2>
      <p class="section-subtitle">Celebrating the exceptional talent of our competition winners.</p>
      <div class="grid-4">
        ${winners.map(w => {
          const rankCls = { 1: 'rank-gold', 2: 'rank-silver', 3: 'rank-bronze' };
          const rankLabel = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' };
          const rankIcon = { 1: '🥇', 2: '🥈', 3: '🥉' };
          const imgBlock = w.fileDataUrl
            ? `<img class="winner-img" src="${w.fileDataUrl}" alt="${escapeHtml(w.title)}" />`
            : `<div class="winner-img-placeholder" style="background:${w.gradient || 'var(--primary)'}"><span style="font-size:3rem">${w.emoji || '🏆'}</span></div>`;
          return `
          <div class="winner-card">
            ${imgBlock}
            <span class="winner-rank-badge ${rankCls[w.rank] || 'rank-gold'}">${rankIcon[w.rank] || '🏆'} ${rankLabel[w.rank] || 'Winner'}</span>
            <div class="winner-info">
              <h4 class="winner-name">${escapeHtml(w.title)}</h4>
              <p class="winner-artist">by ${escapeHtml(w.artist)}</p>
              <div class="winner-meta">
                <span class="winner-category">${escapeHtml(w.category)}</span>
                <span class="winner-age">${escapeHtml(w.ageGroup)}</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="text-center mt-32">
        <button class="btn btn-outline" onclick="navigate('results')">View All Results &rarr;</button>
      </div>
      ` : `
      <div style="text-align:center;padding:20px 0">
        <h2 class="section-title">Be the First Winner</h2>
        <p class="section-subtitle">Submit your artwork to this month's competition. Winners will be featured right here.</p>
        <button class="btn btn-primary btn-lg" onclick="startRegistration()">Submit Your Artwork &rarr;</button>
      </div>
      `}
    </section>

    <!-- CATEGORIES -->
    <section class="section container">
      <h2 class="section-title">Competition Categories</h2>
      <p class="section-subtitle">Six age-appropriate categories designed to nurture every stage of artistic development.</p>
      <div class="grid-3">
        ${categories.map(c => `
          <div class="category-card has-image ${c.style}">
            ${c.image ? `<div class="category-image"><img src="${c.image}" alt="${escapeHtml(c.title)}" loading="lazy" /></div>` : ''}
            <div class="category-content">
              <span class="category-age-pill">${c.label}</span>
              <h3>${c.title}</h3>
              <p style="margin-top:8px;font-size:0.88rem">${c.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- PRIZES -->
    <section class="section prizes-section">
      <div class="container">
        <h2 class="section-title" style="color:white">Prizes &amp; Recognition</h2>
        <p class="section-subtitle" style="color:rgba(255,255,255,0.6)">Outstanding art deserves outstanding recognition. Winners receive prizes, certificates, and national features.</p>
        <div class="grid-3">
          ${prizes.map(p => `
            <div class="prize-card ${p.featured ? 'featured' : ''}">
              <div class="prize-icon">${p.icon}</div>
              <div class="prize-amount">${p.amount}</div>
              <h4 class="prize-title">${p.title}</h4>
              <p class="prize-desc">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section container">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <p class="section-subtitle">Everything you need to know about participating in Art for Awareness.</p>
      <div style="max-width:720px;margin:0 auto">
        ${faqs.map((f, i) => `
          <div class="faq-item" data-faq="${i}">
            <div class="faq-question" onclick="toggleFaq(${i})">
              <span>${f.q}</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-inner">${f.a}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- CTA BANNER -->
    <section style="background:linear-gradient(135deg,var(--dark) 0%,var(--primary) 100%);padding:64px 0;text-align:center">
      <div class="container">
        <h2 style="color:white;margin-bottom:12px">Ready to Create with a Cause?</h2>
        <p style="color:rgba(255,255,255,0.75);max-width:480px;margin:0 auto 28px">Join thousands of young artists creating awareness through art. Free to participate, open to all students aged 6\u201317.</p>
        <div class="flex-center-wrap">
          <button class="btn btn-lg" style="background:var(--secondary);color:white" onclick="startRegistration()">Submit Your Artwork</button>
          <button class="btn btn-outline btn-lg" style="color:white;border-color:rgba(255,255,255,0.3)" onclick="navigate('about')">Learn More</button>
        </div>
      </div>
    </section>
  `;
  return el;
}

function toggleFaq(index) {
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    item.classList.toggle('open', i === index && !item.classList.contains('open'));
  });
}

function initHome() {
  // Carousel
  const slides = document.getElementById('carousel-slides');
  const dots = document.querySelectorAll('#carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!slides || !dots.length) return;

  let current = 0;
  const total = dots.length;

  function goToSlide(n) {
    current = ((n % total) + total) % total;
    slides.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goToSlide(current - 1));
  nextBtn.addEventListener('click', () => goToSlide(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goToSlide(+d.dataset.slide)));

  // Use global interval tracker so renderPage() can clean up on navigation
  if (_carouselInterval) clearInterval(_carouselInterval);
  _carouselInterval = setInterval(() => goToSlide(current + 1), 4000);
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => { if (_carouselInterval) { clearInterval(_carouselInterval); _carouselInterval = null; } });
    carousel.addEventListener('mouseleave', () => {
      if (_carouselInterval) clearInterval(_carouselInterval);
      _carouselInterval = setInterval(() => goToSlide(current + 1), 4000);
    });
  }

  // Dream Generator
  const dreamBtn = document.getElementById('dream-btn');
  const dreamText = document.getElementById('dream-text');
  if (dreamBtn && dreamText) {
    dreamBtn.addEventListener('click', () => {
      const prompts = DATA.dreamPrompts;
      const random = prompts[Math.floor(Math.random() * prompts.length)];
      dreamText.style.opacity = '0';
      dreamText.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        dreamText.textContent = random;
        dreamText.style.opacity = '1';
      }, 300);
    });
  }
}


// ═══════════════════════════════════════════════
//  EVENTS & CALENDAR PAGE
// ═══════════════════════════════════════════════
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
let calFilter = 'all';

function renderEvents() {
  // Reset calendar state on each render so UI and state match
  calMonth = new Date().getMonth();
  calYear = new Date().getFullYear();
  calFilter = 'all';
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="calendar-section">
      <div class="container">
        <h1 class="section-title" style="margin-bottom:8px">Events &amp; Calendar</h1>
        <p class="section-subtitle">Track all competitions, workshops, and special events on one page.</p>

        <!-- Filters -->
        <div class="filter-tabs" id="cal-filters">
          <button class="filter-tab active" data-filter="all">All Events</button>
          <button class="filter-tab" data-filter="competition">Competitions</button>
          <button class="filter-tab" data-filter="workshop">Workshops</button>
          <button class="filter-tab" data-filter="special">Special Events</button>
        </div>

        <div class="calendar-layout">
          <!-- Calendar Grid -->
          <div>
            <div class="calendar-grid-wrap">
              <div class="calendar-header" style="padding:20px 24px">
                <button class="calendar-nav-btn" id="cal-prev" aria-label="Previous month">&#8249;</button>
                <h3 class="calendar-month-title" id="cal-month-title"></h3>
                <button class="calendar-nav-btn" id="cal-next" aria-label="Next month">&#8250;</button>
              </div>
              <div class="calendar-weekdays">
                <div class="weekday">Sun</div><div class="weekday">Mon</div><div class="weekday">Tue</div>
                <div class="weekday">Wed</div><div class="weekday">Thu</div><div class="weekday">Fri</div><div class="weekday">Sat</div>
              </div>
              <div class="calendar-days" id="cal-days"></div>
            </div>
            <div class="calendar-legend" style="margin-top:16px">
              <div class="legend-item"><div class="legend-dot dot-competition"></div>Competition</div>
              <div class="legend-item"><div class="legend-dot dot-workshop"></div>Workshop</div>
              <div class="legend-item"><div class="legend-dot dot-special"></div>Special Event</div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="event-sidebar" id="event-sidebar">
            <h4 class="sidebar-title">Upcoming Events</h4>
            <div id="sidebar-events"></div>
          </div>
        </div>

        <!-- All Events List -->
        <div style="margin-top:48px">
          <h2 class="section-title">All Upcoming Events</h2>
          <div class="grid-3 mt-32" id="all-events-grid"></div>
        </div>
      </div>
    </section>
  `;
  return el;
}

function initCalendar() {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today = new Date();

  function getEventsForMonth(m, y) {
    return DATA.events.filter(e => {
      if (calFilter !== 'all' && e.type !== calFilter) return false;
      return e.month === m + 1 && e.year === y;
    });
  }

  function renderCalendarGrid() {
    const titleEl = document.getElementById('cal-month-title');
    const daysEl = document.getElementById('cal-days');
    if (!titleEl || !daysEl) return;

    titleEl.textContent = `${monthNames[calMonth]} ${calYear}`;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrev = new Date(calYear, calMonth, 0).getDate();
    const monthEvents = getEventsForMonth(calMonth, calYear);

    let html = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-day other-month"><div class="cal-day-num">${daysInPrev - i}</div></div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
      const dayEvents = monthEvents.filter(e => e.day === d);
      const dots = dayEvents.map(e => `<div class="cal-event-dot dot-${e.type}"></div>`).join('');

      html += `
        <div class="cal-day ${isToday ? 'today' : ''}" onclick="showDayEvents(${d})">
          <div class="cal-day-num">${d}</div>
          <div class="cal-day-events">${dots}</div>
        </div>`;
    }

    // Next month days
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="cal-day other-month"><div class="cal-day-num">${i}</div></div>`;
    }

    daysEl.innerHTML = html;
  }

  function renderSidebarEvents() {
    const container = document.getElementById('sidebar-events');
    if (!container) return;
    const events = DATA.events.filter(e => {
      if (calFilter !== 'all' && e.type !== calFilter) return false;
      return true;
    }).slice(0, 5);

    container.innerHTML = events.map(e => {
      const typePill = { competition: 'pill-primary', workshop: 'pill-gold', special: 'pill-gray' };
      return `
        <div class="sidebar-event-item" onclick="showEventDetail(${e.id})">
          <div class="sidebar-event-type">
            <span class="pill ${typePill[e.type] || 'pill-gray'}" style="font-size:0.65rem">${e.type}</span>
          </div>
          <div class="sidebar-event-name">${e.title}</div>
          <div class="sidebar-event-time">${e.monthName} ${e.day}, ${e.year} &middot; ${e.time}</div>
        </div>`;
    }).join('');
  }

  function renderAllEvents() {
    const grid = document.getElementById('all-events-grid');
    if (!grid) return;
    const events = DATA.events.filter(e => calFilter === 'all' || e.type === calFilter);
    grid.innerHTML = events.map(e => `
      <div class="event-card">
        <div class="event-flex">
          <div>
            <div class="event-date-num">${String(e.day).padStart(2, '0')}</div>
            <div class="event-month">${e.monthName}</div>
          </div>
          <div style="flex:1">
            <span class="pill ${e.type === 'competition' ? 'pill-primary' : e.type === 'workshop' ? 'pill-gold' : 'pill-gray'}" style="margin-bottom:8px">${e.type}</span>
            <h3 class="event-title">${e.title}</h3>
          </div>
        </div>
        <p class="event-desc">${e.description}</p>
        <div class="event-card-footer">
          ${e.prize ? `<p style="font-weight:700;color:var(--gold);font-size:0.88rem;margin-bottom:8px">🏆 ${e.prize}</p>` : ''}
          ${e.instructor ? `<p style="font-size:0.85rem;color:var(--primary);font-weight:600;margin-bottom:8px">Instructor: ${e.instructor}</p>` : ''}
          ${e.deadline ? `<p style="font-size:0.82rem;color:var(--text-muted)">Deadline: ${e.deadline}</p>` : ''}
          <button class="btn btn-primary btn-sm mt-8" onclick="${e.type === 'competition' ? 'startRegistration()' : `showEventDetail(${e.id})`}">${e.type === 'competition' ? 'Submit Entry &rarr;' : 'View Details &rarr;'}</button>
        </div>
      </div>
    `).join('');
  }

  // Nav buttons
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendarGrid(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendarGrid(); });

  // Filter tabs
  document.querySelectorAll('#cal-filters .filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('#cal-filters .filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      calFilter = this.dataset.filter;
      renderCalendarGrid();
      renderSidebarEvents();
      renderAllEvents();
    });
  });

  renderCalendarGrid();
  renderSidebarEvents();
  renderAllEvents();
}

function showDayEvents(day) {
  const events = DATA.events.filter(e => {
    if (calFilter !== 'all' && e.type !== calFilter) return false;
    return e.day === day && e.month === calMonth + 1 && e.year === calYear;
  });
  if (!events.length) return;
  showEventDetail(events[0].id);
}

function showEventDetail(id) {
  const e = DATA.events.find(ev => ev.id === id);
  if (!e) return;
  const content = document.getElementById('event-modal-content');
  const typePill = { competition: 'pill-primary', workshop: 'pill-gold', special: 'pill-gray' };
  content.innerHTML = `
    ${e.image ? `<div style="margin:-40px -40px 20px;aspect-ratio:16/9;overflow:hidden;border-radius:var(--radius-xl) var(--radius-xl) 0 0"><img src="${e.image}" alt="${escapeHtml(e.title)}" style="width:100%;height:100%;object-fit:cover" /></div>` : ''}
    <span class="pill ${typePill[e.type] || 'pill-gray'}" style="margin-bottom:16px">${e.type.toUpperCase()}</span>
    <h2 style="margin-bottom:12px">${e.title}</h2>
    ${e.theme ? `<p style="color:var(--secondary);font-weight:600;font-size:0.9rem;margin-bottom:8px">${e.theme}</p>` : ''}
    <p style="margin-bottom:20px">${e.description}</p>
    <div style="background:var(--bg);border-radius:var(--radius-md);padding:16px;margin-bottom:20px">
      <p style="font-size:0.88rem"><strong>Date:</strong> ${e.monthName} ${e.day}, ${e.year}</p>
      <p style="font-size:0.88rem"><strong>Time:</strong> ${e.time}</p>
      ${e.deadline ? `<p style="font-size:0.88rem"><strong>Deadline:</strong> ${e.deadline}</p>` : ''}
      ${e.prize ? `<p style="font-size:0.88rem"><strong>Prize:</strong> ${e.prize}</p>` : ''}
      ${e.instructor ? `<p style="font-size:0.88rem"><strong>Instructor:</strong> ${e.instructor}</p>` : ''}
      ${e.mode ? `<p style="font-size:0.88rem"><strong>Mode:</strong> ${e.mode}</p>` : ''}
    </div>
    ${e.type === 'competition' ? `<button class="form-submit" onclick="closeModal('event-modal');startRegistration()">Submit Artwork &rarr;</button>` : `<button class="form-submit" onclick="closeModal('event-modal')">Close</button>`}
  `;
  openModal('event-modal');
}


// ═══════════════════════════════════════════════
//  RESULTS PAGE
// ═══════════════════════════════════════════════
function renderResults() {
  const el = document.createElement('div');

  // Build merged list: real admin-declared winners first, then static demo winners as fallback
  const realDeclared = getAllSubmissionsAcrossUsers().filter(s => s.resultStatus === 'Winner' || s.resultStatus === 'Participated');
  const realWinners = realDeclared.filter(s => s.resultStatus === 'Winner').map((s, idx) => ({
    id: 'real_' + s.id,
    title: s.artTitle,
    artist: s.userName || (s.userEmail || '').split('@')[0],
    rank: 1,
    category: s.medium || s.category || '-',
    ageGroup: s.category || '-',
    event: s.event || '-',
    month: s.date || '-',
    gradient: defaultGradient(s.artTitle + s.userEmail),
    emoji: '🏆',
    fileDataUrl: s.fileDataUrl,
    isReal: true,
  }));

  const demoWinners = DATA.winners.map(w => ({ ...w, isReal: false }));
  const winners = [...realWinners, ...demoWinners];
  const totalTrees = getAllSubmissionsAcrossUsers().length * 3;

  const allEvents = [...new Set(winners.map(w => w.event).filter(Boolean))];

  el.innerHTML = `
    <!-- Hero -->
    <section class="results-hero">
      <div class="container">
        <span class="pill pill-gold" style="margin-bottom:12px">COMPETITION RESULTS</span>
        <h1>Winners &amp; Results</h1>
        <p>Celebrating artistic excellence. View our competition winners and their remarkable artworks.</p>
      </div>
    </section>

    <section class="section container">
      <div class="results-grid">
        <!-- Sidebar -->
        <div class="results-sidebar">
          <h4 style="margin-bottom:16px;color:var(--navy)">Filter by Event</h4>
          <div style="display:flex;flex-direction:column;gap:8px" id="results-filter">
            <button class="filter-tab active" data-event="all" style="text-align:left;width:100%">All Events (${winners.length})</button>
            ${allEvents.map(ev => {
              const cnt = winners.filter(w => w.event === ev).length;
              return `<button class="filter-tab" data-event="${escapeHtml(ev)}" style="text-align:left;width:100%">${escapeHtml(ev)} (${cnt})</button>`;
            }).join('')}
          </div>

          <div style="margin-top:32px;padding:20px;background:var(--primary-pale);border-radius:var(--radius-lg)">
            <h4 style="color:var(--primary);margin-bottom:8px">🌍 Awareness Through Art</h4>
            <p style="font-size:0.85rem">Each month's competition theme is tied to an environmental awareness day — building a generation that creates with a cause.</p>
          </div>
        </div>

        <!-- Main Results -->
        <div class="results-main" id="results-main">
          ${renderResultCards(winners)}
        </div>
      </div>
    </section>
  `;

  // Bind filters after rendering
  setTimeout(() => {
    document.querySelectorAll('#results-filter .filter-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('#results-filter .filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const event = this.dataset.event;
        const filtered = event === 'all' ? winners : winners.filter(w => w.event === event);
        document.getElementById('results-main').innerHTML = renderResultCards(filtered);
      });
    });
  }, 0);

  return el;
}

function renderResultCards(winners) {
  if (!winners.length) return '<p style="color:var(--text-muted);text-align:center;padding:40px">No results found for this filter.</p>';
  const rankCls = { 1: 'gold', 2: 'silver', 3: 'bronze' };
  const rankIcon = { 1: '🥇', 2: '🥈', 3: '🥉' };
  return winners.map(w => `
    <div class="result-card">
      <div class="result-rank ${rankCls[w.rank] || 'gold'}">${rankIcon[w.rank] || '🏆'}</div>
      ${w.fileDataUrl
        ? `<img class="result-art" src="${w.fileDataUrl}" alt="${escapeHtml(w.title)}" />`
        : `<div class="result-art-placeholder" style="background:${w.gradient || 'var(--primary)'}"><span style="font-size:1.2rem">${w.emoji || '🎨'}</span></div>`}
      <div class="result-info">
        <div class="result-name">${escapeHtml(w.title)}</div>
        <div class="result-artist">by ${escapeHtml(w.artist)}</div>
        <div class="result-cat">${escapeHtml(w.category)} &middot; ${escapeHtml(w.ageGroup)} &middot; ${escapeHtml(w.month)}</div>
      </div>
      <span class="pill ${w.rank === 1 ? 'pill-gold' : w.rank === 2 ? 'pill-gray' : 'pill-primary'}" style="align-self:center">${w.rank === 1 ? '1st' : w.rank === 2 ? '2nd' : '3rd'}</span>
    </div>
  `).join('');
}


// ═══════════════════════════════════════════════
//  GALLERY PAGE
// ═══════════════════════════════════════════════
let galleryFilter = { category: 'all', theme: 'all', age: 'all' };

// Build a merged gallery: real approved submissions + static demo items
function buildGalleryItems() {
  const realItems = getAllSubmissionsAcrossUsers()
    .filter(s => s.resultStatus === 'Winner' || s.resultStatus === 'Participated')
    .map(s => ({
      id: 'real_' + s.id,
      title: s.artTitle || 'Untitled',
      artist: s.userName || (s.userEmail || '').split('@')[0],
      category: s.medium || 'Mixed Media',
      ageGroup: s.category || 'All Ages',
      month: s.date || '',
      year: '',
      theme: s.event || 'Student Art',
      gradient: defaultGradient((s.artTitle || '') + (s.userEmail || '')),
      emoji: s.resultStatus === 'Winner' ? '🏆' : '🎨',
      fileDataUrl: s.fileDataUrl,
      isReal: true,
      resultStatus: s.resultStatus,
    }));
  const demoItems = DATA.gallery.map(g => ({ ...g, isReal: false }));
  return [...realItems, ...demoItems];
}

function renderGallery() {
  // Reset filter state so dropdowns and grid match
  galleryFilter = { category: 'all', theme: 'all', age: 'all' };
  const el = document.createElement('div');
  const items = buildGalleryItems();
  const categories = [...new Set(items.map(g => g.category).filter(Boolean))];
  const themes = [...new Set(items.map(g => g.theme).filter(Boolean))];
  const ages = [...new Set(items.map(g => g.ageGroup).filter(Boolean))];

  el.innerHTML = `
    <section class="section container" style="min-height:80vh">
      <h1 class="section-title" style="margin-bottom:8px">Student Gallery</h1>
      <p class="section-subtitle">Browse remarkable artworks from students across India. Filter by category, theme, or age group.</p>

      <!-- Filters -->
      <div class="gallery-filters" id="gallery-filters">
        <select class="filter-select" id="gf-category">
          <option value="all">All Categories</option>
          ${categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
        </select>
        <select class="filter-select" id="gf-theme">
          <option value="all">All Themes</option>
          ${themes.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('')}
        </select>
        <select class="filter-select" id="gf-age">
          <option value="all">All Age Groups</option>
          ${ages.map(a => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('')}
        </select>
        <span id="gallery-count" style="color:var(--text-muted);font-size:0.85rem;margin-left:auto"></span>
      </div>

      <!-- Gallery Grid -->
      <div class="gallery-grid" id="gallery-grid"></div>
    </section>
  `;
  return el;
}

function initGallery() {
  function renderGalleryGrid() {
    const grid = document.getElementById('gallery-grid');
    const countEl = document.getElementById('gallery-count');
    if (!grid) return;

    const allItems = buildGalleryItems();
    const filtered = allItems.filter(g => {
      if (galleryFilter.category !== 'all' && g.category !== galleryFilter.category) return false;
      if (galleryFilter.theme !== 'all' && g.theme !== galleryFilter.theme) return false;
      if (galleryFilter.age !== 'all' && g.ageGroup !== galleryFilter.age) return false;
      return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} artwork${filtered.length !== 1 ? 's' : ''}`;

    if (!filtered.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:60px 0">No artworks match your filters. Try adjusting your selection.</p>';
      return;
    }

    grid.innerHTML = filtered.map(g => {
      const img = g.fileDataUrl
        ? `<img class="gallery-img" src="${g.fileDataUrl}" alt="${escapeHtml(g.title)}" />`
        : `<div class="gallery-img-placeholder" style="background:${g.gradient}"><span style="font-size:2.5rem">${g.emoji}</span></div>`;
      const winnerBadge = g.resultStatus === 'Winner'
        ? `<span class="pill rank-gold" style="position:absolute;top:10px;left:10px;font-size:0.65rem">Winner</span>`
        : '';
      return `
      <div class="gallery-item" style="position:relative">
        ${winnerBadge}
        ${img}
        <div class="gallery-info">
          <div class="gallery-artist">${escapeHtml(g.title)}</div>
          <div class="gallery-meta">by ${escapeHtml(g.artist)} &middot; ${escapeHtml(g.category)}</div>
          <div class="gallery-meta">${escapeHtml(g.ageGroup)} &middot; ${escapeHtml(g.month)} ${g.year || ''} &middot; ${escapeHtml(g.theme)}</div>
        </div>
      </div>`;
    }).join('');
  }

  // Bind filter selects
  ['gf-category', 'gf-theme', 'gf-age'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', function () {
        const key = id === 'gf-category' ? 'category' : id === 'gf-theme' ? 'theme' : 'age';
        galleryFilter[key] = this.value;
        renderGalleryGrid();
      });
    }
  });

  renderGalleryGrid();
}


// ═══════════════════════════════════════════════
//  ORGANIZATION PAGE
// ═══════════════════════════════════════════════
function renderOrganization() {
  const el = document.createElement('div');
  const benefits = DATA.orgBenefits;
  const jury = DATA.jury;

  el.innerHTML = `
    <!-- Hero -->
    <section class="org-hero">
      <div class="container">
        <span class="pill pill-gold" style="margin-bottom:12px">PARTNER WITH US</span>
        <h1>Schools, Organizations &amp; Changemakers</h1>
        <p>If you believe in nurturing the next generation of creative thinkers and environmental advocates — there's a place for you here. Schools, companies, NGOs, and individuals all welcome.</p>
        <a href="#partner-form" class="btn btn-primary btn-lg" onclick="setTimeout(()=>document.getElementById('partner-name')?.scrollIntoView({behavior:'smooth',block:'center'}),100)">Get In Touch &rarr;</a>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section container">
      <h2 class="section-title">How It Works</h2>
      <p class="section-subtitle">A simple, transparent process from partnership to real impact in classrooms across India.</p>
      <div class="how-it-works">
        <div class="how-step">
          <div class="how-num">01</div>
          <div class="how-icon">🤝</div>
          <h4>Connect</h4>
          <p style="font-size:0.88rem;margin-top:8px">Reach out to us. We'll have a conversation about your goals and how we can collaborate.</p>
        </div>
        <div class="how-step">
          <div class="how-num">02</div>
          <div class="how-icon">🎨</div>
          <h4>Engage</h4>
          <p style="font-size:0.88rem;margin-top:8px">Students across India participate in our monthly themed competitions, with your support powering the platform.</p>
        </div>
        <div class="how-step">
          <div class="how-num">03</div>
          <div class="how-icon">🌱</div>
          <h4>Impact</h4>
          <p style="font-size:0.88rem;margin-top:8px">Real student engagement, real artwork, real environmental awareness — across schools, cities, and states.</p>
        </div>
        <div class="how-step">
          <div class="how-num">04</div>
          <div class="how-icon">📊</div>
          <h4>Report</h4>
          <p style="font-size:0.88rem;margin-top:8px">Regular updates on participation, reach, and the stories of young artists making a difference.</p>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section" style="background:var(--bg-white)">
      <div class="container">
        <h2 class="section-title">Why Partner With Us?</h2>
        <p class="section-subtitle">Whether you're driven by purpose, education, or community impact — there's a meaningful way to be part of this movement.</p>
        <div class="grid-3">
          ${benefits.map(b => `
            <div class="benefit-card">
              <div class="benefit-icon">${b.icon}</div>
              <h4>${b.title}</h4>
              <p style="margin-top:8px;font-size:0.88rem">${b.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Want to Partner With Us -->
    <section class="section container">
      <div style="max-width:720px;margin:0 auto;text-align:center">
        <span class="pill pill-primary" style="margin-bottom:16px">PARTNERSHIPS</span>
        <h2 class="section-title">Want to Partner With Us?</h2>
        <p class="section-subtitle">Whether you're a school, an organization, or simply someone who believes in the power of creative expression — we'd love to hear from you. Let's build something meaningful together.</p>
      </div>

      <div style="max-width:720px;margin:32px auto 0;background:var(--bg-white);border-radius:var(--radius-xl);padding:40px;box-shadow:var(--shadow-md)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="partner-name">Your Name *</label>
            <input id="partner-name" class="form-input" type="text" placeholder="Full name" />
          </div>
          <div class="form-group">
            <label class="form-label" for="partner-org">Organization / School *</label>
            <input id="partner-org" class="form-input" type="text" placeholder="Company, school, or institution name" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="partner-email">Email *</label>
            <input id="partner-email" class="form-input" type="email" placeholder="you@organization.com" />
          </div>
          <div class="form-group">
            <label class="form-label" for="partner-phone">Phone (optional)</label>
            <input id="partner-phone" class="form-input" type="tel" placeholder="+91 XXXXXXXXXX" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="partner-type">I represent a *</label>
          <select id="partner-type" class="form-select">
            <option value="">Select one</option>
            <option>School</option>
            <option>Corporate / Company</option>
            <option>NGO / Foundation</option>
            <option>Individual Donor</option>
            <option>Media / Press</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="partner-message">Tell us how you'd like to partner *</label>
          <textarea id="partner-message" class="form-textarea" placeholder="What's your idea? How would you like to support or collaborate with us?" style="min-height:120px"></textarea>
        </div>
        <button class="form-submit" onclick="submitPartnershipForm()">Send Partnership Inquiry &rarr;</button>
      </div>
    </section>

    <!-- Jury -->
    <section class="section" style="background:var(--bg-white)">
      <div class="container">
        <h2 class="section-title">Our Expert Jury</h2>
        <p class="section-subtitle">Artworks are evaluated by accomplished artists and educators from across India.</p>
        <div class="grid-4">
          ${jury.map(j => `
            <div style="text-align:center;padding:24px">
              <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-light));display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 16px">${j.emoji}</div>
              <h4 style="color:var(--navy)">${j.name}</h4>
              <p style="color:var(--primary);font-weight:600;font-size:0.85rem">${j.role}</p>
              <p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px">${j.school}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section prizes-section">
      <div class="container text-center">
        <h2 style="color:white;margin-bottom:16px">Let's Create Together</h2>
        <p style="color:rgba(255,255,255,0.7);max-width:520px;margin:0 auto 32px">Schools, organizations, and individuals — anyone who shares our belief in creativity as a force for good is welcome here.</p>
        <button class="btn btn-gold btn-lg" onclick="navigate('about')">Get in Touch &rarr;</button>
      </div>
    </section>
  `;
  return el;
}


// ═══════════════════════════════════════════════
//  ABOUT PAGE
// ═══════════════════════════════════════════════
function renderAbout() {
  const el = document.createElement('div');

  el.innerHTML = `
    <section class="section container">
      <div class="about-intro">
        <div>
          <span class="pill pill-primary" style="margin-bottom:16px">OUR STORY</span>
          <h1 style="margin-bottom:16px">About Art for Awareness</h1>
          <p style="margin-bottom:16px">Art for Awareness is India's premier free monthly art competition platform for students aged 6&ndash;17. We believe that every child's creativity is a force for planetary change.</p>
          <p style="margin-bottom:16px">Unlike traditional art competitions that are sporadic, commercial, and urban-centric, we've built a permanent, recurring Creative Infrastructure. Our platform operates on a monthly cycle, fostering consistent artistic practice and habit formation among students.</p>
          <p style="margin-bottom:24px">We are fully compliant with the Digital Personal Data Protection Act 2023 and committed to fostering environmental awareness through creative expression.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="navigate('organization')">Partner With Us</button>
            <button class="btn btn-outline" onclick="navigate('about')">Get In Touch</button>
          </div>
        </div>
        <div class="about-visual">
          <div class="about-visual-icon">🎨</div>
          <h3 style="color:var(--primary);margin-bottom:8px">Art + Environment = Impact</h3>
          <p style="font-size:0.9rem">Every month, a new environmental theme. Every artwork, a voice for the planet. Creativity with a cause.</p>
        </div>
      </div>
    </section>

    <!-- Achievements -->
    <section class="section" style="background:var(--bg-white)">
      <div class="container">
        <h2 class="section-title">Our Impact So Far</h2>
        <p class="section-subtitle">Numbers that reflect the power of creativity combined with purpose.</p>
        ${(() => {
          const stats = computePlatformStats();
          return `
        <div class="achievement-grid">
          <div class="achievement-card">
            <div class="achievement-num">${stats.artworks}</div>
            <div class="achievement-label">Artworks Submitted</div>
          </div>
          <div class="achievement-card">
            <div class="achievement-num">${stats.users}</div>
            <div class="achievement-label">Registered Artists</div>
          </div>
          <div class="achievement-card">
            <div class="achievement-num">${stats.schools}</div>
            <div class="achievement-label">Schools Registered</div>
          </div>
          <div class="achievement-card">
            <div class="achievement-num">${stats.themes}</div>
            <div class="achievement-label">Monthly Themes</div>
          </div>
          <div class="achievement-card">
            <div class="achievement-num">6</div>
            <div class="achievement-label">Age Categories</div>
          </div>
          <div class="achievement-card">
            <div class="achievement-num">12</div>
            <div class="achievement-label">Months Active</div>
          </div>
        </div>`;
        })()}
      </div>
    </section>

    <!-- Mission Pillars -->
    <section class="section container">
      <h2 class="section-title">Our Mission Pillars</h2>
      <div class="grid-3 mt-32">
        <div class="card">
          <div class="card-body card-centered"
            <div class="empty-state-icon">🎓</div>
            <h3>Education</h3>
            <p style="margin-top:12px;font-size:0.88rem">Supporting NEP 2020 art integration mandates by providing monthly themes as ready-made lesson plans for teachers across India.</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body card-centered"
            <div class="empty-state-icon">🌱</div>
            <h3>Environment</h3>
            <p style="margin-top:12px;font-size:0.88rem">Monthly themes tied to environmental awareness days, building a generation that understands and advocates for the planet.</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body card-centered"
            <div class="empty-state-icon">🤝</div>
            <h3>Inclusivity</h3>
            <p style="margin-top:12px;font-size:0.88rem">Free participation, teacher-mediated model, and support for Tier 2/3 cities ensure art recognition reaches every child.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- NEP 2020 Alignment (info only — no submission CTA) -->
    <section class="section" style="background:var(--navy)">
      <div class="container text-center">
        <span class="pill pill-gold" style="margin-bottom:16px">NEP 2020 ALIGNED</span>
        <h2 style="color:white;margin-bottom:16px">Supporting India's Education Vision</h2>
        <p style="color:rgba(255,255,255,0.7);max-width:560px;margin:0 auto">Our monthly themes serve as curriculum-aligned resources, helping teachers integrate art education seamlessly into school schedules as mandated by the National Education Policy 2020.</p>
      </div>
    </section>

    <!-- DPDP Compliance -->
    <section class="section container">
      <h2 class="section-title">Privacy &amp; Trust</h2>
      <p class="section-subtitle">We take data protection seriously. Here's how we ensure compliance with India's DPDP Act 2023.</p>
      <div class="grid-3 mt-32">
        <div style="padding:24px;border:1px solid var(--border-light);border-radius:var(--radius-lg)">
          <h4 style="margin-bottom:8px">🔒 Teacher-Mediated Model</h4>
          <p style="font-size:0.88rem">We register teachers, not students. No direct-to-child data collection ensures DPDP compliance.</p>
        </div>
        <div style="padding:24px;border:1px solid var(--border-light);border-radius:var(--radius-lg)">
          <h4 style="margin-bottom:8px">📋 Data Minimization</h4>
          <p style="font-size:0.88rem">Only first name, grade, school, and artwork are collected. No contact details, no behavioral tracking.</p>
        </div>
        <div style="padding:24px;border:1px solid var(--border-light);border-radius:var(--radius-lg)">
          <h4 style="margin-bottom:8px">🛡️ IP Protection</h4>
          <p style="font-size:0.88rem">Students retain full copyright. Our license is non-exclusive, for platform display and educational use only.</p>
        </div>
      </div>
    </section>

    <!-- CONTACT US (full content, merged into About page) -->
    <section class="section" style="background:var(--bg-white)" id="get-in-touch">
      <div class="container">
        <div style="text-align:center;max-width:560px;margin:0 auto 40px">
          <span class="pill pill-primary mb-16">GET IN TOUCH</span>
          <h2 class="section-title" style="margin-bottom:8px">Contact Us</h2>
          <p class="section-subtitle">Have questions? Want to partner? We'd love to hear from you.</p>
        </div>

        <div class="contact-grid">
          <!-- Info Cards -->
          <div>
            <div class="contact-info-card">
              <div class="contact-icon">📧</div>
              <div class="contact-details">
                <h4>Email Us</h4>
                <p>hello@art4awareness.in</p>
                <p style="color:var(--text-muted);font-size:0.8rem">We respond within 24 hours</p>
              </div>
            </div>
            <div class="contact-info-card">
              <div class="contact-icon">📞</div>
              <div class="contact-details">
                <h4>Call Us</h4>
                <p>Contact us via email</p>
                <p style="color:var(--text-muted);font-size:0.8rem">We respond within 24 hours</p>
              </div>
            </div>
            <div class="contact-info-card">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <h4>Visit Us</h4>
                <p>Bengaluru, Karnataka, India</p>
                <p style="color:var(--text-muted);font-size:0.8rem">By appointment only</p>
              </div>
            </div>
            <div class="contact-info-card">
              <div class="contact-icon">🤝</div>
              <div class="contact-details">
                <h4>Partnerships</h4>
                <p>partnerships@art4awareness.in</p>
                <p style="color:var(--text-muted);font-size:0.8rem">For schools, organizations &amp; NGOs</p>
              </div>
            </div>

            <div style="background:var(--primary-pale);border-radius:var(--radius-lg);padding:24px;margin-top:16px">
              <h4 style="color:var(--primary);margin-bottom:8px">🎓 For Schools &amp; Teachers</h4>
              <p style="font-size:0.88rem">Want to register your school? Join our Teacher Ambassador program and bring art competitions to your students at zero cost.</p>
              <button class="btn btn-primary btn-sm mt-16" onclick="startRegistration()">Register Your School</button>
            </div>
          </div>

          <!-- Contact Form -->
          <div style="background:white;border-radius:var(--radius-xl);padding:40px;box-shadow:var(--shadow-md)">
            <h3 style="margin-bottom:24px">Send Us a Message</h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="contact-name">Your Name *</label>
                <input id="contact-name" class="form-input" type="text" placeholder="Full name" />
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-email">Email *</label>
                <input id="contact-email" class="form-input" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-subject">Subject</label>
              <select id="contact-subject" class="form-select">
                <option>General Inquiry</option>
                <option>Partnership</option>
                <option>School Registration</option>
                <option>Technical Support</option>
                <option>Media / Press</option>
                <option>Feedback / Suggestion</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-message">Your Message *</label>
              <textarea id="contact-message" class="form-textarea" placeholder="Tell us how we can help..." style="min-height:140px"></textarea>
            </div>
            <button class="form-submit" onclick="submitContactForm()">Send Message &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
  return el;
}


// ═══════════════════════════════════════════════
//  CONTACT PAGE (deprecated — merged into About; kept for #contact deep links)
// ═══════════════════════════════════════════════
function renderContact() {
  const el = document.createElement('div');

  el.innerHTML = `
    <section class="section container" style="min-height:80vh">
      <h1 class="section-title" style="margin-bottom:8px">Contact Us</h1>
      <p class="section-subtitle">Have questions? Want to partner? We'd love to hear from you.</p>

      <div class="contact-grid mt-32">
        <!-- Info Cards -->
        <div>
          <div class="contact-info-card">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h4>Email Us</h4>
              <p>hello@art4awareness.in</p>
              <p style="color:var(--text-muted);font-size:0.8rem">We respond within 24 hours</p>
            </div>
          </div>
          <div class="contact-info-card">
            <div class="contact-icon">📞</div>
            <div class="contact-details">
              <h4>Call Us</h4>
              <p>Contact us via email</p>
              <p style="color:var(--text-muted);font-size:0.8rem">We respond within 24 hours</p>
            </div>
          </div>
          <div class="contact-info-card">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h4>Visit Us</h4>
              <p>Bengaluru, Karnataka, India</p>
              <p style="color:var(--text-muted);font-size:0.8rem">By appointment only</p>
            </div>
          </div>
          <div class="contact-info-card">
            <div class="contact-icon">🤝</div>
            <div class="contact-details">
              <h4>CSR Partnerships</h4>
              <p>partnerships@art4awareness.in</p>
              <p style="color:var(--text-muted);font-size:0.8rem">For corporate sponsors & NGOs</p>
            </div>
          </div>

          <div style="background:var(--primary-pale);border-radius:var(--radius-lg);padding:24px;margin-top:16px">
            <h4 style="color:var(--primary);margin-bottom:8px">🎓 For Schools & Teachers</h4>
            <p style="font-size:0.88rem">Want to register your school? Join our Teacher Ambassador program and bring art competitions to your students at zero cost.</p>
            <button class="btn btn-primary btn-sm mt-16" onclick="startRegistration()">Register Your School</button>
          </div>
        </div>

        <!-- Contact Form -->
        <div style="background:white;border-radius:var(--radius-xl);padding:40px;box-shadow:var(--shadow-md)">
          <h3 style="margin-bottom:24px">Send Us a Message</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input id="contact-name" class="form-input" type="text" placeholder="Full name" />
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input id="contact-email" class="form-input" type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Subject</label>
            <select id="contact-subject" class="form-select">
              <option>General Inquiry</option>
              <option>CSR Partnership</option>
              <option>School Registration</option>
              <option>Technical Support</option>
              <option>Media / Press</option>
              <option>Feedback / Suggestion</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Your Message *</label>
            <textarea id="contact-message" class="form-textarea" placeholder="Tell us how we can help..." style="min-height:140px"></textarea>
          </div>
          <button class="form-submit" onclick="submitContactForm()">Send Message &rarr;</button>
        </div>
      </div>
    </section>
  `;
  return el;
}

function submitContactForm() {
  const name = document.getElementById('contact-name')?.value.trim();
  const email = document.getElementById('contact-email')?.value.trim();
  const subject = document.getElementById('contact-subject')?.value || 'General Inquiry';
  const message = document.getElementById('contact-message')?.value.trim();
  if (!name || !email || !message) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  // Persist to localStorage for admin to review
  try {
    const inquiries = JSON.parse(localStorage.getItem('aba_contact_messages') || '[]');
    inquiries.unshift({ id: Date.now(), name, email, subject, message, date: new Date().toLocaleDateString('en-IN') });
    localStorage.setItem('aba_contact_messages', JSON.stringify(inquiries));
  } catch (e) { /* quota */ }
  showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-message').value = '';
  const subjectEl = document.getElementById('contact-subject');
  if (subjectEl) subjectEl.selectedIndex = 0;
}

function submitPartnershipForm() {
  const name = document.getElementById('partner-name')?.value.trim();
  const org = document.getElementById('partner-org')?.value.trim();
  const email = document.getElementById('partner-email')?.value.trim();
  const phone = document.getElementById('partner-phone')?.value.trim();
  const type = document.getElementById('partner-type')?.value;
  const message = document.getElementById('partner-message')?.value.trim();
  if (!name || !org || !email || !type || !message) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  // Persist to localStorage for admin to review (stored alongside contact messages with subject = "Partnership")
  try {
    const inquiries = JSON.parse(localStorage.getItem('aba_contact_messages') || '[]');
    inquiries.unshift({
      id: Date.now(), name, email, subject: 'Partnership: ' + type,
      message: 'Organization: ' + org + (phone ? ' | Phone: ' + phone : '') + '\n\n' + message,
      date: new Date().toLocaleDateString('en-IN')
    });
    localStorage.setItem('aba_contact_messages', JSON.stringify(inquiries));
  } catch (e) { /* quota */ }
  showToast('Thank you! We\'ll be in touch within 48 hours.', 'success');
  ['partner-name', 'partner-org', 'partner-email', 'partner-phone', 'partner-message'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const typeEl = document.getElementById('partner-type');
  if (typeEl) typeEl.selectedIndex = 0;
}


// ═══════════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════════
let dashTab = 'overview';

function renderDashboard() {
  const el = document.createElement('div');
  const user = AUTH.user;
  if (!user) { el.innerHTML = '<p style="padding:60px;text-align:center">Please log in to view your dashboard.</p>'; return el; }

  const submissions = AUTH.getSubmissions();
  const initial = (user.name || 'U').charAt(0).toUpperCase();

  el.innerHTML = `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <div class="dashboard-sidebar">
        <div class="sidebar-user">
          ${user.picture
            ? `<img src="${user.picture}" alt="${escapeHtml(initial)}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:12px" referrerpolicy="no-referrer" />`
            : `<div class="user-avatar">${escapeHtml(initial)}</div>`
          }
          <h4 style="color:var(--navy)">${escapeHtml(user.name)}</h4>
          <p style="font-size:0.82rem;color:var(--text-muted)">${escapeHtml(user.email)}</p>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">Member since ${user.joined || 'Today'}</p>
        </div>
        <div class="sidebar-nav-item active" data-tab="overview" onclick="switchDashTab('overview')">
          <span>📊</span> Overview
        </div>
        <div class="sidebar-nav-item" data-tab="submissions" onclick="switchDashTab('submissions')">
          <span>🎨</span> My Submissions
        </div>
        <div class="sidebar-nav-item" data-tab="results" onclick="switchDashTab('results')">
          <span>🏆</span> Results &amp; Certificates
        </div>
        <div class="sidebar-nav-item" data-tab="profile" onclick="switchDashTab('profile')">
          <span>👤</span> Profile
        </div>
        <div class="sidebar-nav-item" onclick="doLogout()" style="color:var(--error);margin-top:auto">
          <span>🚪</span> Sign Out
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-main" id="dash-main">
        ${renderDashOverview(user, submissions)}
      </div>
    </div>
  `;
  return el;
}

function switchDashTab(tab) {
  dashTab = tab;
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  const main = document.getElementById('dash-main');
  if (!main) return;
  const user = AUTH.user;
  const submissions = AUTH.getSubmissions();

  if (tab === 'overview') main.innerHTML = renderDashOverview(user, submissions);
  else if (tab === 'submissions') main.innerHTML = renderDashSubmissions(submissions);
  else if (tab === 'results') main.innerHTML = renderDashResults(submissions);
  else if (tab === 'profile') main.innerHTML = renderDashProfile(user);
}

function renderDashOverview(user, submissions) {
  const themes = new Set(submissions.map(s => s.event).filter(Boolean)).size;
  const declared = submissions.filter(s => s.resultStatus);
  const underReview = submissions.filter(s => !s.resultStatus);
  return `
    <h2 style="margin-bottom:24px">Welcome back, ${escapeHtml(user.name)}!</h2>
    <div class="grid-4" style="margin-bottom:32px">
      <div class="stat-card">
        <div class="stat-num">${submissions.length}</div>
        <div class="stat-label">Submissions</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${declared.length}</div>
        <div class="stat-label">Results Declared</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${themes}</div>
        <div class="stat-label">Themes Joined</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${underReview.length}</div>
        <div class="stat-label">Under Review</div>
      </div>
    </div>

    ${submissions.length ? `
      <h3 class="dash-section-title">Recent Submissions</h3>
      <div class="table-responsive"><table class="submission-table">
        <thead><tr><th style="width:60px">Art</th><th>Artwork</th><th>Event</th><th>Medium</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          ${submissions.slice(0, 5).map(s => {
            const pill = s.resultStatus === 'Winner'
              ? '<span class="pill rank-gold">Winner</span>'
              : s.resultStatus === 'Participated'
              ? '<span class="pill pill-primary">Participated</span>'
              : '<span class="pill pill-gold">Under Review</span>';
            const thumb = s.fileDataUrl
              ? `<img src="${s.fileDataUrl}" alt="" class="thumb" />`
              : `<div class="thumb-placeholder">🖼️</div>`;
            return `
            <tr>
              <td>${thumb}</td>
              <td style="font-weight:600;color:var(--navy)">${escapeHtml(s.artTitle)}</td>
              <td>${escapeHtml(s.event || '-')}</td>
              <td>${escapeHtml(s.medium || '-')}</td>
              <td>${s.date}</td>
              <td>${pill}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon">🖼️</div>
        <h3 style="color:var(--navy);margin-bottom:8px">No submissions yet</h3>
        <p style="color:var(--text-muted);margin-bottom:24px">Start your creative journey by submitting your first artwork!</p>
        <button class="btn btn-primary" onclick="startRegistration()">Submit Your First Artwork</button>
      </div>
    `}

    <div style="margin-top:32px">
      <h3 class="dash-section-title">Quick Actions</h3>
      <div class="grid-3">
        <div class="card" style="cursor:pointer" onclick="startRegistration()">
          <div class="card-body" style="text-align:center">
            <div style="font-size:2rem;margin-bottom:8px">🎨</div>
            <h4>Submit Artwork</h4>
            <p style="font-size:0.85rem;margin-top:4px">Enter the current competition</p>
          </div>
        </div>
        <div class="card" style="cursor:pointer" onclick="navigate('events')">
          <div class="card-body" style="text-align:center">
            <div style="font-size:2rem;margin-bottom:8px">📅</div>
            <h4>View Calendar</h4>
            <p style="font-size:0.85rem;margin-top:4px">Check upcoming events</p>
          </div>
        </div>
        <div class="card" style="cursor:pointer" onclick="switchDashTab('results')">
          <div class="card-body" style="text-align:center">
            <div style="font-size:2rem;margin-bottom:8px">🏆</div>
            <h4>Results &amp; Certificates</h4>
            <p style="font-size:0.85rem;margin-top:4px">View results &amp; download certificates</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDashSubmissions(submissions) {
  if (!submissions.length) {
    return `
      <h3 class="dash-section-title">My Submissions</h3>
      <div class="empty-state">
        <div class="empty-state-icon">🖼️</div>
        <h3 style="color:var(--navy);margin-bottom:8px">No submissions yet</h3>
        <p style="color:var(--text-muted);margin-bottom:24px">Your submitted artworks will appear here.</p>
        <button class="btn btn-primary" onclick="startRegistration()">Submit Artwork</button>
      </div>`;
  }
  return `
    <h3 class="dash-section-title">My Submissions (${submissions.length})</h3>
    <div class="table-responsive"><table class="submission-table">
      <thead><tr><th style="width:60px">Art</th><th>Artwork</th><th>Event</th><th>Category</th><th>Medium</th><th>Date</th><th>Status</th><th>Result</th></tr></thead>
      <tbody>
        ${submissions.map(s => {
          const statusPill = s.resultStatus
            ? (s.resultStatus === 'Winner'
              ? '<span class="pill rank-gold">Winner</span>'
              : '<span class="pill pill-primary">Participated</span>')
            : '<span class="pill pill-gold">Under Review</span>';
          const resultCol = s.resultStatus
            ? `<span style="color:var(--success);font-weight:600;font-size:0.82rem">Declared</span>`
            : `<span style="color:var(--text-muted);font-size:0.82rem">Pending</span>`;
          const thumb = s.fileDataUrl
            ? `<img src="${s.fileDataUrl}" alt="" class="thumb" />`
            : `<div class="thumb-placeholder">🖼️</div>`;
          return `
          <tr>
            <td>${thumb}</td>
            <td style="font-weight:600;color:var(--navy)">${escapeHtml(s.artTitle)}</td>
            <td>${escapeHtml(s.event || '-')}</td>
            <td>${escapeHtml(s.category || '-')}</td>
            <td>${escapeHtml(s.medium || '-')}</td>
            <td>${s.date}</td>
            <td>${statusPill}</td>
            <td>${resultCol}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`;
}

function renderDashResults(submissions) {
  if (!submissions.length) {
    return `
      <h3 class="dash-section-title">Results &amp; Certificates</h3>
      <div class="empty-state">
        <div class="empty-state-icon">🏆</div>
        <h3 style="color:var(--navy);margin-bottom:8px">No submissions yet</h3>
        <p style="color:var(--text-muted);margin-bottom:24px">Submit artwork to a competition first. Certificates will be available once results are declared.</p>
        <button class="btn btn-primary" onclick="startRegistration()">Submit Artwork</button>
      </div>`;
  }

  const declared = submissions.filter(s => s.resultStatus);
  const pending = submissions.filter(s => !s.resultStatus);

  let html = '<h3 class="dash-section-title">Results &amp; Certificates</h3>';

  // Results declared section
  if (declared.length) {
    html += `
      <div style="margin-bottom:32px">
        <h4 style="color:var(--primary);margin-bottom:16px;font-size:0.95rem">Results Declared (${declared.length})</h4>
        <div class="grid-3">
          ${declared.map(s => {
            const isWinner = s.resultStatus === 'Winner';
            const borderColor = isWinner ? 'var(--gold)' : 'var(--primary)';
            const icon = isWinner ? '🏆' : '🎨';
            const label = isWinner ? 'Winner Certificate' : 'Participation Certificate';
            const certType = isWinner ? 'winner' : 'participation';
            return `
            <div class="cert-card" style="border-color:${borderColor}">
              <div class="cert-icon">${icon}</div>
              ${isWinner ? '<span class="pill rank-gold" style="margin-bottom:8px">Winner</span>' : '<span class="pill pill-primary" style="margin-bottom:8px">Participated</span>'}
              <div class="cert-title">${label}</div>
              <div class="cert-event">${escapeHtml(s.event || 'Competition')} &middot; ${s.date}</div>
              <button class="btn btn-primary btn-sm mt-16" data-cert-event="${escapeHtml(s.event || 'Competition')}" data-cert-type="${certType}" onclick="viewCertificate(this.dataset.certType, this.dataset.certEvent${isWinner ? ", '1st Place'" : ''})">Download Certificate</button>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Pending results section
  if (pending.length) {
    html += `
      <div>
        <h4 style="color:var(--text-muted);margin-bottom:16px;font-size:0.95rem">Awaiting Results (${pending.length})</h4>
        <div class="grid-3">
          ${pending.map(s => `
            <div class="cert-card" style="opacity:0.7;border-style:dashed">
              <div class="cert-icon" style="opacity:0.4">⏳</div>
              <div class="cert-title" style="color:var(--text-muted)">${escapeHtml(s.artTitle)}</div>
              <div class="cert-event">${escapeHtml(s.event || 'Competition')} &middot; ${s.date}</div>
              <span class="pill pill-gold mt-16" style="font-size:0.7rem">Results Pending</span>
              <p style="font-size:0.78rem;color:var(--text-muted);margin-top:8px">Certificate available after results are declared</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  return html;
}

function renderDashProfile(user) {
  const isSocialUser = !!user.provider;
  return `
    <h3 class="dash-section-title">My Profile</h3>
    <div style="max-width:480px">
      <div class="form-group">
        <label class="form-label" for="prof-name">Full Name</label>
        <input id="prof-name" class="form-input" type="text" value="${escapeHtml(user.name || '')}" />
      </div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input class="form-input" type="email" value="${escapeHtml(user.email || '')}" disabled style="opacity:0.6" />
      </div>
      <div class="form-group">
        <label class="form-label" for="prof-mobile">Mobile</label>
        <input id="prof-mobile" class="form-input" type="tel" value="${escapeHtml(user.mobile || '')}" placeholder="+91 XXXXXXXXXX" />
      </div>
      <button class="form-submit" style="max-width:200px" onclick="updateProfile()">Save Changes</button>

      <h3 class="dash-section-title" style="margin-top:40px">Change Password</h3>
      <div class="form-group">
        <label class="form-label" for="prof-curpass">Current Password</label>
        <input id="prof-curpass" class="form-input" type="password" placeholder="Enter current password" />
      </div>
      <div class="form-group">
        <label class="form-label" for="prof-newpass">New Password</label>
        <input id="prof-newpass" class="form-input" type="password" placeholder="Min. 8 characters" />
      </div>
      <div class="form-group">
        <label class="form-label" for="prof-confirmpass">Confirm New Password</label>
        <input id="prof-confirmpass" class="form-input" type="password" placeholder="Repeat new password" />
      </div>
      <button class="form-submit" style="max-width:200px" onclick="changePassword()">Update Password</button>
    </div>
  `;
}

function updateProfile() {
  const name = document.getElementById('prof-name')?.value.trim();
  const mobile = document.getElementById('prof-mobile')?.value.trim();
  if (!name) { showToast('Name is required', 'error'); return; }
  const user = AUTH.user;
  user.name = name;
  user.mobile = mobile;
  AUTH.save(user);
  // Update the stored user record too
  const stored = JSON.parse(localStorage.getItem('aba_user_' + user.email) || '{}');
  stored.name = name;
  stored.mobile = mobile;
  localStorage.setItem('aba_user_' + user.email, JSON.stringify(stored));
  showToast('Profile updated!', 'success');
  updateHeaderAuth();
  // Refresh sidebar display
  const avatarEl = document.querySelector('.user-avatar');
  const nameEl = document.querySelector('.sidebar-user h4');
  if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
  if (nameEl) nameEl.textContent = name;
}

function changePassword() {
  const curPass = document.getElementById('prof-curpass')?.value;
  const newPass = document.getElementById('prof-newpass')?.value;
  const confirmPass = document.getElementById('prof-confirmpass')?.value;
  if (!curPass || !newPass || !confirmPass) { showToast('Please fill all password fields', 'error'); return; }
  if (newPass.length < 8) { showToast('New password must be at least 8 characters', 'error'); return; }
  if (newPass !== confirmPass) { showToast('New passwords do not match', 'error'); return; }

  const user = AUTH.user;
  if (!user) { showToast('Please log in', 'error'); return; }
  const stored = JSON.parse(localStorage.getItem('aba_user_' + user.email) || 'null');
  if (!stored) { showToast('Account not found', 'error'); return; }

  // Verify current password
  if (stored.passwordHash && stored.passwordHash !== hashPassword(curPass)) {
    showToast('Current password is incorrect', 'error');
    return;
  }

  // Update password
  stored.passwordHash = hashPassword(newPass);
  delete stored.password;
  localStorage.setItem('aba_user_' + user.email, JSON.stringify(stored));
  showToast('Password updated successfully!', 'success');
  document.getElementById('prof-curpass').value = '';
  document.getElementById('prof-newpass').value = '';
  document.getElementById('prof-confirmpass').value = '';
}
