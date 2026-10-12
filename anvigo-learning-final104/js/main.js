/* ============================================================
   Anvigo Learning — Public Site Logic
   ============================================================ */

let VHT = vhtLoad();
let S = VHT.settings;

/* ---------- Shared header / footer / floating buttons ---------- */
function vhtToggleNav(force) {
  const nav = document.querySelector('.main-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  const btn = document.querySelector('.hamburger');
  const open = typeof force === 'boolean' ? force : !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  if (backdrop) backdrop.classList.toggle('show', open);
  if (btn) btn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

function vhtRenderChrome() {
  const page = document.body.dataset.page || '';
  const links = [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About Us', 'about'],
    ['teachers.html', 'Our Teachers', 'teachers'],
    ['courses.html', 'Courses', 'courses'],
    ['results.html', 'Results & Toppers', 'results'],
    ['testimonials.html', 'Testimonials', 'testimonials'],
    ['blog.html', 'Blog', 'blog'],
    ['contact.html', 'Contact', 'contact']
  ];
  const nav = links.map(([href, label, key]) =>
    `<li><a href="${href}" class="${key === page ? 'active' : ''}">${label}</a></li>`).join('');

  document.getElementById('site-header').innerHTML = `
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <a href="tel:${vhtEsc(S.phone.replace(/\s/g, ''))}">📞 ${vhtEsc(S.phone)}</a>
          <a href="mailto:${vhtEsc(S.email)}">✉️ ${vhtEsc(S.email)}</a>
        </div>
        <div class="topbar-left">
          <a class="topbar-teacher-link" href="contact.html#apply-teacher">👩‍🏫 Apply as Teacher</a>
          <a class="topbar-teacher-link" href="contact.html#apply-school">🏫 Schools: Hire Teachers</a>
          <span class="topbar-hours">🕗 ${vhtEsc(S.hours)}</span>
        </div>
      </div>
    </div>
    <div class="container nav-wrap">
      <a class="logo" href="index.html"><img src="images/logo.png" alt="${vhtEsc(S.siteName)} Logo"></a>
      <button class="hamburger" aria-label="Toggle menu" aria-expanded="false" onclick="vhtToggleNav()">☰</button>
      <nav class="main-nav">
        <div class="mobile-nav-header">
          <img src="images/logo.png" alt="${vhtEsc(S.siteName)}">
          <button class="nav-close-btn" aria-label="Close menu" onclick="vhtToggleNav(false)">&times;</button>
        </div>
        <ul>${nav}
          <li><a class="nav-cta" href="contact.html#enquiry">Book FREE Demo</a></li>
        </ul>
      </nav>
    </div>
    <div class="nav-backdrop" onclick="vhtToggleNav(false)"></div>`;

  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => vhtToggleNav(false)));

  document.getElementById('site-footer').innerHTML = `
    <div class="container footer-grid">
      <div class="footer-logo">
        <img src="images/logo.png" alt="${vhtEsc(S.siteName)}">
        <p>${vhtEsc(S.about)}</p>
              <div class="social-links">
          <a href="${vhtEsc(S.facebook)}" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="${vhtEsc(S.instagram)}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          
        </div>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="teachers.html">Our Teachers</a></li>
          <li><a href="courses.html">Courses</a></li>
          <li><a href="results.html">Results & Toppers</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html#apply-teacher">👩‍🏫 Teacher Registration</a></li>
          <li><a href="contact.html#apply-school">🏫 Schools — Hire Teachers</a></li>
          <li><a href="admin/index.html">Admin Login</a></li>
        </ul>
      </div>
      <div>
        <h4>Service Areas</h4>
        <ul>
          <li><a href="teachers.html?area=North+India">📍 Home Tuition in North India</a></li>
          <li><a href="teachers.html?area=South+India">📍 Home Tuition in South India</a></li>
          <li><a href="teachers.html?area=West+India">📍 Home Tuition in West India</a></li>
          <li><a href="teachers.html?area=East+India">📍 Home Tuition in East India</a></li>
          <li><a href="teachers.html?area=Online+(Pan+India)">🌐 Available in PAN India (Home & Online Tution)</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact Us</h4>
        <ul>
          <li>📍 ${vhtEsc(S.address)}</li>
          <li>📞 <a href="tel:${vhtEsc(S.phone.replace(/\s/g, ''))}">${vhtEsc(S.phone)}</a></li>
          <li>✉️ <a href="mailto:${vhtEsc(S.email)}">${vhtEsc(S.email)}</a></li>
          <li>🕗 ${vhtEsc(S.hours)}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom container">© ${new Date().getFullYear()} ${vhtEsc(S.siteName)}. All Rights Reserved. | Learn • Teach • Grow — Across India</div>`;

  // Floating buttons with official SVGs
  const fb = document.createElement('div');
  fb.className = 'float-btns';
  fb.innerHTML = `
    <a class="float-btn float-call" href="tel:${vhtEsc(S.phone.replace(/\s/g, ''))}" aria-label="Call Now" title="Call Now">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
    </a>
    <a class="float-btn float-wa" target="_blank" rel="noopener" aria-label="WhatsApp"
       href="https://wa.me/${vhtEsc(S.whatsapp)}?text=${encodeURIComponent('Hello! I want to enquire about home/online tuition on Anvigo Learning.')}" title="Chat on WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.196 8.196 0 012.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.3z"/></svg>
    </a>`;
  document.body.appendChild(fb);

  vhtSetupPopup();
}

