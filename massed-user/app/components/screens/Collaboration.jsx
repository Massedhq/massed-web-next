'use client'

import { useState } from 'react'

const collabProfiles = [
  { name: 'Avy Adore', tagline: 'Beauty & Real Estate Creator', genres: ['Beauty', 'Real Estate', 'Wellness'], color: '#8B6040', initials: 'AA', bio: 'Looking to collab with wellness and beauty brands for UGC and brand deals.' },
  { name: 'Shanay Evans', tagline: 'Lash Tech & MUA Artist', genres: ['Lash Tech', 'MUA Artist', 'Beauty'], color: '#d6249f', initials: 'SE', bio: 'Lash artist open to beauty collabs, product reviews and tutorials.' },
  { name: 'Erica Love', tagline: 'Nail Tech & Apparel', genres: ['Nail Tech', 'Apparel'], color: '#7c3aed', initials: 'EL', bio: 'Nail tech creating content around nail art and fashion styling.' },
  { name: 'Jordan Miles', tagline: 'Fitness Coach & Speaker', genres: ['Fitness', 'Speaker', 'Coaching'], color: '#2563eb', initials: 'JM', bio: 'Certified fitness coach looking for wellness and supplement brand collabs.' },
  { name: 'Nova Belle', tagline: 'Hair Products & Beauty', genres: ['Hair Products', 'Beauty', 'Apparel'], color: '#16a34a', initials: 'NB', bio: 'Natural hair creator open to product collaborations.' },
  { name: 'Kai Monroe', tagline: 'Real Estate & Finance', genres: ['Real Estate', 'Finance', 'Consulting'], color: '#ca8a04', initials: 'KM', bio: 'Real estate investor looking for finance and wealth collab opportunities.' },
  { name: 'Sara West', tagline: 'Esthetician & Wellness', genres: ['Esthetician', 'Wellness', 'Beauty'], color: '#db2777', initials: 'SW', bio: 'Licensed esthetician open to skincare and wellness brand collabs.' },
  { name: 'Marcus Bell', tagline: 'Digital Ebooks & Coaching', genres: ['Digital Ebooks', 'Coaching', 'Consulting'], color: '#0891b2', initials: 'MB', bio: 'Author and business coach looking for digital product collabs.' },
]

const allGenres = ['all', 'Beauty', 'Real Estate', 'Wellness', 'Lash Tech', 'MUA Artist', 'Nail Tech', 'Apparel', 'Fitness', 'Speaker', 'Coaching', 'Hair Products', 'Finance', 'Consulting', 'Esthetician', 'Digital Ebooks']

const initialRequests = [
  { id: 1, name: 'Nova Belle', tagline: 'Hair Products & Beauty', genres: ['Hair Products', 'Beauty'], color: '#16a34a', initials: 'NB', message: 'Hi! I love your content. Would love to collaborate on a beauty series!' },
  { id: 2, name: 'Marcus Bell', tagline: 'Digital Ebooks & Coaching', genres: ['Digital Ebooks', 'Coaching'], color: '#0891b2', initials: 'MB', message: 'Hey! Thinking we could do a joint digital product together. Let me know!' },
]

