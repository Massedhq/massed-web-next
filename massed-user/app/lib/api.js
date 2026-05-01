// ═══════════════════════════════════════════════════════════════════════════
// MASSED API LAYER — connects every feature to the real backend
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://www.massed.io/api'

// ── Core fetch wrapper ────────────────────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }
  if (body && method !== 'GET') opts.body = JSON.stringify(body)
  try {
    const res = await fetch(API_BASE + path, opts)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  } catch (err) {
    console.error('API error:', path, err.message)
    throw err
  }
}

// ── AUTH ──────────────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  return await api('POST', '/auth/login', { email, password })
}

export async function apiLogout() {
  return await api('DELETE', '/auth/me')
}

export async function apiGetMe() {
  try {
    return await api('GET', '/auth/me')
  } catch (e) {
    return null
  }
}

// ── PROFILE ───────────────────────────────────────────────────────────────
export async function apiSaveProfile(data) {
  return await api('PUT', '/profile', data)
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────
export async function apiGetProducts(type) {
  return await api('GET', '/products' + (type ? '?type=' + type : ''))
}
export async function apiCreateProduct(data) {
  return await api('POST', '/products', data)
}
export async function apiUpdateProduct(id, data) {
  return await api('PUT', '/products/' + id, data)
}
export async function apiDeleteProduct(id) {
  return await api('DELETE', '/products/' + id)
}
export async function apiToggleProductVisibility(id, visible) {
  return await api('PATCH', '/products/' + id, { visible })
}

// ── WEB LINKS ─────────────────────────────────────────────────────────────
export async function apiGetWebLinks() {
  return await api('GET', '/weblinks')
}
export async function apiCreateWebLink(data) {
  return await api('POST', '/weblinks', data)
}
export async function apiUpdateWebLink(id, data) {
  return await api('PUT', '/weblinks/' + id, data)
}
export async function apiDeleteWebLink(id) {
  return await api('DELETE', '/weblinks/' + id)
}

// ── LISTINGS ──────────────────────────────────────────────────────────────
export async function apiGetListings(category) {
  return await api('GET', '/listings' + (category && category !== 'all' ? '?category=' + category : ''))
}
export async function apiCreateListing(data) {
  return await api('POST', '/listings', data)
}
export async function apiUpdateListing(id, data) {
  return await api('PUT', '/listings/' + id, data)
}
export async function apiDeleteListing(id) {
  return await api('DELETE', '/listings/' + id)
}

// ── BOOKINGS ──────────────────────────────────────────────────────────────
export async function apiGetBookings() {
  return await api('GET', '/bookings')
}
export async function apiCreateService(data) {
  return await api('POST', '/bookings', data)
}
export async function apiUpdateBooking(id, data) {
  return await api('PATCH', '/bookings/' + id, data)
}
export async function apiDeleteBooking(id) {
  return await api('DELETE', '/bookings/' + id)
}

// ── EVENTS ────────────────────────────────────────────────────────────────
export async function apiGetEvents() {
  return await api('GET', '/events')
}
export async function apiCreateEvent(data) {
  return await api('POST', '/events', data)
}
export async function apiUpdateEvent(id, data) {
  return await api('PUT', '/events/' + id, data)
}
export async function apiDeleteEvent(id) {
  return await api('DELETE', '/events/' + id)
}

// ── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
export async function apiGetSubscriptions() {
  return await api('GET', '/subscriptions')
}

// ── SALES / PAYOUTS ───────────────────────────────────────────────────────
export async function apiGetSalesStats() {
  return await api('GET', '/sales/stats')
}
export async function apiGetTransactions() {
  return await api('GET', '/sales/transactions')
}

// ── MESSAGES ──────────────────────────────────────────────────────────────
export async function apiGetMessages() {
  return await api('GET', '/messages')
}
export async function apiSendMessage(data) {
  return await api('POST', '/messages', data)
}