/**
 * Anvigo Learning — Form → Google Sheet ("Auto Excel") connector
 * ------------------------------------------------------------
 * This script receives form submissions from the website (Student Enrollment,
 * Teacher Applications, School Requests) and appends each one as a new row
 * in the matching tab of your Google Sheet. The Sheet updates automatically —
 * you can open it anytime, or download it as a real Excel file any time via
 * File → Download → Microsoft Excel (.xlsx).
 *
 * SETUP (one-time, free, ~5 minutes) — see README.md in this folder for the
 * full step-by-step instructions. Quick version:
 *   1. Create a new Google Sheet (sheets.google.com/create).
 *   2. Extensions → Apps Script. Delete any starter code, paste this whole file.
 *   3. Click Deploy → New deployment → type: "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Click Deploy, authorize when asked, then copy the "Web app URL".
 *   5. Paste that URL into your website's Admin Panel → Settings →
 *      "Auto-Excel Setup" → Google Sheet Web App URL → Save.
 * That's it — every form submission on the site will now also land as a new
 * row in this Sheet, in a tab named "Students", "Teachers" or "Schools"
 * (created automatically the first time each form is used).
 */

function doPost(e) {
  var result = { status: 'ok' };
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheetName = payload.sheet || 'Submissions';
    var data = payload.data || {};

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    var keys = Object.keys(data);

    // Write a header row the first time this tab is used.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(keys);
      sheet.getRange(1, 1, 1, keys.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var values = keys.map(function (k) { return data[k]; });
    sheet.appendRow(values);
    sheet.autoResizeColumns(1, Math.max(keys.length, 1));
  } catch (err) {
    result = { status: 'error', message: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('Anvigo Learning form endpoint is live. This URL only accepts POST requests from the website.');
}
