// ================================
// SCRIPT.JS
// ================================

// ── LOGIN INPUT CLEANUP ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("login-email");
  const errorEl = document.getElementById("login-email-error");
  if (!emailInput) return;
  emailInput.addEventListener("input", function () {
    this.classList.remove("error", "success");
    errorEl.textContent = "";
  });
});

document.getElementById("login-email").addEventListener("input", () => {
  document.getElementById("login-email-error").textContent = "";
});

// ── STATE ───────────────────────────────────────────────────
const state = {
  currentUser: {
    id: null,
    name: '',
    username: '',
    initials: '',
    avatar: null,
    bio: '',
    following: 0,
    followers: 0,
    signals: 0,
    links: []
  },
  postType: 'signal',
  feed: [],
  vault: [],
  suggested: [],
  following: {},
  vaultFilter: 'All',
};

// ── API HYDRATION ───────────────────────────────────────────
function _initialsFromName(name) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function _normalizeCurrentUser(me) {
  const u = me && typeof me === 'object' ? me : {};
  const name = u.name || u.full_name || '';
  const username = u.username || (u.handle ? String(u.handle).replace(/^@/, '') : '');
  const initials = u.initials || _initialsFromName(name) || (username ? username.slice(0, 2).toUpperCase() : '');
  return {
    ...state.currentUser,
    ...u,
    name,
    username,
    initials,
    bio: u.bio || '',
    avatar: typeof u.avatar === 'string' ? u.avatar : null,
    followers: Number(u.followers || 0),
    following: Number(u.following || 0),
    signals: Number(u.signals || 0),
    links: Array.isArray(u.links) ? u.links : (Array.isArray(u.linkinbio_links) ? u.linkinbio_links : [])
  };
}

function _normalizeFeedItem(p) {
  const post = p && typeof p === 'object' ? p : {};
  const name = post.name || post.author_name || '';
  const handle = post.handle || (post.username ? '@' + String(post.username).replace(/^@/, '') : (post.author_handle || ''));
  const initials = post.initials || _initialsFromName(name) || (handle ? String(handle).replace(/^@/, '').slice(0, 2).toUpperCase() : '');
  return {
    id: post.id || ('f_' + Math.random().toString(36).slice(2)),
    uid: post.uid || post.user_id || post.author_id || 'u_unknown',
    name,
    handle,
    initials,
    color: post.color || '#C07850',
    type: post.type || 'signal',
    time: post.time || post.created_at_human || '',
    body: post.body || post.text || post.content || '',
    liked: Boolean(post.liked),
    likes: Number(post.likes || 0),
    shares: Number(post.shares || 0),
    saved: Boolean(post.saved)
  };
}

async function loadUserData() {
  try {
    const [meRes, dashRes, feedRes] = await Promise.all([
      fetch('/api/me', { credentials: 'include' }),
      fetch('/api/dashboard', { credentials: 'include' }),
      fetch('/api/feed', { credentials: 'include' })
    ]);

    const [meJson, dashJson, feedJson] = await Promise.all([
      meRes.ok ? meRes.json() : null,
      dashRes.ok ? dashRes.json() : null,
      feedRes.ok ? feedRes.json() : null
    ]);

    if (meJson) state.currentUser = _normalizeCurrentUser(meJson);

    if (dashJson && typeof dashJson === 'object') {
      if (Array.isArray(dashJson.vault)) state.vault = dashJson.vault;
      if (Array.isArray(dashJson.suggested)) state.suggested = dashJson.suggested;
      if (dashJson.following && typeof dashJson.following === 'object') state.following = dashJson.following;
    }

    if (Array.isArray(feedJson)) state.feed = feedJson.map(_normalizeFeedItem);
    else if (feedJson && Array.isArray(feedJson.feed)) state.feed = feedJson.feed.map(_normalizeFeedItem);

    if (document.getElementById('screen-app')?.classList.contains('active')) {
      renderFeed();
      renderSuggested();
      if (document.querySelector('.s-nav-item.active')?.dataset?.tab === 'vault') renderVault();
      if (document.querySelector('.s-nav-item.active')?.dataset?.tab === 'profile') renderOwnProfile();
      if (document.querySelector('.s-nav-item.active')?.dataset?.tab === 'linkinbio') renderLibLinks();
      if (document.querySelector('.s-nav-item.active')?.dataset?.tab === 'explore') renderExplore();
    }
  } catch (err) {
    console.error('Failed to load user data:', err);
  }
}

// ── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── MODALS ──────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.style.display = 'none';
}

// ── SCREENS ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

// ── TABS ────────────────────────────────────────────────────
function switchTab(btn) {
  document.querySelectorAll('.s-nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const tab = btn.dataset.tab;
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = tab === 'feed' ? 'flex' : 'block';
  if (tab === 'vault') renderVault();
  if (tab === 'profile') renderOwnProfile();
  if (tab === 'linkinbio') renderLibLinks();
  if (tab === 'explore') renderExplore();
}

// ── PROFILE SWITCHER ────────────────────────────────────────
function toggleSwitcher() {
  document.getElementById('profile-switcher').classList.toggle('open');
}

function switchProfile(id, btn) {
  document.querySelectorAll('.ps-item').forEach(i => {
    i.classList.remove('ps-active');
    i.querySelector('.ps-check') && i.querySelector('.ps-check').remove();
  });
  btn.classList.add('ps-active');
  const check = document.createElement('span');
  check.className = 'ps-check';
  check.textContent = '✓';
  btn.appendChild(check);
  const name = id === 'biz' ? 'Mills Studio' : 'Jordan Mills';
  const handle = id === 'biz' ? '@millsstudio' : '@jordanmills';
  const initials = id === 'biz' ? 'MS' : 'JM';
  document.getElementById('sidebar-name').textContent = name;
  document.getElementById('sidebar-handle').textContent = handle;
  document.getElementById('sidebar-av').textContent = initials;
  document.getElementById('profile-switcher').classList.remove('open');
  showToast('Switched to ' + name);
}

function signOut() {
  localStorage.removeItem('user');
  document.getElementById('profile-switcher').classList.remove('open');
  showScreen('landing');
}

function handleSignupAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = document.getElementById('signup-av-preview');
  img.src = url;
  img.classList.add('loaded');
  img.previousElementSibling.style.display = 'none';
}

function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function checkPasswordMatch() {
  const p1 = document.getElementById('signup-password').value;
  const p2 = document.getElementById('signup-confirm').value;
  const err = document.getElementById('password-match-error');
  if (p2.length > 0 && p1 !== p2) {
    err.classList.add('show');
  } else {
    err.classList.remove('show');
  }
}

// ── ENTER APP ───────────────────────────────────────────────
function enterApp() {
  const u = state.currentUser;
  document.getElementById('sidebar-name').textContent = u.name;
  document.getElementById('sidebar-handle').textContent = '@' + u.username;
  document.getElementById('sidebar-av').textContent = u.initials;
  if (u.avatar) {
    const av = document.getElementById('sidebar-av');
    av.innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;" />';
  }
  document.getElementById('composer-av').textContent = u.initials;
  if (u.avatar) document.getElementById('composer-av').innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
  showScreen('app');
  renderFeed();
  renderSuggested();
  loadUserData();
}

// ── POST TYPE ───────────────────────────────────────────────
function setPostType(type, btn) {
  state.postType = type;
  document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const ta = document.getElementById('compose-text');
  ta.placeholder = type === 'signal' ? 'Share a signal — a thought, quote, or insight…' : 'Write a post…';
  document.getElementById('post-btn').textContent = type === 'signal' ? 'Send signal' : 'Publish';
}

