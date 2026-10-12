/* ============================================================
   Anvigo Learning — Admin Panel Logic
   ============================================================ */

/* Auth guard (fallback only — dashboard.html already gates page visibility;
   this just protects against admin.js running standalone) */
if (!sessionStorage.getItem(VHT_ADMIN_KEY)) location.href = 'index.html';

let DATA = vhtLoad();

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
function save() {
  vhtSave(DATA);
  if (typeof vhtSupabaseSaveSiteContent === 'function' && typeof vhtIsSupabaseConfigured === 'function' && vhtIsSupabaseConfigured()) {
    vhtSupabaseSaveSiteContent(DATA).then(ok => {
      if (ok) {
        toast('☁️ Changes live on website!');
      } else {
        console.warn('Supabase site content sync returned false');
      }
    }).catch(err => console.warn('Supabase site content sync error:', err));
  }
}
function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/**
 * Intelligent Image Processor:
 * 1. Uploads to Supabase Storage 'site-uploads' bucket if cloud is configured (gives permanent CDN URL).
 * 2. If offline or upload fails, optimizes client-side using HTML5 Canvas (max 1200x1200px, 85% quality JPEG)
 *    to preserve crystal-clear aspect ratio while preventing any localStorage quota errors!
 */
async function vhtProcessImageUpload(file) {
  if (!file) return '';

  // 1. Try Supabase Storage if configured
  if (typeof vhtIsSupabaseConfigured === 'function' && vhtIsSupabaseConfigured() && typeof vhtSupabaseUploadFile === 'function') {
    try {
      const publicUrl = await vhtSupabaseUploadFile('site-uploads', file, 'website-photos');
      if (publicUrl) return publicUrl;
    } catch (err) {
      console.warn('Supabase storage upload notice, falling back to local canvas optimization:', err);
    }
  }

  // 2. High-quality Canvas downscale & compression fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/* Lightbox modal for Admin Panel */
function vhtOpenLightbox(src, caption = '', sub = '') {
  let box = document.getElementById('vht-lightbox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'vht-lightbox';
    box.className = 'vht-lightbox';
    box.innerHTML = `
      <button class="vht-lightbox-close" aria-label="Close" title="Close (Esc)">&times;</button>
      <div class="vht-lightbox-content">
        <div class="vht-lightbox-img-wrap">
          <img class="vht-lightbox-img" src="" alt="">
        </div>
        <div class="vht-lightbox-caption"></div>
        <div class="vht-lightbox-sub"></div>
      </div>
    `;
    document.body.appendChild(box);

    const close = () => {
      box.classList.remove('active');
      document.removeEventListener('keydown', handleKey);
    };

    box.querySelector('.vht-lightbox-close').onclick = close;
    box.onclick = e => {
      if (e.target === box || e.target.classList.contains('vht-lightbox-img-wrap')) close();
    };

    function handleKey(e) {
      if (e.key === 'Escape') close();
    }
    box._handleKey = handleKey;
  }

  const img = box.querySelector('.vht-lightbox-img');
  img.src = src;
  img.alt = caption || 'Photo Preview';
  box.querySelector('.vht-lightbox-caption').textContent = caption || '';
  box.querySelector('.vht-lightbox-sub').textContent = sub || 'Full view';
  box.classList.add('active');
  document.addEventListener('keydown', box._handleKey);
}

/* ---------- Navigation between views ---------- */
const VIEW_TITLES = {
  dashboard: 'Dashboard', enquiries: 'Enquiry Management', teacherApps: 'Teacher Applications', schoolApps: 'School Requests',
  teachers: 'Teacher Management', toppers: 'Toppers Management', testimonials: 'Testimonial Management',
  blogs: 'Blog Management', gallery: 'Gallery Management', banners: 'Banner Management', settings: 'Website Settings'
};

function showView(view) {
  document.querySelectorAll('.section-view').forEach(v => v.classList.remove('active'));
  $('view-' + view).classList.add('active');
  document.querySelectorAll('#admin-nav a').forEach(a => a.classList.toggle('active', a.dataset.view === view));
  $('view-title').textContent = VIEW_TITLES[view];
  $('sidebar').classList.remove('open');

  const actions = $('view-actions');
  actions.innerHTML = '';
  const addBtns = {
    teachers: ['➕ Add Teacher', () => openTeacherForm()],
    toppers: ['➕ Add Topper', () => openTopperForm()],
    testimonials: ['➕ Add Testimonial', () => openTestimonialForm()],
    blogs: ['➕ Add Article', () => openBlogForm()],
    gallery: ['➕ Add Image', () => openGalleryForm()],
    banners: ['➕ Add Banner', () => openBannerForm()]
  };
  if (addBtns[view]) {
    const b = document.createElement('button');
    b.className = 'btn btn-primary';
    b.textContent = addBtns[view][0];
    b.onclick = addBtns[view][1];
    actions.appendChild(b);
  }
  if (view === 'enquiries') {
    const b1 = document.createElement('button');
    b1.className = 'btn btn-green';
    b1.textContent = '⬇️ Export Excel (.xlsx)';
    b1.onclick = exportStudentsXLSX;
    actions.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'btn btn-light btn-sm';
    b2.textContent = '📄 CSV';
    b2.onclick = exportEnquiries;
    actions.appendChild(b2);
  }
  if (view === 'teacherApps') {
    const b1 = document.createElement('button');
    b1.className = 'btn btn-green';
    b1.textContent = '⬇️ Export Excel (.xlsx)';
    b1.onclick = exportTeachersXLSX;
    actions.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'btn btn-light btn-sm';
    b2.textContent = '📄 CSV';
    b2.onclick = exportTeacherApps;
    actions.appendChild(b2);
  }
  if (view === 'schoolApps') {
    const b1 = document.createElement('button');
    b1.className = 'btn btn-green';
    b1.textContent = '⬇️ Export Excel (.xlsx)';
    b1.onclick = exportSchoolsXLSX;
    actions.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'btn btn-light btn-sm';
    b2.textContent = '📄 CSV';
    b2.onclick = exportSchoolApps;
    actions.appendChild(b2);
  }
  renderAll();
}

function vhtCloseAdminSidebar() {
  const sb = $('sidebar');
  const bd = $('sidebar-backdrop');
  if (sb) sb.classList.remove('open');
  if (bd) bd.classList.remove('show');
}

document.querySelectorAll('#admin-nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    showView(a.dataset.view);
    vhtCloseAdminSidebar();
  });
});
$('logout-btn').addEventListener('click', e => {
  e.preventDefault();
  if (typeof vhtSupabaseLogout === 'function') {
    vhtSupabaseLogout();
  } else {
    sessionStorage.removeItem(VHT_ADMIN_KEY);
    location.href = 'index.html';
  }
});

