'use client'

import { useState, useEffect, useRef } from 'react'

export default function Poll() {
  const [question, setQuestion] = useState('')
  const [opt1, setOpt1] = useState('')
  const [opt2, setOpt2] = useState('')
  const [opt3, setOpt3] = useState('')
  const [opt4, setOpt4] = useState('')
  const [duration, setDuration] = useState(0)
  const [active, setActive] = useState(false)
  const [votes, setVotes] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const voteInterval = useRef(null)
  const timerInterval = useRef(null)

  const durations = [
    { val: 0, label: 'No limit' },
    { val: 60, label: '1 min' },
    { val: 120, label: '2 min' },
    { val: 300, label: '5 min' },
    { val: 600, label: '10 min' },
    { val: 900, label: '15 min' },
  ]

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  function getFilledOpts() {
    return [opt1, opt2, opt3, opt4].filter(o => o.trim())
  }

  function launch() {
    if (!question.trim()) { alert('⚠️ Please add a poll question'); return }
    if (!opt1.trim() || !opt2.trim()) { alert('⚠️ Please add at least 2 options'); return }
    const filled = getFilledOpts()
    const initVotes = filled.map(() => Math.floor(Math.random() * 18) + 2)
    setVotes(initVotes)
    setActive(true)
    setTimeLeft(duration)

    voteInterval.current = setInterval(() => {
      setVotes(prev => {
        const next = [...prev]
        const idx = Math.floor(Math.random() * next.length)
        next[idx] += Math.floor(Math.random() * 3) + 1
        return next
      })
    }, 1800)

    if (duration > 0) {
      let remaining = duration
      timerInterval.current = setInterval(() => {
        remaining--
        setTimeLeft(remaining)
        if (remaining <= 0) endPoll()
      }, 1000)
    }
  }

  function endPoll() {
    if (voteInterval.current) clearInterval(voteInterval.current)
    if (timerInterval.current) clearInterval(timerInterval.current)
    setActive(false)
    setVotes([])
    setTimeLeft(0)
  }

  useEffect(() => () => {
    if (voteInterval.current) clearInterval(voteInterval.current)
    if (timerInterval.current) clearInterval(timerInterval.current)
  }, [])

  const filledOpts = getFilledOpts()
  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">Create Poll</h2>
        <p className="section-sub">Build polls for your live stream or pin them permanently to your link in bio</p>
      </div>

      {/* Live Poll section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'livepulse 1.5s infinite' }} />
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', color: 'var(--text)' }}>Live Poll</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '1px' }}>Launch a real-time poll during your live stream — viewers vote as you broadcast</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '860px', alignItems: 'start', marginBottom: '48px' }}>

        {/* LEFT: Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Question */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '16px' }}>Poll Question</div>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask your audience something…"
              maxLength={120}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'right' }}>{question.length}/120</div>
          </div>

          {/* Options */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '16px' }}>Answer Options</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { val: opt1, set: setOpt1, label: 'Option 1', required: true },
                { val: opt2, set: setOpt2, label: 'Option 2', required: true },
                { val: opt3, set: setOpt3, label: 'Option 3 (optional)', required: false },
                { val: opt4, set: setOpt4, label: 'Option 4 (optional)', required: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: i < 2 ? 'var(--brown)' : 'var(--cream3)', color: i < 2 ? '#fff' : 'var(--text-dim)', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <input
                    type="text"
                    value={item.val}
                    onChange={e => item.set(e.target.value)}
                    placeholder={item.label}
                    style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Poll Duration</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {durations.map(d => (
                <button key={d.val} onClick={() => setDuration(d.val)} style={{ padding: '9px 6px', borderRadius: '9px', border: `1.5px solid ${duration === d.val ? 'var(--brown)' : 'var(--border)'}`, background: duration === d.val ? 'var(--brown-bg2)' : 'var(--cream)', color: duration === d.val ? 'var(--brown-dark)' : 'var(--text-dim)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={launch} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            ▶ Launch Poll to Live
          </button>

          <button onClick={endPoll} style={{ width: '100%', padding: '12px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-mid)' }}>
            ⏹ End Active Poll
          </button>
        </div>

        {/* RIGHT: Phone preview */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px' }}>Live Preview</div>
          <div style={{ background: '#1a0d08', borderRadius: '36px', maxWidth: '260px', margin: '0 auto', padding: '16px 12px 20px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
              <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>9:41</span>
              <span style={{ color: '#fff', fontSize: '0.6rem' }}>•••</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.5rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>LIVE</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem' }}>👁 142</span>
            </div>

            {/* Poll card on phone */}
            <div style={{ background: 'rgba(20,12,4,0.9)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(192,122,80,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#D4956E', fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Live Poll</span>
                {active && duration > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.5rem' }}>{formatTime(timeLeft)}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.68rem', marginBottom: '10px', lineHeight: 1.4, color: question ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', fontStyle: question ? 'normal' : 'italic' }}>
                {question || 'Your question will appear here…'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {(filledOpts.length >= 2 ? filledOpts : ['Option 1', 'Option 2']).map((opt, i) => {
                  const pct = active && votes[i] !== undefined ? Math.round((votes[i] / totalVotes) * 100) : 0
                  return (
                    <div key={i} style={{ position: 'relative', cursor: 'pointer' }}>
                      {active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'rgba(192,122,80,0.28)', borderRadius: '6px', transition: 'width 0.4s' }} />}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '6px' }}>
                        <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>{opt}</span>
                        {active && <span style={{ color: '#D4956E', fontSize: '0.6rem', fontWeight: 800 }}>{pct}%</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Live results panel */}
          {active && (
            <div style={{ marginTop: '16px', background: 'var(--brown-bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '8px' }}>● Poll is live</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {filledOpts.map((opt, i) => {
                  const pct = votes[i] !== undefined ? Math.round((votes[i] / totalVotes) * 100) : 0
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{opt}</span>
                        <span style={{ fontWeight: 800, color: 'var(--brown)' }}>{pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--cream3)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--brown)', borderRadius: '4px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}