'use client'

import { useState } from 'react'

const TABS = [
  { id: 'settings', label: '⚙ Settings' },
  { id: 'billing', label: '💳 Billing' },
  { id: 'stripe', label: '⚡ Stripe' },
  { id: 'support', label: '? Support' },
  { id: 'api', label: '🔌 API' },
]

export default function Settings({ user }) {
  const [tab, setTab] = useState('settings')
  const [displayName, setDisplayName] = useState(user?.full_name || user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [newPassword, setNewPassword] = useState('')
  const [code, setCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [recoveryChoice, setRecoveryChoice] = useState(null)
  const [showRecovery, setShowRecovery] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function sendPasswordCode() {
    if (!phone.trim()) { showToast('Please enter your phone number first'); return }
    if (!newPassword.trim()) { showToast('Please enter a new password'); return }
    setShowCodeInput(true)
    showToast('✓ 6-digit code sent to ' + phone.replace(/\d(?=\d{4})/g, '*'))
  }

  function verifyPasswordCode() {
    if (code.length < 6) { showToast('Please enter the 6-digit code'); return }
    setShowCodeInput(false)
    setNewPassword('')
    setCode('')
    showToast('✓ Password updated successfully!')
  }

  function saveAccount() {
    showToast('✓ Account updated!')
  }

  function submitWithdrawal() {
    const amt = parseFloat(withdrawAmount)
    if (!amt || amt <= 0) { showToast('Please enter an amount to withdraw'); return }
    if (amt > 1250) { showToast('Amount exceeds available balance'); return }
    setShowWithdraw(false)
    setWithdrawAmount('')
    showToast(`✓ Withdrawal of $${amt.toFixed(2)} initiated! Arrives in 3-5 business days.`)
  }

  function confirmRecovery() {
    if (!recoveryChoice) return
    const msg = recoveryChoice === 'pay'
      ? '✓ Payment processed! Your account has been fully restored.'
      : '✓ Auto-Recovery activated! 20% of each sale will clear your balance automatically.'
    showToast(msg)
    setShowRecovery(false)
    setRecoveryChoice(null)
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: 'var(--text)', margin: '0 0 6px' }}>Settings</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', margin: 0 }}>Manage your account and plan</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', background: tab === t.id ? 'var(--brown)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-dim)', transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* SETTINGS TAB */}
      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Account */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Account</div>
            <div className="form-field"><label>Display Name</label><input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" /></div>
            <div className="form-field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></div>
            <div className="form-field"><label>Phone Number</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (000) 000-0000" /></div>
            <div className="form-field">
              <label>Change Password</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" style={{ flex: 1, padding: '11px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                <button onClick={sendPasswordCode} style={{ padding: '11px 16px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>Send Code</button>
              </div>
            </div>
            {showCodeInput && (
              <div className="form-field">
                <label>Enter 6-digit code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} style={{ flex: 1, padding: '11px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.3em', outline: 'none' }} />
                  <button onClick={verifyPasswordCode} style={{ padding: '11px 16px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>Verify</button>
                </div>
              </div>
            )}
            <button onClick={saveAccount} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', marginTop: '4px' }}>Save Changes</button>
          </div>

          {/* Notifications */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Notifications</div>
            {['New booking requests', 'New messages', 'Sales & payouts', 'Marketing updates'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{label}</span>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: 'var(--brown)', borderRadius: '11px', transition: '0.2s' }} />
                  <span style={{ position: 'absolute', top: '3px', left: '20px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: '0.2s' }} />
                </label>
              </div>
            ))}
          </div>

          {/* Security */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Security</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>Two-Factor Authentication</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Add an extra layer of security to your account</div>
              </div>
              <div onClick={() => { setTwoFA(v => !v); showToast(twoFA ? 'Two-factor authentication disabled' : '✓ Two-factor authentication enabled') }} style={{ width: '44px', height: '24px', background: twoFA ? 'var(--brown)' : '#e5e7eb', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: twoFA ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BILLING TAB */}
      {tab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Current Plan</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', marginBottom: '4px' }}>Pro Plan</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>$79.99/year · Renews Apr 29, 2027</div>
              </div>
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Available Balance</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.2rem', color: 'var(--brown)', marginBottom: '4px' }}>$1,250.00</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Available for withdrawal</div>
            <button onClick={() => setShowWithdraw(true)} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Withdraw Funds</button>
          </div>
        </div>
      )}

      {/* STRIPE TAB */}
      {tab === 'stripe' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Stripe Connect</div>
          <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>Connect Your Stripe Account</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Accept payments directly to your Stripe account</div>
            <button onClick={() => showToast('Redirecting to Stripe Connect…')} style={{ padding: '11px 24px', background: '#635bff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Connect Stripe →</button>
          </div>
        </div>
      )}

      {/* SUPPORT TAB */}
      {tab === 'support' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>Contact Support</div>
          <div className="form-field"><label>Subject</label>
            <select>
              <option value="">Select a subject…</option>
              {['Billing issue', 'Account access', 'Technical problem', 'Feature request', 'Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-field"><label>Email</label><input type="email" placeholder="your@email.com" defaultValue={email} /></div>
          <div className="form-field"><label>Message</label><textarea placeholder="Describe your issue…" style={{ minHeight: '120px' }} /></div>
          <button onClick={() => showToast('✓ Support message sent! We will reply within 24-48 hours.')} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Send Message</button>
        </div>
      )}

      {/* API TAB */}
      {tab === 'api' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '16px' }}>API Access</div>
          <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '6px' }}>Your API Key</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text)', letterSpacing: '0.05em', wordBreak: 'break-all' }}>msd_live_••••••••••••••••••••••••••••••••</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => showToast('✓ API key copied!')} style={{ padding: '10px 18px', background: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>Copy Key</button>
            <button onClick={() => { if (confirm('Regenerate API key? Your current key will stop working.')) showToast('✓ New API key generated') }} style={{ padding: '10px 18px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>Regenerate</button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setShowWithdraw(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', margin: 0 }}>Withdraw Funds</h3>
              <button onClick={() => setShowWithdraw(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '0.82rem', color: 'var(--text-mid)' }}>Available: <strong>$1,250.00</strong></div>
            <div className="form-field"><label>Amount ($)</label><input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0.00" min="0.01" max="1250" step="0.01" /></div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setShowWithdraw(false)} className="btn-cancel">Cancel</button>
              <button onClick={submitWithdrawal} className="btn-confirm">Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}