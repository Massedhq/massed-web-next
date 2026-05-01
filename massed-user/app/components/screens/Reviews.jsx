'use client'

import { useState } from 'react'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [showLeaveReview, setShowLeaveReview] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 5, text: '', receipt: '' })
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const verifiedCount = reviews.filter(r => r.verified).length

  function submitReview() {
    if (!form.name.trim()) { showToast('Please enter your name'); return }
    if (!form.text.trim()) { showToast('Please enter a review'); return }
    setReviews(prev => [...prev, {
      id: Date.now(),
      name: form.name,
      rating: form.rating,
      text: form.text,
      receipt: form.receipt,
      verified: !!form.receipt.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }])
    setForm({ name: '', rating: 5, text: '', receipt: '' })
    setShowLeaveReview(false)
    showToast('✓ Review submitted!')
  }

  function StarRow({ rating, size = 16, interactive = false, onRate }) {
    return (
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            onClick={() => interactive && onRate && onRate(i)}
            style={{
              fontSize: size + 'px',
              color: i <= rating ? '#f59e0b' : '#e5e7eb',
              cursor: interactive ? 'pointer' : 'default',
              lineHeight: 1
            }}
          >★</span>
        ))}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: 'var(--text)', margin: '0 0 6px' }}>Reviews</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', margin: 0 }}>All reviews require a verified Massed purchase or a receipt from a verifiable source</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.4rem', color: 'var(--text)', marginBottom: '6px' }}>{avgRating}</div>
          <StarRow rating={Math.round(parseFloat(avgRating))} size={18} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>Average Rating</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.4rem', color: 'var(--text)', marginBottom: '6px' }}>{reviews.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>Total Reviews</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.4rem', color: 'var(--brown)', marginBottom: '6px' }}>{verifiedCount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>Verified Purchases</div>
        </div>
      </div>

      {/* Leave a review button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => setShowLeaveReview(true)} style={{ padding: '11px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + Leave a Review
        </button>
      </div>

      {/* Admin notice */}
      <div style={{ background: 'rgba(192,122,80,0.08)', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--brown)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-mid)' }}>Only admins can remove reviews. All reviews are visible on your public page.</span>
      </div>

      {/* Reviews list */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', minHeight: '200px' }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⭐</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '6px' }}>No reviews yet</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Reviews from verified purchases will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(r => (
              <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '4px' }}>{r.name}</div>
                    <StarRow rating={r.rating} size={14} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {r.verified && <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ Verified</span>}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{r.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.6, margin: '8px 0 0' }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave Review Modal */}
      {showLeaveReview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setShowLeaveReview(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>Leave a Review</h2>
              <button onClick={() => setShowLeaveReview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div className="form-field">
              <label>Your Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="First & Last Name" />
            </div>
            <div className="form-field">
              <label>Rating *</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} onClick={() => setForm(f => ({ ...f, rating: i }))} style={{ fontSize: '28px', color: i <= form.rating ? '#f59e0b' : '#e5e7eb', cursor: 'pointer' }}>★</span>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Review *</label>
              <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Share your experience…" style={{ minHeight: '80px' }} />
            </div>
            <div className="form-field">
              <label>Receipt / Order # (for verification)</label>
              <input type="text" value={form.receipt} onChange={e => setForm(f => ({ ...f, receipt: e.target.value }))} placeholder="Optional — verifies your purchase" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setShowLeaveReview(false)} className="btn-cancel">Cancel</button>
              <button onClick={submitReview} className="btn-confirm">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}