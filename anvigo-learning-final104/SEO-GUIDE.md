# SEO & "Get Found on Google + AI Chats" Guide — Anvigo Learning

Honest starting point: **no one can guarantee #1 on Google** (not Anthropic,
not any SEO agency) — Google's ranking depends on hundreds of factors,
many outside your website's code (your domain's age, backlinks, reviews,
competitors). What I *can* do is make sure nothing in your code is holding
you back, target your exact keywords properly, and set you up to be
easily found and quoted by AI chat tools too. Below is what's already done
in the website files, and — just as important — what only you can do next
(all free).

---

## ✅ Already done in the code

- **Keywords targeted** (in titles, meta descriptions & page content):
  `home tuition`, `online tuition`, `tuition near me`, `best tuition`,
  `teacher recruitment` — plus related terms like "home tutor near me".
- **Unique, keyword-rich `<title>` and meta description** on every page
  (Home, Teachers, Courses, Contact, etc.) — this is what shows up in
  Google search results.
- **FAQPage structured data** (`schema.org`) on the homepage, with a
  matching visible FAQ section, answering exactly the kind of questions
  people (and AI tools) search for — e.g. "Who provides the best home
  tuition near me?", "Can a school hire teachers through Anvigo Learning?"
- **EducationalOrganization structured data** — tells Google (and AI
  tools that read structured data) clearly what your business is, your
  phone, email, and social profiles.
- **`sitemap.xml`** — a list of all your pages for Google to crawl.
- **`robots.txt`** — tells search engines they're allowed to crawl the
  site (and to skip the private `/admin/` folder).
- **`rel="canonical"` tags** on every page (avoids duplicate-content issues).
- **Open Graph / Twitter tags** — controls how your homepage looks when
  shared/linked on WhatsApp, Facebook, X, etc.
- Mobile/tablet/laptop responsive design (Google ranks mobile-friendly
  sites higher — "mobile-first indexing").

## ⚠️ One thing you must do before any of this fully works

All the URLs above (`sitemap.xml`, `robots.txt`, canonical tags, Open
Graph) currently use a **placeholder domain**:
`https://www.anvigolearning.com`

Once you buy your real domain and host the site there, **find-and-replace**
`https://www.anvigolearning.com` with your real domain across these files:
`index.html`, `about.html`, `blog.html`, `blog-post.html`, `contact.html`,
`courses.html`, `results.html`, `teachers.html`, `testimonials.html`,
`robots.txt`, `sitemap.xml`. (In VS Code: Ctrl/Cmd+Shift+H → "Replace in
Files".)

---

## 📋 What only you can do (all free, this is what actually moves rankings)

1. **Get a real domain + HTTPS hosting.** Google barely ranks sites still
   on `localhost` or unclaimed subdomains. Free/cheap options: Netlify,
   Vercel, GitHub Pages, Cloudflare Pages (all free, give you HTTPS
   automatically). A `.com`/`.in` domain costs a small yearly fee (~₹500-1000/yr).

2. **Google Search Console** (free) — https://search.google.com/search-console
   - Add your site, verify ownership, submit `sitemap.xml`.
   - This is what actually tells Google "please crawl and index me" —
     without this step, Google may take weeks to find you on its own.

3. **Google Business Profile** (free) — https://business.google.com
   - Create a listing for "Anvigo Learning" with your phone, service
     areas, and category "Tutoring service". This is *the* biggest single
     lever for showing up when people search "tuition near me" — Google
     Maps/local results are shown before regular website results for
     "near me" searches.
   - Ask happy parents to leave a Google review — review count & rating
     directly affects local ranking.

4. **Backlinks** — other websites linking to yours (e.g. local education
   directories like Sulekha, JustDial, UrbanPro, Quikr; local news;
   partner schools linking to you). This is the single strongest ranking
   factor after content quality — takes time to build, no shortcuts.

5. **Publish new blog content regularly.** You already have a working
   Blog section — add a new post every 1-2 weeks (exam tips, subject
   guides, "Best tuition in [your city]" style posts). Fresh, useful
   content is what both Google *and* AI tools reward most.

6. **Page speed** — keep images small (yours already are), avoid adding
   heavy plugins. Test at https://pagespeed.web.dev once you're live.

---

## 🤖 About showing up in AI chats (ChatGPT, Claude, Perplexity, etc.)

There's no "submit my site to AI" button. AI chat tools that can browse
the web mostly find sites the same way Google does — through their own
web index or by calling a search engine — so **everything above (good SEO,
structured data, backlinks, being indexed) is also exactly what helps you
get cited by AI tools.** Two extra things specifically help AI citation:

- **Structured data (already added)** — AI tools strongly prefer pulling
  clear facts from FAQ/Organization schema over guessing from paragraphs.
- **Clear, direct, factual writing** — short, unambiguous sentences that
  directly answer a likely question (like your new FAQ section) get
  quoted far more often than marketing-style prose.

There's no guaranteed timeline for either Google ranking or AI citation —
budget for a few months of consistent content + backlink building, not
a one-time fix.
