'use client'

import { useState } from 'react'

const ASTRO_SIGNS = [
  '♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer',
  '♌ Leo', '♍ Virgo', '♎ Libra', '♏ Scorpio',
  '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces'
]

export default function PublicProfileSetupModal({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [astro, setAstro] = useState('')
  const [bio, setBio] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function save() {
    if (!name.trim()) { showToast('Please enter your display name'); return }
    onSave({ name: name.trim(), location: location.trim(), astro, bio: bio.trim() })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(44,26,14,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)', fontFamily: 'DM Sans, sans-serif' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--brown-bg2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.35rem', color: 'var(--text)', marginBottom: '5px' }}>Create Your Public Profile</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>This is your personal public presence on MASSED — separate from your business dashboard.</div>
        </div>

        {/* Display name */}
        <div className="form-field">
          <label>Display Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>

        {/* Location + Astrology */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '13px' }}>
          <div className="form-field" style={{ margin: 0 }}>
            <label>Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" />
          </div>
          <div className="form-field" style={{ margin: 0 }}>
            <label>Astrology Sign</label>
            <select value={astro} onChange={e => setAstro(e.target.value)}>
              <option value="">Select sign</option>
              {ASTRO_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Bio */}
        <div className="form-field">
          <label>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={3} style={{ resize: 'none', minHeight: '70px' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', background: 'var(--cream)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>Cancel</button>
          <button onClick={save} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Create Profile →</button>
        </div>

        {toast && <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>{toast}</div>}
      </div>
    </div>
  )
}