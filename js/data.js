// ============================================
//  AWARENESS BY ART — Data Store
// ============================================

const DATA = {

  // ─── Monthly Events (Environment-Focused Awareness Themes) ───
  events: [
    // APRIL — World Earth Day (Apr 22)
    {
      id: 1, day: 1, month: 4, year: 2026, monthName: "APRIL",
      title: "Earth Palette", type: "competition",
      theme: "World Earth Day",
      description: "Our planet is the ultimate canvas. Paint, sketch, or digitally create your vision of Earth — its landscapes, ecosystems, or a greener future. What does our planet mean to you?",
      time: "10:00 AM – 10:00 PM", deadline: "April 25, 2026",
      prize: "₹10,000 + Certificate + National Feature"
    },
    {
      id: 2, day: 12, month: 4, year: 2026, monthName: "APRIL",
      title: "Nature Sketching Masterclass", type: "workshop",
      description: "Online workshop: Learn to sketch trees, leaves, and landscapes from life. Fundamentals of botanical illustration and outdoor sketching.",
      time: "3:00 PM – 5:00 PM", mode: "Online",
      instructor: "Priya Sharma"
    },
    {
      id: 3, day: 22, month: 4, year: 2026, monthName: "APRIL",
      title: "Earth Day Live Art", type: "special",
      description: "Celebrate Earth Day with a live flash art challenge! 2-hour timed submission — create something that captures our planet's beauty under pressure.",
      time: "4:00 PM – 6:00 PM"
    },
    // MAY — World Biodiversity Day (May 22)
    {
      id: 4, day: 1, month: 5, year: 2026, monthName: "MAY",
      title: "Nature's Brush", type: "competition",
      theme: "World Biodiversity Day",
      description: "Celebrate the incredible diversity of life on Earth. From rainforest canopies to coral reefs, from tiny insects to mighty elephants — paint the biodiversity that inspires you.",
      time: "10:00 AM – 10:00 PM", deadline: "May 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    {
      id: 5, day: 10, month: 5, year: 2026, monthName: "MAY",
      title: "Watercolor Wildlife Workshop", type: "workshop",
      description: "Learn watercolor techniques for painting animals and birds. Wet-on-wet, dry brush, and blending techniques for capturing wildlife.",
      time: "11:00 AM – 1:00 PM", mode: "Online",
      instructor: "Veena Karki"
    },
    // JUNE — World Environment Day (Jun 5)
    {
      id: 6, day: 1, month: 6, year: 2026, monthName: "JUNE",
      title: "Green Vision", type: "competition",
      theme: "World Environment Day",
      description: "Imagine a sustainable future. What does a world powered by clean energy, restored forests, and clean oceans look like? Bring your green vision to life through art.",
      time: "10:00 AM – 10:00 PM", deadline: "June 25, 2026",
      prize: "₹15,000 + National Recognition"
    },
    // JULY — World Ocean Day (Jun 8 carry-over)
    {
      id: 7, day: 1, month: 7, year: 2026, monthName: "JULY",
      title: "Deep Blue", type: "competition",
      theme: "World Ocean Day",
      description: "Dive into the deep blue. Paint the mysteries of the ocean — marine life, coral kingdoms, underwater worlds, or the urgent call to protect our seas from plastic pollution.",
      time: "10:00 AM – 10:00 PM", deadline: "July 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    // AUGUST — Independence Day + Indian Wildlife
    {
      id: 8, day: 1, month: 8, year: 2026, monthName: "AUGUST",
      title: "Wild India", type: "competition",
      theme: "Indian Wildlife & Freedom",
      description: "Celebrate India's independence by honoring its wild heritage. From Bengal tigers to Asiatic lions, from the Western Ghats to the Sundarbans — paint the wild spirit of India.",
      time: "10:00 AM – 10:00 PM", deadline: "August 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    // SEPTEMBER — International Day for the Preservation of the Ozone Layer (Sep 16)
    {
      id: 9, day: 1, month: 9, year: 2026, monthName: "SEPTEMBER",
      title: "Sky Canvas", type: "competition",
      theme: "Ozone & Atmosphere",
      description: "Look up. The sky protects us, inspires us, and connects us all. Create art about our atmosphere, skies, sunsets, auroras, or the invisible shield that protects all life on Earth.",
      time: "10:00 AM – 10:00 PM", deadline: "September 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    // OCTOBER — Wildlife Week (Oct 1-7)
    {
      id: 10, day: 1, month: 10, year: 2026, monthName: "OCTOBER",
      title: "Jungle Stories", type: "competition",
      theme: "Wildlife Week",
      description: "Every forest tells a story. Paint the creatures, ecosystems, and tales from India's jungles and wildlife sanctuaries. Art as a voice for the voiceless.",
      time: "10:00 AM – 10:00 PM", deadline: "October 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    // NOVEMBER — Children's Day (Nov 14) + World Soil Day prep
    {
      id: 11, day: 1, month: 11, year: 2026, monthName: "NOVEMBER",
      title: "Seeds of Change", type: "competition",
      theme: "Children's Day & World Soil Day",
      description: "Young hands can change the world. Paint what you would plant, grow, or build for a better tomorrow. From seeds to forests, from ideas to movements.",
      time: "10:00 AM – 10:00 PM", deadline: "November 25, 2026",
      prize: "₹12,000 + Certificate"
    },
    // DECEMBER — International Mountain Day (Dec 11)
    {
      id: 12, day: 1, month: 12, year: 2026, monthName: "DECEMBER",
      title: "Mountain Calling", type: "competition",
      theme: "International Mountain Day",
      description: "Mountains are the water towers of the world. Capture the majesty of peaks, valleys, glaciers, and the communities that live in harmony with the highlands.",
      time: "10:00 AM – 10:00 PM", deadline: "December 25, 2026",
      prize: "₹20,000 + Grand Prize + National Feature"
    }
  ],

  // ─── Previous Winners (populated from real admin-declared results via localStorage) ───
  // Static demo data removed — only real results are shown.
  winners: [],

  // ─── Categories ───
  categories: [
    {
      id: "6-7", label: "Ages 6–7", title: "Young Explorers",
      style: "light",
      desc: "Introduction to art for our youngest participants. Drawing, colouring and simple compositions.", icon: "🌟"
    },
    {
      id: "8-9", label: "Ages 8–9", title: "Creative Sparks",
      style: "light",
      desc: "Building foundational skills through imaginative expression and guided themes.", icon: "✏️"
    },
    {
      id: "10-11", label: "Ages 10–11", title: "Rising Artists",
      style: "dark",
      desc: "For artists discovering their unique style. Winning artworks featured in our national print magazine.", icon: "🖌️"
    },
    {
      id: "12-13", label: "Ages 12–13", title: "The Rising Tide",
      style: "dark",
      desc: "Developing technical skills. Works that demonstrate depth, technique, and creative vision.", icon: "🎭"
    },
    {
      id: "14-15", label: "Ages 14–15", title: "Vanguard Academy",
      style: "light",
      desc: "Pre-professional portfolio development with opportunities for university credit and studio internships.", icon: "🏆"
    },
    {
      id: "16-17", label: "Ages 16–17", title: "Open Canvas",
      style: "teal",
      desc: "Community-driven challenges. Voted by our platform members globally. No boundaries, no limits.", icon: "🌐"
    }
  ],

  // ─── Gallery Items (populated from real admin-approved submissions via localStorage) ───
  // Static demo data removed — only real approved submissions are shown.
  gallery: [],

  // ─── FAQs ───
  faqs: [
    {
      q: "Who can participate in Art for Awareness competitions?",
      a: "Any student aged 6–17 years from any school in India can participate. The competition is completely free, inclusive, and open to all artistic mediums — traditional or digital."
    },
    {
      q: "What file formats are accepted for digital art submissions?",
      a: "We accept JPG, PNG, and WEBP formats. Maximum file size is 10MB. Physical artworks should be photographed clearly in good lighting before uploading."
    },
    {
      q: "Can I enter multiple categories?",
      a: "Yes, artists can submit up to three unique works per monthly competition across relevant age categories. Each submission must be for the declared monthly theme."
    },
    {
      q: "How are the winners selected?",
      a: "Submissions go through a two-stage process: AI-assisted content moderation for safety, followed by evaluation by our expert jury panel of professional artists and educators. Winners are announced on the Results page."
    },
    {
      q: "How do I receive my participation certificate?",
      a: "Certificates are available to download from your Dashboard once results are declared by our jury. Both participation and winner certificates are issued after each month's results announcement."
    },
    {
      q: "Is there any registration fee or participation cost?",
      a: "Absolutely not. Art for Awareness is 100% free to participate. Our platform is funded through CSR partnerships, ensuring every student can participate regardless of their background."
    },
    {
      q: "How do the monthly environmental themes work?",
      a: "Each month's competition theme is tied to a global environmental awareness day — from World Earth Day to World Ocean Day. Students create artwork around these themes, building environmental consciousness through creative expression."
    }
  ],

  // ─── Dream Generator prompts ───
  dreamPrompts: [
    '"Ancient Indian folk art meets futuristic cyberpunk skylines..."',
    '"A forest that blooms only at midnight, painted only in shades of moonlight..."',
    '"The emotions of a monsoon — expressed through texture, not colour..."',
    '"What if rivers could speak? Draw their oldest memory..."',
    '"The moment between sunrise and morning — capture that feeling..."',
    '"A city built by children, for children — no adult rules allowed..."',
    '"Traditional Warli patterns describing the journey of a satellite..."',
    '"Draw the sound of your favourite song without using any words..."',
    '"Neon Cyberpunk meets 18th Century Mughal miniature painting..."',
    '"The world seen through the eyes of a tree that has stood for 500 years..."',
    '"A marketplace where emotions are bought and sold like vegetables..."',
    '"Imagine Earth as a living, breathing organism — show its heartbeat..."'
  ],

  // ─── Instagram-style feed (color gradients for placeholders) ───
  instaFeed: [
    { gradient: "linear-gradient(135deg,#667eea,#764ba2)", emoji: "🎨" },
    { gradient: "linear-gradient(135deg,#f093fb,#f5576c)", emoji: "🌸" },
    { gradient: "linear-gradient(135deg,#4facfe,#00f2fe)", emoji: "🌊" },
    { gradient: "linear-gradient(135deg,#43e97b,#38f9d7)", emoji: "🌿" },
    { gradient: "linear-gradient(135deg,#fa709a,#fee140)", emoji: "🦋" },
    { gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)", emoji: "✨" },
    { gradient: "linear-gradient(135deg,#ffecd2,#fcb69f)", emoji: "🌅" },
    { gradient: "linear-gradient(135deg,#a1c4fd,#c2e9fb)", emoji: "☁️" },
    { gradient: "linear-gradient(135deg,#d4fc79,#96e6a1)", emoji: "🌱" },
    { gradient: "linear-gradient(135deg,#f6d365,#fda085)", emoji: "🔥" },
    { gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)", emoji: "💙" },
    { gradient: "linear-gradient(135deg,#fddb92,#d1fdff)", emoji: "🌟" }
  ],

  // ─── Prizes ───
  prizes: [
    { icon: "🥇", title: "1st Place", amount: "₹10,000", desc: "Cash prize + Winner Certificate + National Feature + Internship opportunity", featured: true },
    { icon: "🥈", title: "2nd Place", amount: "₹5,000", desc: "Cash prize + Winner Certificate + Gallery Feature", featured: false },
    { icon: "🥉", title: "3rd Place", amount: "₹3,000", desc: "Cash prize + Winner Certificate + Gallery Feature", featured: false },
    { icon: "🎖️", title: "Jury Special", amount: "₹2,000", desc: "Jury's choice award for exceptional creativity and concept", featured: false },
    { icon: "🌟", title: "Top 10", amount: "Certificates", desc: "Participation + Merit certificates for all top-10 finalists in each category", featured: false },
    { icon: "🌍", title: "Awareness Impact", amount: "Real Change", desc: "Every submission spreads environmental awareness. Monthly themes tied to global awareness days.", featured: false }
  ],

  // ─── Organization page ───
  orgBenefits: [
    { icon: "🏆", title: "National Visibility", desc: "Get your organization featured across our platform, social media, and CSR reports reaching 20,000+ students nationwide." },
    { icon: "📊", title: "Measurable Impact", desc: "Receive detailed monthly impact reports covering student engagement, artwork submissions, and trees planted in your name." },
    { icon: "🎓", title: "Education CSR Compliance", desc: "Our platform qualifies under Schedule VII Clauses (ii), (iv) & (v) of the Companies Act, 2013, maximizing your CSR eligibility." },
    { icon: "🌍", title: "Environmental Awareness", desc: "Monthly themes tied to global environmental awareness days. Your brand champions environmental consciousness through art." },
    { icon: "👨‍🏫", title: "Teacher Network", desc: "Gain access to a nationwide network of 1,000+ verified school teachers across Tier 1, 2, and 3 cities." },
    { icon: "🔒", title: "DPDP Compliant", desc: "Fully compliant with India's Digital Personal Data Protection Act 2023, with teacher-mediated student data handling." }
  ],

  // ─── Jury ───
  jury: [
    { name: "Art Educator", role: "Art Teacher", school: "National-level school, Bengaluru", emoji: "👨‍🎨" },
    { name: "Visual Art Expert", role: "HOD - Visual Art", school: "Renowned school, Gurugram", emoji: "👩‍🎨" },
    { name: "Art Department Head", role: "Senior Art Faculty", school: "Leading school, Mumbai", emoji: "🎭" },
    { name: "Professional Painter", role: "Eminent Artist", school: "Professional Artist, Kolkata", emoji: "🖼️" }
  ]
};

// Merge admin-created custom events (stored by admin panel) into DATA.events
// This keeps admin changes in sync with the main site without requiring a rebuild.
try {
  const customEvents = JSON.parse(localStorage.getItem('aba_admin_events') || '[]');
  if (Array.isArray(customEvents) && customEvents.length) {
    // Avoid duplicate IDs
    const existingIds = new Set(DATA.events.map(e => e.id));
    customEvents.forEach(ev => { if (!existingIds.has(ev.id)) DATA.events.push(ev); });
  }
} catch (e) { /* ignore */ }

// ─── Shared helpers to read submissions across all users ───
// Used by both the public site (Results/Gallery pages) and the admin panel
// to surface real user activity instead of static demo data.
function getAllSubmissionsAcrossUsers() {
  const all = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('aba_submissions_')) continue;
    const email = key.replace('aba_submissions_', '');
    try {
      const subs = JSON.parse(localStorage.getItem(key) || '[]');
      subs.forEach(s => all.push({ ...s, userEmail: email }));
    } catch (e) { /* skip */ }
  }
  return all.sort((a, b) => (b.id || 0) - (a.id || 0));
}

function getAllRegisteredUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('aba_user_') || key === 'aba_user') continue;
    try {
      const u = JSON.parse(localStorage.getItem(key));
      if (u && u.email && u.email !== 'admin@awarenessbyart.in') users.push(u);
    } catch (e) { /* skip */ }
  }
  return users;
}

