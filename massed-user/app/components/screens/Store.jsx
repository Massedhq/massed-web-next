'use client'

import { useState, useRef } from 'react'

const CATEGORIES = ['Clothing', 'Beauty', 'Wellness', 'Electronics', 'Home & Living', 'Food', 'Art', 'Jewelry', 'Books', 'Other']
const DELIVERY_OPTIONS = [
  { val: 'shipped', label: '📦 Shipped' },
  { val: 'meetup', label: '🤝 Meet Up' },
  { val: 'pickup', label: '🏪 Local Pickup' },
  { val: 'delivered', label: '🚗 Delivered' },
]

function emptyPhysical() {
  return { name: '', price: '', desc: '', category: '', inventory: '', lowStock: '5', preorder: false, delivery: 'shipped', deliveryFee: '', affiliate: false, affAmount: '', affType: 'percent', hidden: false, sizes: [], colors: [], variants: [], photos: [] }
}
function emptyDigital() {
  return { name: '', price: '', desc: '', category: '', file: null, fileName: '', hidden: false, variants: [] }
}
function emptyCourse() {
  return { name: '', price: '', desc: '', category: '', video: null, videoName: '', hidden: false }
}

function ProductCard({ prod, type, onPreview, onEdit, onHide, onDelete }) {
  const emoji = type === 'digital' ? '💾' : type === 'courses' ? '🎓' : '📦'
  const inv = prod.inventory
  let stockHTML = null
  if (type === 'physical') {
    if (inv === '' || inv < 0) stockHTML = { color: '#16a34a', label: 'In Stock' }
    else if (inv === 0) stockHTML = prod.preorder ? { color: '#7c3aed', label: 'Pre-Order' } : { color: '#dc2626', label: 'Out of Stock' }
    else if (inv <= (prod.lowStock || 5)) stockHTML = { color: '#d97706', label: `Low Stock (${inv})` }
    else stockHTML = { color: '#16a34a', label: `In Stock (${inv})` }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', opacity: prod.hidden ? 0.6 : 1, transition: 'all 0.2s' }}>
      <div style={{ background: 'var(--cream2)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {prod.photos?.[0] || prod.photo
          ? <img src={prod.photos?.[0] || prod.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '2.5rem' }}>{emoji}</span>
        }
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', flex: 1 }}>
            {prod.name}
            {prod.hidden && <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '2px 7px', borderRadius: '10px', fontWeight: 700, marginLeft: '6px' }}>Hidden</span>}
          </div>
          <div style={{ fontWeight: 800, color: 'var(--brown)', fontSize: '0.95rem', marginLeft: '8px' }}>${prod.price}</div>
        </div>
        {stockHTML && (
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stockHTML.color, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: stockHTML.color, display: 'inline-block' }} />
            {stockHTML.label}
          </div>
        )}
        {prod.sizes?.length > 0 && <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>Sizes: {prod.sizes.join(', ')}</div>}
        {prod.colors?.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            {prod.colors.map(c => <span key={c.name} title={c.name} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.15)' }} />)}
          </div>
        )}
        {prod.variants?.length > 0 && <div style={{ fontSize: '0.68rem', color: 'var(--brown)', marginTop: '3px', fontWeight: 600 }}>{prod.variants.length} variant{prod.variants.length > 1 ? 's' : ''}</div>}
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
          <button onClick={onPreview} style={{ flex: 1, padding: '8px 0', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>👁 Preview</button>
          <button onClick={onEdit} style={{ padding: '8px 10px', background: 'var(--cream2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Edit">✏️</button>
          <button onClick={onHide} style={{ padding: '7px 9px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }} title={prod.hidden ? 'Unhide' : 'Hide'}>
            {prod.hidden
              ? <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--text-mid)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
          <button onClick={onDelete} style={{ padding: '7px 9px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Delete">🗑</button>
        </div>
      </div>
    </div>
  )
}

export default function Store() {
  const [storeTab, setStoreTab] = useState('physical')
  const [products, setProducts] = useState({ physical: [], digital: [], courses: [] })
  const [showModal, setShowModal] = useState(null) // 'physical' | 'digital' | 'course'
  const [editingId, setEditingId] = useState(null)
  const [physForm, setPhysForm] = useState(emptyPhysical())
  const [digForm, setDigForm] = useState(emptyDigital())
  const [courseForm, setCourseForm] = useState(emptyCourse())
  const [previewProd, setPreviewProd] = useState(null)
  const [toast, setToast] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newColorHex, setNewColorHex] = useState('#C07A50')
  const [newColorName, setNewColorName] = useState('')
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // ── Publish ────────────────────────────────────────────
  function publishProduct() {
    const type = showModal
    if (type === 'physical') {
      if (!physForm.name.trim()) { showToast('Please enter a product name'); return }
      if (!physForm.price) { showToast('Please enter a price'); return }
      const prod = { ...physForm, id: editingId || Date.now(), price: parseFloat(physForm.price).toFixed(2) }
      setProducts(prev => ({
        ...prev,
        physical: editingId ? prev.physical.map(p => p.id === editingId ? prod : p) : [...prev.physical, prod]
      }))
      showToast(editingId ? '✓ Product updated!' : `✓ "${physForm.name}" published to your store!`)
      setPhysForm(emptyPhysical())
    } else if (type === 'digital') {
      if (!digForm.name.trim()) { showToast('Please enter a product name'); return }
      if (!digForm.price) { showToast('Please enter a price'); return }
      const prod = { ...digForm, id: editingId || Date.now(), price: parseFloat(digForm.price).toFixed(2) }
      setProducts(prev => ({
        ...prev,
        digital: editingId ? prev.digital.map(p => p.id === editingId ? prod : p) : [...prev.digital, prod]
      }))
      showToast(editingId ? '✓ Product updated!' : `✓ "${digForm.name}" published!`)
      setDigForm(emptyDigital())
    } else if (type === 'course') {
      if (!courseForm.name.trim()) { showToast('Please enter a course name'); return }
      if (!courseForm.price) { showToast('Please enter a price'); return }
      const prod = { ...courseForm, id: editingId || Date.now(), price: parseFloat(courseForm.price).toFixed(2) }
      setProducts(prev => ({
        ...prev,
        courses: editingId ? prev.courses.map(p => p.id === editingId ? prod : p) : [...prev.courses, prod]
      }))
      showToast(editingId ? '✓ Course updated!' : `✓ "${courseForm.name}" published!`)
      setCourseForm(emptyCourse())
    }
    setShowModal(null)
    setEditingId(null)
  }

  function editProduct(id, type) {
    const prod = products[type].find(p => p.id === id)
    if (!prod) return
    setEditingId(id)
    if (type === 'physical') { setPhysForm({ ...emptyPhysical(), ...prod }); setShowModal('physical') }
    else if (type === 'digital') { setDigForm({ ...emptyDigital(), ...prod }); setShowModal('digital') }
    else if (type === 'courses') { setCourseForm({ ...emptyCourse(), ...prod }); setShowModal('course') }
  }

  function hideProduct(id, type) {
    setProducts(prev => ({
      ...prev,
      [type]: prev[type].map(p => p.id === id ? { ...p, hidden: !p.hidden } : p)
    }))
    const prod = products[type].find(p => p.id === id)
    showToast(prod?.hidden ? 'Product now visible in store' : 'Product hidden from store')
  }

  function deleteProduct(id, type) {
    setProducts(prev => ({ ...prev, [type]: prev[type].filter(p => p.id !== id) }))
    showToast('Product deleted')
  }

  function addSize() {
    if (!newSize.trim()) return
    newSize.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
      if (!physForm.sizes.includes(s)) setPhysForm(f => ({ ...f, sizes: [...f.sizes, s] }))
    })
    setNewSize('')
  }

  function addColor() {
    const name = newColorName.trim() || newColorHex
    if (physForm.colors.find(c => c.name === name)) { showToast('Color already added'); return }
    setPhysForm(f => ({ ...f, colors: [...f.colors, { hex: newColorHex, name }] }))
    setNewColorName('')
  }

  function addVariant() {
    if (!newVariantName.trim()) { showToast('Enter a variant name'); return }
    const v = { id: Date.now(), name: newVariantName.trim(), price: newVariantPrice ? parseFloat(newVariantPrice).toFixed(2) : null }
    setPhysForm(f => ({ ...f, variants: [...f.variants, v] }))
    setNewVariantName(''); setNewVariantPrice('')
  }

  const TABS = [
    { id: 'physical', label: 'Physical Products', emoji: '📦' },
    { id: 'digital', label: 'Digital Products', emoji: '💾' },
    { id: 'courses', label: 'Courses', emoji: '🎓' },
  ]

  const currentProducts = products[storeTab] || []

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">My Store</h2>
          <p className="section-sub">Manage your physical products, digital downloads, and courses</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowModal(storeTab === 'courses' ? 'course' : storeTab) }}
          style={{ padding: '12px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}
        >
          + Add {storeTab === 'physical' ? 'Physical Product' : storeTab === 'digital' ? 'Digital Product' : 'Course'}
        </button>
      </div>

      {/* Store tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setStoreTab(t.id)} style={{ padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', background: storeTab === t.id ? 'var(--brown)' : 'transparent', color: storeTab === t.id ? '#fff' : 'var(--text-dim)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {currentProducts.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{TABS.find(t => t.id === storeTab)?.emoji}</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>No {storeTab} yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Add your first {storeTab === 'courses' ? 'course' : 'product'} to start selling.</div>
          <button onClick={() => { setEditingId(null); setShowModal(storeTab === 'courses' ? 'course' : storeTab) }} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>
            + Add {storeTab === 'courses' ? 'Course' : storeTab === 'digital' ? 'Digital Product' : 'Physical Product'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {currentProducts.map(prod => (
            <ProductCard
              key={prod.id}
              prod={prod}
              type={storeTab}
              onPreview={() => setPreviewProd({ prod, type: storeTab })}
              onEdit={() => editProduct(prod.id, storeTab)}
              onHide={() => hideProduct(prod.id, storeTab)}
              onDelete={() => deleteProduct(prod.id, storeTab)}
            />
          ))}
        </div>
      )}

      {/* PHYSICAL PRODUCT MODAL */}
      {showModal === 'physical' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setShowModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>📦 {editingId ? 'Edit' : 'Add'} Physical Product</h2>
              <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-field"><label>Product Name *</label><input type="text" value={physForm.name} onChange={e => setPhysForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Handmade Candle Set" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Price ($) *</label><input type="number" value={physForm.price} onChange={e => setPhysForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Category</label><select value={physForm.category} onChange={e => setPhysForm(f => ({ ...f, category: e.target.value }))}><option value="">Select…</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="form-field"><label>Description</label><textarea value={physForm.desc} onChange={e => setPhysForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe your product…" style={{ minHeight: '80px' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Inventory (leave blank = unlimited)</label><input type="number" value={physForm.inventory} onChange={e => setPhysForm(f => ({ ...f, inventory: e.target.value }))} placeholder="e.g. 50" min="0" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Low Stock Alert</label><input type="number" value={physForm.lowStock} onChange={e => setPhysForm(f => ({ ...f, lowStock: e.target.value }))} placeholder="5" min="1" /></div>
              </div>
              <div className="form-field">
                <label>Delivery</label>
                <select value={physForm.delivery} onChange={e => setPhysForm(f => ({ ...f, delivery: e.target.value }))}>
                  {DELIVERY_OPTIONS.map(d => <option key={d.val} value={d.val}>{d.label}</option>)}
                </select>
              </div>
              {(physForm.delivery === 'shipped' || physForm.delivery === 'delivered') && (
                <div className="form-field"><label>Delivery Fee ($)</label><input type="number" value={physForm.deliveryFee} onChange={e => setPhysForm(f => ({ ...f, deliveryFee: e.target.value }))} placeholder="0.00" min="0" step="0.01" /></div>
              )}
              {/* Sizes */}
              <div>
                <div className="form-field" style={{ margin: '0 0 8px' }}><label>Sizes (comma separated)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSize()} placeholder="S, M, L, XL" style={{ flex: 1, padding: '11px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                    <button onClick={addSize} style={{ padding: '11px 14px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Add</button>
                  </div>
                </div>
                {physForm.sizes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {physForm.sizes.map(s => (
                      <span key={s} style={{ padding: '5px 12px', background: 'var(--cream2)', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {s} <span onClick={() => setPhysForm(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }))} style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>✕</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Colors */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>Colors</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} style={{ width: '36px', height: '36px', padding: '2px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }} />
                  <input type="text" value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="Color name (optional)" style={{ flex: 1, padding: '9px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
                  <button onClick={addColor} style={{ padding: '9px 14px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Add</button>
                </div>
                {physForm.colors.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {physForm.colors.map(c => (
                      <span key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: 'var(--cream2)', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                        {c.name}
                        <span onClick={() => setPhysForm(f => ({ ...f, colors: f.colors.filter(x => x.name !== c.name) }))} style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>✕</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Variants */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>Variants</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={newVariantName} onChange={e => setNewVariantName(e.target.value)} placeholder="Variant name" style={{ flex: 1, padding: '9px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
                  <input type="number" value={newVariantPrice} onChange={e => setNewVariantPrice(e.target.value)} placeholder="Price" style={{ width: '80px', padding: '9px 10px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
                  <button onClick={addVariant} style={{ padding: '9px 14px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Add</button>
                </div>
                {physForm.variants.length > 0 && physForm.variants.map(v => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.name}</span>
                      {v.price && <span style={{ fontSize: '0.8rem', color: 'var(--brown)', fontWeight: 700 }}>${v.price}</span>}
                    </div>
                    <button onClick={() => setPhysForm(f => ({ ...f, variants: f.variants.filter(x => x.id !== v.id) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1rem' }}>✕</button>
                  </div>
                ))}
              </div>
              {/* Photo upload */}
              <div className="form-field" style={{ margin: 0 }}>
                <label>Photos</label>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files[0]; if (!file) return
                  const r = new FileReader(); r.onload = ev => setPhysForm(f => ({ ...f, photos: [ev.target.result, ...(f.photos || []).slice(1)] })); r.readAsDataURL(file)
                }} />
                {physForm.photos?.[0] && <img src={physForm.photos[0]} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={physForm.hidden} onChange={e => setPhysForm(f => ({ ...f, hidden: e.target.checked }))} style={{ accentColor: 'var(--brown)' }} />
                Publish as hidden (visible only to you)
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={publishProduct} className="btn-save" style={{ flex: 1 }}>🚀 {editingId ? 'Save Changes' : 'Publish Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL PRODUCT MODAL */}
      {showModal === 'digital' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setShowModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>💾 {editingId ? 'Edit' : 'Add'} Digital Product</h2>
              <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-field"><label>Product Name *</label><input type="text" value={digForm.name} onChange={e => setDigForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Social Media Templates Pack" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Price ($) *</label><input type="number" value={digForm.price} onChange={e => setDigForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Category</label><select value={digForm.category} onChange={e => setDigForm(f => ({ ...f, category: e.target.value }))}><option value="">Select…</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="form-field"><label>Description</label><textarea value={digForm.desc} onChange={e => setDigForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe what's included…" style={{ minHeight: '80px' }} /></div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>Upload File</label>
                <input type="file" onChange={e => { const f = e.target.files[0]; if (f) setDigForm(d => ({ ...d, fileName: f.name })) }} />
                {digForm.fileName && <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>✓ {digForm.fileName}</div>}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={digForm.hidden} onChange={e => setDigForm(f => ({ ...f, hidden: e.target.checked }))} style={{ accentColor: 'var(--brown)' }} />
                Publish as hidden
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={publishProduct} className="btn-save" style={{ flex: 1 }}>🚀 {editingId ? 'Save Changes' : 'Publish Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* COURSE MODAL */}
      {showModal === 'course' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setShowModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>🎓 {editingId ? 'Edit' : 'Add'} Course</h2>
              <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-field"><label>Course Name *</label><input type="text" value={courseForm.name} onChange={e => setCourseForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Beginner's Guide to Branding" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-field" style={{ margin: 0 }}><label>Price ($) *</label><input type="number" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" /></div>
                <div className="form-field" style={{ margin: 0 }}><label>Category</label><select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}><option value="">Select…</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="form-field"><label>Description</label><textarea value={courseForm.desc} onChange={e => setCourseForm(f => ({ ...f, desc: e.target.value }))} placeholder="What will students learn?" style={{ minHeight: '80px' }} /></div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>Course Video (optional)</label>
                <input type="file" accept="video/*" onChange={e => { const f = e.target.files[0]; if (f) setCourseForm(c => ({ ...c, videoName: f.name })) }} />
                {courseForm.videoName && <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>✓ {courseForm.videoName}</div>}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={courseForm.hidden} onChange={e => setCourseForm(f => ({ ...f, hidden: e.target.checked }))} style={{ accentColor: 'var(--brown)' }} />
                Publish as hidden
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={publishProduct} className="btn-save" style={{ flex: 1 }}>🚀 {editingId ? 'Save Changes' : 'Publish Course'}</button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT PREVIEW MODAL */}
      {previewProd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setPreviewProd(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '280px', background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
              {previewProd.prod.photos?.[0] || previewProd.prod.photo
                ? <img src={previewProd.prod.photos?.[0] || previewProd.prod.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '5rem' }}>{previewProd.type === 'digital' ? '💾' : previewProd.type === 'courses' ? '🎓' : '📦'}</span>
              }
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', margin: 0 }}>{previewProd.prod.name}</h2>
                <div style={{ fontWeight: 900, color: 'var(--brown)', fontSize: '1.2rem' }}>${previewProd.prod.price}</div>
              </div>
              {previewProd.prod.desc && <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '16px' }}>{previewProd.prod.desc}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setPreviewProd(null); editProduct(previewProd.prod.id, previewProd.type === 'courses' ? 'courses' : previewProd.type) }} className="btn-cancel">✏️ Edit</button>
                <button onClick={() => setPreviewProd(null)} className="btn-save" style={{ flex: 1 }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}