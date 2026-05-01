'use client'

import { useState, useRef, useEffect } from 'react'

const initialConversations = [
  { id: 1, name: '@maya_j', initials: 'MJ', color: '#7c3aed', preview: 'omg this is amazing 🔥', time: '2m', unread: 2, status: 'Online', messages: [
    { from: 'them', text: 'Hey! I just saw your new product drop 🔥', time: '10:22 AM' },
    { from: 'them', text: 'omg this is amazing 🔥', time: '10:23 AM' },
    { from: 'me', text: 'Thank you so much! It means a lot 💛', time: '10:25 AM' },
  ]},
  { id: 2, name: '@sarah_k', initials: 'SK', color: '#0891b2', preview: 'where can I buy??', time: '14m', unread: 1, status: 'Away', messages: [
    { from: 'them', text: 'where can I buy??', time: '9:50 AM' },
    { from: 'me', text: 'Check my store link in bio!', time: '9:52 AM' },
  ]},
  { id: 3, name: '@jones_r', initials: 'JR', color: '#16a34a', preview: 'just grabbed it! 🛒', time: '1h', unread: 0, status: 'Offline', messages: [
    { from: 'them', text: 'just grabbed it! 🛒', time: 'Yesterday' },
    { from: 'me', text: "You're going to love it!", time: 'Yesterday' },
    { from: 'them', text: "Can't wait for it to arrive", time: 'Yesterday' },
  ]},
  { id: 4, name: '@beauty.brand', initials: 'BB', color: '#d97706', preview: 'Collab opportunity?', time: '3h', unread: 0, status: 'Online', messages: [
    { from: 'them', text: "Hi! We'd love to collab with you on our new skincare line", time: 'Yesterday' },
    { from: 'me', text: "I'd love to hear more! Send me the details.", time: 'Yesterday' },
    { from: 'them', text: 'Collab opportunity?', time: 'Today' },
  ]},
]

const REPLIES = ['Got it! 👍', 'Thanks for reaching out!', "I'll get back to you soon.", 'That sounds great! 🙌']

function statusColor(status) {
  if (status === 'Online') return '#22c55e'
  if (status === 'Away') return '#f59e0b'
  return '#9ca3af'
}

function timeStr() {
  const now = new Date()
  const h = now.getHours(), m = now.getMinutes()
  return `${h}:${m < 10 ? '0' : ''}${m} ${h < 12 ? 'AM' : 'PM'}`
}

export default function Messages() {
  const [convos, setConvos] = useState(initialConversations.map(c => ({ ...c, messages: [...c.messages] })))
  const [activeId, setActiveId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const threadRef = useRef(null)

  const activeConvo = convos.find(c => c.id === activeId)

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [activeConvo?.messages?.length])

  function openConvo(id) {
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
    setActiveId(id)
  }

  function sendMessage() {
    if (!input.trim() || !activeId) return
    const ts = timeStr()
    setConvos(prev => prev.map(c => c.id === activeId
      ? { ...c, messages: [...c.messages, { from: 'me', text: input.trim(), time: ts }], preview: input.trim(), time: 'Just now' }
      : c
    ))
    setInput('')
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)]
      setConvos(prev => prev.map(c => c.id === activeId
        ? { ...c, messages: [...c.messages, { from: 'them', text: reply, time: ts }], preview: reply }
        : c
      ))
    }, 1500)
  }

  function msgAction(action) {
    if (!activeId) return
    const c = convos.find(x => x.id === activeId)
    if (action === 'mute') { alert(`🔇 ${c?.name} muted`) }
    else if (action === 'block') {
      if (confirm(`Block ${c?.name}? They will no longer be able to message you.`)) {
        setConvos(prev => prev.filter(x => x.id !== activeId))
        setActiveId(null)
      }
    } else if (action === 'delete') {
      if (confirm('Delete this conversation? This cannot be undone.')) {
        setConvos(prev => prev.filter(x => x.id !== activeId))
        setActiveId(null)
      }
    }
  }

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0)

  const filtered = convos.filter(c => {
    if (filter === 'unread' && c.unread === 0) return false
    if (filter === 'requests' && c.id !== 4) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.preview.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 className="section-title">My Messages</h2>
        <p className="section-sub">Communicate with your clients, fans, and collaborators</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', display: 'flex', height: '620px' }}>

        {/* LEFT: Conversation list */}
        <div style={{ width: '300px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* Search */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages…"
              style={{ width: '100%', padding: '9px 12px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {['all', 'unread', 'requests'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: '10px 6px', background: 'none', border: 'none', borderBottom: `2px solid ${filter === f ? 'var(--brown)' : 'transparent'}`, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: filter === f ? 700 : 600, color: filter === f ? 'var(--brown)' : 'var(--text-dim)' }}>
                {f === 'all' ? 'All' : f === 'unread' ? `Unread${totalUnread > 0 ? ` (${totalUnread})` : ''}` : 'Requests'}
              </button>
            ))}
          </div>

          {/* Convo list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>No messages found</div>
            ) : filtered.map(c => (
              <div
                key={c.id}
                onClick={() => openConvo(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer', background: c.id === activeId ? 'var(--cream)' : '#fff', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseOver={e => { if (c.id !== activeId) e.currentTarget.style.background = 'var(--cream)' }}
                onMouseOut={e => { if (c.id !== activeId) e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>{c.initials}</div>
                  <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', borderRadius: '50%', background: statusColor(c.status), border: '1.5px solid #fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ fontWeight: c.unread ? 800 : 600, fontSize: '0.85rem', color: 'var(--text)' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', flexShrink: 0 }}>{c.time}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{c.preview}</div>
                    {c.unread > 0 && <div style={{ background: 'var(--brown)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '20px', flexShrink: 0 }}>{c.unread}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Thread header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeConvo ? (
                <>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: activeConvo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>{activeConvo.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeConvo.name}</div>
                    <div style={{ fontSize: '0.72rem', color: statusColor(activeConvo.status), fontWeight: 600 }}>{activeConvo.status}</div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>Select a conversation</div>
              )}
            </div>
            {activeConvo && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { action: 'mute', label: '🔇', title: 'Mute' },
                  { action: 'block', label: '🚫', title: 'Block' },
                  { action: 'delete', label: '🗑', title: 'Delete' },
                ].map(btn => (
                  <button key={btn.action} onClick={() => msgAction(btn.action)} title={btn.title} style={{ width: '32px', height: '32px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Thread messages */}
          <div ref={threadRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--cream)' }}>
            {!activeConvo ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💬</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Select a conversation to start messaging</div>
                </div>
              </div>
            ) : activeConvo.messages.map((msg, i) => {
              const isMe = msg.from === 'me'
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: isMe ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: isMe ? 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))' : '#fff', color: isMe ? '#fff' : 'var(--text)', fontSize: '0.85rem', lineHeight: 1.5, boxShadow: '0 1px 4px rgba(44,26,14,0.08)' }}>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>{msg.time}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Compose */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, background: '#fff' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={activeConvo ? `Message ${activeConvo.name}…` : 'Select a conversation to reply…'}
              disabled={!activeConvo}
              style={{ flex: 1, padding: '10px 14px', background: activeConvo ? '#fff' : 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none', opacity: activeConvo ? 1 : 0.6 }}
            />
            <button onClick={sendMessage} disabled={!activeConvo || !input.trim()} style={{ padding: '10px 18px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '10px', cursor: activeConvo && input.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', opacity: activeConvo && input.trim() ? 1 : 0.4 }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}