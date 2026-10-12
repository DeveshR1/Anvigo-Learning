/**
 * Anvigo Learning — Supabase Client SDK Helpers
 * Handles Database operations, Storage file uploads, and Admin Authentication.
 */

let vhtSupabase = null;

function vhtInitSupabase() {
  if (vhtSupabase) return vhtSupabase;
  if (!vhtIsSupabaseConfigured()) return null;

  try {
    if (window.supabase && window.supabase.createClient) {
      const cfg = vhtGetSupabaseConfig();
      vhtSupabase = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return vhtSupabase;
    }
  } catch (err) {
    console.error('Supabase initialization failed:', err);
  }
  return null;
}

// Automatically attempt init if SDK is present
if (typeof window !== 'undefined') {
  vhtInitSupabase();
}

/* ============================================================
   1. Public Form Submissions (Database Inserts)
   ============================================================ */

/**
 * Submit Student Enrollment to Supabase
 * Dual-engine: Attempts Supabase JS SDK first, then falls back to direct PostgREST fetch
 * ensuring 100% submission success even if CDN is blocked or slow on mobile.
 */
async function vhtSupabaseSubmitStudent(enq) {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  const payload = {
    name: enq.name || '',
    student_class: enq.studentClass || '',
    mobile: enq.mobile || '',
    email: enq.email || '',
    state: enq.state || '',
    city: enq.city || '',
    address: enq.address || '',
    pincode: enq.pincode || '',
    subjects: enq.subjects || '',
    budget: enq.budget || '',
    status: 'New'
  };

  // 1. Try SDK client
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('student_enrollments').insert([payload]).select();
      if (!error && data && data.length) return data[0];
      if (error) console.warn('Supabase SDK insert notice, attempting REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK insert error, attempting REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback (Zero CDN dependency, native browser fetch)
  try {
    const res = await fetch(`${cfg.url}/rest/v1/student_enrollments`, {
      method: 'POST',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) && data[0] ? data[0] : true;
    } else {
      console.error('Supabase REST submit error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Supabase REST submit fetch exception:', err);
  }
  return null;
}

/**
 * Submit Teacher Application to Supabase
 * Dual-engine: SDK + Direct REST API fallback
 */
async function vhtSupabaseSubmitTeacher(app) {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  const payload = {
    name: app.name || '',
    mobile: app.mobile || '',
    email: app.email || '',
    qualification: app.qualification || '',
    state: app.state || '',
    city: app.city || '',
    address: app.address || '',
    pincode: app.pincode || '',
    subjects: app.subjects || '',
    resume_url: app.resumeUrl || null,
    status: 'New'
  };

  // 1. Try SDK client
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('teacher_applications').insert([payload]).select();
      if (!error && data && data.length) return data[0];
      if (error) console.warn('Supabase SDK teacher insert notice, attempting REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK teacher insert error, attempting REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/teacher_applications`, {
      method: 'POST',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) && data[0] ? data[0] : true;
    } else {
      console.error('Supabase REST teacher submit error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Supabase REST teacher submit fetch exception:', err);
  }
  return null;
}

/**
 * Submit School Hiring Request to Supabase
 * Dual-engine: SDK + Direct REST API fallback
 */
async function vhtSupabaseSubmitSchool(req) {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  const payload = {
    school_name: req.schoolName || '',
    contact: req.contact || '',
    email: req.email || '',
    state: req.state || '',
    city: req.city || '',
    address: req.address || '',
    pincode: req.pincode || '',
    subject: req.subject || '',
    budget: req.budget || '',
    status: 'New'
  };

  // 1. Try SDK client
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('school_requests').insert([payload]).select();
      if (!error && data && data.length) return data[0];
      if (error) console.warn('Supabase SDK school insert notice, attempting REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK school insert error, attempting REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/school_requests`, {
      method: 'POST',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) && data[0] ? data[0] : true;
    } else {
      console.error('Supabase REST school submit error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Supabase REST school submit fetch exception:', err);
  }
  return null;
}

/* ============================================================
   2. Supabase Storage (File & Resume Uploads)
   ============================================================ */

/**
 * Upload a file (resume or image) to a Supabase Storage bucket
 */
async function vhtSupabaseUploadFile(bucketName, file, folderPath = '') {
  const sb = vhtInitSupabase();
  if (!sb || !file) return null;

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'bin';
    const cleanName = (file.name || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;
    const filePath = folderPath ? `${folderPath.replace(/\/$/, '')}/${fileName}` : fileName;

    const { error: uploadError } = await sb.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = sb.storage.from(bucketName).getPublicUrl(filePath);
    return urlData ? urlData.publicUrl : null;
  } catch (err) {
    console.error(`Supabase Storage Upload Error (${bucketName}):`, err);
    return null;
  }
}

/* ============================================================
   3. Admin Data Retrieval & Mutation
   ============================================================ */

async function vhtSupabaseFetchStudents() {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  // 1. Try SDK
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('student_enrollments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data;
      if (error) console.warn('Supabase SDK fetch students error, trying REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK fetch students error, trying REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/student_enrollments?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Supabase REST fetch students error:', err);
  }
  return null;
}