function updateCharCount(ta) {
  const remaining = 280 - ta.value.length;
  const cc = document.getElementById('char-count');
  cc.textContent = remaining;
  cc.style.color = remaining < 30 ? '#c0392b' : 'var(--g400)';
  document.getElementById('post-btn').disabled = ta.value.trim().length === 0;
}

// ── FEED ────────────────────────────────────────────────────
function renderFeed() {
  const list = document.getElementById('feed-list');
  list.innerHTML = state.feed.map(p => `
    <div class="signal-card" id="card-${p.id}">
      <div class="sc-header">
        <div class="sc-av" style="background:${p.color}22;color:${p.color};" onclick="viewProfile('${p.uid}')">${p.initials}</div>
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
            <span class="sc-name" onclick="viewProfile('${p.uid}')">${p.name}</span>
            <span class="sc-badge ${p.type === 'signal' ? 'b-signal' : p.type === 'post' ? 'b-post' : 'b-shared'}">${p.type}</span>
          </div>
          <span class="sc-handle">${p.handle}</span>
        </div>
        <span class="sc-time">${p.time}</span>
      </div>
      <div class="sc-body">${p.body}</div>
      <div class="sc-actions">
        <button class="sc-action ${p.liked ? 'liked' : ''}" id="like-${p.id}" onclick="toggleLike('${p.id}')">${p.liked ? '♥' : '♡'} ${p.likes}</button>
        <button class="sc-action" onclick="handleShare('${p.id}')">↗ ${p.shares}</button>
        <button class="sc-action ${p.saved ? 'saved' : ''}" id="save-${p.id}" onclick="toggleSave('${p.id}')">${p.saved ? '🔒' : '🔓'} ${p.saved ? 'Saved' : 'Save'}</button>
      </div>
    </div>
  `).join('');
}

function submitPost() {
  const text = document.getElementById('compose-text').value.trim();
  if (!text) return;
  const u = state.currentUser;
  const newPost = {
    id: 'f_' + Date.now(), uid: 'u_me', name: u.name, handle: '@' + u.username,
    initials: u.initials, color: '#C07850', type: state.postType, time: 'just now',
    body: text, liked: false, likes: 0, shares: 0, saved: false
  };
  state.feed.unshift(newPost);
  document.getElementById('compose-text').value = '';
  document.getElementById('char-count').textContent = '280';
  document.getElementById('post-btn').disabled = true;
  renderFeed();
  showToast(state.postType === 'signal' ? 'Signal posted ⚡' : 'Post published ✓');
}

function toggleLike(id) {
  const p = state.feed.find(f => f.id === id);
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  const btn = document.getElementById('like-' + id);
  btn.className = 'sc-action' + (p.liked ? ' liked' : '');
  btn.textContent = (p.liked ? '♥' : '♡') + ' ' + p.likes;
}

function toggleSave(id) {
  const p = state.feed.find(f => f.id === id);
  if (!p) return;
  p.saved = !p.saved;
  const btn = document.getElementById('save-' + id);
  btn.className = 'sc-action' + (p.saved ? ' saved' : '');
  btn.textContent = (p.saved ? '🔒' : '🔓') + ' ' + (p.saved ? 'Saved' : 'Save');
  if (p.saved) {
    state.vault.unshift({ id: 'v_' + Date.now(), type: p.type === 'signal' ? 'Signal' : 'Post', title: p.body.slice(0, 60) + '…', date: 'Today' });
  }
  showToast(p.saved ? 'Saved to vault 🔒' : 'Removed from vault');
}

function handleShare(id) {
  const p = state.feed.find(f => f.id === id);
  if (!p) return;
  p.shares++;
  document.querySelector(`#card-${id} .sc-actions button:nth-child(2)`).textContent = '↗ ' + p.shares;
  showToast('Link copied ✓');
}

