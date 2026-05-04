'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [goLiveOpen, setGoLiveOpen] = useState(false)
  const [liveMode, setLiveMode] = useState('')
  const [mounted, setMounted] = useState(false)

  // Ensures the app is ready before showing anything to stop the flicker
  useEffect(() => {
    setMounted(true)
  }, [])

  const nav = (screen) => {
    setActive(screen)
    setSidebarOpen(false)
    setMenuOpen(false)
    setGoLiveOpen(false)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }

  const goLive = () => {
    setMenuOpen(false)
    setGoLiveOpen(true)
  }

  const continueGoLive = () => {
    if (!liveMode) return
    if (liveMode === 'sell') nav('mystore')
    else if (liveMode === 'poll') nav('createpoll')
    else nav('golive')
  }

  if (!mounted) return <div style={{ background: '#fff', minHeight: '100vh' }} />;

  return (
    <>
      {/* OVERLAY - Always in the DOM, toggled via CSS class */}
      <div
        className={`sidebar-overlay ${sidebarOpen || menuOpen ? 'active' : ''}`}
        onClick={() => {
          setSidebarOpen(false)
          setMenuOpen(false)
        }}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">M</span>
          <span className="logo-name">Massed</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => nav('dashboard')}>Dashboard</div>
          <div className="nav-item" onClick={() => nav('showcase')}>Showcase</div>
          <div className="nav-item" onClick={() => nav('mystore')}>My Store</div>
        </nav>

        <div className="sidebar-bottom">
          <button className="btn-golive" onClick={goLive}>Go Live</button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
            <span style={{ textTransform: 'capitalize' }}>{active}</span>
          </div>

          <div className="topbar-right">
            <button className="desktop-golive" onClick={goLive}>Go Live</button>
            <button onClick={() => nav('mystore')}>Sell</button>
            <button onClick={() => setMenuOpen(!menuOpen)}>⋯</button>
          </div>
        </div>

        {/* DROPDOWN MENU */}
        <div 
          className={`mobile-dropdown ${menuOpen ? 'active' : ''}`}
          style={{
            display: menuOpen ? 'block' : 'none',
            position: 'fixed', right: 16, top: 70,
            background: '#fff', borderRadius: 12, padding: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2000
          }}
        >
          <div onClick={goLive} style={{ padding: 10, cursor: 'pointer' }}>Go Live</div>
          <div onClick={() => nav('mystore')} style={{ padding: 10, cursor: 'pointer' }}>Sell</div>
          <div onClick={logout} style={{ padding: 10, cursor: 'pointer', color: 'red' }}>Log Out</div>
        </div>

        <div className="content">
          {active === 'dashboard' && (
            <div className="screen"><h1>Welcome to Massed</h1></div>
          )}
          {active === 'golive' && (
            <div className="screen"><h1>Live Preview</h1></div>
          )}
          {active === 'createpoll' && (
            <div className="screen"><h1>Create Poll</h1></div>
          )}
          {active === 'mystore' && (
            <div className="screen"><h1>My Store</h1></div>
          )}
        </div>
      </div>

      {/* GO LIVE MODAL */}
      <div 
        className={`modal-container ${goLiveOpen ? 'active' : ''}`}
        style={{
          display: goLiveOpen ? 'flex' : 'none',
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 3000, alignItems: 'center', justifyContent: 'center', padding: 20
        }}
        onClick={() => setGoLiveOpen(false)}
      >
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 460, background: '#fff',
            borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-lg)'
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Go Live</h2>
          <p style={{ color: 'var(--g600)', marginBottom: 18 }}>Choose how you want to go live.</p>

          {[['live', 'Go Live'], ['sell', 'Go Live & Sell'], ['poll', 'Go Live with a Poll']].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setLiveMode(mode)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 10,
                borderRadius: 14, cursor: 'pointer', fontWeight: 700,
                border: liveMode === mode ? '2px solid var(--tc)' : '1px solid var(--g200)',
                background: liveMode === mode ? 'var(--tc-light)' : '#fff'
              }}
            >
              {label}
            </button>
          ))}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
            <button className="btn" onClick={() => setGoLiveOpen(false)} style={{ border: '1px solid var(--g200)', padding: '10px 20px' }}>
              Cancel
            </button>
            <button 
              className="btn" 
              onClick={continueGoLive} 
              disabled={!liveMode}
              style={{ 
                background: liveMode ? 'var(--black)' : 'var(--g300)', 
                color: '#fff', padding: '10px 20px' 
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  )
}