// ============================================
//  AWARENESS BY ART — Data Store
// ============================================

const DATA = {

  // ─── Monthly Events ───
  events: [
    {
      id: 1, day: 5, month: 4, year: 2026, monthName: "APRIL",
      title: "Nature's Colors", type: "competition",
      description: "Express the beauty of nature through paint, pencil or digital art. A focus on Earth's natural wonders and biodiversity.",
      time: "10:00 AM – 10:00 PM", deadline: "April 20, 2026",
      prize: "₹10,000 + Certificate"
    },
    {
      id: 2, day: 12, month: 4, year: 2026, monthName: "APRIL",
      title: "Sketching Masterclass", type: "workshop",
      description: "Online workshop by award-winning artist Priya Sharma. Learn the fundamentals of shading and perspective.",
      time: "3:00 PM – 5:00 PM", mode: "Online", link: "#",
      instructor: "Priya Sharma"
    },
    {
      id: 3, day: 14, month: 4, year: 2026, monthName: "APRIL",
      title: "World Art Day", type: "special",
      description: "Celebrate World Art Day! Special flash submission open to all ages. Submit your artwork with theme: 'Art for Peace'.",
      time: "All Day"
    },
    {
      id: 4, day: 22, month: 4, year: 2026, monthName: "APRIL",
      title: "Earth Day Challenge", type: "competition",
      description: "Earth Day special. Create artwork around climate action, sustainability, or our planet's future.",
      time: "9:00 AM – 9:00 PM", deadline: "April 22, 2026",
      prize: "₹5,000 + E-Certificate"
    },
    {
      id: 5, day: 5, month: 5, year: 2026, monthName: "MAY",
      title: "Ocean Dreams", type: "competition",
      description: "Dive into the deep blue. Portrayiture and scenes inspired by our oceans, marine life and waterscapes.",
      time: "10:00 AM – 10:00 PM", deadline: "May 20, 2026",
      prize: "₹12,000 + Certificate"
    },
    {
      id: 6, day: 8, month: 5, year: 2026, monthName: "MAY",
      title: "Watercolor Basics", type: "workshop",
      description: "Learn watercolor techniques from scratch. Perfect for beginners. Conducted by Ms. Veena Karki.",
      time: "11:00 AM – 1:00 PM", mode: "Online", link: "#",
      instructor: "Veena Karki"
    },
    {
      id: 7, day: 20, month: 6, year: 2026, monthName: "JUNE",
      title: "Sunshine & Joy", type: "competition",
      description: "Celebrate the season of sunshine! Create vibrant, joyful artworks that radiate warmth and happiness.",
      time: "10:00 AM – 10:00 PM", deadline: "June 20, 2026",
      prize: "₹15,000 + National Recognition"
    },
    {
      id: 8, day: 1, month: 7, year: 2026, monthName: "JULY",
      title: "Urban Geometry", type: "competition",
      description: "Sharp lines, architectural patterns, and modern cityscapes. Capture the geometry of urban life.",
      time: "10:00 AM – 10:00 PM", deadline: "July 20, 2026",
      prize: "₹12,000 + Certificate"
    },
    {
      id: 9, day: 12, month: 8, year: 2026, monthName: "AUGUST",
      title: "The Human Story", type: "competition",
      description: "Portraiture that captures the depth of emotion and the diversity of human experience.",
      time: "10:00 AM – 10:00 PM", deadline: "August 20, 2026",
      prize: "₹12,000 + Certificate"
    },
    {
      id: 10, day: 20, month: 12, year: 2026, monthName: "DECEMBER",
      title: "Dreamscapes", type: "competition",
      description: "Surreal interpretations of the subconscious mind. Let your imagination run wild.",
      time: "10:00 AM – 10:00 PM", deadline: "December 20, 2026",
      prize: "₹20,000 + Grand Prize"
    }
  ],

  // ─── Previous Winners ───
  winners: [
    {
      id: 1, title: "Silent Wisps", artist: "Aisha Khan", rank: 1,
      category: "Charcoal", ageGroup: "Age 10–12", event: "Nature's Colors", month: "April 2026",
      gradient: "linear-gradient(135deg, #1d4f5c 0%, #2E6B7A 60%, #3d8fa2 100%)",
      emoji: "🌊"
    },
    {
      id: 2, title: "Gilded Flow", artist: "Leo Santos", rank: 2,
      category: "Mixed Media", ageGroup: "Age 16–17", event: "Urban Geometry", month: "July 2026",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      emoji: "🔷"
    },
    {
      id: 3, title: "Monsoon Reverie", artist: "Priya Sharma", rank: 1,
      category: "Watercolor", ageGroup: "Age 13–15", event: "Ocean Dreams", month: "May 2026",
      gradient: "linear-gradient(135deg, #004e8c 0%, #0072b1 50%, #00a3e0 100%)",
      emoji: "🎨"
    },
    {
      id: 4, title: "Earth Mother", artist: "Rahul Verma", rank: 3,
      category: "Oil Pastel", ageGroup: "Age 6–9", event: "Earth Day Challenge", month: "April 2026",
      gradient: "linear-gradient(135deg, #2d5016 0%, #4a7c2f 50%, #7db845 100%)",
      emoji: "🌱"
    }
  ],

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

  // ─── Gallery Items ───
  gallery: [
    { id: 1, title: "Forest Dawn", artist: "Meera Patel", category: "Watercolor", ageGroup: "Age 10–11", month: "March", year: 2026, theme: "Nature", gradient: "linear-gradient(135deg, #134e5e, #71b280)", emoji: "🌲" },
    { id: 2, title: "City Lights", artist: "Arjun Singh", category: "Digital Art", ageGroup: "Age 14–15", month: "February", year: 2026, theme: "Urban", gradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", emoji: "🏙️" },
    { id: 3, title: "Ocean's Whisper", artist: "Kavya Nair", category: "Oil Pastel", ageGroup: "Age 8–9", month: "January", year: 2026, theme: "Ocean", gradient: "linear-gradient(135deg, #00467f, #a5cc82)", emoji: "🌊" },
    { id: 4, title: "Festival of Colors", artist: "Rohan Das", category: "Acrylic", ageGroup: "Age 12–13", month: "March", year: 2026, theme: "Culture", gradient: "linear-gradient(135deg, #f7971e, #ffd200)", emoji: "🎨" },
    { id: 5, title: "Mountain Peak", artist: "Sneha Roy", category: "Charcoal", ageGroup: "Age 16–17", month: "February", year: 2026, theme: "Nature", gradient: "linear-gradient(135deg, #373b44, #4286f4)", emoji: "⛰️" },
    { id: 6, title: "Butterfly Garden", artist: "Ananya Kumar", category: "Colored Pencil", ageGroup: "Age 6–7", month: "January", year: 2026, theme: "Nature", gradient: "linear-gradient(135deg, #b24592, #f15f79)", emoji: "🦋" },
    { id: 7, title: "Street Dreams", artist: "Vikram Shah", category: "Mixed Media", ageGroup: "Age 14–15", month: "March", year: 2026, theme: "Urban", gradient: "linear-gradient(135deg, #232526, #414345)", emoji: "🏘️" },
    { id: 8, title: "Golden Sunrise", artist: "Preethi Rao", category: "Watercolor", ageGroup: "Age 10–11", month: "February", year: 2026, theme: "Nature", gradient: "linear-gradient(135deg, #f7971e, #ffd200)", emoji: "🌅" },
    { id: 9, title: "Village Life", artist: "Deepak Sharma", category: "Oil Pastel", ageGroup: "Age 12–13", month: "January", year: 2026, theme: "Culture", gradient: "linear-gradient(135deg, #56ab2f, #a8e063)", emoji: "🌾" },
    { id: 10, title: "Dragon Dreams", artist: "Ishaan Mehta", category: "Digital Art", ageGroup: "Age 8–9", month: "March", year: 2026, theme: "Fantasy", gradient: "linear-gradient(135deg, #c94b4b, #4b134f)", emoji: "🐉" },
    { id: 11, title: "Rain Dance", artist: "Tara Pillai", category: "Acrylic", ageGroup: "Age 16–17", month: "February", year: 2026, theme: "Culture", gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", emoji: "💧" },
    { id: 12, title: "Midnight Bloom", artist: "Anika Gupta", category: "Charcoal", ageGroup: "Age 6–7", month: "January", year: 2026, theme: "Fantasy", gradient: "linear-gradient(135deg, #2c3e50, #fd746c)", emoji: "🌸" }
  ],

  // ─── FAQs ───
  faqs: [
    {
      q: "Who can participate in Awareness by Art competitions?",
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
      a: "Certificates are auto-generated and available to download from your My Account dashboard immediately after successful submission. Winner certificates are issued after results are declared."
    },
    {
      q: "Is there any registration fee or participation cost?",
      a: "Absolutely not. Awareness by Art is 100% free to participate. Our platform is funded through CSR partnerships, and all surplus funds go towards tree plantation drives across India."
    },
    {
      q: "How does the tree plantation initiative work?",
      a: "For every artwork submitted, a portion of our CSR sponsorship surplus funds the planting of real trees through our NGO partners SankalpTaru and SayTrees. You can track the impact live on our homepage."
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
    { icon: "🌱", title: "Green Impact", amount: "Trees Planted", desc: "Every submission funds tree planting through SankalpTaru & SayTrees NGOs", featured: false }
  ],

  // ─── Organization page ───
  orgBenefits: [
    { icon: "🏆", title: "National Visibility", desc: "Get your organization featured across our platform, social media, and CSR reports reaching 20,000+ students nationwide." },
    { icon: "📊", title: "Measurable Impact", desc: "Receive detailed monthly impact reports covering student engagement, artwork submissions, and trees planted in your name." },
    { icon: "🎓", title: "Education CSR Compliance", desc: "Our platform qualifies under Schedule VII Clauses (ii), (iv) & (v) of the Companies Act, 2013, maximizing your CSR eligibility." },
    { icon: "🌱", title: "Environmental Legacy", desc: "100% of surplus funds go to tree plantation via blockchain-verified NGO partners. Your brand plants real trees." },
    { icon: "👨‍🏫", title: "Teacher Network", desc: "Gain access to a nationwide network of 1,000+ verified school teachers across Tier 1, 2, and 3 cities." },
    { icon: "🔒", title: "DPDP Compliant", desc: "Fully compliant with India's Digital Personal Data Protection Act 2023, with teacher-mediated student data handling." }
  ],

  // ─── Jury ───
  jury: [
    { name: "Mr. Venkatesh Desai", role: "Art Teacher", school: "Mallya Aditi International School, Bengaluru", emoji: "👨‍🎨" },
    { name: "Ms. Veena Karki", role: "HOD - Visual Art", school: "Shiv Nadar School, Gurugram", emoji: "👩‍🎨" },
    { name: "Mr. Jay Salian", role: "HOD Art Department", school: "A.M. Naik School, Mumbai", emoji: "🎭" },
    { name: "Ms. Tanima Bhattacharya", role: "Eminent Professional Painter", school: "Professional Artist, Kolkata", emoji: "🖼️" }
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
    subs.unshift({ ...sub, id: Date.now(), date: new Date().toLocaleDateString('en-IN'), status: 'Under Review', resultStatus: null });
    localStorage.setItem('aba_submissions_' + this.user.email, JSON.stringify(subs));
    return subs[0];
  }
};