// ── SUGGESTED ───────────────────────────────────────────────
function renderSuggested() {
  document.getElementById('suggested-list').innerHTML = state.suggested.slice(0, 4).map(u => `
    <div class="sug-row">
      <div class="sug-av" style="background:${u.color}22;color:${u.color};" onclick="viewProfile('${u.id}')">${u.initials}</div>
      <div style="flex:1;min-width:0;cursor:pointer;" onclick="viewProfile('${u.id}')">
        <div class="sug-name">${u.name}</div>
        <div class="sug-handle">${u.handle}</div>
      </div>
      <button class="sug-follow ${state.following[u.id] ? 'following' : ''}" onclick="toggleFollow('${u.id}',this)">${state.following[u.id] ? '✓' : 'Follow'}</button>
    </div>
  `).join('');
}

function toggleFollow(id, btn) {
  state.following[id] = !state.following[id];
  btn.className = 'sug-follow' + (state.following[id] ? ' following' : '');
  btn.textContent = state.following[id] ? '✓' : 'Follow';
}

// ── PROFILE ─────────────────────────────────────────────────
function renderOwnProfile() {
  const u = state.currentUser;
  const el = document.getElementById('own-profile-content');
  el.innerHTML = profileHTML(u, true);
  activateProfileTabs(el, u, true);
}

function viewProfile(uid) {
  const u = uid === 'u_me' ? state.currentUser : state.suggested.find(s => s.id === uid);
  if (!u) return;
  const fullU = uid === 'u_me' ? state.currentUser : { ...u, following: 148, followers: 1200, signals: 44, links: [] };
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  const tab = document.getElementById('tab-viewprofile');
  tab.style.display = 'block';
  tab.querySelector('#view-profile-content').innerHTML = profileHTML(fullU, uid === 'u_me');
  activateProfileTabs(tab.querySelector('#view-profile-content'), fullU, uid === 'u_me');
  document.querySelectorAll('.s-nav-item').forEach(b => b.classList.remove('active'));
}

function profileHTML(u, isOwn) {
  return `
    ${!isOwn ? '<button class="back-btn" onclick="switchTab(document.querySelector(\'[data-tab=feed]\'))">← Back</button>' : ''}
    <div class="p-cover"></div>
    <div class="p-info-row">
      <div class="p-av-lg">${u.avatar ? '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;" />' : (u.initials || 'JM')}</div>
      <div class="p-action-row">
        ${isOwn
          ? '<button class="p-btn" onclick="switchTab(document.querySelector(\'[data-tab=settings]\'))">Edit profile</button>'
          : `<button class="p-btn primary" id="prof-follow-btn" onclick="toggleProfileFollow(this)">${state.following[u.id] ? 'Following ✓' : 'Follow'}</button>
             <button class="p-btn" onclick="showToast('Message sent ✓')">Message</button>`
        }
      </div>
    </div>
    <div class="p-name">${u.name}</div>
    <div class="p-handle">@${u.username || u.handle || 'user'}</div>
    <div class="p-bio">${u.bio || ''}</div>
    <div class="p-stats">
      <span><span class="p-stat-num">${u.signals || 87}</span><span class="p-stat-label">signals</span></span>
      <span><span class="p-stat-num">${(u.followers || 2309).toLocaleString()}</span><span class="p-stat-label">followers</span></span>
      <span><span class="p-stat-num">${u.following || 148}</span><span class="p-stat-label">following</span></span>
    </div>
    ${u.links && u.links.length ? `<div class="p-links">${u.links.map(l => `<button class="p-link"><span style="font-size:12px;">${l.icon}</span>${l.label}</button>`).join('')}</div>` : ''}
    <div class="p-tabs">
      <button class="p-tab active" onclick="switchProfileTab('signals',this)">Signals</button>
      <button class="p-tab" onclick="switchProfileTab('posts',this)">Posts</button>
      <button class="p-tab" onclick="switchProfileTab('vault',this)">Vault</button>
    </div>
    <div id="ptab-signals" class="p-tab-content active">${state.feed.filter(p => p.type === 'signal').map(p => `<div class="signal-card" style="cursor:default;"><div class="sc-body" style="margin-bottom:0;">${p.body}</div><div class="sc-actions" style="margin-top:12px;"><button class="sc-action">♡ ${p.likes}</button><button class="sc-action">↗ ${p.shares}</button></div></div>`).join('')}</div>
    <div id="ptab-posts" class="p-tab-content" style="display:none;">${state.feed.filter(p => p.type === 'post').map(p => `<div class="signal-card" style="cursor:default;"><div class="sc-body" style="margin-bottom:0;">${p.body}</div><div class="sc-actions" style="margin-top:12px;"><button class="sc-action">♡ ${p.likes}</button><button class="sc-action">↗ ${p.shares}</button></div></div>`).join('')}</div>
    <div id="ptab-vault" class="p-tab-content" style="display:none;">${isOwn ? `<div class="vault-grid">${state.vault.map(v => `<div class="vault-card"><div class="vault-type">${v.type}</div><div class="vault-title">${v.title}</div><div class="vault-date">${v.date}</div></div>`).join('')}</div>` : '<div style="text-align:center;padding:44px 0;color:var(--g400);font-size:14px;">🔒 Vault is private</div>'}</div>
  `;
}

