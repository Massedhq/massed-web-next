'use client'

import { useState } from 'react'

const FIELD_TYPES = [
  { type: 'text', label: 'Short Text' },
  { type: 'textarea', label: 'Long Text' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'date', label: 'Date' },
  { type: 'select', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'signature', label: '✍️ Signature' },
]

const TYPE_LABELS = {
  text: 'Short Text', textarea: 'Long Text', email: 'Email',
  phone: 'Phone', date: 'Date', select: 'Dropdown',
  checkbox: 'Checkbox', signature: '✍️ Signature'
}

let fieldCounter = 0

function emptyForm() {
  return { id: null, title: '', type: '', desc: '', body: '', submitLabel: 'Submit', confirmMsg: '', fields: [], status: 'draft', responses: [] }
}

export default function Forms() {
  const [tab, setTab] = useState('all')
  const [forms, setForms] = useState([])
  const [building, setBuilding] = useState(false)
  const [current, setCurrent] = useState(emptyForm())
  const [toast, setToast] = useState('')
  const [sendModal, setSendModal] = useState(null)
  const [sendEmail, setSendEmail] = useState('')
  const [sendName, setSendName] = useState('')
  const [sendNote, setSendNote] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Field operations ──────────────────────────────────
  function addField(type) {
    fieldCounter++
    const defaultLabel = TYPE_LABELS[type] || 'Field'
    const newField = { id: 'field_' + fieldCounter, type, label: defaultLabel, required: false, options: type === 'select' ? ['Option 1', 'Option 2'] : [] }
    setCurrent(prev => ({ ...prev, fields: [...prev.fields, newField] }))
  }

  function removeField(id) {
    setCurrent(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }))
  }

  function updateField(id, key, val) {
    setCurrent(prev => ({ ...prev, fields: prev.fields.map(f => f.id === id ? { ...f, [key]: val } : f) }))
  }

  function addOption(fieldId) {
    setCurrent(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId
        ? { ...f, options: [...f.options, 'Option ' + (f.options.length + 1)] }
        : f
      )
    }))
  }

  function removeOption(fieldId, oi) {
    setCurrent(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId && f.options.length > 1
        ? { ...f, options: f.options.filter((_, j) => j !== oi) }
        : f
      )
    }))
  }

  function updateOption(fieldId, oi, val) {
    setCurrent(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId
        ? { ...f, options: f.options.map((o, j) => j === oi ? val : o) }
        : f
      )
    }))
  }

  // ── Save / Publish ────────────────────────────────────
  function saveForm(status) {
    if (!current.title.trim()) { showToast('⚠️ Please add a form title'); return false }
    if (status === 'active' && current.fields.length === 0) { showToast('⚠️ Add at least one field'); return false }

    const updated = { ...current, status }
    if (current.id) {
      setForms(prev => prev.map(f => f.id === current.id ? updated : f))
    } else {
      const newForm = { ...updated, id: 'form_' + Date.now() }
      setForms(prev => [...prev, newForm])
      setCurrent(newForm)
    }
    return true
  }

  function saveDraft() {
    if (saveForm('draft')) { setBuilding(false); showToast('📝 Form saved as draft') }
  }

  function publish() {
    if (saveForm('active')) { setBuilding(false); showToast('✓ Form published!') }
  }

  function deleteForm(id) {
    if (!confirm('Delete this form? This cannot be undone.')) return
    setForms(prev => prev.filter(f => f.id !== id))
    showToast('🗑 Form deleted')
  }

  function openBuilder(form) {
    setCurrent(form ? { ...form, fields: form.fields.map(f => ({ ...f })) } : emptyForm())
    setBuilding(true)
  }

  // ── Filter ────────────────────────────────────────────
  const allResponses = forms.flatMap(f => (f.responses || []).map(r => ({ form: f, resp: r })))
  const filtered = forms.filter(f => {
    if (tab === 'all') return true
    if (tab === 'active') return f.status === 'active'
    if (tab === 'draft') return f.status === 'draft'
    return true
  })

  // ── BUILDER VIEW ──────────────────────────────────────
  if (building) {
    return (
      <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

        {/* Builder header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <button onClick={() => setBuilding(false)} style={{ padding: '8px 14px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-mid)' }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>
            {current.id ? 'Edit Form' : 'New Form'}
          </h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={saveDraft} style={{ padding: '10px 18px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-mid)' }}>
              Save Draft
            </button>
            <button onClick={publish} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700 }}>
              Publish Form
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT: Builder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Form info */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Form Details</div>
              <div className="form-field">
                <label>Form Title *</label>
                <input type="text" value={current.title} onChange={e => setCurrent(c => ({ ...c, title: e.target.value }))} placeholder="e.g. Client Intake Form" />
              </div>
              <div className="form-field">
                <label>Form Type (optional)</label>
                <input type="text" value={current.type} onChange={e => setCurrent(c => ({ ...c, type: e.target.value }))} placeholder="e.g. NDA, Contract, Intake…" />
              </div>
              <div className="form-field">
                <label>Short Description</label>
                <input type="text" value={current.desc} onChange={e => setCurrent(c => ({ ...c, desc: e.target.value }))} placeholder="Brief description shown on the form" />
              </div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>Body / Clauses (optional)</label>
                <textarea value={current.body} onChange={e => setCurrent(c => ({ ...c, body: e.target.value }))} placeholder="Add contract terms, NDA clauses, or any text to appear before the fields…" style={{ minHeight: '100px' }} />
              </div>
            </div>

            {/* Add fields */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Add Fields</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '16px' }}>
                {FIELD_TYPES.map(ft => (
                  <button key={ft.type} onClick={() => addField(ft.type)} style={{ padding: '6px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-mid)' }}>
                    + {ft.label}
                  </button>
                ))}
              </div>

              {current.fields.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textAlign: 'center', padding: '22px 0', border: '1.5px dashed var(--border)', borderRadius: '10px' }}>Add fields using the buttons above</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {current.fields.map((field, idx) => (
                    <div key={field.id} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: field.type === 'signature' ? 'var(--brown)' : 'var(--text-dim)' }}>
                          {TYPE_LABELS[field.type]}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                            <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, 'required', e.target.checked)} style={{ accentColor: 'var(--brown)' }} /> Required
                          </label>
                          <button onClick={() => removeField(field.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1rem' }}>×</button>
                        </div>
                      </div>

                      {field.type === 'signature' ? (
                        <div style={{ height: '48px', border: '1.5px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Signature box</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={field.label}
                          onChange={e => updateField(field.id, 'label', e.target.value)}
                          placeholder="Field label"
                          style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                        />
                      )}

                      {field.type === 'select' && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {field.options.map((opt, oi) => (
                            <div key={oi} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => updateOption(field.id, oi, e.target.value)}
                                style={{ flex: 1, padding: '6px 9px', border: '1.5px solid var(--border)', borderRadius: '7px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', outline: 'none', background: '#fff' }}
                              />
                              {field.options.length > 1 && (
                                <button onClick={() => removeOption(field.id, oi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.9rem' }}>×</button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addOption(field.id)} style={{ padding: '4px 10px', background: 'none', border: '1px dashed var(--border)', borderRadius: '7px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-dim)', width: '100%' }}>
                            + Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit settings */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Submit Settings</div>
              <div className="form-field">
                <label>Submit Button Label</label>
                <input type="text" value={current.submitLabel} onChange={e => setCurrent(c => ({ ...c, submitLabel: e.target.value }))} placeholder="Submit" />
              </div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>Confirmation Message</label>
                <input type="text" value={current.confirmMsg} onChange={e => setCurrent(c => ({ ...c, confirmMsg: e.target.value }))} placeholder="e.g. Thanks! We'll be in touch soon." />
              </div>
            </div>

            {/* Send section */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Send to Someone</div>
              <div className="form-field">
                <label>Recipient Name</label>
                <input type="text" value={sendName} onChange={e => setSendName(e.target.value)} placeholder="Client name" />
              </div>
              <div className="form-field">
                <label>Recipient Email *</label>
                <input type="email" value={sendEmail} onChange={e => setSendEmail(e.target.value)} placeholder="client@email.com" />
              </div>
              <div className="form-field" style={{ margin: '0 0 14px' }}>
                <label>Personal Note (optional)</label>
                <textarea value={sendNote} onChange={e => setSendNote(e.target.value)} placeholder="Add a personal message…" style={{ minHeight: '60px' }} />
              </div>
              <button onClick={() => {
                if (!sendEmail.trim()) { showToast('⚠️ Please enter a recipient email'); return }
                if (!current.title.trim()) { showToast('⚠️ Please add a form title first'); return }
                if (current.fields.length === 0) { showToast('⚠️ Add at least one field first'); return }
                saveForm('active')
                const subject = encodeURIComponent('Form: ' + current.title)
                const body = encodeURIComponent((sendName ? `Hi ${sendName},\n\n` : '') + (sendNote ? sendNote + '\n\n' : '') + `Please complete the form "${current.title}".\n\n— Sent via MASSED`)
                window.location.href = `mailto:${sendEmail}?subject=${subject}&body=${body}`
                showToast('✉️ Email opened — form sent to ' + sendEmail)
              }} style={{ width: '100%', padding: '11px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700 }}>
                ✉️ Send via Email
              </button>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px' }}>Live Preview</div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {current.type && <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)' }}>{current.type}</div>}
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', color: 'var(--text)' }}>{current.title || 'Form title'}</div>
              {current.desc && <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{current.desc}</div>}
              {current.body && (
                <div style={{ background: 'var(--cream)', borderRadius: '10px', padding: '14px 16px', fontSize: '0.8rem', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap', border: '1px solid var(--border)' }}>
                  {current.body}
                </div>
              )}
              {current.fields.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>Fields will appear here as you add them</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {current.fields.map(field => {
                    const req = field.required ? <span style={{ color: '#dc2626' }}> *</span> : null
                    if (field.type === 'signature') return (
                      <div key={field.id}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '5px' }}>✍️ Signature{req}</div>
                        <div style={{ height: '56px', border: '1.5px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Sign here</span>
                        </div>
                      </div>
                    )
                    if (field.type === 'checkbox') return (
                      <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', border: '1.5px solid var(--border)', borderRadius: '4px', flexShrink: 0, background: 'var(--cream)' }} />
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>{field.label}{req}</div>
                      </div>
                    )
                    if (field.type === 'textarea') return (
                      <div key={field.id}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '5px' }}>{field.label}{req}</div>
                        <div style={{ height: '60px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--cream)', padding: '8px 10px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>Type here…</div>
                      </div>
                    )
                    if (field.type === 'select') return (
                      <div key={field.id}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '5px' }}>{field.label}{req}</div>
                        <div style={{ border: '1.5px solid var(--border)', borderRadius: '8px', padding: '8px 10px', background: 'var(--cream)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{field.options[0] || 'Select…'} ▾</div>
                      </div>
                    )
                    const ph = { email: 'email@example.com', phone: '+1 (000) 000-0000', date: 'MM / DD / YYYY' }[field.type] || 'Answer…'
                    return (
                      <div key={field.id}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '5px' }}>{field.label}{req}</div>
                        <div style={{ border: '1.5px solid var(--border)', borderRadius: '8px', padding: '8px 10px', background: 'var(--cream)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ph}</div>
                      </div>
                    )
                  })}
                </div>
              )}
              <button style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'default', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700 }}>
                {current.submitLabel || 'Submit'}
              </button>
            </div>
          </div>
        </div>

        {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">Forms</h2>
          <p className="section-sub">Build custom forms, NDAs, intake forms, and contracts — send directly to clients</p>
        </div>
        <button onClick={() => openBuilder(null)} style={{ padding: '12px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + New Form
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
        {['all', 'active', 'draft', 'responses'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', background: tab === t ? 'var(--brown)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-dim)', transition: 'all 0.2s' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* RESPONSES TAB */}
      {tab === 'responses' && (
        <div>
          {allResponses.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📬</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>No responses yet</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Responses will appear here once clients submit your forms.</div>
            </div>
          ) : allResponses.map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', marginBottom: '4px' }}>{item.form.title}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '4px' }}>{item.resp.from}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.resp.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* FORMS LIST */}
      {tab !== 'responses' && (
        filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '48px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>No forms yet</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Create your first form to send to clients.</div>
            <button onClick={() => openBuilder(null)} style={{ padding: '11px 24px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>+ New Form</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(f => (
              <div key={f.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    {f.type && <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', marginBottom: '4px' }}>{f.type}</div>}
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{f.title}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: f.status === 'active' ? '#22c55e' : 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {f.status === 'active' ? '● Active' : '○ Draft'}
                  </span>
                </div>
                {f.desc && <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{f.desc}</div>}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {f.fields.length} field{f.fields.length !== 1 ? 's' : ''} · {(f.responses || []).length} response{(f.responses || []).length !== 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  <button onClick={() => openBuilder(f)} style={{ flex: 1, padding: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)' }}>✏️ Edit</button>
                  <button onClick={() => setSendModal(f)} style={{ flex: 1, padding: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)' }}>📤 Send</button>
                  <button onClick={() => deleteForm(f.id)} style={{ padding: '8px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#dc2626' }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Send Modal */}
      {sendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setSendModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', margin: 0 }}>Send Form</h2>
              <button onClick={() => setSendModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Sending: <strong style={{ color: 'var(--text)' }}>{sendModal.title}</strong></div>
            <div className="form-field">
              <label>Recipient Name</label>
              <input type="text" value={sendName} onChange={e => setSendName(e.target.value)} placeholder="Client name" />
            </div>
            <div className="form-field">
              <label>Recipient Email *</label>
              <input type="email" value={sendEmail} onChange={e => setSendEmail(e.target.value)} placeholder="client@email.com" />
            </div>
            <div className="form-field">
              <label>Personal Note (optional)</label>
              <textarea value={sendNote} onChange={e => setSendNote(e.target.value)} placeholder="Add a personal message…" style={{ minHeight: '60px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setSendModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={() => {
                if (!sendEmail.trim()) { showToast('⚠️ Please enter a recipient email'); return }
                const subject = encodeURIComponent('Form: ' + sendModal.title)
                const body = encodeURIComponent((sendName ? `Hi ${sendName},\n\n` : '') + (sendNote ? sendNote + '\n\n' : '') + `Please complete the form "${sendModal.title}".\n\n— Sent via MASSED`)
                window.location.href = `mailto:${sendEmail}?subject=${subject}&body=${body}`
                setSendModal(null)
                showToast('✉️ Email opened for ' + sendModal.title)
              }} className="btn-confirm">✉️ Send via Email</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}