export default function Collaboration() {
  const [subTab, setSubTab] = useState('browse')
  const [activeFilter, setActiveFilter] = useState('all')
  const [requests, setRequests] = useState(initialRequests)
  const [activeCollabs, setActiveCollabs] = useState([])
  const [signedDocuments, setSignedDocuments] = useState([])
  const [toast, setToast] = useState('')
  const [openCollab, setOpenCollab] = useState(null)
  const [messages, setMessages] = useState({})
  const [msgInput, setMsgInput] = useState('')
  const [viewingDoc, setViewingDoc] = useState(null)
  const [docSearch, setDocSearch] = useState('')
  const [docNameFilter, setDocNameFilter] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function acceptRequest(id) {
    const req = requests.find(r => r.id === id)
    if (!req) return
    setRequests(prev => prev.filter(r => r.id !== id))
    setActiveCollabs(prev => [...prev, req])
    setMessages(prev => ({ ...prev, [id]: [] }))
    showToast(`✓ Collaboration with ${req.name} accepted! 🎉`)
    setSubTab('active')
  }

  function declineRequest(id) {
    const req = requests.find(r => r.id === id)
    setRequests(prev => prev.filter(r => r.id !== id))
    showToast(`Request from ${req?.name} declined.`)
  }

  function sendMessage() {
    if (!openCollab || !msgInput.trim()) return
    const id = openCollab.id
    setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), { sender: 'me', text: msgInput }] }))
    setMsgInput('')
    setTimeout(() => {
      setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), { sender: 'them', text: 'Thanks for your message! Looking forward to working together 🙌' }] }))
    }, 1500)
  }

  function downloadDoc(doc) {
    const blob = new Blob([doc.content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${doc.type}_${doc.collaborator.replace(/\s/g, '_')}_${doc.dateSigned.toISOString().slice(0, 10)}.txt`
    a.click()
    showToast('✓ Document downloaded!')
  }

  const filteredProfiles = activeFilter === 'all' ? collabProfiles : collabProfiles.filter(p => p.genres.includes(activeFilter))

  const collaboratorNames = [...new Set(signedDocuments.map(d => d.collaborator))]
  const filteredDocs = signedDocuments.filter(d => {
    const matchSearch = !docSearch || d.collaborator.toLowerCase().includes(docSearch.toLowerCase()) || d.dateSigned.toLocaleDateString().includes(docSearch)
    const matchName = !docNameFilter || d.collaborator === docNameFilter
    return matchSearch && matchName
  })

  const tabs = ['browse', 'incoming', 'active', 'documents']

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="section-header">
        <h2 className="section-title">Collaboration</h2>
        <p className="section-sub">Connect and collaborate with other MASSED creators</p>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', background: subTab === t ? 'var(--brown)' : 'transparent', color: subTab === t ? '#fff' : 'var(--text-dim)', transition: 'all 0.2s', position: 'relative' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'incoming' && requests.length > 0 && (
              <span style={{ marginLeft: '6px', background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem' }}>{requests.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* BROWSE TAB */}
      {subTab === 'browse' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {allGenres.map(g => (
              <button key={g} onClick={() => setActiveFilter(g)} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${activeFilter === g ? 'var(--brown)' : 'var(--border)'}`, background: activeFilter === g ? 'var(--brown)' : '#fff', color: activeFilter === g ? '#fff' : 'var(--text-dim)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>
                {g === 'all' ? 'All' : g}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filteredProfiles.map(p => (
              <div key={p.name} className="collab-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1px' }}>{p.tagline}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{p.bio}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {p.genres.map(g => (
                    <span key={g} style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700, background: 'var(--brown-bg)', color: 'var(--brown)' }}>{g}</span>
                  ))}
                </div>
                <button onClick={() => showToast(`Connection request sent to ${p.name}! 🤝`)} style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', marginTop: 'auto' }}>
                  Connect →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INCOMING TAB */}
      {subTab === 'incoming' && (
        <div>
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No incoming requests yet.</div>
          ) : requests.map(r => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>{r.initials}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{r.tagline}</div>
                </div>
              </div>
              {r.message && (
                <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: 'var(--text)', marginBottom: '12px', fontStyle: 'italic' }}>"{r.message}"</div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => declineRequest(r.id)} style={{ flex: 1, padding: '9px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>✕ Decline</button>
                <button onClick={() => acceptRequest(r.id)} style={{ flex: 2, padding: '9px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>✓ Accept Collaboration</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE TAB */}
      {subTab === 'active' && (
        <div>
          {activeCollabs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No active collaborations yet. Accept an incoming request to get started!</div>
          ) : activeCollabs.map(c => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', marginBottom: '12px', cursor: 'pointer' }} onClick={() => setOpenCollab(c)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>{c.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {(messages[c.id] || []).length ? messages[c.id][messages[c.id].length - 1].text : 'No messages yet'}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>Active</span>
              </div>
            </div>
          ))}

          {openCollab && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', marginTop: '16px' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: openCollab.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.82rem' }}>{openCollab.initials}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{openCollab.name}</div>
                <button onClick={() => setOpenCollab(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1.1rem' }}>✕</button>
              </div>
              <div style={{ padding: '16px', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--cream)' }}>
                {(messages[openCollab.id] || []).length === 0 ? (
                  <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim)' }}>Collaboration started — say hello! 👋</div>
                ) : (messages[openCollab.id] || []).map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '75%', background: m.sender === 'me' ? 'var(--brown)' : '#fff', color: m.sender === 'me' ? '#fff' : 'var(--text)', padding: '8px 12px', borderRadius: m.sender === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: '0.82rem', border: m.sender === 'me' ? 'none' : '1px solid var(--border)' }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message…" style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                <button onClick={sendMessage} style={{ padding: '9px 16px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Send</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {subTab === 'documents' && (
        <div>
          {/* Search + filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={docSearch}
              onChange={e => setDocSearch(e.target.value)}
              placeholder="Search by name or date…"
              style={{ flex: 1, minWidth: '200px', padding: '10px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }}
            />
            <select
              value={docNameFilter}
              onChange={e => setDocNameFilter(e.target.value)}
              style={{ padding: '10px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none', color: 'var(--text)' }}
            >
              <option value="">All Collaborators</option>
              {collaboratorNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {filteredDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📁</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                {signedDocuments.length === 0 ? 'No documents yet' : 'No documents match your search'}
              </div>
              <div style={{ fontSize: '0.78rem' }}>
                {signedDocuments.length === 0 ? 'When both parties sign an NDA it will automatically appear here.' : 'Try clearing your search or filter.'}
              </div>
            </div>
          ) : filteredDocs.map(doc => (
            <div key={doc.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{doc.type} — {doc.collaborator}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Signed {doc.dateSigned.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>✓ {doc.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => setViewingDoc(doc)} style={{ padding: '7px 12px', background: 'var(--brown-bg)', color: 'var(--brown)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>View</button>
                  <button onClick={() => downloadDoc(doc)} style={{ padding: '7px 12px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>⬇ Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Document Modal */}
      {viewingDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }} onClick={() => setViewingDoc(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '620px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1rem', margin: 0 }}>{viewingDoc.type} — {viewingDoc.collaborator}</h2>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '20px', overflowY: 'auto', flex: 1 }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', fontSize: '0.8rem', lineHeight: 1.9, color: '#222', margin: 0 }}>{viewingDoc.content}</pre>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexShrink: 0 }}>
              <button onClick={() => setViewingDoc(null)} className="btn-cancel">Close</button>
              <button onClick={() => downloadDoc(viewingDoc)} className="btn-confirm">⬇ Download NDA</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>
      )}
    </div>
  )
}