'use client'

import { useState } from 'react'

const initialBanned = [
  { id: 1, name: 'Tyler James', email: 'tyler@email.com', reason: 'No-show x3', date: 'Mar 12, 2026', type: 'booking' },
  { id: 2, name: 'Keisha Brown', email: 'keisha@email.com', reason: 'Repeated cancellations', date: 'Feb 28, 2026', type: 'booking' },
]

export default function BannedBlocked() {
  const [tab, setTab] = useState('banned')
  const [banned, setBanned] = useState(initialBanned)
  const [blocked, setBlocked] = useState([])
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function unban(id) {
    const person = banned.find(b => b.id === id)
    if (!person) return
    if (confirm(`Unban ${person.name}? They will be able to book your services again.`)) {
      setBanned(prev => prev.filter(b => b.id !== id))
      showToast(`✓ ${person.name} has been unbanned`)
    }
  }

  function unblock(id) {
    setBlocked(prev => prev.filter(u => u.id !== id))
    showToast('✓ User has been unblocked')
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Banned / Blocked</h2>
        <p className="section-sub">Manage clients banned from booking and users blocked from messaging</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
        {[
          { id: 'banned', label: '⛔ Banned Clients' },
          { id: 'blocked', label: '🚫 Blocked Users' },
        ].map(t => (
          <button key={t.id} id={`bb-tab-${t.id}`} onClick={() => setTab(t.id)} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--brown)' : 'transparent'}`, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: tab === t.id ? 700 : 600, color: tab === t.id ? 'var(--brown)' : 'var(--text-dim)', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Banned list */}
      {tab === 'banned' && (
        <div id="bb-banned-list">
          {banned.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⛔</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>No banned clients</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Clients banned from booking will appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {banned.map(b => (
                <div key={b.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#dc2626', flexShrink: 0 }}>
                    {b.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{b.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.email}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.68rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>⛔ Banned from Booking</span>
                      {b.reason && <span style={{ fontSize: '0.68rem', background: 'var(--cream)', color: 'var(--text-mid)', padding: '2px 8px', borderRadius: '6px' }}>Reason: {b.reason}</span>}
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Since {b.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => unban(b.id)}
                    style={{ padding: '7px 16px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--brown)'; e.currentTarget.style.color = 'var(--brown)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)' }}
                  >
                    Unban
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blocked list */}
      {tab === 'blocked' && (
        <div id="bb-blocked-list">
          {blocked.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚫</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>No blocked users</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Users you block from Messages will appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blocked.map(u => (
                <div key={u.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#9ca3af', flexShrink: 0 }}>{u.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.handle}</div>
                    <div style={{ marginTop: '5px' }}>
                      <span style={{ fontSize: '0.68rem', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>🚫 Blocked via {u.source}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => unblock(u.id)}
                    style={{ padding: '7px 16px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)', whiteSpace: 'nowrap', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--brown)'; e.currentTarget.style.color = 'var(--brown)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)' }}
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}