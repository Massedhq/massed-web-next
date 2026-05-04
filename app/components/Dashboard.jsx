'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [goLiveOpen, setGoLiveOpen] = useState(false)
  const [liveMode, setLiveMode] = useState('')

  const nav = (screen) => {
    setActive(screen)
    setSidebarOpen(false)
    setMenuOpen(false)
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const openGoLive = () => {
    setLiveMode('')
    setMenuOpen(false)
    setGoLiveOpen(true)
  }

  const sell = () => {
    nav('mystore')
  }

  const continueGoLive = () => {
    if (!liveMode) return

    setGoLiveOpen(false)

    if (liveMode === 'sell') {
      nav('mystore')
      return
    }

    if (liveMode === 'poll') {
      nav('createpoll')
      return
    }

    nav('livepreview')
  }

  return (
    <>
      {(sidebarOpen || menuOpen) && (
        <div
          className="sidebar-overlay active"
          onClick={() => {
            setSidebarOpen(false)
            setMenuOpen(false)
          }}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">M</span>
          <span className="logo-name">Massed</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => nav('dashboard')}>Dashboard</div>
          <div className="nav-item" onClick={() => nav('showcase')}>Showcase</div>
          <div className="nav-item" onClick={sell}>My Store</div>
        </nav>

        <div className="sidebar-bottom">
          <button className="btn-golive" onClick={openGoLive}>
            Go Live
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setSidebarOpen(true)}>☰</button>
            <span>{active}</span>
          </div>

          <div className="topbar-right">
            <button className="desktop-golive" onClick={openGoLive}>
              Go Live
            </button>

            <button onClick={sell}>
              Sell
            </button>

            <button onClick={() => setMenuOpen(true)}>
              ⋯
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              position: 'fixed',
              right: 16,
              top: 70,
              background: '#fff',
              borderRadius: 12,
              padding: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 2000,
            }}
          >
            <div onClick={openGoLive} style={{ padding: 10, cursor: 'pointer' }}>
              Go Live
            </div>

            <div onClick={sell} style={{ padding: 10, cursor: 'pointer' }}>
              Sell
            </div>

            <div onClick={logout} style={{ padding: 10, cursor: 'pointer', color: '#dc2626' }}>
              Log Out
            </div>
          </div>
        )}

        <div className="content">
          {active === 'dashboard' && (
            <div className="screen">
              <h1>Welcome to Massed</h1>
            </div>
          )}

          {active === 'mystore' && (
            <div className="screen">
              <h1>My Store</h1>
              <p>Sell products, services, courses, and digital downloads here.</p>
            </div>
          )}

          {active === 'createpoll' && (
            <div className="screen">
              <h1>Create Poll</h1>
              <p>Build a live poll for your audience.</p>
            </div>
          )}

          {active === 'livepreview' && (
            <div className="screen">
              <h1>Live Preview</h1>
              <p>Your live room preview will appear here.</p>
            </div>
          )}

          {!['dashboard', 'mystore', 'createpoll', 'livepreview'].includes(active) && (
            <div className="screen">
              <h1>{active}</h1>
              <p>No data yet. This section is ready to connect.</p>
            </div>
          )}
        </div>
      </div>

      {goLiveOpen && (
        <div
          onClick={() => setGoLiveOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#fff',
              borderRadius: '22px',
              padding: '26px',
              boxShadow: '0 18px 60px rgba(0,0,0,0.22)',
            }}
          >
            <h2 style={{ marginBottom: 6 }}>Go Live 🎙️</h2>
            <p style={{ color: '#58564F', lineHeight: 1.5 }}>
              Choose how you want to go live.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              {[
                ['live', '🔴', 'Go Live', 'Connect with your audience without selling.'],
                ['sell', '🛒', 'Go Live & Sell', 'Feature a product with a sale price and timer.'],
                ['poll', '📊', 'Go Live with a Poll', 'Launch a live poll your audience votes on.'],
              ].map(([mode, icon, title, desc]) => (
                <button
                  key={mode}
                  onClick={() => setLiveMode(mode)}
                  style={{
                    border: liveMode === mode ? '2px solid #C07850' : '1px solid #E0DED7',
                    background: liveMode === mode ? '#F5EDE6' : '#fff',
                    borderRadius: '16px',
                    padding: '18px 12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '26px', marginBottom: '8px' }}>{icon}</div>
                  <div style={{ fontWeight: 800, marginBottom: '6px' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: '#58564F', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '24px',
              }}
            >
              <button
                onClick={() => setGoLiveOpen(false)}
                style={{
                  border: '1px solid #E0DED7',
                  background: '#fff',
                  borderRadius: '999px',
                  padding: '11px 18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                disabled={!liveMode}
                onClick={continueGoLive}
                style={{
                  border: 'none',
                  background: liveMode ? '#0a0a0a' : '#C8C6BE',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '11px 18px',
                  fontWeight: 800,
                  cursor: liveMode ? 'pointer' : 'not-allowed',
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}