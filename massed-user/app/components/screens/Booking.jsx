'use client'

import { useState } from 'react'

const defaultServices = [
  { id: 1, name: 'Classic Haircut', price: 45, duration: '1 hour', category: 'Hair', desc: 'Precision cut tailored to your style.', deposit: true, depositAmt: 15, depositType: 'Fixed amount', cover: null, visible: true },
  { id: 2, name: 'Full Set Lashes', price: 120, duration: '2 hours', category: 'Beauty', desc: 'Volume lash set with premium extensions.', deposit: true, depositAmt: 30, depositType: 'Fixed amount', cover: null, visible: true },
  { id: 3, name: 'Deep Tissue Massage', price: 90, duration: '1 hour', category: 'Wellness', desc: '60-minute deep tissue massage.', deposit: false, depositAmt: 0, depositType: 'Fixed amount', cover: null, visible: true },
  { id: 4, name: 'Brand Consultation', price: 150, duration: '1.5 hours', category: 'Consulting', desc: '1-on-1 brand strategy session.', deposit: true, depositAmt: 50, depositType: 'Fixed amount', cover: null, visible: true },
]

const defaultIncoming = [
  { id: 101, client: 'Ava Thompson', email: 'ava@email.com', service: 'Full Set Lashes', date: 'Apr 18, 2026', time: '11:00 AM', deposit: true, depositAmt: 30, depositPaid: true, status: 'confirmed', banned: false },
  { id: 102, client: 'Marcus Lee', email: 'marcus@email.com', service: 'Classic Haircut', date: 'Apr 19, 2026', time: '2:00 PM', deposit: false, depositAmt: 0, depositPaid: false, status: 'pending', banned: false },
  { id: 103, client: 'Jasmine Rivera', email: 'jasmine@email.com', service: 'Deep Tissue Massage', date: 'Apr 20, 2026', time: '10:00 AM', deposit: true, depositAmt: 20, depositPaid: false, status: 'pending', banned: false },
]

const defaultCategories = ['Hair', 'Beauty', 'Wellness', 'Consulting', 'Classes']
const bookingTimes = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