/* ---------- Modal ---------- */
function openModal(title, formHTML, onSubmit) {
  $('modal-title').textContent = title;
  const form = $('modal-form');
  form.innerHTML = formHTML + `
    <div class="modal-actions">
      <button type="button" class="btn btn-light" id="modal-cancel">Cancel</button>
      <button type="submit" class="btn btn-primary">💾 Save</button>
    </div>`;
  $('modal-overlay').classList.add('show');
  $('modal-cancel').onclick = closeModal;
  form.onsubmit = async e => {
    e.preventDefault();
    await onSubmit(new FormData(form), form);
  };
  // live photo preview & optimization
  const imgPrev = form.querySelector('.photo-preview');
  if (imgPrev) {
    imgPrev.title = 'Click to enlarge';
    imgPrev.onclick = () => vhtOpenLightbox(imgPrev.src, 'Current Photo Preview');
  }
  const fileInput = form.querySelector('input[type=file]');
  if (fileInput) fileInput.addEventListener('change', async () => {
    if (fileInput.files[0]) {
      toast('Optimizing photo...');
      const url = await vhtProcessImageUpload(fileInput.files[0]);
      let img = form.querySelector('.photo-preview');
      if (img) {
        img.src = url;
        img.title = 'Click to enlarge';
        img.onclick = () => vhtOpenLightbox(url, 'Uploaded Photo Preview');
      }
      form._processedPhotoUrl = url;
      toast('✅ Photo ready!');
    }
  });
}
function closeModal() { $('modal-overlay').classList.remove('show'); }
$('modal-close').onclick = closeModal;
$('modal-overlay').addEventListener('click', e => { if (e.target === $('modal-overlay')) closeModal(); });

