'use client'

import { useState } from 'react'

const CAT_EMOJIS = { realestate: '🏠', cars: '🚗', spaces: '🏢', jobs: '💼', experiences: '✨' }
const CTA_LABELS = { contact: 'Contact', apply: 'Apply Now', request: 'Request Info', reserve: 'Reserve Interest', book: 'Book a Viewing', inquire: 'Inquire Now' }

const CATEGORIES = [
  { val: 'realestate', label: 'Real Estate' },
  { val: 'cars', label: 'Cars' },
  { val: 'spaces', label: 'Spaces' },
  { val: 'jobs', label: 'Jobs' },
  { val: 'experiences', label: 'Experiences' },
]

const TABS = ['all', 'realestate', 'cars', 'spaces', 'jobs', 'experiences', 'refunds']

function emptyForm() {
  return { title: '', cat: '', cta: 'contact', price: '', contactPrice: false, location: '', desc: '', photo: null, beds: '', baths: '', sqft: '', year: '', make: '', mileage: '', pay: '', worktype: '' }
}

export default function Listings() {
  const [tab, setTab] = useState('all')
  const [listings, setListings] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [showPreview, setShowPreview] = useState(null)
  const [showInquiry, setShowInquiry] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [editForm, setEditForm] = useState(null)
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [inquirySent, setInquirySent] = useState(false)
  const [payLinkTo, setPayLinkTo] = useState('')
  const [payLinkAmt, setPayLinkAmt] = useState('')
  const [depositTo, setDepositTo] = useState('')
  const [depositAmt, setDepositAmt] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function publish() {
    if (!form.title.trim()) { showToast('Please enter a listing title'); return }
    if (!form.cat) { showToast('Please select a category'); return }
    if (!form.location.trim()) { showToast('Please enter a location'); return }
    if (!form.desc.trim()) { showToast('Please enter a description'); return }
    const catLabel = CATEGORIES.find(c => c.val === form.cat)?.label || form.cat
    setListings(prev => [...prev, { ...form, id: Date.now(), catLabel, hidden: false }])
    setForm(emptyForm())
    setShowAdd(false)
    showToast(`✓ Listing "${form.title}" published!`)
  }

  function saveEdit() {
    setListings(prev => prev.map(l => l.id === editForm.id ? { ...editForm } : l))
    setShowEdit(null)
    showToast('✓ Listing updated!')
  }

  function deleteListing(id) {
    setListings(prev => prev.filter(l => l.id !== id))
    showToast('Listing deleted')
  }

  function toggleHide(id) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, hidden: !l.hidden } : l))
    const l = listings.find(x => x.id === id)
    showToast(l?.hidden ? 'Listing is now visible' : 'Listing hidden from public')
  }

  function submitInquiry() {
    if (!inquiryForm.name.trim()) { showToast('Please enter your name'); return }
    if (!inquiryForm.email.trim()) { showToast('Please enter your email'); return }
    setPayLinkTo(inquiryForm.email)
    setDepositTo(inquiryForm.email)
    setInquirySent(true)
  }

  function sendPayLink() {
    if (!payLinkTo || !payLinkAmt) { showToast('Enter amount and recipient'); return }
    showToast(`💳 Payment link for $${parseFloat(payLinkAmt).toFixed(2)} sent to ${payLinkTo}`)
  }

  function sendDepositLink() {
    if (!depositTo || !depositAmt) { showToast('Enter amount and recipient'); return }
    showToast(`🔒 Deposit link for $${parseFloat(depositAmt).toFixed(2)} sent to ${depositTo}`)
  }

  const filtered = tab === 'all' || tab === 'refunds' ? listings : listings.filter(l => l.cat === tab)

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">Listings</h2>
          <p className="section-sub">Post listings for real estate, cars, jobs, spaces, and experiences</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '12px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + Add Listing
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', overflowX: 'auto', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem', background: tab === t ? 'var(--brown)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-dim)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {t === 'all' ? 'All' : t === 'realestate' ? '🏠 Real Estate' : t === 'cars' ? '🚗 Cars' : t === 'spaces' ? '🏢 Spaces' : t === 'jobs' ? '💼 Jobs' : t === 'experiences' ? '✨ Experiences' : '🔄 Refunds'}
          </button>
        ))}
      </div>

      {/* REFUNDS TAB */}
      {tab === 'refunds' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔄</div>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>No refund requests</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Refund requests from buyers will appear here.</div>
        </div>
      )}

      {/* LISTINGS GRID */}
      {tab !== 'refunds' && (
        filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>No listings yet</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Add your first listing to get started.</div>
            <button onClick={() => setShowAdd(true)} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>+ Add Listing</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(l => (
              <div key={l.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', opacity: l.hidden ? 0.5 : 1, transition: 'box-shadow 0.2s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(44,26,14,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Cover image */}
                <div style={{ height: '175px', background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {l.photo
                    ? <img src={l.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '3rem' }}>{CAT_EMOJIS[l.cat] || '📋'}</span>
                  }
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(44,26,14,0.7)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 9px', borderRadius: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {CAT_EMOJIS[l.cat] || ''} {l.catLabel}
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', lineHeight: 1.3 }}>{l.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>📍 {l.location}</div>
                  <div style={{ marginBottom: '10px' }}>
                    {l.contactPrice
                      ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brown)', background: 'var(--brown-bg)', padding: '3px 9px', borderRadius: '12px' }}>Contact for price</span>
                      : <span style={{ fontWeight: 800, color: 'var(--brown)', fontSize: '1rem' }}>{l.price}</span>
                    }
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.desc}</div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                    <button onClick={() => { setShowInquiry(l); setInquirySent(false); setInquiryForm({ name: '', email: '', phone: '', message: '' }) }} style={{ flex: 1, padding: '9px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                      {CTA_LABELS[l.cta] || 'Contact'}
                    </button>
                    <button onClick={() => setShowPreview(l)} style={{ padding: '9px 12px', background: 'var(--brown-bg)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontSize: '0.85rem' }} title="Preview">👁</button>
                    <button onClick={() => toggleHide(l.id)} style={{ padding: '9px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)' }}>{l.hidden ? '🚫 Hidden' : '👁 Visible'}</button>
                    <button onClick={() => { setEditForm({ ...l }); setShowEdit(true) }} style={{ padding: '9px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontSize: '0.85rem' }} title="Edit">✏️</button>
                    <button onClick={() => deleteListing(l.id)} style={{ padding: '9px 12px', background: '#fee2e2', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '0.85rem' }} title="Delete">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ADD LISTING MODAL */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add Listing" maxWidth={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-field">
              <label>Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 3BR House in Atlanta" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-field" style={{ margin: 0 }}>
                <label>Category *</label>
                <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c.val} value={c.val}>{CAT_EMOJIS[c.val]} {c.label}</option>)}
                </select>
              </div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>CTA Button</label>
                <select value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))}>
                  {Object.entries(CTA_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Location *</label>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State or Address" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="form-field" style={{ flex: 1, margin: 0 }}>
                <label>Price</label>
                <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$0,000" disabled={form.contactPrice} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)', cursor: 'pointer', marginTop: '16px', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={form.contactPrice} onChange={e => setForm(f => ({ ...f, contactPrice: e.target.checked }))} style={{ accentColor: 'var(--brown)' }} />
                Contact for price
              </label>
            </div>

            {/* Category-specific fields */}
            {form.cat === 'realestate' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Beds</label><input type="number" value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} placeholder="3" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Baths</label><input type="number" value={form.baths} onChange={e => setForm(f => ({ ...f, baths: e.target.value }))} placeholder="2" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Sq Ft</label><input type="text" value={form.sqft} onChange={e => setForm(f => ({ ...f, sqft: e.target.value }))} placeholder="1,500" /></div>
              </div>
            )}
            {form.cat === 'cars' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Year</label><input type="text" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2020" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Make/Model</label><input type="text" value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} placeholder="Toyota Camry" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Mileage</label><input type="text" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))} placeholder="45,000 mi" /></div>
              </div>
            )}
            {form.cat === 'jobs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Pay</label><input type="text" value={form.pay} onChange={e => setForm(f => ({ ...f, pay: e.target.value }))} placeholder="$25/hr" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Work Type</label><select value={form.worktype} onChange={e => setForm(f => ({ ...f, worktype: e.target.value }))}><option value="">Select</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option><option>Hybrid</option></select></div>
              </div>
            )}

            <div className="form-field">
              <label>Description *</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe your listing…" style={{ minHeight: '80px' }} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Cover Photo</label>
              <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = ev => setForm(f => ({ ...f, photo: ev.target.result })); r.readAsDataURL(file) }} style={{ padding: '8px 0' }} />
              {form.photo && <img src={form.photo} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setShowAdd(false)} className="btn-cancel">Cancel</button>
            <button onClick={publish} className="btn-confirm">Publish Listing</button>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && editForm && (
        <Modal onClose={() => setShowEdit(null)} title="Edit Listing" maxWidth={500}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-field"><label>Title</label><input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-field"><label>Price</label><input type="text" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} disabled={editForm.contactPrice} /></div>
            <div className="form-field"><label>Location</label><input type="text" value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="form-field"><label>Description</label><textarea value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} style={{ minHeight: '70px' }} /></div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>CTA Button</label>
              <select value={editForm.cta} onChange={e => setEditForm(f => ({ ...f, cta: e.target.value }))}>
                {Object.entries(CTA_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setShowEdit(null)} className="btn-cancel">Cancel</button>
            <button onClick={saveEdit} className="btn-confirm">Save Changes</button>
          </div>
        </Modal>
      )}

      {/* PREVIEW MODAL */}
      {showPreview && (
        <Modal onClose={() => setShowPreview(null)} title="Listing Preview" maxWidth={560}>
          <div>
            <div style={{ height: '220px', background: 'var(--cream2)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {showPreview.photo
                ? <img src={showPreview.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '4rem' }}>{CAT_EMOJIS[showPreview.cat] || '📋'}</span>
              }
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', background: 'var(--brown-bg)', padding: '3px 10px', borderRadius: '10px' }}>{CAT_EMOJIS[showPreview.cat]} {showPreview.catLabel}</span>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', margin: '10px 0 4px' }}>{showPreview.title}</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '10px' }}>📍 {showPreview.location}</div>
            <div style={{ marginBottom: '12px' }}>
              {showPreview.contactPrice
                ? <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brown)', background: 'var(--brown-bg)', padding: '4px 12px', borderRadius: '12px' }}>Contact for price</span>
                : <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>{showPreview.price}</span>
              }
            </div>
            {/* Extra badges */}
            {['beds', 'baths', 'sqft', 'year', 'make', 'mileage', 'pay', 'worktype'].some(k => showPreview[k]) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {showPreview.beds && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>🛏 {showPreview.beds} bed{showPreview.beds > 1 ? 's' : ''}</span>}
                {showPreview.baths && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>🚿 {showPreview.baths} bath{showPreview.baths > 1 ? 's' : ''}</span>}
                {showPreview.sqft && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>📐 {showPreview.sqft} sq ft</span>}
                {showPreview.year && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>📅 {showPreview.year}</span>}
                {showPreview.make && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>🚗 {showPreview.make}</span>}
                {showPreview.mileage && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>🛣 {showPreview.mileage}</span>}
                {showPreview.pay && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>💰 {showPreview.pay}</span>}
                {showPreview.worktype && <span style={{ padding: '5px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>⏱ {showPreview.worktype}</span>}
              </div>
            )}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '20px' }}>{showPreview.desc}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowPreview(null); setEditForm({ ...showPreview }); setShowEdit(true) }} className="btn-cancel">✏️ Edit</button>
              <button onClick={() => { setShowPreview(null); setShowInquiry(showPreview); setInquirySent(false); setInquiryForm({ name: '', email: '', phone: '', message: '' }) }} className="btn-confirm">{CTA_LABELS[showPreview.cta] || 'Contact'}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* INQUIRY MODAL */}
      {showInquiry && (
        <Modal onClose={() => setShowInquiry(null)} title={CTA_LABELS[showInquiry.cta] || 'Contact'} maxWidth={460}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Re: <strong style={{ color: 'var(--text)' }}>{showInquiry.title}</strong></div>

          {!inquirySent ? (
            <>
              <div className="form-field"><label>Your Name *</label><input type="text" value={inquiryForm.name} onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))} placeholder="First & Last Name" /></div>
              <div className="form-field"><label>Email *</label><input type="email" value={inquiryForm.email} onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" /></div>
              <div className="form-field"><label>Phone (optional)</label><input type="tel" value={inquiryForm.phone} onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (000) 000-0000" /></div>
              <div className="form-field" style={{ margin: 0 }}><label>Message (optional)</label><textarea value={inquiryForm.message} onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us more about your interest…" style={{ minHeight: '70px' }} /></div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => setShowInquiry(null)} className="btn-cancel">Cancel</button>
                <button onClick={submitInquiry} className="btn-confirm">Send Inquiry →</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>✓ Inquiry sent!</div>
                <div style={{ fontSize: '0.78rem', color: '#166534' }}>We'll get back to you at {inquiryForm.email}</div>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '12px' }}>Send Payment or Deposit Link</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Send To</label><input type="text" value={payLinkTo} onChange={e => setPayLinkTo(e.target.value)} placeholder="email or phone" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Amount ($)</label><input type="number" value={payLinkAmt} onChange={e => setPayLinkAmt(e.target.value)} placeholder="0.00" min="0" step="0.01" /></div>
              </div>
              <button onClick={sendPayLink} style={{ width: '100%', padding: '10px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, marginBottom: '10px' }}>💳 Send Payment Link</button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Deposit To</label><input type="text" value={depositTo} onChange={e => setDepositTo(e.target.value)} placeholder="email or phone" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Deposit ($)</label><input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="0.00" min="0" step="0.01" /></div>
              </div>
              <button onClick={sendDepositLink} style={{ width: '100%', padding: '10px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, color: 'var(--text-mid)' }}>🔒 Send Deposit Link</button>
              <button onClick={() => setShowInquiry(null)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: 'var(--text-dim)', marginTop: '8px' }}>Close</button>
            </>
          )}
        </Modal>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}

function Modal({ children, onClose, title, maxWidth = 500 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}