'use client'

import { useState } from 'react'

function formatCard(val) {
  return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
}

export default function Billing() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Jane Creator', number: '•••• •••• •••• 4242', expiry: '09/27', brand: 'Visa', default: true }
  ])
  const [showAddCard, setShowAddCard] = useState(false)
  const [showUpdateCard, setShowUpdateCard] = useState(null)
  const [receipts, setReceipts] = useState({
    '@lashartist': { id: 'RCP-001823', handle: '@lashartist', amount: '$80', sentTo: '@lashartist (Stripe — bank on file)', date: 'April 20, 2026', time: '5:34 PM', status: 'Completed' }
  })
  const [viewReceipt, setViewReceipt] = useState(null)
  const [apiKeys, setApiKeys] = useState({ stripe: '', paypal: '', cashapp: '' })
  const [customApiName, setCustomApiName] = useState('')
  const [customApiKey, setCustomApiKey] = useState('')
  const [toast, setToast] = useState('')

  // Add card form
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' })

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function saveCard(isUpdate = false) {
    if (!cardForm.name.trim()) { showToast('Please enter cardholder name'); return }
    if (cardForm.number.replace(/\s/g, '').length < 15) { showToast('Please enter a valid card number'); return }
    if (!cardForm.expiry.trim()) { showToast('Please enter expiry date'); return }
    if (cardForm.cvv.length < 3) { showToast('Please enter CVV'); return }
    const last4 = cardForm.number.replace(/\s/g, '').slice(-4)
    if (isUpdate && showUpdateCard) {
      setPaymentMethods(prev => prev.map(m => m.id === showUpdateCard
        ? { ...m, name: cardForm.name, number: `•••• •••• •••• ${last4}`, expiry: cardForm.expiry }
        : m
      ))
      setShowUpdateCard(null)
      showToast('✓ Payment method updated!')
    } else {
      setPaymentMethods(prev => [...prev, { id: Date.now(), name: cardForm.name, number: `•••• •••• •••• ${last4}`, expiry: cardForm.expiry, brand: 'Card', default: false }])
      setShowAddCard(false)
      showToast('✓ Payment method added successfully!')
    }
    setCardForm({ name: '', number: '', expiry: '', cvv: '' })
  }

  function saveApiKey(service) {
    if (!apiKeys[service]?.trim()) { showToast('Please enter an API key'); return }
    showToast(`✓ ${service.charAt(0).toUpperCase() + service.slice(1)} connected!`)
  }

  function saveCustomApi() {
    if (!customApiName.trim()) { showToast('Please enter a service name'); return }
    if (!customApiKey.trim()) { showToast('Please enter an API key'); return }
    showToast(`✓ ${customApiName} API connected!`)
    setCustomApiName('')
    setCustomApiKey('')
  }

  const CardForm = ({ isUpdate, onSave, onCancel }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="form-field"><label>Cardholder Name *</label><input type="text" value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} placeholder="Name on card" /></div>
      <div className="form-field"><label>Card Number *</label><input type="text" value={cardForm.number} onChange={e => setCardForm(f => ({ ...f, number: formatCard(e.target.value) }))} placeholder="0000  0000  0000  0000" maxLength={19} style={{ fontFamily: 'monospace' }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="form-field" style={{ margin: 0 }}><label>Expiry *</label><input type="text" value={cardForm.expiry} onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))} placeholder="MM / YY" maxLength={7} /></div>
        <div className="form-field" style={{ margin: 0 }}><label>CVV *</label><input type="text" value={cardForm.cvv} onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="•••" maxLength={4} style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }} /></div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button onClick={onCancel} className="btn-cancel">Cancel</button>
        <button onClick={() => onSave(isUpdate)} className="btn-confirm">{isUpdate ? 'Update Card' : 'Add Card'}</button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="section-header">
        <h2 className="section-title">Billing</h2>
        <p className="section-sub">Manage your payment methods, API integrations, and view receipts</p>
      </div>

      {/* Payment Methods */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)' }}>Payment Methods</div>
          <button onClick={() => { setShowAddCard(true); setShowUpdateCard(null) }} style={{ padding: '7px 14px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>+ Add Card</button>
        </div>

        {showAddCard && (
          <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '14px' }}>Add New Card</div>
            <CardForm isUpdate={false} onSave={() => saveCard(false)} onCancel={() => setShowAddCard(false)} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {paymentMethods.map(m => (
            <div key={m.id}>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '28px', background: '#1a1a2e', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', flexShrink: 0 }}>{m.brand.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', fontFamily: 'monospace' }}>{m.number}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{m.name} · Expires {m.expiry}</div>
                </div>
                {m.default && <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>Default</span>}
                <button onClick={() => { setShowUpdateCard(m.id); setShowAddCard(false) }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-mid)' }}>Update</button>
                {!m.default && <button onClick={() => setPaymentMethods(prev => prev.filter(x => x.id !== m.id))} style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Remove</button>}
              </div>
              {showUpdateCard === m.id && (
                <div style={{ background: 'var(--cream)', borderRadius: '0 0 12px 12px', padding: '18px', borderTop: '1px solid var(--border)' }}>
                  <CardForm isUpdate={true} onSave={() => saveCard(true)} onCancel={() => setShowUpdateCard(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* API Integrations */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '18px' }}>Payment API Integrations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {['stripe', 'paypal', 'cashapp'].map(svc => (
            <div key={svc} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div className="form-field" style={{ flex: 1, margin: 0 }}>
                <label>{svc.charAt(0).toUpperCase() + svc.slice(1)} API Key</label>
                <input type="text" value={apiKeys[svc]} onChange={e => setApiKeys(prev => ({ ...prev, [svc]: e.target.value }))} placeholder={`Enter ${svc} API key…`} />
              </div>
              <button onClick={() => saveApiKey(svc)} style={{ padding: '11px 16px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0, marginBottom: '14px' }}>Connect</button>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '10px' }}>Custom Integration</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div className="form-field" style={{ margin: 0 }}><label>Service Name</label><input type="text" value={customApiName} onChange={e => setCustomApiName(e.target.value)} placeholder="e.g. Square, Braintree…" /></div>
              <div className="form-field" style={{ margin: 0 }}><label>API Key</label><input type="text" value={customApiKey} onChange={e => setCustomApiKey(e.target.value)} placeholder="Enter API key…" /></div>
            </div>
            <button onClick={saveCustomApi} style={{ padding: '10px 18px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-mid)' }}>Save Custom API</button>
          </div>
        </div>
      </div>

      {/* Receipts */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '18px' }}>Payment Receipts</div>
        {Object.keys(receipts).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No receipts yet</div>
        ) : Object.values(receipts).map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--cream2)', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.handle}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{r.id} · {r.date} at {r.time}</div>
            </div>
            <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>{r.amount}</span>
            <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>{r.status}</span>
            <button onClick={() => setViewReceipt(r)} style={{ padding: '5px 12px', background: 'var(--brown-bg)', color: 'var(--brown)', border: '1px solid var(--border)', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>View Receipt</button>
          </div>
        ))}
      </div>

      {/* Receipt Modal */}
      {viewReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setViewReceipt(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem' }}>Payment Receipt</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>{viewReceipt.id}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--cream)', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
              {[
                { label: 'Paid To', val: viewReceipt.handle },
                { label: 'Amount', val: viewReceipt.amount },
                { label: 'Sent To', val: viewReceipt.sentTo },
                { label: 'Date', val: `${viewReceipt.date} at ${viewReceipt.time}` },
                { label: 'Status', val: viewReceipt.status },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.label === 'Status' ? '#16a34a' : 'var(--text)' }}>{row.val}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewReceipt(null)} className="btn-save" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}