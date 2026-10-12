# Anvigo Learning — Official Platform (anvigolearning.com)

**Learn • Teach • Grow.**  
India's unified platform connecting students (home & online tuition), teachers (tuition/teaching jobs), and schools (hiring teachers) — all in one place across India.

---

## 🌟 Key Features & Updates

1. **⚡ Supabase Cloud Database & Storage (https://supabase.com)**:
   - Full PostgreSQL cloud database for the 3 enrollment types.
   - Dedicated storage buckets (`resumes` for teacher CVs, `site-uploads` for banners and images).
   - 1-click SQL setup via `supabase/schema.sql`.
   - Setup guide: **`SUPABASE-SETUP-GUIDE.md`**.

2. **📊 Separate Excel (.xlsx) Downloads for All 3 Enrollment Types**:
   - Integrated **SheetJS** (`xlsx.full.min.js`) for genuine Microsoft Excel `.xlsx` format (no CSV formatting issues, phone number truncations, or comma breakages).
   - **Separate Excel Downloads**:
     - 🎓 **Student Enrollments (.xlsx)**
     - 👩‍🏫 **Teacher Applications (.xlsx)**
     - 🏫 **School Hiring Requests (.xlsx)**
   - **Master Workbook Export**:
     - 📦 **"Export All 3 in 1 Excel"** button in Admin Dashboard topbar — creates one single Excel workbook containing **3 separate formatted worksheet tabs** (`Student Enrollments`, `Teacher Applications`, `School Requests`).

3. **🔐 Admin Login Credentials**:
   - **Cloud Supabase Auth**: Official admin email: **`anvigolearning@gmail.com`** (managed securely via Supabase Authentication).
   - **Local Emergency Fallback**: Username: `admin` | Password: `admin123` (editable in Settings).
   - Dedicated Settings panel in Admin Dashboard to configure, test, or disconnect Supabase keys anytime.

4. **🇮🇳 Pan-India #1 SEO & AI Chat Visibility (GEO - Generative Engine Optimization)**:
   - Optimized for Google India #1 rankings across all 28 states and major cities.
   - Standard **`/llms.txt`** and **`/llms-full.txt`** files for AI search engines (**ChatGPT Search, Perplexity, Google Gemini, Claude, Copilot**).
   - Explicit AI crawler permissions in **`robots.txt`** (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`).
   - Rich **Schema.org** JSON-LD (`EducationalOrganization`, `EducationalService`, `FAQPage`, `BreadcrumbList`, `WebSite`).
   - Step-by-step ranking strategy: **`SEO-AND-AI-RANKING-STRATEGY.md`**.

---

## 📂 Project Structure

```text
anvigo-learning/
├── index.html                     # Homepage (Hero, courses, toppers, testimonials, Pan-India areas, enquiry)
├── about.html                     # About Anvigo Learning story & mission
├── courses.html                   # All course streams (Class 1-12, JEE, NEET, Commerce, English)
├── teachers.html                  # Searchable teacher directory with subject/area filters
├── results.html                   # Toppers and student success stories
├── testimonials.html              # Parent reviews & feedback
├── blog.html                      # Educational blog listing
├── blog-post.html                 # Single blog article view
├── contact.html                   # The 3 core enrollment forms (Tabs: Student, Teacher, School)
├── llms.txt                       # Standard AI search manifest (Perplexity, ChatGPT, Claude)
├── llms-full.txt                  # Complete knowledge base for deep AI models
├── robots.txt                     # Crawler directives allowing AI search engines & search engines
├── sitemap.xml                    # Canonical sitemap for Google Search Console
├── SUPABASE-SETUP-GUIDE.md        # Step-by-step Hindi/English Supabase setup guide
├── SEO-AND-AI-RANKING-STRATEGY.md # Blueprint for Google India #1 and AI search recommendations
│
├── admin/                         # Admin Management Portal
│   ├── index.html                 # Admin login (supports Supabase Auth & local credentials)
│   └── dashboard.html             # Full management dashboard (leads, excel exports, settings)
│
├── js/
│   ├── data.js                    # Core data models, Indian states, default data
│   ├── main.js                    # Public site renderer, form handlers, Supabase hooks
│   ├── admin.js                   # Admin dashboard logic, SheetJS XLSX exports, Supabase sync
│   ├── supabase-config.js         # Supabase URL & Anon Key configuration
│   └── supabase-client.js         # Supabase JS SDK helpers (DB insert, storage upload, auth)
│
├── css/
│   ├── style.css                  # Public responsive website stylesheet
│   └── admin.css                  # Admin panel stylesheet
│
├── supabase/
│   └── schema.sql                 # 1-Click PostgreSQL schema & storage buckets setup
│
└── google-sheets-setup/           # Optional Google Sheets Apps Script auto-sync
    ├── Code.gs
    └── README.md
```

---

## 🚀 How to Run Locally (Live Server)
1. Open this folder in VS Code.
2. Right click on `index.html` → **"Open with Live Server"**.
3. Website will launch at `http://127.0.0.1:5500/index.html`.
4. Open `admin/index.html` to access the Admin Panel.
