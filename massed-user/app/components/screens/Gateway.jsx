'use client'

import { useState, useEffect, useRef } from 'react'

const GW_IS_GRADUATED = true

const presenters = [
  { id: 1, name: 'Aaliyah Morris', initials: 'AM', title: 'Founder, NaturalGlow Skincare', category: 'Beauty', pitch: 'A clean, vegan skincare line built for melanin-rich skin tones. 3 hero products, zero harsh chemicals, already retailing in 4 boutiques.', signals: 14, ins: 6, shelf: 3, time: 'On now', feedback: [] },
  { id: 2, name: 'Devon Chase', initials: 'DC', title: 'CEO, ShiftLogic AI', category: 'Tech', pitch: 'An AI workflow tool that cuts admin time by 60% for solopreneurs. No code required. Monthly subscription model with a free tier.', signals: 9, ins: 4, shelf: 2, time: 'Up next', feedback: [] },
  { id: 3, name: 'Priya Nair', initials: 'PN', title: 'Creator, The Meal Shift', category: 'Food & Wellness', pitch: 'Weekly meal prep kits designed for busy professionals who want to eat whole foods without the planning. Launching in Q3.', signals: 7, ins: 2, shelf: 1, time: 'In 20 min', feedback: [] },
]

const FEEDBACK_TAGS = ['Strong idea', 'Felt polished', 'Clear offer', 'Delivery needs work', 'Not enough information', 'Could work', 'Too rushed', 'Loved it', 'Needs pricing info', 'Would buy this']

const LIVE_FEED_ITEMS = [
  ['📡', 'Someone signalled interest in Aaliyah Morris'],
  ['✅', "A viewer committed — I'm In"],
  ['📡', 'A business signalled Devon Chase'],
  ['💬', 'Feedback submitted for Aaliyah Morris'],
  ['📦', 'A business added Priya Nair to their shelf'],
  ['✅', "New commitment — I'm In for Devon Chase"],
  ['📡', '3 new signals in the last minute'],
]

