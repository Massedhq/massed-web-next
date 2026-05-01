'use client'

import { useState, useRef } from 'react'

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

function validateUrl(url) {
  let u = url.trim()
  if (!u) return null
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u
  if (!/^https?:\/\/.+\..+/i.test(u)) return null
  return u
}

let idCounter = 1

export default function WebLinks() {
  const [links, setLinks] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editLink, setEditLink] = useState(null)
  const [addForm, setAddForm] = useState({ url: '', title: '', subtitle: '', cover: null })
  const [editForm, setEditForm] = useState({ url: '', title: '', subtitle: '', cover: null })
  const [urlError, setUrlError] = useState('')
  const [editUrlError, setEditUrlError] = useState('')
  const [toast, setToast] = useState('')
  const addFileRef = useRef(null)
  const editFileRef = useRef(null)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function handleCoverUpload(e, isEdit = false) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (isEdit) setEditForm(f => ({ ...f, cover: ev.target.result }))
      else setAddForm(f => ({ ...f, cover: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function saveLink() {
    const validated = validateUrl(addForm.url)
    if (!validated) { setUrlError('Please enter a valid URL (e.g. https://yourwebsite.com)'); return }
    if (!addForm.title.trim()) { showToast('Please enter a title for this link'); return }
    setUrlError('')
    setLinks(prev => [...prev, { id: idCounter++, url: validated, title: addForm.title.trim(), subtitle: addForm.subtitle.trim(), cover: addForm.cover, visible: true }])
    setAddForm({ url: '', title: '', subtitle: '', cover: null })
    setShowAdd(false)
    showToast('✓ Link added!')
  }

  function saveEdit() {
    const validated = validateUrl(editForm.url)
    if (!validated) { setEditUrlError('Please enter a valid URL'); return }
    if (!editForm.title.trim()) { showToast('Please enter a title'); return }
    setEditUrlError('')
    setLinks(prev => prev.map(l => l.id === editLink.id ? { ...l, url: validated, title: editForm.title.trim(), subtitle: editForm.subtitle.trim(), cover: editForm.cover ?? l.cover } : l))
    setEditLink(null)
    showToast('✓ Link updated!')
  }

  function deleteLink(id) {
    setLinks(prev => prev.filter(l => l.id !== id))
    showToast('Link removed')
  }

  function toggleVisibility(id) {
    const link = links.find(l => l.id === id)
    setLinks(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l))
    showToast(link?.visible ? 'Link hidden from your page' : '✓ Link visible on your page')
  }

  function copyLink(url) {
    navigator.clipboard?.writeText(url).then(() => showToast('✓ Link copied to clipboard!'))
  }

  function openEdit(link) {
    setEditLink(link)
    setEditForm({ url: link.url, title: link.title, subtitle: link.subtitle || '', cover: link.cover || null })
    setEditUrlError('')
  }

  const inp = (err) => ({ width: '100%', padding: '11px 14px', background: 'var(--cream)', border: `1.5px solid ${err ? '#dc2626' : 'var(--border)'}`, borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', color: 'var(--text)' })
  const lbl = { display: 'block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: 'var(--text)', margin: '0 0 5px' }}>Web Links</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', margin: 0 }}>Links that appear on your public MASSED page</p>
        </div>
        <button onClick={() => { setShowAdd(true); setUrlError(''); setAddForm({ url: '', title: '', subtitle: '', cover: null }) }} style={{ padding: '11px 22px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + Add Link
        </button>
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '64px 28px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--brown-bg)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No links yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Click <strong>Add Link</strong> to add your first link.</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '24px' }}>Your audience will see each one on your MASSED profile.</div>
          <button onClick={() => { setShowAdd(true); setUrlError('') }} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
            + Add Your First Link
          </button>
        </div>
      )}

      {/* Links grid */}
      {links.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {links.map(link => {
            const domain = getDomain(link.url)
            return (
              <div key={link.id} style={{ position: 'relative', borderRadius: '20px', background: '#f5ede8', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', opacity: link.visible ? 1 : 0.6, transition: 'box-shadow 0.22s, transform 0.22s' }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 10px 36px rgba(0,0,0,0.16)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'none' }}
              >
                {/* Cover */}
                {link.cover
                  ? <div style={{ height: '195px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}><img src={link.cover} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
                  : <div style={{ height: '195px', background: 'linear-gradient(145deg, #b8c2d0 0%, #8e9db4 50%, #6b7e96 100%)', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    </div>
                }

                {/* Action buttons overlay */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 10 }}>
                  {[
                    { fn: () => toggleVisibility(link.id), title: link.visible ? 'Hide' : 'Show', color: link.visible ? '#C07A50' : '#999',
                      icon: link.visible
                        ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        : <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    },
                    { fn: () => copyLink(link.url), title: 'Copy link', color: '#333', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                    { fn: () => openEdit(link), title: 'Edit', color: '#333', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                    { fn: () => deleteLink(link.id), title: 'Delete', color: '#ef4444', icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg> },
                  ].map((b, i) => (
                    <button key={i} onClick={b.fn} title={b.title} style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.88)', border: 'none', borderRadius: '50%', boxShadow: '0 1px 6px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.color }}>
                      {b.icon}
                    </button>
                  ))}
                </div>

                {/* White bubble panel */}
                <div style={{ padding: '0 10px 12px' }}>
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 18px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', marginTop: '-32px', position: 'relative' }}>
                    <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: '1.02rem', fontWeight: 700, color: '#111', lineHeight: 1.38, marginBottom: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {link.title || domain}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.6, marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {link.subtitle || `Visit ${domain}`}
                    </div>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 700, color: '#111', textDecoration: 'none' }}
                      onMouseOver={e => e.currentTarget.style.color = '#C07A50'}
                      onMouseOut={e => e.currentTarget.style.color = '#111'}
                    >
                      Learn More <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setShowAdd(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>Add Web Link</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>URL *</label><input type="url" value={addForm.url} onChange={e => { setAddForm(f => ({ ...f, url: e.target.value })); setUrlError('') }} placeholder="https://yourwebsite.com" style={inp(urlError)} />{urlError && <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '5px' }}>{urlError}</div>}</div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>Title *</label><input type="text" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. My TikTok" style={inp(false)} /></div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>Description (optional)</label><input type="text" value={addForm.subtitle} onChange={e => setAddForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Short description shown on card" style={inp(false)} /></div>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Cover Image (optional)</label>
              <input ref={addFileRef} type="file" accept="image/*" onChange={e => handleCoverUpload(e, false)} style={{ display: 'none' }} />
              <div onClick={() => addFileRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', background: 'var(--cream)', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {addForm.cover ? <img src={addForm.cover} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} /> : <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', padding: '20px' }}>Click to upload cover image</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px', background: 'var(--cream)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>Cancel</button>
              <button onClick={saveLink} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Add Link</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editLink && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setEditLink(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', margin: 0 }}>Edit Link</h2>
              <button onClick={() => setEditLink(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>URL *</label><input type="url" value={editForm.url} onChange={e => { setEditForm(f => ({ ...f, url: e.target.value })); setEditUrlError('') }} placeholder="https://yourwebsite.com" style={inp(editUrlError)} />{editUrlError && <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '5px' }}>{editUrlError}</div>}</div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>Title *</label><input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Link title" style={inp(false)} /></div>
            <div style={{ marginBottom: '14px' }}><label style={lbl}>Description (optional)</label><input type="text" value={editForm.subtitle} onChange={e => setEditForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Short description" style={inp(false)} /></div>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Cover Image</label>
              <input ref={editFileRef} type="file" accept="image/*" onChange={e => handleCoverUpload(e, true)} style={{ display: 'none' }} />
              <div onClick={() => editFileRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', background: 'var(--cream)', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {editForm.cover ? <img src={editForm.cover} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} /> : <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', padding: '16px' }}>Click to change cover image</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setEditLink(null)} style={{ flex: 1, padding: '11px', background: 'var(--cream)', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>Cancel</button>
              <button onClick={saveEdit} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}