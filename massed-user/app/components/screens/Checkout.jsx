'use client'

import { useState } from 'react'

export default function Checkout({ cart, onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [paymentType, setPaymentType] = useState('full')
  const [splitCount, setSplitCount] = useState(2)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const total = cart?.total || 0
  const ev = cart?.ev || {}
  const cartItems = cart?.cartItems || []
  const perPerson = paymentType === 'split' && splitCount > 0 ? (total / splitCount) : total

  function formatCard(val) {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  }

  function completeCheckout() {
    setTimeout(() => {
      onClose?.()
      onComplete?.()
    }, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 600, overflowY: 'auto', padding: '30px 0', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#0d0d0d', borderRadius: '24px', maxWidth: '520px', width: '90%', margin: 'auto', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', border: '1px solid rgba(192,122,80,0.15)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a0a00, #2d1500)', padding: '28px 28px 20px', borderBottom: '1px solid rgba(192,122,80,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>Secure Checkout</div>
              <div style={{ color: 'var(--brown-light)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>🔒 256-bit SSL Encrypted</div>
            </div>
            <div style={{ width: '32px' }} />
          </div>

          {/* Order summary */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Order Summary</div>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>{item.tier?.type} × {item.qty}</span>
                <span>{item.price === 0 ? 'Free' : `$${(item.price * item.qty).toFixed(2)}`}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Total</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'DM Serif Display, serif' }}>{total === 0 ? 'Free' : `$${total.toFixed(2)}`}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} onClick={() => s < step && setStep(s)} style={{ flex: 1, padding: '8px', textAlign: 'center', borderRadius: '8px', cursor: s < step ? 'pointer' : 'default', background: step === s ? 'var(--brown)' : 'transparent', color: step === s ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: step === s ? 700 : 600 }}>
                {s}. {s === 1 ? 'Contact' : s === 2 ? 'Payment' : 'Confirm'}
              </div>
            ))}
          </div>

          {/* Step 1: Contact */}
          {step === 1 && (
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '16px', lineHeight: 1.5 }}>Your tickets will be sent to the contact info below.</div>
              {['name', 'email', 'phone'].map(field => (
                <div key={field} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                    {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Phone (Optional)'}
                  </div>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={contact[field]}
                    onChange={e => setContact(c => ({ ...c, [field]: e.target.value }))}
                    placeholder={field === 'name' ? 'First & Last Name' : field === 'email' ? 'your@email.com' : '+1 (000) 000-0000'}
                    style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', fontWeight: 700, boxShadow: '0 4px 20px rgba(192,122,80,0.4)' }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['full', 'split'].map(type => (
                  <div key={type} onClick={() => setPaymentType(type)} style={{ flex: 1, padding: '12px', background: paymentType === type ? 'var(--brown)' : 'rgba(255,255,255,0.06)', color: paymentType === type ? '#fff' : 'rgba(255,255,255,0.45)', border: `1px solid ${paymentType === type ? 'transparent' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                    {type === 'full' ? '💳 Full Payment' : '🤝 Split Payment'}
                  </div>
                ))}
              </div>

              {paymentType === 'full' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {['name', 'number', 'expiry', 'cvv'].map(f => (
                    <input
                      key={f}
                      type="text"
                      value={card[f]}
                      onChange={e => setCard(c => ({ ...c, [f]: f === 'number' ? formatCard(e.target.value) : e.target.value }))}
                      placeholder={f === 'name' ? 'Name on card' : f === 'number' ? '0000  0000  0000  0000' : f === 'expiry' ? 'MM / YY' : '•••'}
                      maxLength={f === 'number' ? 19 : f === 'expiry' ? 7 : f === 'cvv' ? 4 : undefined}
                      style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontFamily: f === 'number' || f === 'cvv' ? 'monospace' : 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  ))}
                </div>
              )}

              {paymentType === 'split' && (
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '14px' }}>Split the total cost with friends. Tickets are generated only after all payments are collected.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" value={splitCount} onChange={e => setSplitCount(parseInt(e.target.value) || 2)} min="2" max="10" style={{ width: '100px', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#fff', outline: 'none', textAlign: 'center' }} />
                    <div style={{ color: 'var(--brown-light)', fontSize: '0.88rem', fontWeight: 700 }}>${perPerson.toFixed(2)} each</div>
                  </div>
                </div>
              )}

              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', fontWeight: 700, boxShadow: '0 4px 20px rgba(192,122,80,0.4)' }}>
                Review Order →
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>Attendee</div>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>{contact.name || '—'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{contact.email || '—'}</div>
                </div>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>Payment</div>
                  <div style={{ color: '#fff', fontSize: '0.85rem' }}>
                    {paymentType === 'split' ? `🤝 Split — ${splitCount} people × $${perPerson.toFixed(2)}` : `💳 Card ending in ${card.number.replace(/\s/g, '').slice(-4) || '••••'}`}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Total</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'DM Serif Display, serif' }}>{total === 0 ? 'Free' : `$${total.toFixed(2)}`}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(192,122,80,0.08)', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '20px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                By completing your purchase you agree to our Terms of Service. Tickets will be delivered to your email immediately after payment.
              </div>
              <button onClick={completeCheckout} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #C8A96E, #8B6914)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Serif Display, serif', fontSize: '1.05rem', letterSpacing: '0.08em', boxShadow: '0 4px 24px rgba(184,134,11,0.5)' }}>
                Complete Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}