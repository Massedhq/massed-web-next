'use client'

import { useState } from 'react'

const initialPosts = [
  { id: 1, text: '💡 Tip: The best time to post Reels is between 6–9 AM and 7–10 PM. Consistency is more important than perfection. Show up daily and watch your engagement grow.', time: '2 hours ago', sparks: 247, lit: false, comments: [{ user: '@maya_j', text: 'This is so helpful! Thank you 🙏' }, { user: '@jones_r', text: 'Been doing this for a week and already seeing results!' }], shared: 34 },
  { id: 2, text: '🌱 Knowledge drop: Astrological compatibility isn\'t just about sun signs — your Venus sign determines how you give and receive love. What\'s your Venus sign? Drop it below 👇', time: 'Yesterday', sparks: 521, lit: false, comments: [{ user: '@sarah_k', text: 'Venus in Scorpio here! 🦂' }, { user: '@beauty.brand', text: 'Venus in Libra! Makes so much sense now' }], shared: 89 },
]

export default function SwitchProfile({ user }) {
  const [tab, setTab] = useState('posts')
  const [posts, setPosts] = useState(initialPosts)
  const [openComments, setOpenComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [newPostText, setNewPostText] = useState('')
  const [toast, setToast] = useState('')
  const [vaultItems, setVaultItems] = useState([])
  const [vaultTab, setVaultTab] = useState('all')
  const [vaultTitle, setVaultTitle] = useState('')
  const [vaultNotes, setVaultNotes] = useState('')
  const [vaultCat, setVaultCat] = useState('all')

  const name = user?.full_name || user?.name || 'Avy Adore'
  const username = user?.username || 'avyadore'
  const initial = name.charAt(0).toUpperCase()
  const totalSparks = posts.reduce((s, p) => s + p.sparks, 0)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function lightIt(id) {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, lit: !p.lit, sparks: p.lit ? p.sparks - 1 : p.sparks + 1 }
      : p
    ))
    const p = posts.find(x => x.id === id)
    if (!p?.lit) showToast('💡 You lit this post!')
  }

  function sharePost(id) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, shared: p.shared + 1 } : p))
    showToast('🔗 Signal link copied!')
  }

  function addComment(id) {
    const text = commentInputs[id]?.trim()
    if (!text) return
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, comments: [...p.comments, { user: '@you', text }] }
      : p
    ))
    setCommentInputs(prev => ({ ...prev, [id]: '' }))
  }

  function createPost() {
    if (!newPostText.trim()) return
    setPosts(prev => [{ id: Date.now(), text: newPostText.trim(), time: 'Just now', sparks: 0, lit: false, comments: [], shared: 0 }, ...prev])
    setNewPostText('')
    showToast('✓ Signal posted!')
  }

  const TABS = [
    { id: 'posts', label: 'Posts' },
    { id: 'about', label: 'About' },
    { id: 'store', label: 'Store' },
    { id: 'media', label: 'Media' },
    { id: 'signals', label: 'Shared Signals' },
    { id: 'vault', label: 'My Vault' },
    { id: 'messages', label: 'Messages' },
  ]

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#1a0d00', minHeight: 'calc(100vh - 60px)', margin: '-32px', color: '#fff' }}>

      {/* Profile header */}
      <div style={{ position: 'relative' }}>
        {/* Banner */}
        <div style={{ height: '120px', background: 'linear-gradient(135deg, #2d1500, #1a0a00)' }} />
        {/* Avatar */}
        <div style={{ position: 'absolute', bottom: '-30px', left: '24px', width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: '#fff', fontWeight: 700, border: '3px solid #1a0d00' }}>
          {initial}
        </div>
      </div>

      {/* Name row */}
      <div style={{ padding: '40px 24px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#fff', marginBottom: '2px' }}>{name}</div>
          <div style={{ fontSize: '0.78rem', color: '#D4956E' }}>massed.io/{username}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>Follow</button>
          <button style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>Message</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 24px 16px' }}>
        {[['1.2K', 'Followers'], [totalSparks.toLocaleString(), 'Sparks'], ['4.9 ★', 'Rating']].map(([val, label]) => (
          <div key={label}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#D4956E' }}>{val}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto', padding: '0 24px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#D4956E' : 'transparent'}`, color: tab === t.id ? '#D4956E' : 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: tab === t.id ? 700 : 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px 24px' }}>

        {/* POSTS TAB */}
        {tab === 'posts' && (
          <div style={{ maxWidth: '640px' }}>
            {/* Composer */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <textarea
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                placeholder="Share a signal with your audience…"
                rows={3}
                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: '#fff', resize: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={createPost} disabled={!newPostText.trim()} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', color: '#fff', border: 'none', borderRadius: '20px', cursor: newPostText.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', opacity: newPostText.trim() ? 1 : 0.5 }}>
                  Post Signal
                </button>
              </div>
            </div>

            {/* Feed */}
            {posts.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                No Signals yet. Create your first Signal above!
              </div>
            ) : posts.map(post => (
              <div key={post.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>{initial}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{post.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, margin: '0 0 14px' }}>{post.text}</p>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                  <button onClick={() => lightIt(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: post.lit ? '#f59e0b' : 'rgba(255,255,255,0.5)', fontWeight: 600, padding: '6px 10px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{post.lit ? '💡' : '🔦'}</span> {post.sparks} Light it
                  </button>
                  <button onClick={() => setOpenComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, padding: '6px 10px', borderRadius: '8px' }}>
                    💬 {post.comments.length} Comments
                  </button>
                  <button onClick={() => sharePost(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, padding: '6px 10px', borderRadius: '8px' }}>
                    🔗 {post.shared} Shared
                  </button>
                  <button onClick={() => showToast('Added to vault!')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, padding: '6px 10px', borderRadius: '8px', marginLeft: 'auto' }}>
                    🔒 Vault
                  </button>
                </div>

                {/* Comments */}
                {openComments[post.id] && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                    {post.comments.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,149,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#D4956E', flexShrink: 0 }}>{c.user.slice(1, 3).toUpperCase()}</div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 12px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D4956E', marginBottom: '2px' }}>{c.user}</div>
                          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{c.text}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input value={commentInputs[post.id] || ''} onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addComment(post.id)} placeholder="Add a comment…" style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#fff', outline: 'none' }} />
                      <button onClick={() => addComment(post.id)} style={{ padding: '8px 14px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>Post</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ABOUT TAB */}
        {tab === 'about' && (
          <div style={{ maxWidth: '480px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4956E', marginBottom: '12px' }}>About</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                Beauty · Wellness · Real Estate & More. Sign up to get updates directly from me.
              </div>
            </div>
          </div>
        )}

        {/* VAULT TAB */}
        {tab === 'vault' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            {/* Save to Vault form */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '12px' }}>Save to Vault</div>
              <input
                value={vaultTitle}
                onChange={e => setVaultTitle(e.target.value)}
                placeholder="Title or name…"
                style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <textarea
                value={vaultNotes}
                onChange={e => setVaultNotes(e.target.value)}
                placeholder="Notes, details, or description…"
                rows={3}
                style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: 'var(--text)', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={vaultCat}
                  onChange={e => setVaultCat(e.target.value)}
                  style={{ flex: 1, padding: '11px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: 'var(--text)', outline: 'none' }}
                >
                  <option value="all">All</option>
                  <option value="services">Services</option>
                  <option value="products">Products</option>
                  <option value="listings">Listings</option>
                  <option value="people">People</option>
                  <option value="opportunities">Opportunities</option>
                </select>
                <button
                  onClick={() => {
                    if (!vaultTitle.trim()) { showToast('Please enter a title to save'); return }
                    setVaultItems(prev => [{ id: Date.now(), title: vaultTitle.trim(), notes: vaultNotes.trim(), category: vaultCat, time: 'Just now' }, ...prev])
                    setVaultTitle(''); setVaultNotes(''); setVaultCat('all')
                    showToast('🔒 Saved to Vault!')
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}
                >
                  🔒 Save to Vault
                </button>
              </div>
            </div>

            {/* Category filter tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[['all','All'],['services','Services'],['products','Products'],['listings','Listings'],['people','People'],['opportunities','Opportunities']].map(([c, label]) => (
                <button
                  key={c}
                  onClick={() => setVaultTab(c)}
                  style={{ padding: '6px 16px', background: vaultTab === c ? 'var(--brown)' : '#fff', color: vaultTab === c ? '#fff' : 'var(--text-mid)', border: `1px solid ${vaultTab === c ? 'var(--brown)' : 'var(--border)'}`, borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: vaultTab === c ? 700 : 600, fontSize: '0.82rem', transition: 'all 0.15s' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Vault entries */}
            {(() => {
              const catIcons = { all:'📁', services:'🛠️', products:'📦', listings:'📋', people:'👤', opportunities:'⚡' }
              const catLabels = { all:'All', services:'Services', products:'Products', listings:'Listings', people:'People', opportunities:'Opportunities' }
              const filtered = vaultTab === 'all' ? vaultItems : vaultItems.filter(v => v.category === vaultTab)
              if (!filtered.length) return (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px', color: 'var(--text)' }}>Your vault is empty</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Save information using the form above or click "Add to Vault" on any Signal.</div>
                </div>
              )
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filtered.map(v => (
                    <div key={v.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--brown-bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{catIcons[v.category] || '📁'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{v.title}</div>
                        {v.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-mid)', marginTop: '3px', lineHeight: 1.5 }}>{v.notes}</div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--brown-bg)', color: 'var(--brown)', padding: '2px 8px', borderRadius: '20px' }}>{catLabels[v.category] || 'All'}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{v.time}</span>
                        </div>
                      </div>
                      <button onClick={() => setVaultItems(prev => prev.filter(x => x.id !== v.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-dim)', flexShrink: 0 }} title="Remove">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}

        {/* Other tabs — coming soon */}
        {['store', 'media', 'messages'].includes(tab) && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tab.charAt(0).toUpperCase() + tab.slice(1)} coming soon</div>
          </div>
        )}
      </div>

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}