/* ---------- Dashboard ---------- */
function renderDashboard() {
  const enqs = vhtEnquiries();
  const apps = vhtTeacherApplications();
  const schoolApps = vhtSchoolApplications();
  const now = new Date();

  const thisMonth = enqs.filter(e => {
    let d = null;
    if (e.date) {
      const parsed = Date.parse(e.date);
      if (!isNaN(parsed)) d = new Date(parsed);
    }
    if (!d && typeof e.id === 'number' && e.id > 100000000000) {
      d = new Date(e.id);
    }
    if (!d) d = now;
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  $('stats-grid').innerHTML = `
    <div class="stat-card"><div class="ic ic-orange">👩‍🏫</div><div><b>${DATA.teachers.length}</b><span>Total Teachers</span></div></div>
    <div class="stat-card" style="cursor:pointer" onclick="showView('enquiries')"><div class="ic ic-blue">📩</div><div><b>${enqs.length}</b><span>Student Enrollments</span></div></div>
    <div class="stat-card"><div class="ic ic-green">📈</div><div><b>${thisMonth}</b><span>This Month's Leads</span></div></div>
    <div class="stat-card"><div class="ic ic-purple">🏆</div><div><b>${DATA.toppers.length}</b><span>Toppers Showcased</span></div></div>
    <div class="stat-card" style="cursor:pointer" onclick="showView('teacherApps')"><div class="ic ic-orange">🧑‍💼</div><div><b>${apps.length}</b><span>Teacher Applications</span></div></div>
    <div class="stat-card" style="cursor:pointer" onclick="showView('schoolApps')"><div class="ic ic-blue">🏫</div><div><b>${schoolApps.length}</b><span>School Requests</span></div></div>`;

  $('recent-enquiries').innerHTML = enquiryTable(enqs.slice(0, 10), false) +
    (enqs.length > 10 ? `<div style="text-align:center;padding:10px"><button class="btn btn-sm btn-outline" onclick="showView('enquiries')">View All ${enqs.length} Student Enrollments →</button></div>` : '');

  $('recent-teacher-apps').innerHTML = teacherAppTable(apps.slice(0, 10), false) +
    (apps.length > 10 ? `<div style="text-align:center;padding:10px"><button class="btn btn-sm btn-outline" onclick="showView('teacherApps')">View All ${apps.length} Teacher Applications →</button></div>` : '');

  $('recent-school-apps').innerHTML = schoolAppTable(schoolApps.slice(0, 10), false) +
    (schoolApps.length > 10 ? `<div style="text-align:center;padding:10px"><button class="btn btn-sm btn-outline" onclick="showView('schoolApps')">View All ${schoolApps.length} School Requests →</button></div>` : '');

  const count = (key) => {
    const m = {};
    enqs.forEach(e => { const v = (e[key] || '').trim(); if (v) m[v] = (m[v] || 0) + 1; });
    const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : '—';
  };
  $('popular-stats').innerHTML = `
    <div><b style="color:var(--primary)">📖 Most Requested Subjects</b><div>${vhtEsc(count('subjects'))}</div></div>
    <div><b style="color:var(--primary)">🎓 Most Requested Class</b><div>${vhtEsc(count('studentClass'))}</div></div>
    <div><b style="color:var(--primary)">📍 Top City</b><div>${vhtEsc(count('city'))}</div></div>`;
}

/* ---------- Student Enrollments ---------- */
function enquiryTable(list, withActions) {
  if (!list.length) return '<div class="empty-note">Abhi tak koi student enrollment nahi aayi hai. Website ke enrollment form se yaha list dikhegi.</div>';
  return `<table><thead><tr>
      <th>Date</th><th>Name</th><th>Class</th><th>Mobile</th><th>Email</th><th>State</th><th>City</th><th>Address</th><th>Pin Code</th><th>Subjects</th><th>Budget</th><th>Status</th>${withActions ? '<th>Actions</th>' : ''}
    </tr></thead><tbody>${list.map(e => `
      <tr>
        <td style="white-space:nowrap">${vhtEsc(e.date)}</td>
        <td><b>${vhtEsc(e.name)}</b></td>
        <td>${vhtEsc(e.studentClass)}</td>
        <td><a href="tel:${vhtEsc(e.mobile)}" style="color:var(--primary)">${vhtEsc(e.mobile)}</a></td>
        <td>${vhtEsc(e.email)}</td><td>${vhtEsc(e.state)}</td><td>${vhtEsc(e.city)}</td>
        <td style="max-width:180px">${vhtEsc(e.address)}</td><td>${vhtEsc(e.pincode)}</td>
        <td>${vhtEsc(e.subjects)}</td><td>${vhtEsc(e.budget)}</td>
        <td><span class="status-pill status-${(e.status || 'New').toLowerCase()}">${vhtEsc(e.status || 'New')}</span></td>
        ${withActions ? `<td style="white-space:nowrap">
          <button class="btn btn-sm btn-green" onclick="cycleEnquiryStatus('${e.id}')">↻ Status</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEnquiry('${e.id}')">🗑️</button>
        </td>` : ''}
      </tr>`).join('')}</tbody></table>`;
}

function renderEnquiries() { $('enquiries-table').innerHTML = enquiryTable(vhtEnquiries(), true); }

function cycleEnquiryStatus(id) {
  const list = vhtEnquiries();
  const targetId = String(id);
  const e = list.find(x => String(x.id) === targetId);
  if (!e) return;
  const order = ['New', 'Contacted', 'Closed'];
  e.status = order[(order.indexOf(e.status || 'New') + 1) % order.length];
  vhtSaveEnquiries(list);
  if (typeof vhtSupabaseUpdateStudentStatus === 'function') {
    vhtSupabaseUpdateStudentStatus(id, e.status);
  }
  renderAll();
  toast('Status updated → ' + e.status);
}

function deleteEnquiry(id) {
  if (!confirm('Is enrollment ko delete karna hai?')) return;
  const targetId = String(id);
  vhtSaveEnquiries(vhtEnquiries().filter(x => String(x.id) !== targetId));
  if (typeof vhtSupabaseDeleteStudent === 'function') {
    vhtSupabaseDeleteStudent(id);
  }
  renderAll();
  toast('Enrollment deleted');
}

/* Helper to format column widths in SheetJS */
function vhtSetWorksheetColWidths(ws, rowsWithHeader) {
  if (!ws || !rowsWithHeader || !rowsWithHeader.length) return;
  const colWidths = rowsWithHeader[0].map((_, colIdx) => {
    let maxLen = 14;
    rowsWithHeader.forEach(row => {
      const val = row[colIdx] != null ? String(row[colIdx]) : '';
      if (val.length > maxLen) maxLen = Math.min(val.length + 3, 40);
    });
    return { wch: maxLen };
  });
  ws['!cols'] = colWidths;
}

function exportStudentsXLSX() {
  const list = vhtEnquiries();
  if (!list.length) { toast('Koi student enrollment nahi hai export karne ke liye'); return; }
  const head = ['Date', 'Student / Parent Name', 'Class of Student', 'Mobile Number', 'Email', 'State', 'City', 'Complete Address', 'Pin Code', 'Subjects Needed', 'Budget', 'Status'];
  const rows = list.map(e => [e.date || '', e.name || '', e.studentClass || '', e.mobile || '', e.email || '', e.state || '', e.city || '', e.address || '', e.pincode || '', e.subjects || '', e.budget || '', e.status || 'New']);
  const data = [head, ...rows];

  if (typeof XLSX !== 'undefined') {
    const ws = XLSX.utils.aoa_to_sheet(data);
    vhtSetWorksheetColWidths(ws, data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Enrollments");
    const filename = 'student-enrollments-' + new Date().toISOString().slice(0, 10) + '.xlsx';
    XLSX.writeFile(wb, filename);
    toast('✅ Student Enrollments Excel (.xlsx) downloaded!');
  } else {
    exportEnquiries();
  }
}

function exportEnquiries() {
  const list = vhtEnquiries();
  if (!list.length) { toast('Koi student enrollment nahi hai export karne ke liye'); return; }
  const head = ['Date', 'Name', 'Class of Student', 'Mobile', 'Email', 'State', 'City', 'Address', 'Pin Code', 'Subjects', 'Budget', 'Status'];
  const rows = list.map(e => [e.date, e.name, e.studentClass, e.mobile, e.email, e.state, e.city, e.address, e.pincode, e.subjects, e.budget, e.status || 'New']);
  const csv = [head, ...rows].map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'student-enrollments-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  toast('CSV file downloaded — Excel me open karein');
}

/* ---------- Teacher Applications (job applications from the public form) ---------- */
function teacherAppTable(list, withActions) {
  if (!list.length) return '<div class="empty-note">Abhi tak koi teacher application nahi aayi hai. Website ke "Apply as Teacher" form se yaha list dikhegi.</div>';
  return `<table><thead><tr>
      <th>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Qualification</th><th>State</th><th>City</th><th>Address</th><th>Pin Code</th><th>Subjects</th><th>Status</th>${withActions ? '<th>Actions</th>' : ''}
    </tr></thead><tbody>${list.map(a => `
      <tr>
        <td style="white-space:nowrap">${vhtEsc(a.date)}</td>
        <td><b>${vhtEsc(a.name)}</b></td>
        <td><a href="tel:${vhtEsc(a.mobile)}" style="color:var(--primary)">${vhtEsc(a.mobile)}</a></td>
        <td>${vhtEsc(a.email)}</td>
        <td>${vhtEsc(a.qualification)}</td><td>${vhtEsc(a.state)}</td><td>${vhtEsc(a.city)}</td>
        <td style="max-width:180px">${vhtEsc(a.address)}</td><td>${vhtEsc(a.pincode)}</td>
        <td>${vhtEsc(a.subjects)}</td>
        <td><span class="status-pill status-${(a.status || 'New').toLowerCase()}">${vhtEsc(a.status || 'New')}</span></td>
        ${withActions ? `<td style="white-space:nowrap">
          <button class="btn btn-sm btn-green" onclick="cycleTeacherAppStatus('${a.id}')">↻ Status</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacherApp('${a.id}')">🗑️</button>
        </td>` : ''}
      </tr>`).join('')}</tbody></table>`;
}

function renderTeacherApps() { $('teacher-apps-table').innerHTML = teacherAppTable(vhtTeacherApplications(), true); }

function cycleTeacherAppStatus(id) {
  const list = vhtTeacherApplications();
  const targetId = String(id);
  const a = list.find(x => String(x.id) === targetId);
  if (!a) return;
  const order = ['New', 'Contacted', 'Closed'];
  a.status = order[(order.indexOf(a.status || 'New') + 1) % order.length];
  vhtSaveTeacherApplications(list);
  if (typeof vhtSupabaseUpdateTeacherStatus === 'function') {
    vhtSupabaseUpdateTeacherStatus(id, a.status);
  }
  renderAll();
  toast('Status updated → ' + a.status);
}

function deleteTeacherApp(id) {
  if (!confirm('Is application ko delete karna hai?')) return;
  const targetId = String(id);
  vhtSaveTeacherApplications(vhtTeacherApplications().filter(x => String(x.id) !== targetId));
  if (typeof vhtSupabaseDeleteTeacher === 'function') {
    vhtSupabaseDeleteTeacher(id);
  }
  renderAll();
  toast('Application deleted');
}

function exportTeachersXLSX() {
  const list = vhtTeacherApplications();
  if (!list.length) { toast('Koi teacher application nahi hai export karne ke liye'); return; }
  const head = ['Date', 'Teacher Name', 'Phone Number', 'Email', 'Highest Qualification', 'State', 'City', 'Complete Address', 'Pin Code', 'Subjects You Teach', 'Resume URL', 'Status'];
  const rows = list.map(a => [a.date || '', a.name || '', a.mobile || '', a.email || '', a.qualification || '', a.state || '', a.city || '', a.address || '', a.pincode || '', a.subjects || '', a.resume_url || a.resumeUrl || '', a.status || 'New']);
  const data = [head, ...rows];

  if (typeof XLSX !== 'undefined') {
    const ws = XLSX.utils.aoa_to_sheet(data);
    vhtSetWorksheetColWidths(ws, data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teacher Applications");
    const filename = 'teacher-applications-' + new Date().toISOString().slice(0, 10) + '.xlsx';
    XLSX.writeFile(wb, filename);
    toast('✅ Teacher Applications Excel (.xlsx) downloaded!');
  } else {
    exportTeacherApps();
  }
}

function exportTeacherApps() {
  const list = vhtTeacherApplications();
  if (!list.length) { toast('Koi teacher application nahi hai export karne ke liye'); return; }
  const head = ['Date', 'Name', 'Phone No.', 'Email', 'Highest Qualification', 'State', 'City', 'Address', 'Pin Code', 'Subjects', 'Status'];
  const rows = list.map(a => [a.date, a.name, a.mobile, a.email, a.qualification, a.state, a.city, a.address, a.pincode, a.subjects, a.status || 'New']);
  const csv = [head, ...rows].map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'teacher-applications-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  toast('CSV file downloaded — Excel me open karein');
}

/* ---------- School Requests (schools that want to hire teachers) ---------- */
function schoolAppTable(list, withActions) {
  if (!list.length) return '<div class="empty-note">Abhi tak koi school request nahi aayi hai. Website ke "Schools — Hire Teachers" form se yaha list dikhegi.</div>';
  return `<table><thead><tr>
      <th>Date</th><th>School Name</th><th>Contact</th><th>Email</th><th>State</th><th>City</th><th>Address</th><th>Pin Code</th><th>Subject Needed</th><th>Budget</th><th>Status</th>${withActions ? '<th>Actions</th>' : ''}
    </tr></thead><tbody>${list.map(a => `
      <tr>
        <td style="white-space:nowrap">${vhtEsc(a.date)}</td>
        <td><b>${vhtEsc(a.schoolName)}</b></td>
        <td><a href="tel:${vhtEsc(a.contact)}" style="color:var(--primary)">${vhtEsc(a.contact)}</a></td>
        <td>${vhtEsc(a.email)}</td><td>${vhtEsc(a.state)}</td><td>${vhtEsc(a.city)}</td>
        <td style="max-width:180px">${vhtEsc(a.address)}</td><td>${vhtEsc(a.pincode)}</td>
        <td>${vhtEsc(a.subject)}</td><td>${vhtEsc(a.budget)}</td>
        <td><span class="status-pill status-${(a.status || 'New').toLowerCase()}">${vhtEsc(a.status || 'New')}</span></td>
        ${withActions ? `<td style="white-space:nowrap">
          <button class="btn btn-sm btn-green" onclick="cycleSchoolAppStatus('${a.id}')">↻ Status</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSchoolApp('${a.id}')">🗑️</button>
        </td>` : ''}
      </tr>`).join('')}</tbody></table>`;
}

function renderSchoolApps() { $('school-apps-table').innerHTML = schoolAppTable(vhtSchoolApplications(), true); }

function cycleSchoolAppStatus(id) {
  const list = vhtSchoolApplications();
  const targetId = String(id);
  const a = list.find(x => String(x.id) === targetId);
  if (!a) return;
  const order = ['New', 'Contacted', 'Closed'];
  a.status = order[(order.indexOf(a.status || 'New') + 1) % order.length];
  vhtSaveSchoolApplications(list);
  if (typeof vhtSupabaseUpdateSchoolStatus === 'function') {
    vhtSupabaseUpdateSchoolStatus(id, a.status);
  }
  renderAll();
  toast('Status updated → ' + a.status);
}

function deleteSchoolApp(id) {
  if (!confirm('Is request ko delete karna hai?')) return;
  const targetId = String(id);
  vhtSaveSchoolApplications(vhtSchoolApplications().filter(x => String(x.id) !== targetId));
  if (typeof vhtSupabaseDeleteSchool === 'function') {
    vhtSupabaseDeleteSchool(id);
  }
  renderAll();
  toast('Request deleted');
}

function exportSchoolsXLSX() {
  const list = vhtSchoolApplications();
  if (!list.length) { toast('Koi school request nahi hai export karne ke liye'); return; }
  const head = ['Date', 'School Name', 'Contact Number', 'Email', 'State', 'City', 'Complete Address', 'Pin Code', 'Subject Teacher Needed', 'Budget', 'Status'];
  const rows = list.map(a => [a.date || '', a.schoolName || '', a.contact || '', a.email || '', a.state || '', a.city || '', a.address || '', a.pincode || '', a.subject || '', a.budget || '', a.status || 'New']);
  const data = [head, ...rows];

  if (typeof XLSX !== 'undefined') {
    const ws = XLSX.utils.aoa_to_sheet(data);
    vhtSetWorksheetColWidths(ws, data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "School Requests");
    const filename = 'school-requests-' + new Date().toISOString().slice(0, 10) + '.xlsx';
    XLSX.writeFile(wb, filename);
    toast('✅ School Requests Excel (.xlsx) downloaded!');
  } else {
    exportSchoolApps();
  }
}

function exportSchoolApps() {
  const list = vhtSchoolApplications();
  if (!list.length) { toast('Koi school request nahi hai export karne ke liye'); return; }
  const head = ['Date', 'School Name', 'Contact No.', 'Email', 'State', 'City', 'Address', 'Pin Code', 'Subject Needed', 'Budget', 'Status'];
  const rows = list.map(a => [a.date, a.schoolName, a.contact, a.email, a.state, a.city, a.address, a.pincode, a.subject, a.budget, a.status || 'New']);
  const csv = [head, ...rows].map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'school-requests-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  toast('CSV file downloaded — Excel me open karein');
}

/* ---------- MASTER EXCEL WORKBOOK (All 3 Types in 1 File with 3 Tabs) ---------- */
function exportMasterWorkbookXLSX() {
  const students = vhtEnquiries();
  const teachers = vhtTeacherApplications();
  const schools = vhtSchoolApplications();

  if (!students.length && !teachers.length && !schools.length) {
    toast('Koi data nahi hai export karne ke liye.');
    return;
  }

  if (typeof XLSX !== 'undefined') {
    const wb = XLSX.utils.book_new();

    // Tab 1: Student Enrollments
    const head1 = ['Date', 'Student / Parent Name', 'Class of Student', 'Mobile Number', 'Email', 'State', 'City', 'Complete Address', 'Pin Code', 'Subjects Needed', 'Budget', 'Status'];
    const rows1 = students.map(e => [e.date || '', e.name || '', e.studentClass || '', e.mobile || '', e.email || '', e.state || '', e.city || '', e.address || '', e.pincode || '', e.subjects || '', e.budget || '', e.status || 'New']);
    const data1 = [head1, ...rows1];
    const ws1 = XLSX.utils.aoa_to_sheet(data1);
    vhtSetWorksheetColWidths(ws1, data1);
    XLSX.utils.book_append_sheet(wb, ws1, "Student Enrollments");

    // Tab 2: Teacher Applications
    const head2 = ['Date', 'Teacher Name', 'Phone Number', 'Email', 'Highest Qualification', 'State', 'City', 'Complete Address', 'Pin Code', 'Subjects You Teach', 'Resume URL', 'Status'];
    const rows2 = teachers.map(a => [a.date || '', a.name || '', a.mobile || '', a.email || '', a.qualification || '', a.state || '', a.city || '', a.address || '', a.pincode || '', a.subjects || '', a.resume_url || a.resumeUrl || '', a.status || 'New']);
    const data2 = [head2, ...rows2];
    const ws2 = XLSX.utils.aoa_to_sheet(data2);
    vhtSetWorksheetColWidths(ws2, data2);
    XLSX.utils.book_append_sheet(wb, ws2, "Teacher Applications");

    // Tab 3: School Requests
    const head3 = ['Date', 'School Name', 'Contact Number', 'Email', 'State', 'City', 'Complete Address', 'Pin Code', 'Subject Teacher Needed', 'Budget', 'Status'];
    const rows3 = schools.map(a => [a.date || '', a.schoolName || '', a.contact || '', a.email || '', a.state || '', a.city || '', a.address || '', a.pincode || '', a.subject || '', a.budget || '', a.status || 'New']);
    const data3 = [head3, ...rows3];
    const ws3 = XLSX.utils.aoa_to_sheet(data3);
    vhtSetWorksheetColWidths(ws3, data3);
    XLSX.utils.book_append_sheet(wb, ws3, "School Requests");

    const filename = 'anvigo-learning-all-enrollments-' + new Date().toISOString().slice(0, 10) + '.xlsx';
    XLSX.writeFile(wb, filename);
    toast('✅ Master Excel file downloaded with 3 separate tabs!');
  } else {
    toast('SheetJS library load ho raha hai... CSV downloads use karein');
  }
}

/* ---------- Teachers CRUD ---------- */
function renderTeachers() {
  $('teachers-table').innerHTML = DATA.teachers.length ? `<table><thead><tr>
    <th>Photo</th><th>Name</th><th>Qualification</th><th>Subjects</th><th>Classes</th><th>Areas</th><th>Demo</th><th>Actions</th>
  </tr></thead><tbody>${DATA.teachers.map(t => `
    <tr>
      <td><img class="thumb" src="${t.photo}" alt="" onclick="vhtOpenLightbox('${t.photo}', '${vhtEsc(t.name)} (${vhtEsc(t.qualification)})', 'Subjects: ${vhtEsc(t.subjects)}')" title="Click to enlarge photo"></td>
      <td><b>${vhtEsc(t.name)}</b><br><small style="color:var(--gray)">${vhtEsc(t.experience)}</small></td>
      <td>${vhtEsc(t.qualification)}</td><td>${vhtEsc(t.subjects)}</td><td>${vhtEsc(t.classes)}</td><td>${vhtEsc(t.areas)}</td>
      <td>${t.demo === 'Yes' ? '✅' : '❌'}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-light" onclick="openTeacherForm('${t.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('teachers', '${t.id}', 'Teacher')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Koi teacher nahi. "Add Teacher" par click karke add karein.</div>';
}

function openTeacherForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const t = targetId ? (DATA.teachers.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Teacher' : 'Add New Teacher', `
    <div class="form-grid">
      <div><label>Full Name *</label><input name="name" value="${vhtEsc(t.name || '')}" required></div>
      <div><label>Qualification *</label><input name="qualification" value="${vhtEsc(t.qualification || '')}" placeholder="M.Sc. Maths, B.Ed." required></div>
      <div><label>Experience</label><input name="experience" value="${vhtEsc(t.experience || '')}" placeholder="5+ Years"></div>
      <div><label>Subjects (comma separated)</label><input name="subjects" value="${vhtEsc(t.subjects || '')}" placeholder="Maths, Physics"></div>
      <div><label>Classes</label><input name="classes" value="${vhtEsc(t.classes || '')}" placeholder="Class 6-12, JEE"></div>
      <div><label>Areas Covered</label><input name="areas" value="${vhtEsc(t.areas || '')}" placeholder="Delhi NCR, Mumbai"></div>
      <div><label>Demo Class Available</label><select name="demo"><option ${t.demo === 'Yes' ? 'selected' : ''}>Yes</option><option ${t.demo === 'No' ? 'selected' : ''}>No</option></select></div>
      <div><label>Upload Photo</label><input type="file" name="photoFile" accept="image/*"><img class="photo-preview" src="${t.photo || vhtAvatar('New Teacher', '#e63946', '#ff7a18')}" alt=""></div>
      <div class="full"><label>Short Bio</label><textarea name="bio">${vhtEsc(t.bio || '')}</textarea></div>
    </div>`, async (f, form) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = {
      id: recId,
      name: f.get('name'), qualification: f.get('qualification'), experience: f.get('experience'),
      subjects: f.get('subjects'), classes: f.get('classes'), areas: f.get('areas'),
      demo: f.get('demo'), bio: f.get('bio'),
      photo: t.photo || vhtAvatar(f.get('name'), '#e63946', '#ff7a18')
    };
    const file = form.querySelector('input[type=file]').files[0];
    if (file) rec.photo = form._processedPhotoUrl || await vhtProcessImageUpload(file);
    if (targetId) DATA.teachers = DATA.teachers.map(x => String(x.id) === targetId ? rec : x);
    else DATA.teachers.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Teacher updated ✅' : 'Teacher added ✅');
  });
}

/* ---------- Toppers CRUD ---------- */
function renderToppers() {
  $('toppers-table').innerHTML = DATA.toppers.length ? `<table><thead><tr>
    <th>Photo</th><th>Name</th><th>Marks/Result</th><th>School</th><th>Year</th><th>Actions</th>
  </tr></thead><tbody>${DATA.toppers.map(t => `
    <tr>
      <td><img class="thumb" src="${t.photo}" alt="" onclick="vhtOpenLightbox('${t.photo}', '${vhtEsc(t.name)} — ${vhtEsc(t.marks)}', '${vhtEsc(t.school)} (${vhtEsc(t.year)})')" title="Click to enlarge photo"></td>
      <td><b>${vhtEsc(t.name)}</b></td><td>${vhtEsc(t.marks)}</td><td>${vhtEsc(t.school)}</td><td>${vhtEsc(t.year)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-light" onclick="openTopperForm('${t.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('toppers', '${t.id}', 'Topper')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Koi topper nahi. "Add Topper" par click karke add karein.</div>';
}

function openTopperForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const t = targetId ? (DATA.toppers.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Topper' : 'Add New Topper', `
    <div class="form-grid">
      <div><label>Student Name *</label><input name="name" value="${vhtEsc(t.name || '')}" required></div>
      <div><label>Marks / Result *</label><input name="marks" value="${vhtEsc(t.marks || '')}" placeholder="97% — Class 12" required></div>
      <div><label>School</label><input name="school" value="${vhtEsc(t.school || '')}"></div>
      <div><label>Year</label><input name="year" value="${vhtEsc(t.year || new Date().getFullYear())}"></div>
      <div><label>Upload Photo</label><input type="file" name="photoFile" accept="image/*"><img class="photo-preview" src="${t.photo || vhtAvatar('Top Student', '#0f9d58', '#14b8a6')}" alt=""></div>
      <div class="full"><label>Success Story</label><textarea name="story">${vhtEsc(t.story || '')}</textarea></div>
    </div>`, async (f, form) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = {
      id: recId,
      name: f.get('name'), marks: f.get('marks'), school: f.get('school'),
      year: f.get('year'), story: f.get('story'),
      photo: t.photo || vhtAvatar(f.get('name'), '#0f9d58', '#14b8a6')
    };
    const file = form.querySelector('input[type=file]').files[0];
    if (file) rec.photo = form._processedPhotoUrl || await vhtProcessImageUpload(file);
    if (targetId) DATA.toppers = DATA.toppers.map(x => String(x.id) === targetId ? rec : x);
    else DATA.toppers.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Topper updated ✅' : 'Topper added ✅');
  });
}

/* ---------- Testimonials CRUD ---------- */
function renderTestimonials() {
  $('testimonials-table').innerHTML = DATA.testimonials.length ? `<table><thead><tr>
    <th>Parent Name</th><th>Relation</th><th>Review</th><th>Rating</th><th>Actions</th>
  </tr></thead><tbody>${DATA.testimonials.map(t => `
    <tr>
      <td><b>${vhtEsc(t.name)}</b></td><td>${vhtEsc(t.relation)}</td>
      <td style="max-width:280px">${vhtEsc(t.text)}</td>
      <td style="color:#f59e0b">${'★'.repeat(t.rating || 5)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-light" onclick="openTestimonialForm('${t.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('testimonials', '${t.id}', 'Testimonial')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Koi testimonial nahi hai.</div>';
}

function openTestimonialForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const t = targetId ? (DATA.testimonials.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Testimonial' : 'Add Testimonial', `
    <div class="form-grid">
      <div><label>Parent Name *</label><input name="name" value="${vhtEsc(t.name || '')}" required></div>
      <div><label>Relation</label><input name="relation" value="${vhtEsc(t.relation || '')}" placeholder="Parent of Class 10 student"></div>
      <div><label>Rating</label><select name="rating">${[5, 4, 3, 2, 1].map(r => `<option value="${r}" ${t.rating === r ? 'selected' : ''}>${'★'.repeat(r)}</option>`).join('')}</select></div>
      <div class="full"><label>Review Text *</label><textarea name="text" required>${vhtEsc(t.text || '')}</textarea></div>
    </div>`, async (f) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = {
      id: recId,
      name: f.get('name'), relation: f.get('relation'), text: f.get('text'), rating: Number(f.get('rating'))
    };
    if (targetId) DATA.testimonials = DATA.testimonials.map(x => String(x.id) === targetId ? rec : x);
    else DATA.testimonials.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Testimonial updated ✅' : 'Testimonial added ✅');
  });
}

/* ---------- Blogs CRUD ---------- */
function renderBlogs() {
  $('blogs-table').innerHTML = DATA.blogs.length ? `<table><thead><tr>
    <th>Title</th><th>Date</th><th>Author</th><th>Actions</th>
  </tr></thead><tbody>${DATA.blogs.map(b => `
    <tr>
      <td><b>${vhtEsc(b.title)}</b></td><td>${vhtEsc(b.date)}</td><td>${vhtEsc(b.author)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-light" onclick="openBlogForm('${b.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('blogs', '${b.id}', 'Article')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Koi article nahi hai.</div>';
}

function openBlogForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const b = targetId ? (DATA.blogs.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Article' : 'Add New Article', `
    <div class="form-grid">
      <div class="full"><label>Title *</label><input name="title" value="${vhtEsc(b.title || '')}" required></div>
      <div><label>Date</label><input name="date" type="date" value="${vhtEsc(b.date || new Date().toISOString().slice(0, 10))}"></div>
      <div><label>Author</label><input name="author" value="${vhtEsc(b.author || 'Anvigo Learning')}"></div>
      <div class="full"><label>Content * (blank line = new paragraph)</label><textarea name="content" style="min-height:200px" required>${vhtEsc(b.content || '')}</textarea></div>
    </div>`, async (f) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = {
      id: recId,
      title: f.get('title'), date: f.get('date'), author: f.get('author'), content: f.get('content'),
      slug: f.get('title').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    };
    if (targetId) DATA.blogs = DATA.blogs.map(x => String(x.id) === targetId ? rec : x);
    else DATA.blogs.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Article updated ✅' : 'Article published ✅');
  });
}

/* ---------- Gallery CRUD ---------- */
function renderGallery() {
  $('gallery-table').innerHTML = DATA.gallery.length ? `<table><thead><tr>
    <th>Image</th><th>Title</th><th>Actions</th>
  </tr></thead><tbody>${DATA.gallery.map(g => `
    <tr>
      <td><img class="thumb" style="width:80px;height:52px;object-fit:cover" src="${g.image.startsWith('data:') ? g.image : '../' + g.image}" alt="" onclick="vhtOpenLightbox(this.src, '${vhtEsc(g.title)}', 'Gallery Photo')" title="Click to enlarge image"></td>
      <td><b>${vhtEsc(g.title)}</b></td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-light" onclick="openGalleryForm('${g.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('gallery', '${g.id}', 'Image')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Gallery khali hai.</div>';
}

function openGalleryForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const g = targetId ? (DATA.gallery.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Gallery Image' : 'Add Gallery Image', `
    <div class="form-grid">
      <div class="full"><label>Title / Caption *</label><input name="title" value="${vhtEsc(g.title || '')}" required></div>
      <div class="full"><label>Upload Image ${targetId ? '(chhodne par purani image rahegi)' : '*'}</label>
        <input type="file" name="photoFile" accept="image/*" ${targetId ? '' : 'required'}>
        ${g.image ? `<img class="photo-preview" style="width:140px" src="${g.image.startsWith('data:') ? g.image : '../' + g.image}" alt="">` : ''}
      </div>
    </div>`, async (f, form) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = { id: recId, title: f.get('title'), image: g.image || '' };
    const file = form.querySelector('input[type=file]').files[0];
    if (file) rec.image = form._processedPhotoUrl || await vhtProcessImageUpload(file);
    if (targetId) DATA.gallery = DATA.gallery.map(x => String(x.id) === targetId ? rec : x);
    else DATA.gallery.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Image updated ✅' : 'Image added ✅');
  });
}

/* ---------- Banners CRUD ---------- */
function renderBanners() {
  $('banners-table').innerHTML = DATA.banners.length ? `<table><thead><tr>
    <th>Title</th><th>Subtitle</th><th>Button Text</th><th>Active</th><th>Actions</th>
  </tr></thead><tbody>${DATA.banners.map(b => `
    <tr>
      <td><b>${vhtEsc(b.title)}</b></td><td style="max-width:260px">${vhtEsc(b.subtitle)}</td><td>${vhtEsc(b.cta)}</td>
      <td>${b.active ? '<span class="status-pill status-contacted">Active</span>' : '<span class="status-pill status-closed">Off</span>'}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-green" onclick="toggleBanner('${b.id}')">${b.active ? 'Deactivate' : 'Activate'}</button>
        <button class="btn btn-sm btn-light" onclick="openBannerForm('${b.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('banners', '${b.id}', 'Banner')">🗑️</button>
      </td>
    </tr>`).join('')}</tbody></table>` : '<div class="empty-note">Koi banner nahi hai.</div>';
}

function toggleBanner(id) {
  const targetId = String(id);
  DATA.banners = DATA.banners.map(b => String(b.id) === targetId ? { ...b, active: !b.active } : b);
  save(); renderAll(); toast('Banner status updated');
}

function openBannerForm(id) {
  const targetId = (id != null && id !== 'undefined' && id !== '') ? String(id) : null;
  const b = targetId ? (DATA.banners.find(x => String(x.id) === targetId) || {}) : {};
  openModal(targetId ? 'Edit Banner' : 'Add Banner', `
    <div class="form-grid">
      <div class="full"><label>Banner Title *</label><input name="title" value="${vhtEsc(b.title || '')}" required></div>
      <div class="full"><label>Subtitle</label><textarea name="subtitle">${vhtEsc(b.subtitle || '')}</textarea></div>
      <div><label>Button Text</label><input name="cta" value="${vhtEsc(b.cta || 'Book FREE Demo Class')}"></div>
      <div><label>Active</label><select name="active"><option value="1" ${b.active !== false ? 'selected' : ''}>Yes</option><option value="0" ${b.active === false ? 'selected' : ''}>No</option></select></div>
    </div>`, async (f) => {
    const recId = targetId ? (isNaN(Number(targetId)) ? targetId : Number(targetId)) : Date.now();
    const rec = {
      id: recId,
      title: f.get('title'), subtitle: f.get('subtitle'), cta: f.get('cta'), active: f.get('active') === '1'
    };
    if (targetId) DATA.banners = DATA.banners.map(x => String(x.id) === targetId ? rec : x);
    else DATA.banners.push(rec);
    save(); closeModal(); renderAll(); toast(targetId ? 'Banner updated ✅' : 'Banner added ✅');
  });
}

/* ---------- Generic delete ---------- */
function deleteItem(section, id, label) {
  if (!confirm(label + ' delete karna hai? Ye action wapas nahi hoga.')) return;
  const targetId = String(id);
  DATA[section] = (DATA[section] || []).filter(x => String(x.id) !== targetId);
  save(); renderAll(); toast(label + ' deleted 🗑️');
}

/* ---------- Cloud Status & Supabase Data Sync ---------- */
function updateCloudStatusUI() {
  const isCloud = (typeof vhtIsSupabaseConfigured === 'function' && vhtIsSupabaseConfigured());
  const cfg = (typeof vhtGetSupabaseConfig === 'function') ? vhtGetSupabaseConfig() : { url: '' };

  const bannerInd = $('cloud-status-indicator');
  const bannerSub = $('cloud-status-sub');
  const badge = $('supabase-badge');
  const disconnectBtn = $('btn-disconnect-supabase');

  if (isCloud) {
    if (bannerInd) bannerInd.innerHTML = '⚡ <b>Supabase Cloud Active:</b> Real-time database, storage &amp; auth enabled';
    if (bannerSub) bannerSub.innerHTML = `Project URL: <code>${vhtEsc(cfg.url)}</code> | Admin: <b>anvigolearning@gmail.com</b>`;
    if (badge) {
      badge.style.background = '#ecfdf5';
      badge.style.border = '1px solid #10b981';
      badge.style.color = '#065f46';
      badge.innerHTML = `✅ <b>Connected to Supabase Cloud:</b> <code>${vhtEsc(cfg.url)}</code><br><small>Student, teacher, and school submissions are saved directly to your PostgreSQL database &amp; storage.</small>`;
    }
    if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
  } else {
    if (bannerInd) bannerInd.innerHTML = '⚠️ <b>Local Storage Mode:</b> Data stored only on this browser/device';
    if (bannerSub) bannerSub.innerHTML = 'Free me permanent cloud storage banane ke liye Settings me Supabase connect karein.';
    if (badge) {
      badge.style.background = '#fef3c7';
      badge.style.border = '1px solid #f59e0b';
      badge.style.color = '#92400e';
      badge.innerHTML = '⚠️ <b>Supabase not connected yet.</b> Paste your Project URL and Anon key below, then click "Save &amp; Connect".';
    }
    if (disconnectBtn) disconnectBtn.style.display = 'none';
  }
}

async function syncSupabaseData() {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return;
  try {
    // 0. Fetch latest site content from Cloud (Teachers, Toppers, Testimonials, Blogs, Banners, Settings)
    if (typeof vhtSupabaseFetchSiteContent === 'function') {
      const cloudSite = await vhtSupabaseFetchSiteContent();
      if (cloudSite && typeof cloudSite === 'object') {
        DATA = vhtMergeCloudData(cloudSite);
      } else if (DATA && typeof vhtSupabaseSaveSiteContent === 'function') {
        // Initial cloud seeding if cloud table row is empty
        await vhtSupabaseSaveSiteContent(DATA);
      }
    }

    const students = await vhtSupabaseFetchStudents();
    if (Array.isArray(students) && students.length) {
      const mapped = students.map(s => ({
        id: s.id,
        date: s.created_at ? new Date(s.created_at).toLocaleString('en-IN') : '',
        name: s.name,
        studentClass: s.student_class,
        mobile: s.mobile,
        email: s.email,
        state: s.state,
        city: s.city,
        address: s.address,
        pincode: s.pincode,
        subjects: s.subjects,
        budget: s.budget,
        status: s.status || 'New'
      }));
      vhtSaveEnquiries(mapped);
    }

    const teachers = await vhtSupabaseFetchTeachers();
    if (Array.isArray(teachers) && teachers.length) {
      const mapped = teachers.map(t => ({
        id: t.id,
        date: t.created_at ? new Date(t.created_at).toLocaleString('en-IN') : '',
        name: t.name,
        mobile: t.mobile,
        email: t.email,
        qualification: t.qualification,
        state: t.state,
        city: t.city,
        address: t.address,
        pincode: t.pincode,
        subjects: t.subjects,
        resume_url: t.resume_url,
        status: t.status || 'New'
      }));
      vhtSaveTeacherApplications(mapped);
    }

    const schools = await vhtSupabaseFetchSchools();
    if (Array.isArray(schools) && schools.length) {
      const mapped = schools.map(s => ({
        id: s.id,
        date: s.created_at ? new Date(s.created_at).toLocaleString('en-IN') : '',
        schoolName: s.school_name,
        contact: s.contact,
        email: s.email,
        state: s.state,
        city: s.city,
        address: s.address,
        pincode: s.pincode,
        subject: s.subject,
        budget: s.budget,
        status: s.status || 'New'
      }));
      vhtSaveSchoolApplications(mapped);
    }

    renderAll();
  } catch (err) {
    console.warn('Supabase sync notice:', err);
  }
}

/* ---------- Settings ---------- */
function fillSettingsForm() {
  const form = $('settings-form');
  for (const [k, v] of Object.entries(DATA.settings)) {
    const el = form.elements[k];
    if (el) el.value = v;
  }
  const sheetForm = $('sheet-settings-form');
  if (sheetForm) {
    const activeUrl = (typeof vhtGetSheetUrl === 'function') ? vhtGetSheetUrl() : (DATA.settings.sheetWebAppUrl || '');
    sheetForm.elements['sheetWebAppUrl'].value = activeUrl;
  }

  // Supabase form
  const sbCfg = (typeof vhtGetSupabaseConfig === 'function') ? vhtGetSupabaseConfig() : { url: '', anonKey: '' };
  const sbUrlInput = $('setting-supabase-url');
  const sbKeyInput = $('setting-supabase-key');
  if (sbUrlInput) sbUrlInput.value = sbCfg.url.includes('PASTE_') ? '' : sbCfg.url;
  if (sbKeyInput) sbKeyInput.value = sbCfg.anonKey.includes('PASTE_') ? '' : sbCfg.anonKey;

  updateCloudStatusUI();
  renderAdminLoginPanel();
}

function renderAdminLoginPanel() {
  const panel = $('admin-login-panel');
  if (!panel) return;

  const isCloud = (typeof vhtIsSupabaseConfigured === 'function' && vhtIsSupabaseConfigured());

  panel.innerHTML = `
    <h2>🔐 Admin Login Credentials</h2>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;margin-bottom:16px">
      <div style="font-weight:600;margin-bottom:6px;color:var(--dark)">Current Login Mode: ${isCloud ? '<span style="color:#059669">⚡ Supabase Cloud Auth</span>' : '<span style="color:#d97706">🔑 Local Storage Credentials</span>'}</div>
      <p style="font-size:0.83rem;color:var(--gray);margin-bottom:10px">
        ${isCloud
          ? 'Supabase Authentication is active. Your admin email is <b>anvigolearning@gmail.com</b>. You can add more admin accounts or reset your password directly from the <b>Supabase Dashboard → Authentication → Users</b> tab.'
          : 'Using local administrator account. Default credentials: Username: <b>admin</b> | Password: <b>admin123</b>. You can update your local credentials below, or connect Supabase above for cloud security.'}
      </p>
    </div>
    <form id="admin-cred-form" class="form-grid">
      <div><label>Local Admin Username</label><input name="username" value="${vhtEsc(DATA.admin.username)}" required></div>
      <div><label>New Local Password</label><input name="password" type="password" required minlength="6" placeholder="Enter new password"></div>
      <div class="full"><button class="btn btn-primary" type="submit">🔑 Update Local Admin Credentials</button></div>
    </form>`;

  const form = $('admin-cred-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    DATA.admin.username = f.get('username').trim();
    DATA.admin.password = f.get('password');
    save(); toast('Admin credentials updated 🔑 — naya password yaad rakhein!');
    e.target.elements['password'].value = '';
  });
}

// Supabase Settings Form Submit
const sbForm = $('supabase-settings-form');
if (sbForm) {
  sbForm.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const url = (f.get('supabaseUrl') || '').trim();
    const key = (f.get('supabaseAnonKey') || '').trim();

    if (!url.startsWith('https://')) {
      alert('Please enter a valid Supabase URL starting with https://');
      return;
    }

    if (typeof vhtSaveSupabaseConfig === 'function') {
      vhtSaveSupabaseConfig(url, key);
    }

    // re-init
    if (typeof vhtInitSupabase === 'function') {
      vhtSupabase = null;
      vhtInitSupabase();
    }

    updateCloudStatusUI();
    toast('⚡ Supabase settings saved! Connecting & syncing data...');
    await syncSupabaseData();
    toast('✅ Supabase connected & data synced!');
  });
}

// Disconnect button
const disconnectBtn = $('btn-disconnect-supabase');
if (disconnectBtn) {
  disconnectBtn.addEventListener('click', () => {
    if (!confirm('Supabase cloud connection disconnect karna hai? (Data delete nahi hoga, sirf local mode me revert ho jayega)')) return;
    if (typeof vhtSaveSupabaseConfig === 'function') {
      vhtSaveSupabaseConfig('', '');
    }
    const sbUrlInput = $('setting-supabase-url');
    const sbKeyInput = $('setting-supabase-key');
    if (sbUrlInput) sbUrlInput.value = '';
    if (sbKeyInput) sbKeyInput.value = '';
    updateCloudStatusUI();
    toast('Disconnected from Supabase Cloud');
  });
}

$('settings-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  for (const k of Object.keys(DATA.settings)) {
    const v = f.get(k);
    if (v !== null) DATA.settings[k] = v;
  }
  save(); toast('Settings saved ✅ — website par changes live ho gaye');
});

$('sheet-settings-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const url = (f.get('sheetWebAppUrl') || '').trim();
  DATA.settings.sheetWebAppUrl = url;
  if (typeof vhtSaveSheetUrl === 'function') vhtSaveSheetUrl(url);
  save(); toast('Google Sheet URL saved ✅ — ab forms Excel me auto-save honge');
});

$('reset-data-btn').addEventListener('click', () => {
  if (!confirm('Pura data default par reset ho jayega (enquiries, teacher applications aur school requests included). Continue?')) return;
  localStorage.removeItem(VHT_KEY);
  localStorage.removeItem(VHT_ENQ_KEY);
  localStorage.removeItem(VHT_TEACHER_APP_KEY);
  localStorage.removeItem(VHT_SCHOOL_APP_KEY);
  DATA = vhtLoad();
  renderAll(); fillSettingsForm(); toast('Data reset ho gaya ✅');
});

/* ---------- Render all ---------- */
function renderAll() {
  renderDashboard();
  renderEnquiries();
  renderTeacherApps();
  renderSchoolApps();
  renderTeachers();
  renderToppers();
  renderTestimonials();
  renderBlogs();
  renderGallery();
  renderBanners();
}

renderAll();
fillSettingsForm();
syncSupabaseData();