// Default gradients/emojis for submissions that don't have them (visual fallback)
const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #134e5e, #71b280)',
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #00467f, #a5cc82)',
  'linear-gradient(135deg, #f7971e, #ffd200)',
  'linear-gradient(135deg, #373b44, #4286f4)',
  'linear-gradient(135deg, #b24592, #f15f79)',
  'linear-gradient(135deg, #232526, #414345)',
  'linear-gradient(135deg, #56ab2f, #a8e063)',
];
function defaultGradient(seed) {
  let h = 0;
  for (let i = 0; i < (seed || '').length; i++) { h = ((h << 5) - h) + (seed || '').charCodeAt(i); h |= 0; }
  return DEFAULT_GRADIENTS[Math.abs(h) % DEFAULT_GRADIENTS.length];
}

// Auth state (localStorage based)
const AUTH = {
  get user() { try { return JSON.parse(localStorage.getItem('aba_user')) || null; } catch { return null; } },
  save(user) { localStorage.setItem('aba_user', JSON.stringify(user)); },
  logout() { localStorage.removeItem('aba_user'); },
  isLoggedIn() { return !!this.user; },
  getSubmissions() {
    try { return JSON.parse(localStorage.getItem('aba_submissions_' + (this.user?.email || ''))) || []; } catch { return []; }
  },
  addSubmission(sub) {
    const subs = this.getSubmissions();
    const record = {
      ...sub,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Under Review',
      resultStatus: null,
      userName: this.user?.name || '',
    };
    subs.unshift(record);
    localStorage.setItem('aba_submissions_' + this.user.email, JSON.stringify(subs));
    return subs[0];
  }
};
