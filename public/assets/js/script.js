// ================================
// SCRIPT.JS — SAFE NEXT.JS VERSION
// ================================

const $ = (id) => document.getElementById(id)

function safeText(id, value) {
  const el = $(id)
  if (el) el.textContent = value
}

function safeHTML(id, value) {
  const el = $(id)
  if (el) el.innerHTML = value
}

function safeDisplay(id, value) {
  const el = $(id)
  if (el) el.style.display = value
}

// ── LOGIN INPUT CLEANUP ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = $('login-email')
  const errorEl = $('login-email-error')

  if (emailInput && errorEl) {
    emailInput.addEventListener('input', function () {
      this.classList.remove('error', 'success')
      errorEl.textContent = ''
    })
  }
})

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
  vaultFilter: 'All'
}

// ── HELPERS ─────────────────────────────────────────────────
function _initialsFromName(name) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function _normalizeCurrentUser(me) {
  const u = me && typeof me === 'object' ? me : {}
  const name = u.name || u.full_name || ''
  const username = u.username || (u.handle ? String(u.handle).replace(/^@/, '') : '')
  const initials = u.initials || _initialsFromName(name) || (username ? username.slice(0, 2).toUpperCase() : '')

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
    links: Array.isArray(u.links)
      ? u.links
      : Array.isArray(u.linkinbio_links)
        ? u.linkinbio_links
        : []
  }
}

function _normalizeFeedItem(p) {
  const post = p && typeof p === 'object' ? p : {}
  const name = post.name || post.author_name || ''
  const handle = post.handle || (post.username ? '@' + String(post.username).replace(/^@/, '') : post.author_handle || '')
  const initials = post.initials || _initialsFromName(name) || (handle ? String(handle).replace(/^@/, '').slice(0, 2).toUpperCase() : '')

  return {
    id: post.id || 'f_' + Math.random().toString(36).slice(2),
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
  }
}

// ── API HYDRATION ───────────────────────────────────────────
async function loadUserData() {
  try {
    const [meRes, dashRes, feedRes] = await Promise.all([
      fetch('/api/me', { credentials: 'include' }),
      fetch('/api/dashboard', { credentials: 'include' }),
      fetch('/api/feed', { credentials: 'include' })
    ])

    const [meJson, dashJson, feedJson] = await Promise.all([
      meRes.ok ? meRes.json() : null,
      dashRes.ok ? dashRes.json() : null,
      feedRes.ok ? feedRes.json() : null
    ])

    if (meJson) state.currentUser = _normalizeCurrentUser(meJson)

    if (dashJson && typeof dashJson === 'object') {
      if (Array.isArray(dashJson.vault)) state.vault = dashJson.vault
      if (Array.isArray(dashJson.suggested)) state.suggested = dashJson.suggested
      if (dashJson.following && typeof dashJson.following === 'object') state.following = dashJson.following
    }

    if (Array.isArray(feedJson)) state.feed = feedJson.map(_normalizeFeedItem)
    else if (feedJson && Array.isArray(feedJson.feed)) state.feed = feedJson.feed.map(_normalizeFeedItem)

    if ($('feed-list')) renderFeed()
    if ($('suggested-list')) renderSuggested()

    const activeTab = document.querySelector('.s-nav-item.active')?.dataset?.tab
    if (activeTab === 'vault' && $('vault-grid')) renderVault()
    if (activeTab === 'profile' && $('own-profile-content')) renderOwnProfile()
    if (activeTab === 'linkinbio' && $('lib-links-list')) renderLibLinks()
    if (activeTab === 'explore' && $('explore-list')) renderExplore()
  } catch (err) {
    console.error('Failed to load user data:', err)
  }
}

// ── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const t = $('toast')
  if (!t) return

  t.textContent = msg
  t.classList.add('show')

  setTimeout(() => {
    t.classList.remove('show')
  }, 2200)
}

// ── MODALS ──────────────────────────────────────────────────
function openModal(id) {
  safeDisplay('modal-' + id, 'flex')
}

function closeModal(id) {
  safeDisplay('modal-' + id, 'none')
}

// ── SCREENS ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))

  const screen = $('screen-' + id)
  if (screen) screen.classList.add('active')
}