/* ---------- Google Sheets sync (free "auto-updating Excel") ----------
   Set Website Settings → Google Sheet Web App URL (Admin Panel) once you've
   deployed the Apps Script in /google-sheets-setup/Code.gs. Every form
   submission is then appended as a new row in your Google Sheet, which you
   can open directly or download as .xlsx (File → Download → Microsoft Excel)
   any time — it updates automatically, no manual export needed. */
function vhtSendToSheet(sheetName, data) {
  const url = (typeof vhtGetSheetUrl === 'function') ? vhtGetSheetUrl() : (S.sheetWebAppUrl || '');
  if (!url) return;
  try {
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ sheet: sheetName, data: data })
    });
  } catch (e) { console.warn('Google Sheet sync failed (check Settings → Google Sheet URL).', e); }
}

function vhtAddressFieldsHTML() {
  const stateOpts = VHT_INDIAN_STATES.map(s => `<option>${vhtEsc(s)}</option>`).join('');
  return `
    <div><label>State *</label><select name="state" required><option value="">Select state</option>${stateOpts}</select></div>
    <div><label>City *</label><input type="text" name="city" placeholder="e.g. Indore" required></div>
    <div class="full"><label>Full Address *</label><input type="text" name="address" placeholder="House no., street, landmark, area" required></div>
    <div><label>Pin Code *</label><input type="text" name="pincode" placeholder="6-digit PIN code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required></div>`;
}

/* ---------- Student Enrollment (parents — home/online tuition) ---------- */
async function vhtSubmitEnquiry(form, msgEl) {
  const f = new FormData(form);
  const enq = {
    name: f.get('name'), studentClass: f.get('studentClass') || '', mobile: f.get('mobile'),
    email: f.get('email') || '', state: f.get('state') || '', city: f.get('city') || '',
    address: f.get('address') || '', pincode: f.get('pincode') || '',
    subjects: f.get('subjects') || '', budget: f.get('budget') || ''
  };
  if (!enq.name || !enq.mobile) { vhtFormMsg(msgEl, 'Please fill Name and Mobile number.', false); return; }
  if (!/^[0-9+\-\s]{10,15}$/.test(enq.mobile)) { vhtFormMsg(msgEl, 'Please enter a valid mobile number.', false); return; }
  if (!enq.state || !enq.city || !enq.address || !enq.pincode) { vhtFormMsg(msgEl, 'Please fill your complete address (State, City, Address, Pin code).', false); return; }
  if (!enq.subjects) { vhtFormMsg(msgEl, 'Please tell us which subjects you need.', false); return; }

  vhtAddEnquiry(enq);
  vhtFormMsg(msgEl, '⏳ Submitting your enquiry...', true);

  if (typeof vhtSupabaseSubmitStudent === 'function') {
    try {
      await vhtSupabaseSubmitStudent(enq);
    } catch (e) { console.warn('Supabase student submission error:', e); }
  }

  vhtSendToSheet('Students', {
    'Date': new Date().toLocaleString('en-IN'), 'Name': enq.name, 'Class of Student': enq.studentClass,
    'Mobile': enq.mobile, 'Email': enq.email, 'State': enq.state, 'City': enq.city,
    'Address': enq.address, 'Pin Code': enq.pincode, 'Subjects': enq.subjects, 'Budget': enq.budget
  });

  try {
    await fetch('https://formsubmit.co/ajax/' + S.enquiryEmail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Student Enrollment — ' + S.siteName,
        'Name': enq.name, 'Class': enq.studentClass, 'Mobile': enq.mobile, 'Email': enq.email,
        'State': enq.state, 'City': enq.city, 'Address': enq.address, 'Pin Code': enq.pincode,
        'Subjects': enq.subjects, 'Budget': enq.budget
      })
    });
  } catch (e) { console.warn('Email notification could not be sent (offline/local mode).', e); }

  vhtFormMsg(msgEl, '✅ Thank you! Your enquiry has been received. We will call you back shortly.', true);
  form.reset();
}

