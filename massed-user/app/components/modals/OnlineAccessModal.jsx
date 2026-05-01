'use client'

import { useState } from 'react'

export default function OnlineAccessModal({ event, onClose }) {
  const [ticketInput, setTicketInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null) // null | 'valid' | 'invalid'

  if (!event) return null

  const streamLink = event.onlineLink || (
    'https://stream.massed.io/' +
    (event.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '')
  )

  const dateStr = event.date
    ? new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  function verifyAccess() {
    const val = ticketInput.trim().toUpperCase()
    if (!val) { alert('Please enter your ticket number'); return }
    setVerifying(true)
    setVerifyResult(null)
    setTimeout(() => {
      setVerifying(false)
      const isValid = val.startsWith('TKT-') && val.length > 10
      setVerifyResult(isValid ? 'valid' : 'invalid')
    }, 1200)
  }

  function downloadLink() {
    const blob = new Blob([`Event: ${event.name}\nStream Link: ${streamLink}`], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${event.name}-access-link.txt`
    a.click()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div style={{ background: 'linear-gradient(160deg, #0d0800, #1a0d00)', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '480px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', fontFamily: 'DM Sans, sans-serif', color: '#fff' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>Online Event Access</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0, color: '#fff' }}>{event.name}</h2>
            {dateStr && <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{dateStr}{event.time ? ` • ${event.time}` : ''}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>✕</button>
        </div>

        {/* Stream link */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Stream Link</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#D4956E', marginBottom: '12px', wordBreak: 'break-all' }}>{streamLink}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={streamLink} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              🔗 Open Event Link
            </a>
            <button onClick={downloadLink} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
              📥 Save
            </button>
          </div>
        </div>

        {/* Ticket verification */}
        {verifyResult !== 'valid' && (
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>Verify Ticket</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                value={ticketInput}
                onChange={e => { setTicketInput(e.target.value); setVerifyResult(null) }}
                onKeyDown={e => e.key === 'Enter' && verifyAccess()}
                placeholder="Enter ticket number (e.g. TKT-ABC123456)"
                style={{ flex: 1, padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#fff', outline: 'none' }}
              />
              <button onClick={verifyAccess} disabled={verifying} style={{ padding: '11px 18px', background: 'rgba(192,122,80,0.2)', border: '1px solid rgba(192,122,80,0.3)', borderRadius: '10px', cursor: verifying ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#D4956E', flexShrink: 0 }}>
                {verifying ? '🔍…' : 'Verify'}
              </button>
            </div>

            {verifying && (
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>🔍 Verifying…</div>
            )}

            {verifyResult === 'invalid' && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '9px', padding: '10px 14px', fontSize: '0.82rem', color: '#f87171', fontWeight: 600 }}>
                ❌ Invalid ticket number. Please check and try again.
              </div>
            )}
          </div>
        )}

        {/* Access granted */}
        {verifyResult === 'valid' && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#22c55e', marginBottom: '4px' }}>Access Granted!</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Your ticket is valid. Click below to join the event.</div>
            <a href={streamLink} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', padding: '13px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 18px rgba(34,197,94,0.3)' }}>
              🎥 Join Event Stream
            </a>
          </div>
        )}
      </div>
    </div>
  )
}