// === SUPABASE CLIENT ===
var _supa = null;
function getSupa() {
  if (!_supa && window.supabase) {
    _supa = window.supabase.createClient('https://wkgawfioizvaajiwqycg.supabase.co', 'sb_publishable_Ad6w7mUrq5u2arw-WL3N-A_-bxCqzon');
  }
  return _supa;
}

// Save admin settings to Supabase
async function saveSettingsToCloud(settings) {
  var db = getSupa();
  if (!db) return;
  try {
    await db.from('admin_settings').upsert({ id: 1, settings: settings, updated_at: new Date().toISOString() });
  } catch(e) { console.log('Supabase save error:', e); }
}

// Load admin settings from Supabase
async function loadSettingsFromCloud() {
  var db = getSupa();
  if (!db) return null;
  try {
    var result = await db.from('admin_settings').select('settings').eq('id', 1).single();
    if (result.data && result.data.settings) return result.data.settings;
  } catch(e) { console.log('Supabase load error:', e); }
  return null;
}

// Save referral code to Supabase
async function saveRefCodeToCloud(code) {
  var db = getSupa();
  if (!db) return;
  try {
    await db.from('referral_codes').upsert({ code: code, created_at: new Date().toISOString() }, { onConflict: 'code' });
  } catch(e) { console.log('Supabase ref error:', e); }
}

// Load referral codes from Supabase
async function loadRefCodesFromCloud() {
  var db = getSupa();
  if (!db) return null;
  try {
    var result = await db.from('referral_codes').select('code, created_at').order('created_at', { ascending: false });
    if (result.data) return result.data;
  } catch(e) { console.log('Supabase ref load error:', e); }
  return null;
}

// Increment visit counter in Supabase
async function incrementVisitCloud() {
  var db = getSupa();
  if (!db) return;
  try {
    await db.rpc('increment_visits');
  } catch(e) {
    // fallback: read then update
    try {
      var r = await db.from('site_stats').select('visits').eq('id', 1).single();
      var v = (r.data ? r.data.visits : 0) + 1;
      await db.from('site_stats').upsert({ id: 1, visits: v, updated_at: new Date().toISOString() });
    } catch(e2) { console.log('Visit increment error:', e2); }
  }
}

// Track service click in Supabase
async function trackSvcCloud(key) {
  var db = getSupa();
  if (!db) return;
  try {
    var r = await db.from('site_stats').select('service_clicks').eq('id', 1).single();
    var clicks = (r.data && r.data.service_clicks) ? r.data.service_clicks : {};
    clicks[key] = (clicks[key] || 0) + 1;
    await db.from('site_stats').upsert({ id: 1, service_clicks: clicks, updated_at: new Date().toISOString() });
  } catch(e) { console.log('Track svc error:', e); }
}

// Load stats from Supabase
async function loadStatsFromCloud() {
  var db = getSupa();
  if (!db) return null;
  try {
    var r = await db.from('site_stats').select('visits, service_clicks').eq('id', 1).single();
    return r.data;
  } catch(e) { return null; }
}