function switchProfileTab(name, btn) {
  btn.closest('.main-wide').querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  btn.closest('.main-wide').querySelectorAll('.p-tab-content').forEach(t => t.style.display = 'none');
  btn.closest('.main-wide').querySelector('#ptab-' + name).style.display = 'block';
}

function activateProfileTabs(el, u, isOwn) {}

function toggleProfileFollow(btn) {
  const isFollowing = btn.classList.contains('following');
  btn.classList.toggle('following', !isFollowing);
  btn.classList.toggle('primary', isFollowing);
  btn.textContent = isFollowing ? 'Follow' : 'Following ✓';
}

// ── VAULT ───────────────────────────────────────────────────
function renderVault() {
  const items = state.vaultFilter === 'All' ? state.vault : state.vault.filter(v => v.type === state.vaultFilter);
  document.getElementById('vault-grid').innerHTML = items.map(v => `
    <div class="vault-card">
      <div class="vault-type">${v.type}</div>
      <div class="vault-title">${v.title}</div>
      <div class="vault-date">${v.date}</div>
    </div>
  `).join('');
}

function filterVault(f, btn) {
  state.vaultFilter = f;
  document.querySelectorAll('#vault-filters .type-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderVault();
}

// ── LINK IN BIO ─────────────────────────────────────────────
function renderLibLinks() {
  const u = state.currentUser;
  document.getElementById('lib-name').textContent = u.name;
  document.getElementById('lib-bio').textContent = u.bio;
  if (u.avatar) document.getElementById('lib-av').innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
  else document.getElementById('lib-av').textContent = u.initials;
  document.getElementById('lib-links-list').innerHTML = u.links.map((l, i) => `
    <div class="lib-link-item">
      <span style="font-size:15px;">${l.icon}</span>
      <span style="flex:1;margin-left:9px;">${l.label}</span>
      <span style="font-size:13px;color:var(--g400);">→</span>
    </div>
  `).join('');
  renderLibEditLinks();
}

function renderLibEditLinks() {
  document.getElementById('lib-edit-links').innerHTML = state.currentUser.links.map((l, i) => `
    <div style="display:flex;gap:7px;margin-bottom:8px;">
      <input class="form-input" style="flex:1;" value="${l.label}" onchange="state.currentUser.links[${i}].label=this.value;renderLibLinks();" />
      <button onclick="state.currentUser.links.splice(${i},1);renderLibLinks();" style="background:none;border:none;cursor:pointer;font-size:17px;color:var(--g400);padding:0 4px;">×</button>
    </div>
  `).join('');
}

let libEditing = false;
function toggleLibEdit() {
  libEditing = !libEditing;
  document.getElementById('lib-edit-panel').style.display = libEditing ? 'block' : 'none';
  document.getElementById('lib-edit-btn').textContent = libEditing ? 'Done' : 'Edit links';
}

function addLibLink() {
  const input = document.getElementById('lib-new-label');
  if (!input.value.trim()) return;
  state.currentUser.links.push({ label: input.value.trim(), icon: '🔗' });
  input.value = '';
  renderLibLinks();
}

// ── EXPLORE ─────────────────────────────────────────────────
function renderExplore(query = '') {
  const results = query
    ? state.suggested.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.handle.includes(query.toLowerCase()))
    : state.suggested;
  document.getElementById('explore-list').innerHTML = results.map(u => `
    <div class="ex-row">
      <div style="width:44px;height:44px;border-radius:50%;background:${u.color}22;color:${u.color};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;cursor:pointer;flex-shrink:0;" onclick="viewProfile('${u.id}')">${u.initials}</div>
      <div style="flex:1;min-width:0;cursor:pointer;" onclick="viewProfile('${u.id}')">
        <div style="font-size:14.5px;font-weight:600;color:var(--black);">${u.name}</div>
        <div style="font-size:13px;color:var(--g400);">${u.handle}</div>
        <div style="font-size:13px;color:var(--g600);margin-top:2px;font-weight:300;">${u.bio}</div>
      </div>
      <button class="follow-btn ${state.following[u.id] ? 'following' : ''}" onclick="toggleFollowExplore('${u.id}',this)">${state.following[u.id] ? 'Following ✓' : 'Follow'}</button>
    </div>
  `).join('');
}

