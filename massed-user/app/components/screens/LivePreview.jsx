'use client'

import { useState, useEffect, useRef } from 'react'

export default function LivePreview({ user, liveConfig, onEndLive }) {
  const [duration, setDuration] = useState(0)
  const [viewers, setViewers] = useState(142)
  const [paused, setPaused] = useState(false)
  const [productVisible, setProductVisible] = useState(!!liveConfig?.product)
  const [timerSecs, setTimerSecs] = useState((liveConfig?.timerMins || 0) * 60)
  const [pollVotes, setPollVotes] = useState(
    liveConfig?.options ? liveConfig.options.map(() => Math.floor(Math.random() * 18) + 2) : []
  )

  const durationRef = useRef(null)
  const viewerRef = useRef(null)
  const timerRef = useRef(null)
  const pollRef = useRef(null)

  const name = user?.full_name || user?.name || 'Your Name'
  const username = user?.username || 'username'

  useEffect(() => {
    // Duration counter
    durationRef.current = setInterval(() => setDuration(d => d + 1), 1000)

    // Viewer count fluctuation
    viewerRef.current = setInterval(() => {
      setViewers(v => Math.max(1, v + Math.floor(Math.random() * 5) - 1))
    }, 4000)

    // Sale timer countdown
    if (liveConfig?.timerMins > 0) {
      timerRef.current = setInterval(() => {
        setTimerSecs(s => {
          if (s <= 1) {
            clearInterval(timerRef.current)
            setProductVisible(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }

    // Poll votes simulation
    if (liveConfig?.mode === 'poll' && liveConfig?.options) {
      pollRef.current = setInterval(() => {
        setPollVotes(prev => {
          const next = [...prev]
          const idx = Math.floor(Math.random() * next.length)
          next[idx] += Math.floor(Math.random() * 3) + 1
          return next
        })
      }, 1800)
    }

    return () => {
      clearInterval(durationRef.current)
      clearInterval(viewerRef.current)
      clearInterval(timerRef.current)
      clearInterval(pollRef.current)
    }
  }, [])

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function formatTimer(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  function handleEndLive() {
    if (!confirm('Are you sure you want to end your live session?')) return
    clearInterval(durationRef.current)
    clearInterval(viewerRef.current)
    clearInterval(timerRef.current)
    clearInterval(pollRef.current)
    onEndLive?.()
  }

  const salePrice = liveConfig?.salePrice || 0
  const origPrice = salePrice > 0 ? (salePrice * 1.3) : 0
  const discPct = origPrice > 0 ? Math.round(((origPrice - salePrice) / origPrice) * 100) : 0
  const totalVotes = pollVotes.reduce((a, b) => a + b, 0) || 1

  return (
    <div style={{ display: 'flex', background: '#111', minHeight: 'calc(100vh - 60px)', margin: '-32px', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>

      {/* LEFT: Phone mockup */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
        <div style={{ width: '280px', background: '#000', borderRadius: '40px', border: '8px solid #2a2a2a', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
          {/* Phone status bar */}
          <div style={{ height: '28px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>9:41</span>
            <span style={{ color: '#fff', fontSize: '0.6rem' }}>●●●</span>
          </div>

          {/* Phone content */}
          <div style={{ background: 'linear-gradient(180deg, #1a0a00, #2d1500 40%, #1a0a00)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* Live header */}
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!paused && <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', animation: 'livepulse 1.5s infinite' }} />}
                <span style={{ background: paused ? '#888' : '#ef4444', color: '#fff', fontSize: '0.5rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>{paused ? 'PAUSED' : 'LIVE'}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.55rem' }}>{formatTime(duration)}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem' }}>👁 {viewers}</span>
            </div>

            {/* Profile */}
            <div style={{ padding: '0 14px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', border: '2px solid #ef4444', flexShrink: 0 }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.7rem', color: '#fff' }}>{name}</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)' }}>massed.io/{username}</div>
              </div>
            </div>

            {/* Product card */}
            {liveConfig?.mode === 'sell' && productVisible && (
              <div style={{ margin: '0 10px 10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🛍️ Featured Product</span>
                  {timerSecs > 0 && <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700 }}>⏱ {formatTimer(timerSecs)}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#fff', marginBottom: '5px' }}>{liveConfig.product?.split('|')[0] || liveConfig.product}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 900, color: '#22c55e', fontSize: '0.9rem' }}>${salePrice.toFixed(2)}</span>
                  {origPrice > salePrice && (
                    <>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>${origPrice.toFixed(2)}</span>
                      <span style={{ fontSize: '0.55rem', background: '#22c55e', color: '#fff', padding: '1px 5px', borderRadius: '6px', fontWeight: 700 }}>{discPct}% OFF</span>
                    </>
                  )}
                </div>
                <button style={{ width: '100%', marginTop: '8px', padding: '7px', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.65rem', cursor: 'pointer' }}>
                  Buy Now
                </button>
              </div>
            )}

            {/* Poll card */}
            {liveConfig?.mode === 'poll' && (
              <div style={{ margin: '0 10px 10px', background: 'rgba(20,12,4,0.9)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(192,122,80,0.25)' }}>
                <div style={{ fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4956E', marginBottom: '8px' }}>📊 Live Poll</div>
                <div style={{ fontWeight: 700, fontSize: '0.68rem', color: '#fff', marginBottom: '10px', lineHeight: 1.4 }}>{liveConfig.question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {liveConfig.options.map((opt, i) => {
                    const pct = Math.round((pollVotes[i] / totalVotes) * 100)
                    return (
                      <div key={i} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'rgba(192,122,80,0.28)', borderRadius: '6px', transition: 'width 0.4s' }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', border: '1px solid rgba(192,122,80,0.2)', borderRadius: '6px' }}>
                          <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>{opt}</span>
                          <span style={{ color: '#D4956E', fontSize: '0.6rem', fontWeight: 800 }}>{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Chat simulation */}
            <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '5px', paddingBottom: '10px' }}>
              {[
                { name: 'user123', msg: '🔥🔥🔥' },
                { name: 'sarah_b', msg: 'Love this!' },
                { name: 'mk_vibes', msg: 'Where do I buy?' },
              ].map((c, i) => (
                <div key={i} style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#D4956E', fontWeight: 700 }}>{c.name} </span>{c.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={{ width: '320px', background: '#1a1a1a', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column', padding: '24px', gap: '16px', overflowY: 'auto' }}>

        {/* Live status */}
        <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {!paused && <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'livepulse 1.5s infinite' }} />}
            <span style={{ fontWeight: 700, color: paused ? '#888' : '#ef4444', fontSize: '0.85rem' }}>{paused ? '⏸ Paused' : '🔴 Live'}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Duration</div>
              <div style={{ fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{formatTime(duration)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Viewers</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>{viewers}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setPaused(p => !p)} style={{ flex: 1, padding: '10px', background: paused ? '#dcfce7' : '#fef3c7', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: paused ? '#16a34a' : '#d97706' }}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button onClick={handleEndLive} style={{ flex: 1, padding: '10px', background: '#fee2e2', border: 'none', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#dc2626' }}>
            ⏹ End Live
          </button>
        </div>

        {/* Product controls */}
        {liveConfig?.mode === 'sell' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>Product Controls</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setProductVisible(false)} style={{ flex: 1, padding: '9px', background: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>Hide Product</button>
              <button onClick={() => setProductVisible(true)} style={{ flex: 1, padding: '9px', background: 'var(--brown)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>Show Product</button>
            </div>
            {timerSecs > 0 && (
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#ef4444', fontWeight: 700, textAlign: 'center' }}>
                ⏱ Sale ends in {formatTimer(timerSecs)}
              </div>
            )}
          </div>
        )}

        {/* Poll results */}
        {liveConfig?.mode === 'poll' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>Live Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveConfig.options.map((opt, i) => {
                const pct = Math.round((pollVotes[i] / totalVotes) * 100)
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{opt}</span>
                      <span style={{ color: 'var(--brown-light)', fontWeight: 800 }}>{pct}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#444', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--brown)', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* URL display */}
        <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Your Live URL</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#D4956E' }}>massed.io/{username}</div>
        </div>
      </div>
    </div>
  )
}