/* ---------- Teacher Recruitment ---------- */
async function vhtSubmitTeacherApplication(form, msgEl) {
  const f = new FormData(form);
  const app = {
    name: f.get('name'), mobile: f.get('mobile'), email: f.get('email') || '',
    qualification: f.get('qualification') || '', state: f.get('state') || '', city: f.get('city') || '',
    address: f.get('address') || '', pincode: f.get('pincode') || '', subjects: f.get('subjects') || ''
  };
  if (!app.name || !app.mobile) { vhtFormMsg(msgEl, 'Please fill Name and Mobile number.', false); return; }
  if (!/^[0-9+\-\s]{10,15}$/.test(app.mobile)) { vhtFormMsg(msgEl, 'Please enter a valid mobile number.', false); return; }
  if (!app.state || !app.city || !app.address || !app.pincode) { vhtFormMsg(msgEl, 'Please fill your complete address (State, City, Address, Pin code).', false); return; }
  if (!app.subjects) { vhtFormMsg(msgEl, 'Please tell us which subjects you can teach.', false); return; }

  vhtAddTeacherApplication(app);
  vhtFormMsg(msgEl, '⏳ Submitting your application...', true);

  if (typeof vhtSupabaseSubmitTeacher === 'function') {
    try {
      await vhtSupabaseSubmitTeacher(app);
    } catch (e) { console.warn('Supabase teacher submission error:', e); }
  }

  vhtSendToSheet('Teachers', {
    'Date': new Date().toLocaleString('en-IN'), 'Name': app.name, 'Phone No.': app.mobile, 'Email': app.email,
    'Highest Qualification': app.qualification, 'State': app.state, 'City': app.city,
    'Address': app.address, 'Pin Code': app.pincode, 'Subjects': app.subjects
  });

  try {
    await fetch('https://formsubmit.co/ajax/' + S.enquiryEmail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Teacher Application — ' + S.siteName,
        'Name': app.name, 'Phone': app.mobile, 'Email': app.email, 'Qualification': app.qualification,
        'State': app.state, 'City': app.city, 'Address': app.address, 'Pin Code': app.pincode, 'Subjects': app.subjects
      })
    });
  } catch (e) { console.warn('Email notification could not be sent (offline/local mode).', e); }

  vhtFormMsg(msgEl, '✅ Thank you! Your application has been received. Our team will contact you shortly.', true);
  form.reset();
}

/* ---------- School Enrollment (schools that want to hire teachers) ---------- */
async function vhtSubmitSchoolApplication(form, msgEl) {
  const f = new FormData(form);
  const app = {
    schoolName: f.get('schoolName'), contact: f.get('contact'), email: f.get('email') || '',
    state: f.get('state') || '', city: f.get('city') || '', address: f.get('address') || '',
    pincode: f.get('pincode') || '', subject: f.get('subject') || '', budget: f.get('budget') || ''
  };
  if (!app.schoolName || !app.contact) { vhtFormMsg(msgEl, 'Please fill School Name and Contact number.', false); return; }
  if (!/^[0-9+\-\s]{10,15}$/.test(app.contact)) { vhtFormMsg(msgEl, 'Please enter a valid contact number.', false); return; }
  if (!app.state || !app.city || !app.address || !app.pincode) { vhtFormMsg(msgEl, 'Please fill the complete address (State, City, Address, Pin code).', false); return; }
  if (!app.subject) { vhtFormMsg(msgEl, 'Please tell us which subject teacher you need.', false); return; }

  vhtAddSchoolApplication(app);
  vhtFormMsg(msgEl, '⏳ Submitting your request...', true);

  if (typeof vhtSupabaseSubmitSchool === 'function') {
    try {
      await vhtSupabaseSubmitSchool(app);
    } catch (e) { console.warn('Supabase school submission error:', e); }
  }

  vhtSendToSheet('Schools', {
    'Date': new Date().toLocaleString('en-IN'), 'School Name': app.schoolName, 'Contact No.': app.contact,
    'Email': app.email, 'State': app.state, 'City': app.city, 'Address': app.address, 'Pin Code': app.pincode,
    'Subject Needed': app.subject, 'Budget': app.budget
  });

  try {
    await fetch('https://formsubmit.co/ajax/' + S.enquiryEmail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New School Hiring Request — ' + S.siteName,
        'School Name': app.schoolName, 'Contact': app.contact, 'Email': app.email,
        'State': app.state, 'City': app.city, 'Address': app.address, 'Pin Code': app.pincode,
        'Subject Needed': app.subject, 'Budget': app.budget
      })
    });
  } catch (e) { console.warn('Email notification could not be sent (offline/local mode).', e); }

  vhtFormMsg(msgEl, '✅ Thank you! Your request has been received. Our team will contact you shortly.', true);
  form.reset();
}

