# ⚡ Anvigo Learning — Supabase Complete Setup Guide

> **Learn • Teach • Grow — https://www.anvigolearning.com**  
> Ye guide aapko **Supabase** (https://supabase.com) par free account banakar, database, storage buckets aur secure admin login setup karne ka poora step-by-step process sikhayegi.

---

## 🎯 Supabase Kyun Use Kar Rahe Hain?

1. **Persistent Cloud Database (PostgreSQL)**:
   - Student Enrollments, Teacher Applications aur School Requests browser localStorage me nahi, balki cloud database me safe rahenge.
   - Aap kisi bhi computer, laptop ya mobile phone se Admin Panel login karke sara real-time data dekh sakte hain.
2. **Supabase Object Storage**:
   - Resumes (teachers ki CV), ID proofs, topper photos, aur website banners store karne ke liye dedicated storage buckets (`resumes`, `site-uploads`).
3. **Secure Admin Authentication**:
   - Admin login (`anvigolearning@gmail.com`) encrypted aur secure password ke sath Supabase Auth se verify hota hai.
4. **100% Free**:
   - Supabase ka free tier 500 MB database, 1 GB file storage, aur 50,000 monthly active users deta hai — jo aapke business ke liye shuruat me kaafi hai.

---

## 🚀 Step-by-Step Setup (Total ~5 se 7 Minutes)

### Step 1: Supabase Par Free Account Banayein
1. Browser me **https://supabase.com** open karein.
2. Top-right me **"Start your project"** ya **"Sign in"** par click karein.
3. Apne GitHub account ya Google account se sign up karein (free).

---

### Step 2: Naya Project Banayein
1. Dashboard par **"New Project"** button par click karein.
2. Details fill karein:
   - **Name**: `anvigo-learning`
   - **Database Password**: Ek strong password banayein aur save karke rakhein (e.g. `AnvigoPass@2026!`).
   - **Region**: India ke sabse paas wala region select karein — **"South Asia (Mumbai) - ap-south-1"** ya Singapore.
   - **Pricing Plan**: Free tier (selected by default).
3. **"Create new project"** par click karein.
4. Project create hone me 1-2 minute lagte hain.

---

### Step 3: Database Tables & Storage Buckets Banayein (1-Click SQL)
Humne aapke project folder me ek ready-made SQL script banayi hai:
📁 **`supabase/schema.sql`**

1. Supabase Dashboard ke left sidebar me **"SQL Editor"** (icon: `>_`) par click karein.
2. **"New Query"** par click karein.
3. Apne computer me `supabase/schema.sql` file open karein, sara code copy karein, aur Supabase SQL Editor me paste kar dein.
4. Bottom-right me green button **"Run"** par click karein.
5. `Success. No rows returned` show hoga.
   - Isse automatically ye tables ban jayengi:
     - `student_enrollments` (Students / Parents leads)
     - `teacher_applications` (Teacher job applications)
     - `school_requests` (School hiring requests)
     - `site_settings`
   - Aur Storage buckets ban jayenge:
     - `resumes` (for teacher CVs)
     - `site-uploads` (for photos/banners)

---

### Step 4: API Keys Copy Karein
1. Supabase dashboard ke left sidebar me sabse neeche ⚙️ **Project Settings** par click karein.
2. Settings me **"API"** tab par click karein.
3. Yaha aapko do cheezein dikhengi:
   - **Project URL**: e.g. `https://abcdefghijklmnop.supabase.co`
   - **Project API keys** ke andar `anon` / `public` key: e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Dono ko copy karein.

---

### Step 5: Website & Admin Panel Se Connect Karein (2 Easy Ways)

#### Option A: Direct Admin Dashboard Se (Sabse Asaan — No Code Editing!)
1. Apni website ka Admin Panel open karein: `admin/index.html` (Local default: `admin` / `admin123`).
2. Left menu me **"⚙️ Settings"** par click karein.
3. **"⚡ Supabase Cloud Setup"** panel me:
   - **Supabase Project URL** me apna URL paste karein.
   - **Supabase Anon Public Key** me apni key paste karein.
4. **"💾 Save & Connect to Supabase"** par click karein.
5. Green message aayega: `✅ Supabase connected & data synced!`
6. Dashboard topbar me badge automatically change hokar **⚡ Supabase Cloud Active** ban jayega!

#### Option B: Code File Me Paste Karna
- Agar aap permanently code me save karna chahte hain, to `js/supabase-config.js` file open karein:
```javascript
const VHT_SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co", // <-- Apna URL yaha dalein
  anonKey: "your-anon-key-here...",           // <-- Apni Anon Key yaha dalein
  defaultAdminEmail: "anvigolearning@gmail.com"
};
```

---

### Step 6: Admin Login Email & Password Banayein (Supabase Auth)
Aapka official admin email hai: **`anvigolearning@gmail.com`**

1. Supabase Dashboard ke left menu me **"Authentication"** (icon: 👤 Users) par click karein.
2. **"Users"** tab me top-right par **"Add user"** button par click karein.
3. **"Create user"** select karein:
   - **User Email**: `anvigolearning@gmail.com`
   - **User Password**: Ek strong password set karein (e.g. `AnvigoAdmin@2026`).
   - **Auto Confirm User?**: Checkbox ko **ON** (tick) karein taaki email confirmation ki zaroorat na pade.
4. **"Create user"** par click karein.
5. Ab aap `admin/index.html` me directly `anvigolearning@gmail.com` aur apne password se secure cloud login kar sakte hain!

---

## 📊 Supabase Me Data Kaise Dekhein?

- **Table Editor**:
  - Supabase Dashboard ke left menu me **"Table Editor"** (table icon) par click karein.
  - Waha aapko 3 tables dikhengi:
    1. `student_enrollments` — Har student enquiry live yaha aayegi.
    2. `teacher_applications` — Teachers ke applications yaha aayenge.
    3. `school_requests` — Schools ki requirement yaha aayegi.
- **Real-Time Data**:
  - Jaise hi website par koi form submit karega, Supabase table me instant row add ho jayegi!
  - Admin dashboard par bhi wo enquiry real-time dikhai degi.

---

## 📁 Storage Buckets (Resumes & Files)
- Left menu me **"Storage"** par click karein.
- Aapko do buckets dikhenge:
  - `resumes` — Teacher resumes download ya view karne ke liye.
  - `site-uploads` — Banners ya gallery images ke liye.