// ── TABS ────────────────────────────────────────────────────
function switchTab(btn) {
  if (!btn) return

  document.querySelectorAll('.s-nav-item').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')

  const tab = btn.dataset.tab
  if (!tab) return

  document.querySelectorAll('.tab-content').forEach(t => {
    t.style.display = 'none'
  })

  const tabEl = $('tab-' + tab)
  if (tabEl) tabEl.style.display = tab === 'feed' ? 'flex' : 'block'

  if (tab === 'vault') renderVault()
  if (tab === 'profile') renderOwnProfile()
  if (tab === 'linkinbio') renderLibLinks()
  if (tab === 'explore') renderExplore()
}

// ── PROFILE SWITCHER ────────────────────────────────────────
function toggleSwitcher() {
  const switcher = $('profile-switcher')
  if (switcher) switcher.classList.toggle('open')
}

function switchProfile(id, btn) {
  if (!btn) return

  document.querySelectorAll('.ps-item').forEach(i => {
    i.classList.remove('ps-active')
    const check = i.querySelector('.ps-check')
    if (check) check.remove()
  })

  btn.classList.add('ps-active')

  const check = document.createElement('span')
  check.className = 'ps-check'
  check.textContent = '✓'
  btn.appendChild(check)

  const name = id === 'biz' ? 'Mills Studio' : 'Jordan Mills'
  const handle = id === 'biz' ? '@millsstudio' : '@jordanmills'
  const initials = id === 'biz' ? 'MS' : 'JM'

  safeText('sidebar-name', name)
  safeText('sidebar-handle', handle)
  safeText('sidebar-av', initials)

  const switcher = $('profile-switcher')
  if (switcher) switcher.classList.remove('open')

  showToast('Switched to ' + name)
}

function signOut() {
  localStorage.removeItem('user')

  const switcher = $('profile-switcher')
  if (switcher) switcher.classList.remove('open')

  showScreen('landing')

  if (!$('screen-landing')) {
    window.location.href = '/'
  }
}

// ── SIGNUP / PASSWORD ───────────────────────────────────────
function handleSignupAvatar(input) {
  const file = input?.files?.[0]
  if (!file) return

  const url = URL.createObjectURL(file)
  const img = $('signup-av-preview')

  if (img) {
    img.src = url
    img.classList.add('loaded')
    if (img.previousElementSibling) img.previousElementSibling.style.display = 'none'
  }
}

function togglePassword(inputId, btnId) {
  const input = $(inputId)
  const btn = $(btnId)

  if (!input || !btn) return

  if (input.type === 'password') {
    input.type = 'text'
    btn.textContent = '🙈'
  } else {
    input.type = 'password'
    btn.textContent = '👁'
  }
}

function checkPasswordMatch() {
  const p1 = $('signup-password')?.value || ''
  const p2 = $('signup-confirm')?.value || ''
  const err = $('password-match-error')

  if (!err) return

  if (p2.length > 0 && p1 !== p2) {
    err.classList.add('show')
  } else {
    err.classList.remove('show')
  }
}

// ── ENTER APP ───────────────────────────────────────────────
function enterApp() {
  const u = state.currentUser

  safeText('sidebar-name', u.name)
  safeText('sidebar-handle', '@' + u.username)
  safeText('sidebar-av', u.initials)

  const sidebarAv = $('sidebar-av')
  if (sidebarAv && u.avatar) {
    sidebarAv.innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;" />'
  }

  safeText('composer-av', u.initials)

  const composerAv = $('composer-av')
  if (composerAv && u.avatar) {
    composerAv.innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
  }

  showScreen('app')

  if ($('feed-list')) renderFeed()
  if ($('suggested-list')) renderSuggested()

  loadUserData()
}

// ── POST TYPE ───────────────────────────────────────────────
function setPostType(type, btn) {
  state.postType = type

  document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('active'))
  if (btn) btn.classList.add('active')

  const ta = $('compose-text')
  if (ta) {
    ta.placeholder = type === 'signal'
      ? 'Share a signal — a thought, quote, or insight…'
      : 'Write a post…'
  }

  safeText('post-btn', type === 'signal' ? 'Send signal' : 'Publish')
}

function updateCharCount(ta) {
  if (!ta) return

  const remaining = 280 - ta.value.length
  const cc = $('char-count')
  const postBtn = $('post-btn')

  if (cc) {
    cc.textContent = remaining
    cc.style.color = remaining < 30 ? '#c0392b' : 'var(--g400)'
  }

  if (postBtn) postBtn.disabled = ta.value.trim().length === 0
}