async function vhtSupabaseUpdateStudentStatus(id, newStatus) {
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('student_enrollments').update({ status: newStatus }).eq('id', id);
      if (!error) return true;
    } catch (e) {}
  }
  const cfg = vhtGetSupabaseConfig();
  try {
    const res = await fetch(`${cfg.url}/rest/v1/student_enrollments?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function vhtSupabaseDeleteStudent(id) {
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('student_enrollments').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {}
  }
  const cfg = vhtGetSupabaseConfig();
  try {
    const res = await fetch(`${cfg.url}/rest/v1/student_enrollments?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function vhtSupabaseFetchTeachers() {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  // 1. Try SDK
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data;
      if (error) console.warn('Supabase SDK fetch teachers error, trying REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK fetch teachers error, trying REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/teacher_applications?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Supabase REST fetch teachers error:', err);
  }
  return null;
}

async function vhtSupabaseUpdateTeacherStatus(id, newStatus) {
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('teacher_applications').update({ status: newStatus }).eq('id', id);
      if (!error) return true;
    } catch (e) {}
  }
  const cfg = vhtGetSupabaseConfig();
  try {
    const res = await fetch(`${cfg.url}/rest/v1/teacher_applications?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function vhtSupabaseDeleteTeacher(id) {
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('teacher_applications').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {}
  }
  const cfg = vhtGetSupabaseConfig();
  try {
    const res = await fetch(`${cfg.url}/rest/v1/teacher_applications?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function vhtSupabaseFetchSchools() {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  // 1. Try SDK
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('school_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) return data;
      if (error) console.warn('Supabase SDK fetch schools error, trying REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK fetch schools error, trying REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/school_requests?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Supabase REST fetch schools error:', err);
  }
  return null;
}

async function vhtSupabaseUpdateSchoolStatus(id, newStatus) {
  const sb = vhtInitSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('school_requests').update({ status: newStatus }).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase Update School Error:', err);
    return false;
  }
}

async function vhtSupabaseDeleteSchool(id) {
  const sb = vhtInitSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('school_requests').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase Delete School Error:', err);
    return false;
  }
}

/* ============================================================
   4. Admin Authentication via Supabase Auth
   ============================================================ */

async function vhtSupabaseLogin(email, password) {
  const sb = vhtInitSupabase();
  if (!sb) return { error: { message: 'Supabase is not configured yet.' } };

  try {
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    return { data, error };
  } catch (err) {
    return { error: err };
  }
}

async function vhtSupabaseLogout() {
  const sb = vhtInitSupabase();
  if (sb) {
    try { await sb.auth.signOut(); } catch (e) {}
  }
  sessionStorage.removeItem(VHT_ADMIN_KEY);
  location.href = 'index.html';
}

async function vhtSupabaseGetSession() {
  const sb = vhtInitSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    return data ? data.session : null;
  } catch (e) {
    return null;
  }
}

/* ============================================================
   5. Site Content Cloud Synchronization (Teachers, Toppers, etc.)
   ============================================================ */

/**
 * Fetch full website content (teachers, toppers, blogs, etc.) from Supabase Cloud.
 * Dual-engine: SDK + Direct REST API fallback.
 */
async function vhtSupabaseFetchSiteContent() {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return null;
  const cfg = vhtGetSupabaseConfig();

  // 1. Try SDK
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('site_settings')
        .select('value')
        .eq('key', 'site_content')
        .maybeSingle();
      if (!error && data && data.value) return data.value;
      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase SDK fetch site_content notice, trying REST fallback:', error);
      }
    } catch (err) {
      console.warn('Supabase SDK fetch site_content notice, trying REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/site_settings?key=eq.site_content&select=value`, {
      method: 'GET',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${cfg.anonKey}`
      }
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0] && rows[0].value) {
        return rows[0].value;
      }
    }
  } catch (err) {
    console.warn('Supabase REST fetch site_content notice:', err);
  }
  return null;
}

/**
 * Save / Upsert full website content (teachers, toppers, blogs, settings) to Supabase Cloud.
 * Dual-engine: SDK + Direct REST API fallback.
 */
async function vhtSupabaseSaveSiteContent(data) {
  if (typeof vhtIsSupabaseConfigured !== 'function' || !vhtIsSupabaseConfigured()) return false;
  if (!data) return false;
  const cfg = vhtGetSupabaseConfig();

  // Clone and sanitize content (strip admin credentials)
  const cleanData = JSON.parse(JSON.stringify(data));
  if (cleanData.admin) delete cleanData.admin;

  const payload = {
    key: 'site_content',
    value: cleanData,
    updated_at: new Date().toISOString()
  };

  // Determine auth token if admin has an active session
  let authToken = cfg.anonKey;
  const sb = vhtInitSupabase();
  if (sb) {
    try {
      const sess = await sb.auth.getSession();
      if (sess && sess.data && sess.data.session && sess.data.session.access_token) {
        authToken = sess.data.session.access_token;
      }
    } catch (e) {}
  }

  // 1. Try SDK
  if (sb) {
    try {
      const { error } = await sb
        .from('site_settings')
        .upsert([payload], { onConflict: 'key' });
      if (!error) return true;
      console.warn('Supabase SDK save site_content notice, trying REST fallback:', error);
    } catch (err) {
      console.warn('Supabase SDK save site_content notice, trying REST fallback:', err);
    }
  }

  // 2. Direct REST API fallback
  try {
    const res = await fetch(`${cfg.url}/rest/v1/site_settings?on_conflict=key`, {
      method: 'POST',
      headers: {
        'apikey': cfg.anonKey,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return true;
    console.error('Supabase REST save site_content failed:', res.status, await res.text());
  } catch (err) {
    console.error('Supabase REST save site_content exception:', err);
  }
  return false;
}

