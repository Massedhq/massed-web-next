'use client'

import { useState } from 'react'

const TIMER_OPTIONS = [
  { val: 0, label: 'No timer' },
  { val: 5, label: '5 min' },
  { val: 10, label: '10 min' },
  { val: 15, label: '15 min' },
  { val: 20, label: '20 min' },
  { val: 30, label: '30 min' },
]

export default function GoLiveModal({ onClose, onGoLive, products = [] }) {
  const [mode, setMode] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [timerMins, setTimerMins] = useState(0)
  const [step, setStep] = useState(1) // 1 = pick mode, 2 = sell details

  // Poll fields
  const [pollQ, setPollQ] = useState('')
  const [pollOpts, setPollOpts] = useState(['', '', '', ''])
  const [pollDuration, setPollDuration] = useState(0)

  function handleNext() {
    if (!mode) return
    if (mode === 'sell') {
      setStep(2)
    } else if (mode === 'poll') {
      setStep(3)
    } else {
      // Go live directly
      onGoLive({ mode: 'live' })
      onClose()
    }
  }

  function handleStartSell() {
    if (!selectedProduct) return
    onGoLive({ mode: 'sell', product: selectedProduct, salePrice: parseFloat(salePrice) || 0, timerMins })
    onClose()
  }

  function handleLaunchPoll() {
    if (!pollQ.trim()) { alert('⚠️ Please add a poll question'); return }
    const filled = pollOpts.filter(o => o.trim())
    if (filled.length < 2) { alert('⚠️ Add at least 2 options'); return }
    onGoLive({ mode: 'poll', question: pollQ, options: filled, duration: pollDuration })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', margin: 0 }}>
            {step === 1 ? 'Go Live' : step === 2 ? 'Sell a Product' : 'Launch Poll'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
        </div>

        {/* STEP 1: Pick mode */}
        {step === 1 && (
          <>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', marginBottom: '20px', lineHeight: 1.6 }}>
              Choose how you want to go live with your audience.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {[
                { val: 'live', icon: '🔴', title: 'Go Live', desc: 'Stream to your audience' },
                { val: 'sell', icon: '🛍️', title: 'Sell a Product', desc: 'Feature a product live' },
                { val: 'poll', icon: '📊', title: 'Launch Poll', desc: 'Get real-time votes' },
              ].map(opt => (
                <div key={opt.val} onClick={() => setMode(opt.val)} style={{ border: `2px solid ${mode === opt.val ? 'var(--brown)' : 'var(--border)'}`, background: mode === opt.val ? 'var(--brown-bg)' : '#fff', borderRadius: '14px', padding: '16px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: mode === opt.val ? 'var(--brown-dark)' : 'var(--text)' }}>{opt.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '3px' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} className="btn-cancel">Cancel</button>
              <button onClick={handleNext} disabled={!mode} className="btn-confirm" style={{ opacity: mode ? 1 : 0.4 }}>
                {mode === 'live' ? '🔴 Go Live Now' : 'Next →'}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: Sell product */}
        {step === 2 && (
          <>
            <div className="form-field">
              <label>Select Product *</label>
              <select value={selectedProduct} onChange={e => { setSelectedProduct(e.target.value); setSalePrice('') }}>
                <option value="">Choose a product…</option>
                {products.length > 0 ? products.map(p => (
                  <option key={p.id} value={p.name} data-price={p.price}>{p.name} — ${p.price}</option>
                )) : (
                  <>
                    <option value="Sample Product|49.99" data-price="49.99">Sample Product — $49.99</option>
                    <option value="Digital Course|99.99" data-price="99.99">Digital Course — $99.99</option>
                  </>
                )}
              </select>
            </div>
            {selectedProduct && (
              <>
                <div className="form-field">
                  <label>Sale Price</label>
                  <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="form-field" style={{ margin: 0 }}>
                  <label>Sale Timer</label>
                  <select value={timerMins} onChange={e => setTimerMins(parseInt(e.target.value))}>
                    {TIMER_OPTIONS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                  </select>
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setStep(1)} className="btn-cancel">← Back</button>
              <button onClick={handleStartSell} disabled={!selectedProduct} className="btn-confirm" style={{ opacity: selectedProduct ? 1 : 0.4 }}>
                🔴 Go Live & Sell
              </button>
            </div>
          </>
        )}

        {/* STEP 3: Poll */}
        {step === 3 && (
          <>
            <div className="form-field">
              <label>Poll Question *</label>
              <input type="text" value={pollQ} onChange={e => setPollQ(e.target.value)} placeholder="Ask your audience something…" maxLength={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {pollOpts.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: i < 2 ? 'var(--brown)' : 'var(--cream3)', color: i < 2 ? '#fff' : 'var(--text-dim)', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <input type="text" value={opt} onChange={e => setPollOpts(prev => prev.map((o, j) => j === i ? e.target.value : o))} placeholder={`Option ${i + 1}${i >= 2 ? ' (optional)' : ''}`} style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div className="form-field" style={{ margin: '0 0 20px' }}>
              <label>Duration</label>
              <select value={pollDuration} onChange={e => setPollDuration(parseInt(e.target.value))}>
                <option value={0}>No limit</option>
                {TIMER_OPTIONS.filter(t => t.val > 0).map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(1)} className="btn-cancel">← Back</button>
              <button onClick={handleLaunchPoll} className="btn-confirm">🔴 Go Live with Poll</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}