// ── FEED ────────────────────────────────────────────────────
function renderFeed() {
  const list = $('feed-list')
  if (!list) return

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
  `).join('')
}

function submitPost() {
  const text = $('compose-text')?.value?.trim()
  if (!text) return

  const u = state.currentUser

  const newPost = {
    id: 'f_' + Date.now(),
    uid: 'u_me',
    name: u.name,
    handle: '@' + u.username,
    initials: u.initials,
    color: '#C07850',
    type: state.postType,
    time: 'just now',
    body: text,
    liked: false,
    likes: 0,
    shares: 0,
    saved: false
  }

  state.feed.unshift(newPost)

  const compose = $('compose-text')
  if (compose) compose.value = ''

  safeText('char-count', '280')

  const postBtn = $('post-btn')
  if (postBtn) postBtn.disabled = true

  renderFeed()
  showToast(state.postType === 'signal' ? 'Signal posted ⚡' : 'Post published ✓')
}

function toggleLike(id) {
  const p = state.feed.find(f => f.id === id)
  if (!p) return

  p.liked = !p.liked
  p.likes += p.liked ? 1 : -1

  const btn = $('like-' + id)
  if (!btn) return

  btn.className = 'sc-action' + (p.liked ? ' liked' : '')
  btn.textContent = (p.liked ? '♥' : '♡') + ' ' + p.likes
}

function toggleSave(id) {
  const p = state.feed.find(f => f.id === id)
  if (!p) return

  p.saved = !p.saved

  const btn = $('save-' + id)
  if (btn) {
    btn.className = 'sc-action' + (p.saved ? ' saved' : '')
    btn.textContent = (p.saved ? '🔒' : '🔓') + ' ' + (p.saved ? 'Saved' : 'Save')
  }

  if (p.saved) {
    state.vault.unshift({
      id: 'v_' + Date.now(),
      type: p.type === 'signal' ? 'Signal' : 'Post',
      title: p.body.slice(0, 60) + '…',
      date: 'Today'
    })
  }

  showToast(p.saved ? 'Saved to vault 🔒' : 'Removed from vault')
}

function handleShare(id) {
  const p = state.feed.find(f => f.id === id)
  if (!p) return

  p.shares++

  const btn = document.querySelector(`#card-${id} .sc-actions button:nth-child(2)`)
  if (btn) btn.textContent = '↗ ' + p.shares

  showToast('Link copied ✓')
}

// ── SUGGESTED ───────────────────────────────────────────────
function renderSuggested() {
  const list = $('suggested-list')
  if (!list) return

  list.innerHTML = state.suggested.slice(0, 4).map(u => `
    <div class="sug-row">
      <div class="sug-av" style="background:${u.color}22;color:${u.color};" onclick="viewProfile('${u.id}')">${u.initials}</div>
      <div style="flex:1;min-width:0;cursor:pointer;" onclick="viewProfile('${u.id}')">
        <div class="sug-name">${u.name}</div>
        <div class="sug-handle">${u.handle}</div>
      </div>
      <button class="sug-follow ${state.following[u.id] ? 'following' : ''}" onclick="toggleFollow('${u.id}',this)">${state.following[u.id] ? '✓' : 'Follow'}</button>
    </div>
  `).join('')
}

function toggleFollow(id, btn) {
  state.following[id] = !state.following[id]

  if (!btn) return

  btn.className = 'sug-follow' + (state.following[id] ? ' following' : '')
  btn.textContent = state.following[id] ? '✓' : 'Follow'
}

// ── PROFILE ─────────────────────────────────────────────────
function renderOwnProfile() {
  const u = state.currentUser
  const el = $('own-profile-content')
  if (!el) return

  el.innerHTML = profileHTML(u, true)
  activateProfileTabs(el, u, true)
}