function filterExplore(q) { renderExplore(q); }

function toggleFollowExplore(id, btn) {
  state.following[id] = !state.following[id];
  btn.className = 'follow-btn' + (state.following[id] ? ' following' : '');
  btn.textContent = state.following[id] ? 'Following ✓' : 'Follow';
}

// ── SETTINGS ────────────────────────────────────────────────
function handleSettingsAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  state.currentUser.avatar = url;
  const img = document.getElementById('settings-av-img');
  img.src = url;
  img.classList.add('loaded');
  document.getElementById('settings-av-initials').style.display = 'none';
  document.getElementById('remove-av-btn').style.display = 'inline-flex';
}

function removeAvatar() {
  state.currentUser.avatar = null;
  const img = document.getElementById('settings-av-img');
  img.src = '';
  img.classList.remove('loaded');
  document.getElementById('settings-av-initials').style.display = 'block';
  document.getElementById('remove-av-btn').style.display = 'none';
}

function saveSettings() {
  state.currentUser.name = document.getElementById('settings-name').value;
  state.currentUser.username = document.getElementById('settings-username').value;
  state.currentUser.bio = document.getElementById('settings-bio').value;
  const u = state.currentUser;
  document.getElementById('sidebar-name').textContent = u.name;
  document.getElementById('sidebar-handle').textContent = '@' + u.username;
  showToast('Profile saved ✓');
}

// ── CLICK OUTSIDE SWITCHER ───────────────────────────────────
document.addEventListener('click', function (e) {
  const switcher = document.getElementById('profile-switcher');
  if (switcher.classList.contains('open') && !switcher.contains(e.target) && !e.target.closest('.s-profile-btn')) {
    switcher.classList.remove('open');
  }
});

// ── AUTO-LOGIN FROM URL PARAM ────────────────────────────────
(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  if (userParam) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('user', JSON.stringify(user));
      state.currentUser = _normalizeCurrentUser(user);
      enterApp();
      window.history.replaceState({}, '', '/');
    } catch (e) {
      console.error('Failed to parse user from URL:', e);
    }
  } else {
    // Check localStorage for existing session
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        state.currentUser = _normalizeCurrentUser(user);
        enterApp();
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }
})();