export default function Gateway() {
  const [view, setView] = useState('landing') // 'landing' | 'attendee' | 'presenter'
  const [role, setRole] = useState(null)
  const [activePresenter, setActivePresenter] = useState(presenters[0])
  const [pData, setPData] = useState(presenters.map(p => ({ ...p, feedback: [] })))
  const [actions, setActions] = useState({}) // {presenterId: {signal, in, shelf}}
  const [confirm, setConfirm] = useState('')
  const [liveFeed, setLiveFeed] = useState([])
  const [dashTab, setDashTab] = useState('signals')
  const [myDash, setMyDash] = useState({ signals: [], ready: [], shelf: [], feedback: [] })
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackTags, setFeedbackTags] = useState([])
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const feedTimer = useRef(null)
  const feedIdx = useRef(0)

  function enter(selectedRole) {
    setRole(selectedRole)
    setView(selectedRole === 'presenter' ? 'presenter' : 'attendee')
    if (selectedRole !== 'presenter') startFeedSimulation()
  }

  function leave() {
    setRole(null)
    setView('landing')
    setActions({})
    setConfirm('')
    if (feedTimer.current) clearInterval(feedTimer.current)
  }

  function startFeedSimulation() {
    if (feedTimer.current) clearInterval(feedTimer.current)
    feedTimer.current = setInterval(() => {
      const item = LIVE_FEED_ITEMS[feedIdx.current % LIVE_FEED_ITEMS.length]
      setLiveFeed(prev => [item, ...prev].slice(0, 12))
      feedIdx.current++
    }, 4500)
  }

  useEffect(() => () => { if (feedTimer.current) clearInterval(feedTimer.current) }, [])

  function doAction(type) {
    const pid = activePresenter.id
    const already = actions[pid]?.[type]
    if (already) return

    setActions(prev => ({ ...prev, [pid]: { ...(prev[pid] || {}), [type]: true } }))
    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    if (type === 'signal') {
      setPData(prev => prev.map(p => p.id === pid ? { ...p, signals: p.signals + 1 } : p))
      setConfirm(`📡 Signal sent to ${activePresenter.name}! They'll follow up with you.`)
      setLiveFeed(prev => [['📡', `${role === 'business' ? 'A business' : 'Someone'} signalled interest in ${activePresenter.name}`], ...prev].slice(0, 12))
      setMyDash(prev => ({ ...prev, signals: [...prev.signals, { name: activePresenter.name, time: ts, role }] }))
    } else if (type === 'in') {
      setPData(prev => prev.map(p => p.id === pid ? { ...p, ins: p.ins + 1 } : p))
      setConfirm(`✅ You're In! ${activePresenter.name} has been notified of your commitment.`)
      setLiveFeed(prev => [['✅', `${role === 'business' ? 'A business' : 'Someone'} committed to ${activePresenter.name}`], ...prev].slice(0, 12))
      setMyDash(prev => ({ ...prev, ready: [...prev.ready, { name: activePresenter.name, time: ts, role }] }))
    } else if (type === 'shelf') {
      setPData(prev => prev.map(p => p.id === pid ? { ...p, shelf: p.shelf + 1 } : p))
      setConfirm(`📦 Added to your shelf! Distribution request sent to ${activePresenter.name}.`)
      setLiveFeed(prev => [['📦', `A business added ${activePresenter.name} to their shelf`], ...prev].slice(0, 12))
      setMyDash(prev => ({ ...prev, shelf: [...prev.shelf, { name: activePresenter.name, time: ts, role: 'business' }] }))
    }

    setTimeout(() => setConfirm(''), 4000)
  }

  function submitFeedback() {
    if (!feedbackTags.length && !feedbackMsg.trim()) { alert('Please select at least one tag or write a message'); return }
    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const entry = { tags: feedbackTags, msg: feedbackMsg.trim(), time: ts, role }
    setPData(prev => prev.map(p => p.id === activePresenter.id ? { ...p, feedback: [...p.feedback, entry] } : p))
    setMyDash(prev => ({ ...prev, feedback: [...prev.feedback, { presenter: activePresenter.name, ...entry }] }))
    setLiveFeed(prev => [['💬', `Feedback submitted for ${activePresenter.name}`], ...prev].slice(0, 12))
    setFeedbackOpen(false)
    setFeedbackTags([])
    setFeedbackMsg('')
  }

  const curP = pData.find(p => p.id === activePresenter.id) || pData[0]
  const curActions = actions[activePresenter.id] || {}

  // ── LANDING ─────────────────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(160deg,#0d0800,#1a0d00)', minHeight: 'calc(100vh - 60px)', margin: '-32px', padding: '48px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>🚪</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>Gateway Room</h2>
            <p id="gw-landing-sub" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: '0 auto' }}>
              {GW_IS_GRADUATED ? "You have presenter access. Choose how you'd like to enter." : "You're attending as a registered business."}
            </p>
          </div>

          {/* Role picker */}
          <div style={{ display: 'grid', gridTemplateColumns: GW_IS_GRADUATED ? '1fr 1fr' : '1fr', gap: '14px', maxWidth: '520px', margin: '0 auto 40px' }}>
            <button onClick={() => enter('business')} style={{ padding: '24px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '8px' }}>🏢</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Enter as Attendee</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>Signal interest & request distribution</div>
            </button>
            {GW_IS_GRADUATED && (
              <button onClick={() => enter('presenter')} style={{ padding: '24px 14px', background: 'rgba(192,122,80,0.15)', border: '1.5px solid rgba(192,122,80,0.5)', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
                <div style={{ fontSize: '1.7rem', marginBottom: '8px' }}>🎤</div>
                <div style={{ fontWeight: 700, color: '#D4956E', fontSize: '0.92rem' }}>Enter as Presenter</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>Graduated access — go live & view your dashboard</div>
              </button>
            )}
          </div>

          {/* Lineup */}
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Today's Lineup</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {presenters.map(p => (
                <div key={p.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>{p.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.title}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {p.id === 1 && <span style={{ width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'livepulse 1.5s infinite' }} />}
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: p.id === 1 ? '#ef4444' : 'var(--text-dim)' }}>{p.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── ATTENDEE VIEW ────────────────────────────────────────────────────────────
  if (view === 'attendee') {
    return (
      <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(160deg,#0d0800,#1a0d00)', minHeight: 'calc(100vh - 60px)', margin: '-32px', padding: '0', color: '#fff' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'livepulse 1.5s infinite' }} />
            <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>Gateway Room — Live</span>
          </div>
          <button onClick={leave} style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>Leave Room</button>
        </div>

        {/* Presenter tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', overflowX: 'auto' }}>
          {pData.map(p => (
            <button key={p.id} onClick={() => setActivePresenter(p)} style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${p.id === activePresenter.id ? '#D4956E' : 'transparent'}`, color: p.id === activePresenter.id ? '#D4956E' : 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: p.id === activePresenter.id ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '0', minHeight: 'calc(100vh - 130px)' }}>

          {/* Main: Presenter card */}
          <div style={{ padding: '24px', overflowY: 'auto' }}>

            {/* Presenter header */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#D4956E,#8B5E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>{activePresenter.initials}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{activePresenter.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{activePresenter.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(192,122,80,0.2)', color: '#D4956E', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{activePresenter.category}</span>
                    <span style={{ fontSize: '0.65rem', color: activePresenter.id === 1 ? '#ef4444' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{curP.time}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{activePresenter.pitch}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Signals', val: curP.signals, color: 'var(--brown-light)' },
                { label: "I'm In", val: curP.ins, color: '#22c55e' },
                { label: 'On Shelf', val: curP.shelf, color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: role === 'business' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <button onClick={() => doAction('signal')} style={{ padding: '14px', background: curActions.signal ? 'var(--brown-bg)' : '#fff', border: `1.5px solid ${curActions.signal ? 'var(--brown)' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: curActions.signal ? 'var(--brown)' : 'var(--text)', opacity: curActions.signal ? 0.8 : 1 }}>
                📡 Signal {curActions.signal && '✓'}
              </button>
              <button onClick={() => doAction('in')} style={{ padding: '14px', background: curActions.in ? '#f0fdf4' : '#fff', border: `1.5px solid ${curActions.in ? '#22c55e' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: curActions.in ? '#16a34a' : 'var(--text)', opacity: curActions.in ? 0.8 : 1 }}>
                ✅ I'm In {curActions.in && '✓'}
              </button>
              {role === 'business' && (
                <button onClick={() => doAction('shelf')} style={{ padding: '14px', background: curActions.shelf ? '#faf5ff' : '#fff', border: `1.5px solid ${curActions.shelf ? '#7c3aed' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: curActions.shelf ? '#7c3aed' : 'var(--text)', opacity: curActions.shelf ? 0.8 : 1 }}>
                  📦 Shelf {curActions.shelf && '✓'}
                </button>
              )}
            </div>

            <button onClick={() => setFeedbackOpen(true)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              💬 Give Feedback
            </button>

            {confirm && (
              <div style={{ marginTop: '12px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '12px 14px', fontSize: '0.82rem', color: '#22c55e', fontWeight: 600 }}>
                {confirm}
              </div>
            )}
          </div>

          {/* Right: Live feed */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '20px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>Live Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveFeed.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Activity will appear here…</div>
              ) : liveFeed.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>{item[0]}</span><span>{item[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback panel */}
        {feedbackOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setFeedbackOpen(false)}>
            <div style={{ background: '#1a0d00', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '20px 20px 0 0', padding: '28px 24px 36px', width: '100%', maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>Leave Feedback</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '18px' }}>For: {activePresenter.name} — {activePresenter.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {FEEDBACK_TAGS.map(tag => (
                  <button key={tag} onClick={() => setFeedbackTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} style={{ padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${feedbackTags.includes(tag) ? 'var(--brown)' : 'rgba(255,255,255,0.15)'}`, background: feedbackTags.includes(tag) ? 'var(--brown)' : 'transparent', color: feedbackTags.includes(tag) ? '#fff' : 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    {tag}
                  </button>
                ))}
              </div>
              <textarea value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)} placeholder="Write additional feedback (optional)…" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#fff', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box', marginBottom: '14px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setFeedbackOpen(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Cancel</button>
                <button onClick={submitFeedback} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>Submit Feedback</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── PRESENTER DASHBOARD ──────────────────────────────────────────────────────
  const myP = pData[0]
  const allFeedback = [...myDash.feedback, ...myP.feedback.map(f => ({ presenter: myP.name, ...f }))]
  if (allFeedback.length === 0) {
    allFeedback.push(
      { tags: ['Strong idea', 'Felt polished', 'Clear offer'], msg: 'Really compelling pitch, great energy!', time: '2:14 PM', role: 'public' },
      { tags: ['Delivery needs work', 'Not enough information'], msg: '', time: '2:16 PM', role: 'business' },
      { tags: ['Could work', 'Too rushed'], msg: 'Would love to see more about pricing.', time: '2:19 PM', role: 'public' },
    )
  }
  const tagCount = {}
  allFeedback.forEach(f => (f.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1 }))
  const topTags = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a])

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(160deg,#0d0800,#1a0d00)', minHeight: 'calc(100vh - 60px)', margin: '-32px', padding: '0', color: '#fff' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem' }}>🎤</span>
          <span style={{ fontWeight: 700, color: '#D4956E', fontSize: '0.9rem' }}>Presenter Dashboard</span>
        </div>
        <button onClick={leave} style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>Leave Room</button>
      </div>

      <div style={{ padding: '24px 28px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Signals', val: myDash.signals.length + myP.signals, color: 'var(--brown-light)' },
            { label: "I'm In", val: myDash.ready.length + myP.ins, color: '#22c55e' },
            { label: 'On Shelf', val: myDash.shelf.length + myP.shelf, color: '#a78bfa' },
            { label: 'Feedback', val: allFeedback.length, color: '#38bdf8' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          {['signals', 'ready', 'shelf', 'feedback'].map(t => (
            <button key={t} onClick={() => setDashTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${dashTab === t ? 'var(--brown)' : 'transparent'}`, color: dashTab === t ? 'var(--brown)' : 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: dashTab === t ? 700 : 600, cursor: 'pointer' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {dashTab === 'signals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myDash.signals.length === 0 && myP.signals === 0 ? (
              <EmptyState icon="📡" title="No signals yet" note="When attendees signal you, they'll appear here." />
            ) : [...myDash.signals, ...Array(myP.signals).fill({ name: myP.name, time: 'Live', role: 'public' })].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📡</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Signal #{i + 1}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.time} · {s.role === 'business' ? '🏢 Business' : '👁 Public'}</div>
                </div>
                <span style={{ fontSize: '0.68rem', background: 'var(--brown-bg)', color: 'var(--brown)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>New</span>
              </div>
            ))}
          </div>
        )}

        {dashTab === 'ready' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myDash.ready.length === 0 && myP.ins === 0 ? (
              <EmptyState icon="✅" title="No commitments yet" note="When attendees tap 'I'm In', they'll show here." />
            ) : [...myDash.ready, ...Array(myP.ins).fill({ time: 'Live', role: 'public' })].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#22c55e' }}>Committed — I'm In</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.time} · {s.role === 'business' ? '🏢 Business' : '👁 Public'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {dashTab === 'shelf' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myDash.shelf.length === 0 && myP.shelf === 0 ? (
              <EmptyState icon="📦" title="No shelf requests yet" note="Business attendees who request distribution will appear here." />
            ) : [...myDash.shelf, ...Array(myP.shelf).fill({ time: 'Live' })].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a78bfa' }}>Shelf / Distribution Request</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.time} · 🏢 Business Attendee</div>
                </div>
                <span style={{ fontSize: '0.68rem', background: '#faf5ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, border: '1px solid #ede9fe' }}>New</span>
              </div>
            ))}
          </div>
        )}

        {dashTab === 'feedback' && (
          <div>
            {topTags.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Top Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {topTags.map(t => (
                    <span key={t} style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--brown-bg)', color: 'var(--brown)', fontSize: '0.75rem', fontWeight: 700 }}>
                      {t} <span style={{ opacity: 0.7 }}>×{tagCount[t]}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allFeedback.map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px' }}>
                  {f.tags?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: f.msg ? '8px' : 0 }}>
                      {f.tags.map(t => (
                        <span key={t} style={{ padding: '3px 9px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {f.msg && <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{f.msg}"</div>}
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>{f.time} · {f.role === 'business' ? '🏢 Business' : '👁 Public'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, title, note }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px', color: '#fff' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{note}</div>
    </div>
  )
}