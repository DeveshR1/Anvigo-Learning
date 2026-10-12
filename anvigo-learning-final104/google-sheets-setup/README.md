# Free "Auto-Updating Excel" Setup — Google Sheets

Your website has 3 forms:
1. **Student Enrollment** (parents)
2. **Teacher Registration** (teachers)
3. **School — Hire Teachers** (schools)

Every time someone submits one of these forms, this setup makes it appear
as a new row in your Google Sheet **automatically** — no manual export
needed. It's 100% free (no paid tools, no backend/server needed).

You'll do this once. It takes about 5 minutes.

---

## Step 1 — Create a Google Sheet

1. Go to https://sheets.google.com/create
2. Rename it something like **"Anvigo Learning — Submissions"**.
3. You don't need to add any tabs or headers yourself — the script creates
   3 tabs automatically the first time each form is used:
   - `Students`
   - `Teachers`
   - `Schools`

## Step 2 — Add the script

1. In your new Sheet, click **Extensions → Apps Script**.
2. Delete any starter code you see (`function myFunction() {}` etc.).
3. Open the `Code.gs` file from this folder, copy **everything**, and
   paste it into the Apps Script editor.
4. Click the 💾 **Save** icon (or Ctrl/Cmd+S). Name the project anything,
   e.g. "Anvigo Form Handler".

## Step 3 — Deploy it as a Web App

1. Click the blue **Deploy** button (top-right) → **New deployment**.
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** Anvigo form handler (or anything)
   - **Execute as:** **Me** (your Google account)
   - **Who has access:** **Anyone**
   ⚠️ It must be "Anyone" — this is what lets your website (running in a
   visitor's browser) submit form data. It does **not** let anyone read
   your Sheet — only your script's `doPost` function runs, and only your
   forms call it.
4. Click **Deploy**.
5. The first time, Google will ask you to **authorize** the script —
   click through "Advanced" → "Go to (project name) (unsafe)" if you see
   a warning (this is normal for your own scripts) → **Allow**.
6. Copy the **Web app URL** shown (looks like
   `https://script.google.com/macros/s/AKfycb.../exec`).

## Step 4 — Connect it to your website

1. Open your website's **Admin Panel** (`admin/index.html`) and log in.
2. Go to **Settings → 📊 Auto-Excel Setup (Google Sheets — Free)**.
3. Paste the Web app URL into **Google Sheet Web App URL** and click
   **Save Sheet URL**.

Done! Submit a test entry on the Student Enrollment / Teacher Registration
/ School form on your live site, then check your Google Sheet — a new row
(with column headers on first use) should appear within a few seconds.

## Downloading it as a real Excel file

Anytime you want an actual `.xlsx` file (to email, archive, etc.), open
the Google Sheet and go to **File → Download → Microsoft Excel (.xlsx)**.
The Sheet itself always stays live and up to date — you only need to
download it when you specifically want an offline copy.

## Re-deploying after you edit Code.gs

If you ever change the script later, you must create a **new deployment
version** for the changes to take effect:
**Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy.**
The Web app URL usually stays the same, but double check it and update
Settings if it changes.

## Troubleshooting

- **New rows aren't appearing:** Double-check "Who has access" is set to
  "Anyone" (not "Anyone with Google account" or "Only myself").
- **Wrong/missing columns:** Delete the tab (`Students`/`Teachers`/`Schools`)
  in the Sheet and submit a fresh test entry — the header row will be
  recreated automatically in the correct order.
- This is optional — if you don't set it up, all 3 forms still work fine
  and save data inside the website's Admin Panel (view/export CSV there
  anytime); you just won't get the automatic Google Sheet copy.
