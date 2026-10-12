/**
 * Anvigo Learning — Supabase Configuration
 * ----------------------------------------
 * You can configure Supabase in two easy ways:
 * 1. Open Admin Panel -> Settings -> "Supabase Cloud Setup" and paste your keys.
 * 2. OR paste your Supabase Project URL and Anon Key directly below in this file.
 *
 * Full step-by-step guide: SUPABASE-SETUP-GUIDE.md
 */

const VHT_SUPABASE_CONFIG = {
  url: "https://qkohpclvvnnkdaeavzsc.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb2hwY2x2dm5ua2RhZWF2enNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzY4NjksImV4cCI6MjEwNzA1Mjg2OX0.mVzh7t48CHBRG2gbzhdsoCbZvtN5dqOuWDclVWBLkEI",
  defaultAdminEmail: "anvigolearning@gmail.com"
};

/**
 * Returns effective Supabase configuration (prefers localStorage if saved via Admin Settings UI).
 */
function vhtGetSupabaseConfig() {
  const localUrl = localStorage.getItem('vht_supabase_url');
  const localKey = localStorage.getItem('vht_supabase_anon_key');
  
  const url = (localUrl && localUrl.trim()) || VHT_SUPABASE_CONFIG.url || '';
  const anonKey = (localKey && localKey.trim()) || VHT_SUPABASE_CONFIG.anonKey || '';

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
    defaultAdminEmail: VHT_SUPABASE_CONFIG.defaultAdminEmail
  };
}

/**
 * Check if real Supabase keys are configured.
 */
function vhtIsSupabaseConfigured() {
  const cfg = vhtGetSupabaseConfig();
  return Boolean(
    cfg.url &&
    cfg.anonKey &&
    !cfg.url.includes('PASTE_') &&
    !cfg.anonKey.includes('PASTE_') &&
    cfg.url.startsWith('https://')
  );
}

/**
 * Save Supabase configuration to localStorage from Admin Dashboard UI.
 */
function vhtSaveSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem('vht_supabase_url', url.trim());
  else localStorage.removeItem('vht_supabase_url');

  if (anonKey) localStorage.setItem('vht_supabase_anon_key', anonKey.trim());
  else localStorage.removeItem('vht_supabase_anon_key');
}

/**
 * ============================================================
 * Google Sheet Auto-Excel Configuration (Shared across all users)
 * ============================================================
 * Paste your Google Apps Script Web App URL below (starts with https://script.google.com/macros/s/...)
 * Once set here, form submissions from ANY visitor, on ANY device, will automatically
 * land into your Google Sheet!
 */
const VHT_GOOGLE_SHEET_CONFIG = {
  webAppUrl: "https://script.google.com/macros/s/AKfycbwCy94BCi_eFyPSccaCmt3FUDGMchECfUZK0_PYznryYlE6lz8whvsrB67IGE1bDabV/exec"
};

function vhtGetSheetUrl() {
  const local = localStorage.getItem('vht_sheet_webapp_url');
  if (local && local.trim()) return local.trim();
  if (VHT_GOOGLE_SHEET_CONFIG.webAppUrl && VHT_GOOGLE_SHEET_CONFIG.webAppUrl.trim()) return VHT_GOOGLE_SHEET_CONFIG.webAppUrl.trim();
  if (typeof VHT !== 'undefined' && VHT.settings && VHT.settings.sheetWebAppUrl) return VHT.settings.sheetWebAppUrl.trim();
  return '';
}

function vhtSaveSheetUrl(url) {
  if (url) localStorage.setItem('vht_sheet_webapp_url', url.trim());
  else localStorage.removeItem('vht_sheet_webapp_url');
}
