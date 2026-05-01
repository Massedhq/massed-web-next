'use client'

import { useState } from 'react'

function nextBillingDate() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_COLORS = {
  pending:     { bg: '#fef3c7', text: '#92400e', label: 'Pending Invite' },
  active:      { bg: '#dcfce7', text: '#166534', label: 'Active' },
  graduated:   { bg: '#dbeafe', text: '#1e3a8a', label: '🎓 Graduated — Free Hosting' },
  independent: { bg: '#f3e8ff', text: '#4a1d96', label: 'Independent Owner' },
}

export default function SparkFounder() {
  const [founders, setFounders] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteStep, setInviteStep] = useState(1)
  const [form, setForm] = useState({ email: '', relationship: '', note: '' })
  const [lastInvited, setLastInvited] = useState('')
  const [viewDetail, setViewDetail] = useState(null)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function openInvite() {
    setForm({ email: '', relationship: '', note: '' })
    setInviteStep(1)
    setShowInviteModal(true)
  }

  function proceedToSend() {
    if (!form.email || !form.email.includes('@')) { showToast('Please enter a valid email address'); return }
    const id = Date.now()
    const slug = 'founder-' + id.toString(36)
    const newFounder = {
      id, email: form.email, relationship: form.relationship || 'Founder',
      note: form.note, status: 'active',
      inviteLink: `https://massed.app/join/spark/${slug}`,
      inviteSentAt: new Date().toISOString(),
      displayName: null, urlSlug: null,
      stripeConnected: false, paymentsCompleted: 1, monthlyFee: 15,
      nextBillingDate: nextBillingDate(),
      freeHostingStartDate: null, freeHostingEndDate: null, independentSince: null,
      paymentHistory: [{ num: 1, amount: 15, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'paid' }]
    }
    setFounders(prev => [newFounder, ...prev])
    setLastInvited(form.email)
    setInviteStep(2)
  }

  function recordPayment(id) {
    setFounders(prev => prev.map(f => {
      if (f.id !== id) return f
      if (f.paymentsCompleted >= 12) { showToast('All 12 payments completed — already graduated!'); return f }
      const newCount = Math.min(f.paymentsCompleted + 1, 12)
      const newPayment = { num: newCount, amount: 15, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'paid' }
      let status = f.status
      let freeStart = f.freeHostingStartDate
      let freeEnd = f.freeHostingEndDate
      if (newCount >= 12) {
        status = 'graduated'
        const start = new Date()
        const end = new Date(); end.setFullYear(end.getFullYear() + 2)
        freeStart = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        freeEnd = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        setTimeout(() => showToast(`🎓 ${f.displayName || f.email} graduated! 2-year free hosting activated.`), 600)
      }
      return { ...f, paymentsCompleted: newCount, status, freeHostingStartDate: freeStart, freeHostingEndDate: freeEnd, nextBillingDate: nextBillingDate(), paymentHistory: [...f.paymentHistory, newPayment] }
    }))
    const f = founders.find(x => x.id === id)
    if (f) showToast(`✓ Payment #${Math.min(f.paymentsCompleted + 1, 12)} recorded`)
  }

  function cancelSeat(id) {
    if (!confirm('Cancel this Spark Founder seat? This stops billing and their account will be suspended.')) return
    setFounders(prev => prev.filter(f => f.id !== id))
    showToast('Spark Founder seat cancelled.')
  }

  function resendInvite(id) {
    const f = founders.find(x => x.id === id)
    if (f) showToast(`✓ Invite resent to ${f.email}`)
  }

  const stats = {
    active: founders.filter(f => f.status === 'active').length,
    graduated: founders.filter(f => f.status === 'graduated' || f.status === 'independent').length,
    pending: founders.filter(f => f.status === 'pending').length,
    spend: founders.filter(f => f.status === 'active' || f.status === 'pending').length * 15,
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: 'var(--text)', margin: 0 }}>Spark Founder</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', margin: 0, maxWidth: '600px' }}>
            Sponsor an independent professional presence for a family member or junior partner — they build their own business, you support their launch.
          </p>
        </div>
        <button onClick={openInvite} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)', whiteSpace: 'nowrap' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Spark a New Founder — $15/mo
        </button>
      </div>

      {/* How it works card */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '16px' }}>How Spark Founder Works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {[
            { num: '1', text: 'You pay $15/mo and enter their email to send an invitation link' },
            { num: '2', text: 'They create their own login, choose their own URL — massed.app/theirname — completely independent' },
            { num: '3', text: 'They get a full Massed dashboard — store, events, bookings, messages — all private from you' },
            { num: '4', text: 'After 12 payments, they automatically graduate to 2 years free hosting — then $79/yr on their own' },
          ].map(step => (
            <div key={step.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--cream2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-mid)', flexShrink: 0 }}>{step.num}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: step.text.replace('$15/mo', '<strong>$15/mo</strong>').replace('12 payments', '<strong>12 payments</strong>').replace(/massed\.app\/theirname/, '<strong>massed.app/theirname</strong>') }} />
            </div>
          ))}
        </div>
        {/* Firewall notice */}
        <div style={{ background: 'var(--cream)', borderRadius: '9px', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-mid)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span>🔒</span>
          <span><strong>Full Firewall:</strong> You only see billing status. You cannot access their client data, messages, bookings, or revenue. Their Stripe connects directly to them.</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'ACTIVE FOUNDERS', val: stats.active, color: 'var(--text)' },
          { label: 'GRADUATED', val: stats.graduated, color: '#16a34a' },
          { label: 'MONTHLY SPEND', val: `$${stats.spend}`, color: '#16a34a' },
          { label: 'PENDING INVITES', val: stats.pending, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Founders list or empty state */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        {founders.length === 0 ? (
          <div style={{ padding: '64px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>⚡</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>No Spark Founders yet</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Sponsor a family member or junior partner for just $15/mo. They get their own full Massed platform. After 12 months, they own it free for 2 years.
            </div>
            <button onClick={openInvite} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.92rem', boxShadow: '0 4px 18px rgba(192,122,80,0.3)' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Spark Your First Founder
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {founders.map((f, idx) => {
              const sc = STATUS_COLORS[f.status] || STATUS_COLORS.pending
              const pct = Math.round((f.paymentsCompleted / 12) * 100)
              const initials = (f.displayName || f.email).substring(0, 2).toUpperCase()
              return (
                <div key={f.id} style={{ padding: '20px 24px', borderBottom: idx < founders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--brown-bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--brown)', flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{f.displayName || 'Awaiting setup'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{f.email}{f.relationship ? ` · ${f.relationship}` : ''}</div>
                        {f.urlSlug && <div style={{ fontSize: '0.72rem', color: 'var(--brown)', marginTop: '1px' }}>massed.app/{f.urlSlug}</div>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: sc.bg, color: sc.text }}>{sc.label}</span>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '5px' }}>
                      <span>Graduation Progress — {f.paymentsCompleted} of 12 payments</span>
                      <span style={{ fontWeight: 700, color: pct >= 100 ? '#16a34a' : 'var(--brown)' }}>{pct}%</span>
                    </div>
                    <div style={{ background: 'var(--cream3)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ background: pct >= 100 ? '#16a34a' : 'linear-gradient(90deg, var(--brown-light), var(--brown-dark))', height: '100%', width: `${pct}%`, borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    {f.status === 'graduated' && <div style={{ fontSize: '0.72rem', color: '#1e3a8a', marginTop: '5px' }}>🎓 Free hosting: {f.freeHostingStartDate} → {f.freeHostingEndDate}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ background: 'var(--cream)', borderRadius: '9px', padding: '9px 12px' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '3px' }}>Monthly Fee</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brown)' }}>${f.monthlyFee}/mo</div>
                    </div>
                    <div style={{ background: 'var(--cream)', borderRadius: '9px', padding: '9px 12px' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '3px' }}>
                        {f.status === 'active' ? 'Next Billing' : f.status === 'graduated' ? 'Free Until' : 'Status'}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                        {f.status === 'active' ? f.nextBillingDate : f.status === 'graduated' ? f.freeHostingEndDate : f.status === 'pending' ? 'Awaiting signup' : 'Independent'}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔒 Client data, messages, bookings & revenue are private to your Founder
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => setViewDetail(f)} style={{ padding: '8px 14px', background: 'var(--cream2)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>View Details</button>
                    {f.status === 'active' && <button onClick={() => recordPayment(f.id)} style={{ padding: '8px 14px', background: 'var(--brown-bg2)', color: 'var(--brown-dark)', border: '1px solid var(--brown)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>+ Record Payment</button>}
                    {f.status === 'pending' && <button onClick={() => resendInvite(f.id)} style={{ padding: '8px 14px', background: '#fff', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>Resend Invite</button>}
                    <button onClick={() => cancelSeat(f.id)} style={{ padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>Cancel Seat</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setShowInviteModal(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            {inviteStep === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>⚡ Spark a New Founder</h2>
                  <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: '20px', lineHeight: 1.6 }}>You pay <strong>$15/month</strong>. They get a full independent Massed platform. After 12 payments they graduate to 2 years free.</p>
                <div className="form-field"><label>Their Email Address *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="founder@email.com" /></div>
                <div className="form-field"><label>Your Relationship</label><select value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}><option value="">Select…</option>{['Family', 'Friend', 'Client', 'Colleague', 'Mentee', 'Other'].map(r => <option key={r}>{r}</option>)}</select></div>
                <div className="form-field" style={{ margin: '0 0 20px' }}><label>Personal Note (optional)</label><textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Add a personal message…" style={{ minHeight: '60px' }} /></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowInviteModal(false)} className="btn-cancel">Cancel</button>
                  <button onClick={proceedToSend} className="btn-confirm">Send Invite — $15/mo →</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚡</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', marginBottom: '8px' }}>Invite Sent!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Your Spark Founder invite has been sent to <strong>{lastInvited}</strong>. Once they sign up and make their first payment, their seat activates.
                </div>
                <button onClick={() => setShowInviteModal(false)} className="btn-save" style={{ width: '100%' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {viewDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setViewDetail(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', margin: 0 }}>⚡ {viewDetail.displayName || viewDetail.email}</h2>
              <button onClick={() => setViewDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>Founder Info</div>
              {[['Email', viewDetail.email], ['Relationship', viewDetail.relationship || '—'], ['URL', viewDetail.urlSlug ? `massed.app/${viewDetail.urlSlug}` : 'Not yet chosen'], ['Stripe', viewDetail.stripeConnected ? '✓ Connected' : 'Not connected yet'], ['Status', viewDetail.status]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-dim)', minWidth: '90px' }}>{k}:</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>12-Month Cycle — {viewDetail.paymentsCompleted}/12</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const done = i < viewDetail.paymentsCompleted
                  return <div key={i} style={{ width: '22px', height: '22px', borderRadius: '4px', background: done ? 'var(--brown)' : 'var(--cream3)', border: `1px solid ${done ? 'var(--brown-dark)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: done ? '#fff' : 'var(--text-dim)' }}>{i + 1}</div>
                })}
              </div>
              {viewDetail.status === 'graduated' && <div style={{ background: '#dbeafe', borderRadius: '8px', padding: '8px 10px', fontSize: '0.78rem', color: '#1e3a8a' }}>🎓 Free hosting until {viewDetail.freeHostingEndDate}</div>}
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>Payment History</div>
              {viewDetail.paymentHistory.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', padding: '6px 0' }}>No payments recorded yet.</div>
              ) : viewDetail.paymentHistory.map(p => (
                <div key={p.num} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Payment #{p.num} · {p.date}</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>+${p.amount}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 14px', fontSize: '0.78rem', color: '#166534', lineHeight: 1.6, marginBottom: '16px' }}>
              🔒 <strong>Privacy Firewall Active.</strong> You cannot view their client data, messages, booking details, or revenue. You only see billing status shown above.
            </div>
            <button onClick={() => setViewDetail(null)} className="btn-save" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}