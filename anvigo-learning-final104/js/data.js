/* ============================================================
   Anvigo Learning — Data Layer
   All content is stored in localStorage so the Admin Panel can
   manage it. First visit seeds default demo data.
   ============================================================ */

const VHT_KEY = 'vht_data_v2';
const VHT_ENQ_KEY = 'vht_enquiries_v1';
const VHT_TEACHER_APP_KEY = 'vht_teacher_applications_v1';
const VHT_SCHOOL_APP_KEY = 'vht_school_applications_v1';
const VHT_ADMIN_KEY = 'vht_admin_session';

const VHT_INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

/* Generate a colorful initials avatar as an SVG data-URI */
function vhtAvatar(name, c1, c2) {
  const initials = (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="240" height="240" fill="url(#g)"/>
    <circle cx="120" cy="95" r="45" fill="rgba(255,255,255,0.9)"/>
    <path d="M45 240 Q120 150 195 240 Z" fill="rgba(255,255,255,0.9)"/>
    <text x="120" y="112" text-anchor="middle" font-family="Poppins, Arial" font-size="38" font-weight="700" fill="${c1}">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

const VHT_DEFAULTS = {
  settings: {
    siteName: 'Anvigo Learning',
    tagline: 'Learn • Teach • Grow — Find Verified Home & Online Tutors, Teaching Jobs & School Hiring, All In One Place',
    phone: '+91 8979913296',
    whatsapp: '918979913296',
    email: 'anvigolearning@gmail.com',
    enquiryEmail: 'anvigolearning@gmail.com',
    address: 'India (Home & Online Tuition — Pan India Service)',
    mapLink: 'https://maps.google.com/?q=India',
    hours: 'Mon - Sun: 8:00 AM - 9:00 PM',
    facebook: 'https://www.facebook.com/share/1EcgPZfWSw/',
    instagram: 'https://www.instagram.com/anvigolearning',
   // youtube: 'https://youtube.com/',
    sheetWebAppUrl: 'https://script.google.com/macros/s/AKfycbwCy94BCi_eFyPSccaCmt3FUDGMchECfUZK0_PYznryYlE6lz8whvsrB67IGE1bDabV/exec',
    about: 'Anvigo Learning is a platform that brings students, teachers and schools together. We help parents find verified home & online tutors for their children, help qualified teachers find great tuition and teaching opportunities, and help schools hire the right teachers for their subjects — all in one place, anywhere in India. Our mission: Learn, Teach, Grow.',
    heroTitle: 'Best Home & Online Tutors, Teachers & Schools — All In One Place',
    heroSubtitle: 'Verified tutors for Class 1-12, JEE, NEET, Commerce & Spoken English — at home or online. Teachers can register for tuition & teaching jobs. Schools can hire qualified teachers. Book a FREE demo class today!'
  },
  teachers: [
    { id: 1, name: 'Rakesh Sharma', qualification: 'M.Sc. Mathematics, B.Ed.', experience: '12+ Years', subjects: 'Mathematics, Physics', classes: 'Class 6-12, JEE', areas: 'Delhi NCR', demo: 'Yes', bio: 'Expert in board exam preparation and JEE foundation. Known for making Maths simple and fun.', photo: vhtAvatar('Rakesh Sharma', '#e63946', '#ff7a18') },
    { id: 2, name: 'Priya Agarwal', qualification: 'M.Sc. Chemistry, NET Qualified', experience: '8+ Years', subjects: 'Chemistry, Biology', classes: 'Class 9-12, NEET', areas: 'Mumbai', demo: 'Yes', bio: 'NEET specialist with 50+ selections. Focus on NCERT mastery and regular testing.', photo: vhtAvatar('Priya Agarwal', '#8b5cf6', '#ec4899') },
    { id: 3, name: 'Amit Verma', qualification: 'M.Com, CA Inter', experience: '10+ Years', subjects: 'Accounts, Economics, Business Studies', classes: 'Class 11-12, B.Com', areas: 'Bengaluru', demo: 'Yes', bio: 'Commerce expert. Students consistently score 90+ in board exams.', photo: vhtAvatar('Amit Verma', '#1d7fbf', '#14b8a6') },
    { id: 4, name: 'Sunita Mishra', qualification: 'M.A. English, B.Ed.', experience: '9+ Years', subjects: 'English, Spoken English, Hindi', classes: 'Class 1-10, Spoken English', areas: 'Pune', demo: 'Yes', bio: 'Makes young learners confident in English speaking and grammar.', photo: vhtAvatar('Sunita Mishra', '#0f9d58', '#84cc16') },
    { id: 5, name: 'Deepak Chaturvedi', qualification: 'B.Tech (IIT Kanpur)', experience: '6+ Years', subjects: 'Physics, Mathematics', classes: 'Class 11-12, JEE, NEET', areas: 'Online (Pan India)', demo: 'Yes', bio: 'IITian mentor for JEE/NEET aspirants. Concept-first teaching with weekly mock tests.', photo: vhtAvatar('Deepak Chaturvedi', '#f59e0b', '#e63946') },
    { id: 6, name: 'Kavita Goswami', qualification: 'M.Sc. Biology, B.Ed.', experience: '7+ Years', subjects: 'Science, Biology', classes: 'Class 6-10', areas: 'Hyderabad', demo: 'Yes', bio: 'Patient and friendly teacher for middle school science with activity-based learning.', photo: vhtAvatar('Kavita Goswami', '#14b8a6', '#1d7fbf') }
  ],
  toppers: [
    { id: 1, name: 'Aarav Gupta', marks: '97.4% — Class 12 (PCM)', school: 'Kendriya Vidyalaya, Delhi', year: '2025', story: 'Cracked JEE Mains with 98.2 percentile along with board topper rank.', photo: vhtAvatar('Aarav Gupta', '#e63946', '#f59e0b') },
    { id: 2, name: 'Shreya Sharma', marks: '96.8% — Class 10', school: 'St. Paul\'s School, Mumbai', year: '2025', story: 'School topper in Maths and Science with 100/100 in Mathematics.', photo: vhtAvatar('Shreya Sharma', '#8b5cf6', '#ec4899') },
    { id: 3, name: 'Rohan Pandey', marks: 'NEET Qualified — 645 Marks', school: 'DAV Public School, Bengaluru', year: '2024', story: 'Selected in Government Medical College after 2 years of dedicated NEET coaching.', photo: vhtAvatar('Rohan Pandey', '#0f9d58', '#14b8a6') },
    { id: 4, name: 'Ananya Chaudhary', marks: '95.2% — Class 12 (Commerce)', school: 'Sacred Heart Convent, Pune', year: '2025', story: 'District topper in Accountancy with 99/100 marks.', photo: vhtAvatar('Ananya Chaudhary', '#1d7fbf', '#8b5cf6') }
  ],
  testimonials: [
    { id: 1, name: 'Mrs. Rekha Agrawal', relation: 'Parent of Class 10 student', text: 'Meri beti ke Maths me 95+ marks aaye hain. Rakesh Sir bahut acha padhate hain aur regular test lete hain. Highly recommended!', rating: 5 },
    { id: 2, name: 'Mr. Suresh Tiwari', relation: 'Parent of NEET aspirant', text: 'Priya Ma\'am ki wajah se mere bete ka NEET clear hua. Ghar par hi itni achi coaching mil gayi, bahut dhanyavaad Anvigo Learning!', rating: 5 },
    { id: 3, name: 'Mrs. Poonam Sharma', relation: 'Parent of Class 5 student', text: 'Sunita Ma\'am bahut patient hain. Mera beta ab English me confident ho gaya hai. Demo class free mili thi jo bahut helpful rahi.', rating: 5 },
    { id: 4, name: 'Mr. Rajesh Goyal', relation: 'Parent of Class 12 Commerce student', text: 'Amit Sir ke padhane ka tarika bahut acha hai. Accounts jaise tough subject me meri beti ne 98 marks laaye. Thank you!', rating: 5 }
  ],
  blogs: [
    { id: 1, title: 'Best Home & Online Tutor — How to Choose the Right One', slug: 'best-home-tutor', date: '2025-07-10', author: 'Anvigo Learning', content: 'Choosing the right home or online tutor can transform your child\'s academic journey. Look for verified qualifications, teaching experience, and a free demo class before committing.\n\nAt Anvigo Learning, every tutor is background-verified, qualification-checked and interviewed personally. We match tutors based on your child\'s class, subject needs and learning style.\n\nKey things to check:\n1. Qualification & subject expertise\n2. Experience with your child\'s board (CBSE/ICSE/State Board)\n3. Demo class performance\n4. Regular tests & progress reports\n5. Feedback from other parents\n\nBook a free demo class today and see the difference personal attention makes!' },
    { id: 2, title: 'How to Prepare for CBSE Board Exams — Complete Strategy', slug: 'cbse-board-preparation', date: '2025-08-02', author: 'Anvigo Learning', content: 'CBSE board exams need a smart strategy, not just hard work. Here is our proven 5-step plan used by our toppers:\n\n1. NCERT First: 90% of the paper comes from NCERT. Master every line, example and back exercise.\n2. Previous Year Papers: Solve at least 10 years of papers chapter-wise.\n3. Sample Papers: Practice full 3-hour papers in exam conditions every week.\n4. Revision Notes: Make short notes for every chapter for quick revision.\n5. Weak Areas: Identify and fix weak chapters with your tutor\'s help.\n\nOur tutors create a personalised study timetable for every student. Enquire now for board exam crash courses!' },
    { id: 3, title: 'JEE Preparation Tips for Class 11 Students', slug: 'jee-preparation-tips', date: '2025-08-20', author: 'Anvigo Learning', content: 'Starting JEE preparation in Class 11 gives you a huge advantage. Here are tips from our IITian faculty:\n\n1. Build concepts from NCERT before jumping to advanced books.\n2. For Physics: HC Verma + previous year JEE questions.\n3. For Chemistry: NCERT is king, especially for Inorganic.\n4. For Maths: Practice daily — minimum 30 questions a day.\n5. Take weekly mock tests and analyse every mistake.\n\nOur tutors include IIT graduates who provide one-to-one JEE coaching at home or online. Book a free demo class now.' }
  ],
  gallery: [
    { id: 1, title: 'Maths Classroom Session', image: 'images/gallery1.svg' },
    { id: 2, title: 'One-to-One Home Tuition', image: 'images/gallery2.svg' },
    { id: 3, title: 'Annual Award Ceremony', image: 'images/gallery3.svg' }
  ],
  banners: [
    { id: 1, title: 'Best Home & Online Tutors, Teachers & Schools — All In One Place', subtitle: 'Verified tutors for Class 1-12, JEE, NEET, Commerce & Spoken English — at home or online.', cta: 'Book FREE Demo Class', active: true },
    { id: 2, title: 'Teachers & Schools — Register Free', subtitle: 'Teachers can apply for tuition jobs. Schools can hire qualified teachers, absolutely free.', cta: 'Register Now', active: true }
  ],
  courses: [
    { id: 1, title: 'Class 1 - 5 (Junior)', desc: 'Strong foundation in Maths, English, Hindi, EVS with fun activity-based learning and handwriting improvement.', icon: '🧒', subjects: 'All Subjects' },
   // { id: 2, title: 'Class 6 - 10', desc: 'Complete syllabus coverage for CBSE, ICSE & State Boards with chapter-wise tests and doubt sessions.', icon: '📚', subjects: 'Maths, Science, English, SST, Hindi' },
    { id: 2, title: 'Class 6 - 10', desc: 'Complete syllabus coverage for CBSE, ICSE & State Boards with chapter-wise tests and doubt sessions.', icon: '📚', subjects: 'All Subjects' }, 
    { id: 3, title: 'Class 11 - 12 (Science)', desc: 'PCM & PCB streams with board + competitive exam preparation by expert faculty.', icon: '🔬', subjects: 'Physics, Chemistry, Maths, Biology' },
    { id: 4, title: 'JEE (Main + Advanced)', desc: 'One-to-one JEE coaching by IITian faculty with weekly mock tests and performance analysis.', icon: '⚙️', subjects: 'Physics, Chemistry, Mathematics' },
    { id: 5, title: 'NEET', desc: 'NCERT-focused NEET preparation with 50+ selections. Regular tests on NEET pattern.', icon: '🩺', subjects: 'Physics, Chemistry, Biology' },
    { id: 6, title: 'Commerce (11-12 & B.Com)', desc: 'Accounts, Economics & Business Studies by CA Inter qualified faculty.', icon: '📊', subjects: 'Accounts, Economics, Business Studies' },
    { id: 7, title: 'Spoken English', desc: 'Personality development and fluent English speaking course for students and adults.', icon: '🗣️', subjects: 'Spoken English, Grammar' }
  ],
  areas: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Patna', 'Indore', 'Bhopal', 'Chandigarh', 'Kochi', 'Online (Pan India)'],
  admin: { username: 'admin', password: 'admin123' }
};

function vhtSanitizeData(data) {
  if (!data || typeof data !== 'object') return data;
  const sections = ['teachers', 'toppers', 'testimonials', 'blogs', 'gallery', 'banners'];
  sections.forEach(sec => {
    if (Array.isArray(data[sec])) {
      const seen = new Set();
      data[sec] = data[sec].map((item, idx) => {
        if (!item || typeof item !== 'object') return item;
        let id = item.id;
        const idStr = String(id);
        if (id == null || idStr === '' || idStr === 'undefined' || idStr === 'null' || idStr === 'NaN' || seen.has(idStr)) {
          id = Date.now() + idx;
        }
        seen.add(String(id));
        return { ...item, id };
      });
    }
  });
  return data;
}

function vhtLoad() {
  try {
    const raw = localStorage.getItem(VHT_KEY);
    if (raw) {
      let data = JSON.parse(raw);
      // merge any new default sections added in future versions
      for (const k of Object.keys(VHT_DEFAULTS)) if (!(k in data)) data[k] = VHT_DEFAULTS[k];
      if (data.settings) {
        for (const sk of Object.keys(VHT_DEFAULTS.settings)) {
          if (!data.settings[sk]) data.settings[sk] = VHT_DEFAULTS.settings[sk];
        }
        if (data.settings.about && data.settings.about.includes('Verma')) {
          data.settings.about = VHT_DEFAULTS.settings.about;
        }
      }
      data = vhtSanitizeData(data);
      return data;
    }
  } catch (e) { console.warn('VHT: resetting corrupted data', e); }
  const defaults = JSON.parse(JSON.stringify(VHT_DEFAULTS));
  const sanitized = vhtSanitizeData(defaults);
  localStorage.setItem(VHT_KEY, JSON.stringify(sanitized));
  return sanitized;
}

function vhtSave(data) {
  const sanitized = vhtSanitizeData(data);
  localStorage.setItem(VHT_KEY, JSON.stringify(sanitized));
}

/**
 * Merge cloud-fetched data into local cache safely.
 * Returns the merged data object.
 */
function vhtMergeCloudData(cloudData) {
  if (!cloudData || typeof cloudData !== 'object') return vhtLoad();
  const local = vhtLoad();

  const sections = ['teachers', 'toppers', 'testimonials', 'blogs', 'gallery', 'banners', 'courses', 'areas'];
  sections.forEach(sec => {
    if (Array.isArray(cloudData[sec])) {
      local[sec] = cloudData[sec];
    }
  });

  if (cloudData.settings && typeof cloudData.settings === 'object') {
    local.settings = { ...local.settings, ...cloudData.settings };
  }

  // Preserve local admin credentials
  if (!local.admin) local.admin = VHT_DEFAULTS.admin;

  const sanitized = vhtSanitizeData(local);
  localStorage.setItem(VHT_KEY, JSON.stringify(sanitized));
  return sanitized;
}

function vhtEnquiries() {
  try { return JSON.parse(localStorage.getItem(VHT_ENQ_KEY)) || []; }
  catch (e) { return []; }
}

function vhtSaveEnquiries(list) {
  localStorage.setItem(VHT_ENQ_KEY, JSON.stringify(list));
}

function vhtAddEnquiry(enq) {
  const list = vhtEnquiries();
  enq.id = Date.now();
  enq.date = new Date().toLocaleString('en-IN');
  enq.status = 'New';
  list.unshift(enq);
  vhtSaveEnquiries(list);
  return enq;
}

/* ---------- Teacher applications (job/tutor applications) ---------- */
function vhtTeacherApplications() {
  try { return JSON.parse(localStorage.getItem(VHT_TEACHER_APP_KEY)) || []; }
  catch (e) { return []; }
}

function vhtSaveTeacherApplications(list) {
  localStorage.setItem(VHT_TEACHER_APP_KEY, JSON.stringify(list));
}

function vhtAddTeacherApplication(app) {
  const list = vhtTeacherApplications();
  app.id = Date.now();
  app.date = new Date().toLocaleString('en-IN');
  app.status = 'New';
  list.unshift(app);
  vhtSaveTeacherApplications(list);
  return app;
}

/* ---------- School applications (schools that want to hire teachers) ---------- */
function vhtSchoolApplications() {
  try { return JSON.parse(localStorage.getItem(VHT_SCHOOL_APP_KEY)) || []; }
  catch (e) { return []; }
}

function vhtSaveSchoolApplications(list) {
  localStorage.setItem(VHT_SCHOOL_APP_KEY, JSON.stringify(list));
}

function vhtAddSchoolApplication(app) {
  const list = vhtSchoolApplications();
  app.id = Date.now();
  app.date = new Date().toLocaleString('en-IN');
  app.status = 'New';
  list.unshift(app);
  vhtSaveSchoolApplications(list);
  return app;
}

function vhtNextId(arr) {
  if (!Array.isArray(arr) || !arr.length) return Date.now();
  const validIds = arr.map(x => Number(x.id)).filter(n => !isNaN(n) && isFinite(n));
  return validIds.length ? Math.max(...validIds) + 1 : Date.now();
}

function vhtEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