export default function Booking() {
  const [tab, setTab] = useState('services')
  const [services, setServices] = useState(defaultServices)
  const [incoming, setIncoming] = useState(defaultIncoming)
  const [activeCat, setActiveCat] = useState('all')
  const [categories, setCategories] = useState(defaultCategories)
  const [bookingLive, setBookingLive] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  // Add service form state
  const [form, setForm] = useState({ name: '', price: '', duration: '1 hour', category: 'Hair', desc: '', deposit: false, depositAmt: '', depositType: 'Fixed amount' })

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function saveService() {
    if (!form.name.trim()) { showToast('Please enter a service name'); return }
    const svc = {
      id: Date.now(),
      name: form.name,
      price: parseFloat(form.price) || 0,
      duration: form.duration,
      category: form.category,
      desc: form.desc,
      deposit: form.deposit,
      depositAmt: parseFloat(form.depositAmt) || 0,
      depositType: form.depositType,
      cover: null,
      visible: true,
    }
    setServices(prev => [...prev, svc])
    setForm({ name: '', price: '', duration: '1 hour', category: 'Hair', desc: '', deposit: false, depositAmt: '', depositType: 'Fixed amount' })
    setShowAddModal(false)
    showToast('✓ Service added!')
  }

  function toggleVisibility(id) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  function deleteService(id) {
    setServices(prev => prev.filter(s => s.id !== id))
    showToast('Service removed')
  }

  function handleBookingAction(action, b) {
    if (action === 'cancel') {
      setIncoming(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x))
      showToast(`Booking cancelled for ${b.client}`)
    } else if (action === 'delete') {
      setIncoming(prev => prev.filter(x => x.id !== b.id))
      showToast('Booking deleted')
    } else if (action === 'ban') {
      setIncoming(prev => prev.map(x => x.id === b.id ? { ...x, banned: !x.banned } : x))
      showToast(b.banned ? `✓ ${b.client} ban removed` : `⛔ ${b.client} banned from booking`)
    } else {
      showToast(`${action} action coming soon`)
    }
  }

  const filtered = activeCat === 'all' ? services : services.filter(s => s.category === activeCat)

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">Your Booking Services</h2>
          <p className="section-sub">Manage your services and incoming appointments</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + Add Service
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
        {['services', 'incoming', 'reservations'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', background: tab === t ? 'var(--brown)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-dim)', transition: 'all 0.2s', position: 'relative' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'incoming' && (
              <span style={{ marginLeft: '4px', background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem' }}>{incoming.filter(b => b.status !== 'cancelled').length}</span>
            )}
          </button>
        ))}
      </div>

      {/* SERVICES TAB */}
      {tab === 'services' && (
        <div>
          {/* Booking live toggle */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>Booking Page Live</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>Clients can book your services on your MASSED page</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
              <input type="checkbox" checked={bookingLive} onChange={e => { setBookingLive(e.target.checked); showToast(e.target.checked ? '✓ Booking page is live!' : 'Booking page hidden') }} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: bookingLive ? 'var(--brown)' : '#e5e7eb', borderRadius: '26px', transition: '0.2s' }} />
              <span style={{ position: 'absolute', top: '4px', left: bookingLive ? '26px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </label>
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
            {['all', ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: `1.5px solid ${activeCat === cat ? 'var(--brown)' : 'var(--border)'}`, background: activeCat === cat ? 'var(--brown)' : '#fff', color: activeCat === cat ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Services grid */}
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>No services yet</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Add your first bookable service to start accepting appointments.</div>
              <button onClick={() => setShowAddModal(true)} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>+ Add Service</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {filtered.map(svc => (
                <div key={svc.id} className="bk-svc-card">
                  <div style={{ height: '140px', background: 'linear-gradient(135deg, #1a0a00, #3d1800)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>{svc.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{svc.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--brown)' }}>${svc.price.toFixed(2)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>⏱ {svc.duration}</span>
                    </div>
                    {svc.deposit && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: 'var(--brown-bg)', color: 'var(--brown)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700 }}>💳 Deposit: ${svc.depositAmt}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      <button onClick={() => showToast(`Editing ${svc.name}…`)} style={{ padding: '6px 10px', background: 'var(--cream2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>✏️ Edit</button>
                      <button onClick={() => toggleVisibility(svc.id)} style={{ flex: 1, padding: '6px', background: 'none', border: '1px solid var(--border)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, color: svc.visible ? 'var(--brown)' : 'var(--text-dim)' }}>{svc.visible ? 'Visible' : 'Hidden'}</button>
                      <button onClick={() => deleteService(svc.id)} style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INCOMING TAB */}
      {tab === 'incoming' && (
        <div>
          {incoming.filter(b => b.status !== 'deleted').length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>No incoming bookings</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>New bookings will appear here when clients book through your MASSED page.</div>
            </div>
          ) : incoming.filter(b => b.status !== 'deleted').map(b => {
            const statusColor = b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#d97706'
            const statusBg = b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#fef3c7'
            return (
              <div key={b.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{b.client}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.email}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>{b.service}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>📅 {b.date} · {b.time}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                      <span style={{ padding: '2px 8px', background: statusBg, color: statusColor, borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                      {b.deposit && (b.depositPaid
                        ? <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#16a34a', padding: '2px 7px', borderRadius: '7px', fontWeight: 700 }}>Deposit Paid</span>
                        : <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '2px 7px', borderRadius: '7px', fontWeight: 700 }}>Deposit Pending</span>
                      )}
                      {b.banned && <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '2px 7px', borderRadius: '7px', fontWeight: 700 }}>⛔ Banned</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => handleBookingAction('cancel', b)} style={{ padding: '7px 12px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Cancel</button>
                    <button onClick={() => handleBookingAction('ban', b)} style={{ padding: '7px 12px', background: b.banned ? '#dcfce7' : '#fee2e2', color: b.banned ? '#16a34a' : '#dc2626', border: `1px solid ${b.banned ? '#86efac' : '#fecaca'}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>{b.banned ? 'Unban' : '⛔ Ban'}</button>
                    <button onClick={() => handleBookingAction('delete', b)} style={{ padding: '7px 12px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* RESERVATIONS TAB */}
      {tab === 'reservations' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>No reservations yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Reservations created from Events / Tickets will appear here.</div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', margin: 0 }}>Add Service</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-field">
                <label>Service Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Full Set Lashes, Haircut" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field" style={{ margin: 0 }}>
                  <label>Price ($)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="form-field" style={{ margin: 0 }}>
                  <label>Duration</label>
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                    {['30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Description (optional)</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe what's included..." style={{ minHeight: '70px' }} />
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: form.deposit ? '12px' : 0 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Require Deposit</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Client pays deposit to secure their booking</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.deposit} onChange={e => setForm(f => ({ ...f, deposit: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, background: form.deposit ? 'var(--brown)' : '#e5e7eb', borderRadius: '24px', transition: '0.2s' }} />
                    <span style={{ position: 'absolute', top: '3px', left: form.deposit ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </label>
                </div>
                {form.deposit && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Deposit Amount ($)</label>
                      <input type="number" value={form.depositAmt} onChange={e => setForm(f => ({ ...f, depositAmt: e.target.value }))} placeholder="e.g. 25.00" min="0" step="0.01" />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Type</label>
                      <select value={form.depositType} onChange={e => setForm(f => ({ ...f, depositType: e.target.value }))}>
                        <option>Fixed amount</option>
                        <option>% of total</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={saveService} className="btn-save" style={{ flex: 1 }}>Add Service</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>
      )}
    </div>
  )
}