function viewProfile(uid) {
  const u = uid === 'u_me'
    ? state.currentUser
    : state.suggested.find(s => s.id === uid)

  if (!u) return

  const fullU = uid === 'u_me'
    ? state.currentUser
    : { ...u, following: 148, followers: 1200, signals: 44, links: [] }

  document.querySelectorAll('.tab-content').forEach(t => {
    t.style.display = 'none'
  })

  const tab = $('tab-viewprofile')
  if (!tab) return

  tab.style.display = 'block'

  const content = tab.querySelector('#view-profile-content')
  if (content) {
    content.innerHTML = profileHTML(fullU, uid === 'u_me')
    activateProfileTabs(content, fullU, uid === 'u_me')
  }

  document.querySelectorAll('.s-nav-item').forEach(b => b.classList.remove('active'))
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
  `
}

function switchProfileTab(name, btn) {
  const parent = btn?.closest('.main-wide')
  if (!parent) return

  parent.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'))
  btn.classList.add('active')

  parent.querySelectorAll('.p-tab-content').forEach(t => {
    t.style.display = 'none'
  })

  const tab = parent.querySelector('#ptab-' + name)
  if (tab) tab.style.display = 'block'
}

function activateProfileTabs(el, u, isOwn) {}

function toggleProfileFollow(btn) {
  if (!btn) return

  const isFollowing = btn.classList.contains('following')

  btn.classList.toggle('following', !isFollowing)
  btn.classList.toggle('primary', isFollowing)
  btn.textContent = isFollowing ? 'Follow' : 'Following ✓'
}

// ── VAULT ───────────────────────────────────────────────────
function renderVault() {
  const grid = $('vault-grid')
  if (!grid) return

  const items = state.vaultFilter === 'All'
    ? state.vault
    : state.vault.filter(v => v.type === state.vaultFilter)

  grid.innerHTML = items.map(v => `
    <div class="vault-card">
      <div class="vault-type">${v.type}</div>
      <div class="vault-title">${v.title}</div>
      <div class="vault-date">${v.date}</div>
    </div>
  `).join('')
}

function filterVault(f, btn) {
  state.vaultFilter = f

  document.querySelectorAll('#vault-filters .type-pill').forEach(p => p.classList.remove('active'))
  if (btn) btn.classList.add('active')

  renderVault()
}

// ── LINK IN BIO ─────────────────────────────────────────────
function renderLibLinks() {
  const u = state.currentUser

  safeText('lib-name', u.name)
  safeText('lib-bio', u.bio)

  const av = $('lib-av')
  if (av) {
    if (u.avatar) {
      av.innerHTML = '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
    } else {
      av.textContent = u.initials
    }
  }

  const list = $('lib-links-list')
  if (list) {
    list.innerHTML = u.links.map((l) => `
      <div class="lib-link-item">
        <span style="font-size:15px;">${l.icon}</span>
        <span style="flex:1;margin-left:9px;">${l.label}</span>
        <span style="font-size:13px;color:var(--g400);">→</span>
      </div>
    `).join('')
  }

  renderLibEditLinks()
}

function renderLibEditLinks() {
  const edit = $('lib-edit-links')
  if (!edit) return

  edit.innerHTML = state.currentUser.links.map((l, i) => `
    <div style="display:flex;gap:7px;margin-bottom:8px;">
      <input class="form-input" style="flex:1;" value="${l.label}" onchange="state.currentUser.links[${i}].label=this.value;renderLibLinks();" />
      <button onclick="state.currentUser.links.splice(${i},1);renderLibLinks();" style="background:none;border:none;cursor:pointer;font-size:17px;color:var(--g400);padding:0 4px;">×</button>
    </div>
  `).join('')
}

let libEditing = false

function toggleLibEdit() {
  libEditing = !libEditing

  safeDisplay('lib-edit-panel', libEditing ? 'block' : 'none')
  safeText('lib-edit-btn', libEditing ? 'Done' : 'Edit links')
}

function addLibLink() {
  const input = $('lib-new-label')
  if (!input || !input.value.trim()) return

  state.currentUser.links.push({
    label: input.value.trim(),
    icon: '🔗'
  })

  input.value = ''
  renderLibLinks()
}

// ── EXPLORE ─────────────────────────────────────────────────
function renderExplore(query = '') {
  const list = $('explore-list')
  if (!list) return

  const results = query
    ? state.suggested.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.handle.includes(query.toLowerCase())
      )
    : state.suggested

  list.innerHTML = results.map(u => `
    <div class="ex-row">
      <div style="width:44px;height:44px;border-radius:50%;background:${u.color}22;color:${u.color};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;cursor:pointer;flex-shrink:0;" onclick="viewProfile('${u.id}')">${u.initials}</div>
      <div style="flex:1;min-width:0;cursor:pointer;" onclick="viewProfile('${u.id}')">
        <div style="font-size:14.5px;font-weight:600;color:var(--black);">${u.name}</div>
        <div style="font-size:13px;color:var(--g400);">${u.handle}</div>
        <div style="font-size:13px;color:var(--g600);margin-top:2px;font-weight:300;">${u.bio}</div>
      </div>
      <button class="follow-btn ${state.following[u.id] ? 'following' : ''}" onclick="toggleFollowExplore('${u.id}',this)">${state.following[u.id] ? 'Following ✓' : 'Follow'}</button>
    </div>
  `).join('')
}

function filterExplore(q) {
  renderExplore(q)
}

function toggleFollowExplore(id, btn) {
  state.following[id] = !state.following[id]

  if (!btn) return

  btn.className = 'follow-btn' + (state.following[id] ? ' following' : '')
  btn.textContent = state.following[id] ? 'Following ✓' : 'Follow'
}

// ── SETTINGS ────────────────────────────────────────────────
function handleSettingsAvatar(input) {
  const file = input?.files?.[0]
  if (!file) return

  const url = URL.createObjectURL(file)
  state.currentUser.avatar = url

  const img = $('settings-av-img')
  if (img) {
    img.src = url
    img.classList.add('loaded')
  }

  safeDisplay('settings-av-initials', 'none')
  safeDisplay('remove-av-btn', 'inline-flex')
}

function removeAvatar() {
  state.currentUser.avatar = null

  const img = $('settings-av-img')
  if (img) {
    img.src = ''
    img.classList.remove('loaded')
  }

  safeDisplay('settings-av-initials', 'block')
  safeDisplay('remove-av-btn', 'none')
}

function saveSettings() {
  const name = $('settings-name')
  const username = $('settings-username')
  const bio = $('settings-bio')

  if (name) state.currentUser.name = name.value
  if (username) state.currentUser.username = username.value
  if (bio) state.currentUser.bio = bio.value

  safeText('sidebar-name', state.currentUser.name)
  safeText('sidebar-handle', '@' + state.currentUser.username)

  showToast('Profile saved ✓')
}

// ── CLICK OUTSIDE SWITCHER ───────────────────────────────────
document.addEventListener('click', function (e) {
  const switcher = $('profile-switcher')

  if (!switcher) return

  if (
    switcher.classList.contains('open') &&
    !switcher.contains(e.target) &&
    !e.target.closest('.s-profile-btn')
  ) {
    switcher.classList.remove('open')
  }
})

// ── AUTO-LOGIN FROM URL PARAM ────────────────────────────────
;(function () {
  const urlParams = new URLSearchParams(window.location.search)
  const userParam = urlParams.get('user')

  if (userParam) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam))
      localStorage.setItem('user', JSON.stringify(user))
      state.currentUser = _normalizeCurrentUser(user)
      enterApp()
      window.history.replaceState({}, '', '/')
    } catch (e) {
      console.error('Failed to parse user from URL:', e)
    }
  } else {
    const stored = localStorage.getItem('user')

    if (stored) {
      try {
        const user = JSON.parse(stored)
        state.currentUser = _normalizeCurrentUser(user)
        enterApp()
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }
})()

// ── EXPOSE FUNCTIONS FOR OLD INLINE HTML HANDLERS ────────────
window.showToast = showToast
window.openModal = openModal
window.closeModal = closeModal
window.showScreen = showScreen
window.switchTab = switchTab
window.toggleSwitcher = toggleSwitcher
window.switchProfile = switchProfile
window.signOut = signOut
window.handleSignupAvatar = handleSignupAvatar
window.togglePassword = togglePassword
window.checkPasswordMatch = checkPasswordMatch
window.enterApp = enterApp
window.setPostType = setPostType
window.updateCharCount = updateCharCount
window.submitPost = submitPost
window.toggleLike = toggleLike
window.toggleSave = toggleSave
window.handleShare = handleShare
window.toggleFollow = toggleFollow
window.viewProfile = viewProfile
window.switchProfileTab = switchProfileTab
window.toggleProfileFollow = toggleProfileFollow
window.filterVault = filterVault
window.toggleLibEdit = toggleLibEdit
window.addLibLink = addLibLink
window.filterExplore = filterExplore
window.toggleFollowExplore = toggleFollowExplore
window.handleSettingsAvatar = handleSettingsAvatar
window.removeAvatar = removeAvatar
window.saveSettings = saveSettings