function vhtFormMsg(el, text, ok) {
  el.textContent = text;
  el.className = 'form-msg ' + (ok ? 'ok' : 'err');
}

function vhtBindEnquiryForms() {
  document.querySelectorAll('form.enquiry-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      vhtSubmitEnquiry(form, form.querySelector('.form-msg'));
    });
  });
  document.querySelectorAll('form.teacher-apply-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      vhtSubmitTeacherApplication(form, form.querySelector('.form-msg'));
    });
  });
  document.querySelectorAll('form.school-apply-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      vhtSubmitSchoolApplication(form, form.querySelector('.form-msg'));
    });
  });
}

function vhtEnquiryFormHTML() {
  const classes = ['Nursery-KG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'JEE', 'NEET', 'Commerce', 'Spoken English'];
  const classOpts = classes.map(c => `<option>${c}</option>`).join('');
  return `
    <div class="form-grid">
      <div><label>Parent Name *</label><input type="text" name="name" placeholder="Your full name" required></div>
      <div><label>Class of Student</label><select name="studentClass"><option value="">Select class</option>${classOpts}</select></div>
      <div><label>Mobile Number *</label><input type="tel" name="mobile" placeholder="10-digit mobile number" required></div>
      <div><label>Email (optional)</label><input type="email" name="email" placeholder="you@example.com"></div>
      ${vhtAddressFieldsHTML()}
      <div><label>Subjects Needed *</label><input type="text" name="subjects" placeholder="e.g. Maths, Science" required></div>
      <div><label>Budget (optional)</label><input type="text" name="budget" placeholder="e.g. ₹5,000/month"></div>
      <div class="full" style="text-align:center">
        <button class="btn btn-primary" type="submit">📩 Submit Enquiry — Get FREE Demo Class</button>
        <div class="form-note">Your details are 100% safe with us. we will contact you within 24 hours</div>
        <div class="form-msg"></div>
      </div>
    </div>`;
}

function vhtTeacherApplicationFormHTML() {
  return `
    <div class="form-grid">
      <div><label>Full Name *</label><input type="text" name="name" placeholder="Your full name" required></div>
      <div><label>Phone No. *</label><input type="tel" name="mobile" placeholder="10-digit mobile number" required></div>
      <div><label>Email</label><input type="email" name="email" placeholder="you@example.com"></div>
      <div><label>Highest Qualification</label><input type="text" name="qualification" placeholder="e.g. M.Sc. Mathematics, B.Ed."></div>
      ${vhtAddressFieldsHTML()}
      <div class="full"><label>Subjects You Want to Teach *</label><input type="text" name="subjects" placeholder="e.g. Maths, Physics" required></div>
      <div class="full" style="text-align:center">
        <button class="btn btn-primary" type="submit">👩‍🏫 Submit Teacher Application</button>
        <div class="form-note">Your details are 100% safe with us. we will contact you within 24 hours.</div>
        <div class="form-msg"></div>
      </div>
    </div>`;
}

function vhtSchoolApplicationFormHTML() {
  return `
    <div class="form-grid">
      <div><label>School Name *</label><input type="text" name="schoolName" placeholder="Your school's name" required></div>
      <div><label>Contact No. *</label><input type="tel" name="contact" placeholder="10-digit contact number" required></div>
      <div><label>Email</label><input type="email" name="email" placeholder="school@example.com"></div>
      ${vhtAddressFieldsHTML()}
      <div><label>Subject Teacher Required *</label><input type="text" name="subject" placeholder="e.g. Physics, English" required></div>
      <div><label>Budget</label><input type="text" name="budget" placeholder="e.g. ₹25,000/month"></div>
      <div class="full" style="text-align:center">
        <button class="btn btn-primary" type="submit">🏫 Submit Hiring Request</button>
        <div class="form-note">Your details are 100% safe with us. we will contact you within 24 hours</div>
        <div class="form-msg"></div>
      </div>
    </div>`;
}

/* ---------- Popup ("Get Free Demo Class" after 7 seconds) ---------- */
function vhtSetupPopup() {
  if (sessionStorage.getItem('vht_popup_shown') || document.body.dataset.page === 'admin') return;
  const ov = document.createElement('div');
  ov.className = 'popup-overlay';
  ov.innerHTML = `
    <div class="popup">
      <button class="popup-close" aria-label="Close">&times;</button>
      <h3>🎓 Get a FREE Demo Class!</h3>
      <div class="sub">Book a FREE demo class with experienced tutors for home and online tution.</div>
      <a class="btn btn-primary" style="display:block;text-align:center" href="contact.html#enquiry">📩 Fill Enrollment Form</a>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector('.popup-close').onclick = () => ov.classList.remove('show');
  ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('show'); });
  setTimeout(() => { ov.classList.add('show'); sessionStorage.setItem('vht_popup_shown', '1'); }, 7000);
}

/* ============================================================
   Lightbox / Fullscreen Modal Image Viewer
   ============================================================ */
let vhtActiveLightboxGallery = [];
let vhtActiveLightboxIndex = 0;

function vhtOpenLightbox(src, caption = '', sub = '', gallery = [], index = 0) {
  let box = document.getElementById('vht-lightbox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'vht-lightbox';
    box.className = 'vht-lightbox';
    box.innerHTML = `
      <button class="vht-lightbox-close" aria-label="Close" title="Close (Esc)">&times;</button>
      <button class="vht-lightbox-nav vht-lightbox-prev" aria-label="Previous" title="Previous (Left Arrow)">&#10094;</button>
      <button class="vht-lightbox-nav vht-lightbox-next" aria-label="Next" title="Next (Right Arrow)">&#10095;</button>
      <div class="vht-lightbox-content">
        <div class="vht-lightbox-img-wrap">
          <img class="vht-lightbox-img" src="" alt="">
        </div>
        <div class="vht-lightbox-caption"></div>
        <div class="vht-lightbox-sub"></div>
      </div>
    `;
    document.body.appendChild(box);

    const closeBtn = box.querySelector('.vht-lightbox-close');
    const prevBtn = box.querySelector('.vht-lightbox-prev');
    const nextBtn = box.querySelector('.vht-lightbox-next');

    const close = () => {
      box.classList.remove('active');
      document.removeEventListener('keydown', handleKey);
    };

    closeBtn.onclick = close;
    box.onclick = e => {
      if (e.target === box || e.target.classList.contains('vht-lightbox-img-wrap')) close();
    };

    const updateGalleryView = (idx) => {
      if (!vhtActiveLightboxGallery.length) return;
      if (idx < 0) idx = vhtActiveLightboxGallery.length - 1;
      if (idx >= vhtActiveLightboxGallery.length) idx = 0;
      vhtActiveLightboxIndex = idx;
      const item = vhtActiveLightboxGallery[idx];
      const img = box.querySelector('.vht-lightbox-img');
      img.src = item.src;
      img.alt = item.caption || '';
      box.querySelector('.vht-lightbox-caption').textContent = item.caption || '';
      box.querySelector('.vht-lightbox-sub').textContent =
        (vhtActiveLightboxGallery.length > 1 ? `(${idx + 1} / ${vhtActiveLightboxGallery.length}) ` : '') + (item.sub || '');
    };

    prevBtn.onclick = (e) => { e.stopPropagation(); updateGalleryView(vhtActiveLightboxIndex - 1); };
    nextBtn.onclick = (e) => { e.stopPropagation(); updateGalleryView(vhtActiveLightboxIndex + 1); };

    function handleKey(e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') updateGalleryView(vhtActiveLightboxIndex - 1);
      else if (e.key === 'ArrowRight') updateGalleryView(vhtActiveLightboxIndex + 1);
    }

    box._handleKey = handleKey;
    box._updateGalleryView = updateGalleryView;
  }

  vhtActiveLightboxGallery = (gallery && gallery.length) ? gallery : [{ src, caption, sub }];
  vhtActiveLightboxIndex = index;

  const prevBtn = box.querySelector('.vht-lightbox-prev');
  const nextBtn = box.querySelector('.vht-lightbox-next');
  if (vhtActiveLightboxGallery.length > 1) {
    prevBtn.style.display = 'grid';
    nextBtn.style.display = 'grid';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  box._updateGalleryView(index);
  box.classList.add('active');
  document.addEventListener('keydown', box._handleKey);
}

function vhtOpenGalleryLightbox(idx) {
  const items = VHT.gallery.map(g => ({
    src: g.image,
    caption: g.title,
    sub: 'Anvigo Learning — Classes & Activities'
  }));
  vhtOpenLightbox(items[idx].src, items[idx].caption, items[idx].sub, items, idx);
}

function vhtOpenTeacherLightbox(id) {
  const items = VHT.teachers.map(x => ({
    src: x.photo,
    caption: `${x.name} — ${x.qualification}`,
    sub: `Subjects: ${x.subjects} · ${x.experience} exp · ${x.areas}`
  }));
  const idx = Math.max(0, VHT.teachers.findIndex(x => x.id === id));
  const t = VHT.teachers[idx] || {};
  vhtOpenLightbox(t.photo, `${t.name} — ${t.qualification}`, `Subjects: ${t.subjects}`, items, idx);
}

function vhtOpenTopperLightbox(id) {
  const items = VHT.toppers.map(x => ({
    src: x.photo,
    caption: `${x.name} (${x.year}) — ${x.marks}`,
    sub: `${x.school} · ${x.story}`
  }));
  const idx = Math.max(0, VHT.toppers.findIndex(x => x.id === id));
  const t = VHT.toppers[idx] || {};
  vhtOpenLightbox(t.photo, `${t.name} — ${t.marks}`, `${t.school}`, items, idx);
}

/* ---------- Render helpers ---------- */
function vhtTeacherCard(t) {
  return `<div class="card teacher-card">
    <div class="img-wrap" onclick="vhtOpenTeacherLightbox(${t.id})" title="Click to view full photo">
      <img src="${t.photo}" alt="${vhtEsc(t.name)} — ${vhtEsc(t.subjects)} tutor in ${vhtEsc(t.areas)}" loading="lazy">
      <span class="zoom-hint">🔍 View Photo</span>
    </div>
    <div class="body">
      <h3>${vhtEsc(t.name)}</h3>
      <div class="qual">${vhtEsc(t.qualification)}</div>
      <div class="meta">🎓 ${vhtEsc(t.experience)} experience · 📍 ${vhtEsc(t.areas)}</div>
      <div class="tags">
        ${t.subjects.split(',').map(s => `<span class="tag">${vhtEsc(s.trim())}</span>`).join('')}
        <span class="tag tag-blue">${vhtEsc(t.classes)}</span>
        ${t.demo === 'Yes' ? '<span class="badge-demo">FREE Demo ✓</span>' : ''}
      </div>
      <p style="font-size:0.82rem;color:var(--gray)">${vhtEsc(t.bio)}</p>
      <a class="btn btn-primary btn-sm" style="margin-top:12px" href="contact.html#enquiry">Book Demo Class</a>
    </div>
  </div>`;
}

function vhtTopperCard(t) {
  return `<div class="card topper-card">
    <div class="ribbon">TOPPER ${vhtEsc(t.year)}</div>
    <div class="img-wrap" onclick="vhtOpenTopperLightbox(${t.id})" title="Click to view full result & photo">
      <img src="${t.photo}" alt="${vhtEsc(t.name)} — ${vhtEsc(t.marks)}" loading="lazy">
      <span class="zoom-hint">🔍 View Result</span>
    </div>
    <div class="body">
      <h3>${vhtEsc(t.name)}</h3>
      <div class="marks">🏆 ${vhtEsc(t.marks)}</div>
      <div class="school">${vhtEsc(t.school)}</div>
      <p class="story">${vhtEsc(t.story)}</p>
    </div>
  </div>`;
}

function vhtTestimonialCard(t) {
  return `<div class="card testimonial-card">
    <div class="quote">“</div>
    <p class="text">${vhtEsc(t.text)}</p>
    <div class="stars">${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}</div>
    <div class="who" style="margin-top:10px"><b>${vhtEsc(t.name)}</b><span>${vhtEsc(t.relation)}</span></div>
  </div>`;
}

function vhtBlogCard(b) {
  const excerpt = b.content.split('\n')[0].slice(0, 120) + '...';
  return `<div class="card blog-card">
    <div class="thumb">📝</div>
    <div class="body">
      <div class="date">📅 ${vhtEsc(b.date)} · ${vhtEsc(b.author)}</div>
      <h3>${vhtEsc(b.title)}</h3>
      <p>${vhtEsc(excerpt)}</p>
      <a class="readmore" href="blog-post.html?id=${b.id}">Read More →</a>
    </div>
  </div>`;
}

function vhtCourseCard(c) {
  return `<div class="card course-card">
    <div class="icon">${c.icon}</div>
    <h3>${vhtEsc(c.title)}</h3>
    <p>${vhtEsc(c.desc)}</p>
    <div class="subs">📖 ${vhtEsc(c.subjects)}</div>
    <a class="btn btn-outline btn-sm" style="margin-top:14px" href="contact.html#enquiry">Enquire Now</a>
  </div>`;
}

/* ---------- Page renderers ---------- */
function vhtRenderPage() {
  const page = document.body.dataset.page;
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  if (page === 'home') {
    const banner = VHT.banners.find(b => b.active) || VHT.banners[0] || {};
    document.getElementById('hero-title').innerHTML = vhtEsc(banner.title || S.heroTitle);
    document.getElementById('hero-sub').textContent = banner.subtitle || S.heroSubtitle;
    set('home-teachers', VHT.teachers.slice(0, 3).map(vhtTeacherCard).join(''));
    set('home-toppers', VHT.toppers.slice(0, 4).map(vhtTopperCard).join(''));
    set('home-testimonials', VHT.testimonials.slice(0, 3).map(vhtTestimonialCard).join(''));
    set('home-courses', VHT.courses.slice(0, 4).map(vhtCourseCard).join(''));
    const zoneCards = `
      <div class="zone-grid">
        <a class="zone-card" href="teachers.html?area=North+India">
          <div class="zone-icon">📍</div>
          <div>
            <b>Home Tuition in North India</b>
            <small>Delhi NCR, Lucknow, Jaipur, Chandigarh, Punjab &amp; UP</small>
          </div>
        </a>
        <a class="zone-card" href="teachers.html?area=South+India">
          <div class="zone-icon">📍</div>
          <div>
            <b>Home Tuition in South India</b>
            <small>Bengaluru, Hyderabad, Chennai, Kochi &amp; nearby</small>
          </div>
        </a>
        <a class="zone-card" href="teachers.html?area=West+India">
          <div class="zone-icon">📍</div>
          <div>
            <b>Home Tuition in West India</b>
            <small>Mumbai, Pune, Ahmedabad, Gujarat &amp; Maharashtra</small>
          </div>
        </a>
        <a class="zone-card" href="teachers.html?area=East+India">
          <div class="zone-icon">📍</div>
          <div>
            <b>Home Tuition in East India</b>
            <small>Kolkata, Patna, Ranchi, Bihar &amp; West Bengal</small>
          </div>
        </a>
        <a class="zone-card zone-card-highlight" href="teachers.html?area=Online+(Pan+India)">
          <div class="zone-icon">🌐</div>
          <div>
            <b>Available in PAN India (Home & Online Tution)</b>
            <small>1-on-1 Live Interactive Classes across all States &amp; Cities</small>
          </div>
        </a>
      </div>`;
    set('home-areas', zoneCards);
    const box = document.getElementById('home-enquiry-form');
    if (box) box.innerHTML = vhtEnquiryFormHTML();

    document.querySelectorAll('.hero-img img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.title = 'Click to enlarge';
      img.addEventListener('click', () => {
        vhtOpenLightbox(img.src, S.siteName, S.heroSubtitle || S.tagline);
      });
    });
  }

  if (page === 'about') {
    set('about-text', vhtEsc(S.about).replace(/\n/g, '<br>'));
    set('about-gallery', VHT.gallery.map((g, idx) =>
      `<div class="gallery-item" onclick="vhtOpenGalleryLightbox(${idx})" title="Click to enlarge — ${vhtEsc(g.title)}">
        <img src="${g.image}" alt="${vhtEsc(g.title)}" loading="lazy">
        <div class="zoom-indicator">🔍</div>
        <div class="caption">${vhtEsc(g.title)}</div>
      </div>`).join(''));
  }

  if (page === 'teachers') {
    const params = new URLSearchParams(location.search);
    const subjects = [...new Set(VHT.teachers.flatMap(t => t.subjects.split(',').map(s => s.trim())))].sort();
    set('subject-filter', '<option value="">All Subjects</option>' + subjects.map(s => `<option>${vhtEsc(s)}</option>`).join(''));
    
    const filterOptions = [
      '<option value="">All Areas & Zones</option>',
      '<optgroup label="Regions / Zones">',
      '<option value="North India">📍 North India</option>',
      '<option value="South India">📍 South India</option>',
      '<option value="West India">📍 West India</option>',
      '<option value="East India">📍 East India</option>',
      '<option value="Online">🌐 Online (PAN India)</option>',
      '</optgroup>',
      '<optgroup label="Key Cities">',
      ...VHT.areas.map(a => `<option value="${vhtEsc(a)}">${vhtEsc(a)}</option>`),
      '</optgroup>'
    ].join('');
    set('area-filter', filterOptions);

    const zoneCityMap = {
      'north india': ['delhi', 'ncr', 'chandigarh', 'jaipur', 'lucknow', 'bhopal', 'punjab', 'haryana', 'uttar pradesh', 'north'],
      'south india': ['bengaluru', 'bangalore', 'chennai', 'hyderabad', 'kochi', 'kerala', 'karnataka', 'tamil nadu', 'telangana', 'south'],
      'west india': ['mumbai', 'pune', 'ahmedabad', 'gujarat', 'maharashtra', 'goa', 'west'],
      'east india': ['kolkata', 'patna', 'ranchi', 'bhubaneswar', 'bihar', 'west bengal', 'odisha', 'east'],
      'online': ['online', 'pan india']
    };

    const areaParam = params.get('area');
    if (areaParam) {
      const matchedOpt = Array.from(document.getElementById('area-filter').options).find(o => o.value.toLowerCase() === areaParam.toLowerCase() || areaParam.toLowerCase().includes(o.value.toLowerCase()));
      if (matchedOpt) document.getElementById('area-filter').value = matchedOpt.value;
    }

    const render = () => {
      const sub = document.getElementById('subject-filter').value.toLowerCase();
      const area = document.getElementById('area-filter').value.toLowerCase();
      const q = document.getElementById('teacher-search').value.toLowerCase();
      const list = VHT.teachers.filter(t => {
        const tSub = (t.subjects || '').toLowerCase();
        const tArea = (t.areas || '').toLowerCase();
        const tFull = (t.name + ' ' + t.subjects + ' ' + t.qualification + ' ' + t.classes + ' ' + t.areas).toLowerCase();

        const matchSub = !sub || tSub.includes(sub);
        let matchArea = !area || tArea.includes(area);
        if (!matchArea && zoneCityMap[area]) {
          matchArea = zoneCityMap[area].some(city => tArea.includes(city));
        }

        const matchQ = !q || tFull.includes(q);
        return matchSub && matchArea && matchQ;
      });
      set('teachers-grid', list.length ? list.map(vhtTeacherCard).join('') : '<div class="empty-note">No teachers found for this filter. Try changing subject or area.</div>');
    };
    const sf = document.getElementById('subject-filter');
    const af = document.getElementById('area-filter');
    const ts = document.getElementById('teacher-search');
    if (sf) sf.onchange = render;
    if (af) af.onchange = render;
    if (ts) ts.oninput = render;
    render();
  }

  if (page === 'courses') set('courses-grid', VHT.courses.map(vhtCourseCard).join(''));
  if (page === 'results') set('toppers-grid', VHT.toppers.map(vhtTopperCard).join(''));
  if (page === 'testimonials') set('testimonials-grid', VHT.testimonials.map(vhtTestimonialCard).join(''));
  if (page === 'blog') set('blog-grid', VHT.blogs.map(vhtBlogCard).join(''));

  if (page === 'blog-post') {
    const id = Number(new URLSearchParams(location.search).get('id'));
    const post = VHT.blogs.find(b => b.id === id) || VHT.blogs[0];
    if (post) {
      document.title = post.title + ' | ' + S.siteName;
      set('post-title', vhtEsc(post.title));
      set('post-meta', `📅 ${vhtEsc(post.date)} · ✍️ ${vhtEsc(post.author)}`);
      set('post-content', post.content.split('\n\n').map(p => `<p>${vhtEsc(p)}</p>`).join(''));
    }
  }

  if (page === 'contact') {
    set('contact-phone', `<a href="tel:${vhtEsc(S.phone.replace(/\s/g, ''))}">${vhtEsc(S.phone)}</a>`);
    set('contact-email', `<a href="mailto:${vhtEsc(S.email)}">${vhtEsc(S.email)}</a>`);
    set('contact-address', vhtEsc(S.address));
    set('contact-hours', vhtEsc(S.hours));
    const wa = document.getElementById('contact-wa');
    if (wa) wa.href = `https://wa.me/${S.whatsapp}`;
    const map = document.getElementById('contact-map-link');
    if (map) map.href = S.mapLink;
    const box = document.getElementById('contact-enquiry-form');
    if (box) box.innerHTML = vhtEnquiryFormHTML();
    const teacherBox = document.getElementById('contact-teacher-form');
    if (teacherBox) teacherBox.innerHTML = vhtTeacherApplicationFormHTML();
    const schoolBox = document.getElementById('contact-school-form');
    if (schoolBox) schoolBox.innerHTML = vhtSchoolApplicationFormHTML();

    const tabs = document.querySelectorAll('.apply-tab');
    const panels = { student: document.getElementById('panel-student'), teacher: document.getElementById('panel-teacher'), school: document.getElementById('panel-school') };
    const tabFromHash = () => location.hash === '#apply-teacher' ? 'teacher' : location.hash === '#apply-school' ? 'school' : 'student';
    const setTab = (which) => {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === which));
      Object.entries(panels).forEach(([k, el]) => { if (el) el.classList.toggle('active', k === which); });
    };
    tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
    setTab(tabFromHash());
    window.addEventListener('hashchange', () => setTab(tabFromHash()));
  }

  vhtBindEnquiryForms();
}

/**
 * Asynchronously sync latest site content (Teachers, Toppers, etc.) from Supabase Cloud
 * and re-render the page if cloud content has new updates.
 */
async function vhtInitPublicCloudSync() {
  if (typeof vhtSupabaseFetchSiteContent !== 'function' || typeof vhtIsSupabaseConfigured !== 'function') return;
  if (!vhtIsSupabaseConfigured()) return;

  try {
    const cloudSite = await vhtSupabaseFetchSiteContent();
    if (cloudSite && typeof cloudSite === 'object') {
      const updated = vhtMergeCloudData(cloudSite);
      VHT = updated;
      S = VHT.settings;
      vhtRenderChrome();
      vhtRenderPage();
    }
  } catch (err) {
    console.warn('Public cloud sync notice:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  vhtRenderChrome();
  vhtRenderPage();
  vhtInitPublicCloudSync();
});
