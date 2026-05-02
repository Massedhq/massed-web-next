'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const nav = (screen) => {
    setActive(screen)
    setSidebarOpen(false)
  }

  const logout = () => {
    if (typeof window !== 'undefined' && window.signOut) {
      window.signOut()
      return
    }

    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <>
      <div
        className="sidebar-overlay"
        id="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        style={{ display: sidebarOpen ? 'block' : undefined }}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="main-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">M</span>
          <span className="logo-name">Massed</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-header">
            <span>Main</span>
          </div>

          <div className="nav-group-body">
            <div className={`nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => nav('dashboard')}>
              Dashboard
            </div>

            <div className={`nav-item ${active === 'showcase' ? 'active' : ''}`} onClick={() => nav('showcase')}>
              Showcase
            </div>

            <div className={`nav-item ${active === 'mystore' ? 'active' : ''}`} onClick={() => nav('mystore')}>
              My Store
            </div>

            <div className={`nav-item ${active === 'digital' ? 'active' : ''}`} onClick={() => nav('digital')} style={{ paddingLeft: '36px', fontSize: '0.82rem' }}>
              Digital Products
            </div>

            <div className={`nav-item ${active === 'physical' ? 'active' : ''}`} onClick={() => nav('physical')} style={{ paddingLeft: '36px', fontSize: '0.82rem' }}>
              Physical Products
            </div>

            <div className={`nav-item ${active === 'courses' ? 'active' : ''}`} onClick={() => nav('courses')} style={{ paddingLeft: '36px', fontSize: '0.82rem' }}>
              Courses
            </div>
          </div>

          <div className="nav-group-header">
            <span>Build</span>
          </div>

          <div className="nav-group-body">
            {[
              ['weblinks', 'Web Links'],
              ['booking', 'Booking / Your Services'],
              ['subs', 'Subscriptions / Memberships / Subs'],
              ['tickets', 'Events / Tickets'],
              ['listings', 'Listings'],
              ['createpoll', 'Create Poll'],
              ['forms', 'Forms'],
            ].map(([key, label]) => (
              <div key={key} className={`nav-item ${active === key ? 'active' : ''}`} onClick={() => nav(key)}>
                {label}
              </div>
            ))}
          </div>

          <div className="nav-group-header">
            <span>Profile</span>
          </div>

          <div className="nav-group-body">
            {[
              ['mediaprofile', 'Media Profile'],
              ['sociallinks', 'Social Links'],
              ['video', 'Video'],
              ['promo', 'Promo / Referrals / Affiliates'],
              ['browsericon', 'Branding / Browser Icon'],
            ].map(([key, label]) => (
              <div key={key} className={`nav-item ${active === key ? 'active' : ''}`} onClick={() => nav(key)}>
                {label}
              </div>
            ))}
          </div>

          <div className="nav-group-header">
            <span>Finance</span>
          </div>

          <div className="nav-group-body">
            {[
              ['analytics', 'Analytics'],
              ['salespayouts', 'Sales & Payouts'],
              ['payoutsettings', 'Payout Settings'],
            ].map(([key, label]) => (
              <div key={key} className={`nav-item ${active === key ? 'active' : ''}`} onClick={() => nav(key)}>
                {label}
              </div>
            ))}
          </div>

          <div className="nav-group-header">
            <span>Trust & Community</span>
          </div>

          <div className="nav-group-body">
            {[
              ['gateway', 'Gateway Room'],
              ['reviews', 'Reviews'],
              ['scanner', 'Scanner'],
              ['messages', 'My Messages'],
              ['bannedblocked', 'Banned / Blocked'],
              ['sparkfounder', 'Spark Founder'],
            ].map(([key, label]) => (
              <div key={key} className={`nav-item ${active === key ? 'active' : ''}`} onClick={() => nav(key)}>
                {label}
              </div>
            ))}
          </div>

          <div className="nav-group-header">
            <span>System</span>
          </div>

          <div className="nav-group-body">
            <div className={`nav-item ${active === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')}>
              Settings
            </div>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div id="sidebar-avatar" className="user-avatar">U</div>
            <div>
              <div id="sidebar-name" className="user-name">Loading...</div>
              <div id="sidebar-handle" className="user-handle">@username</div>
            </div>
          </div>

          <div className="bottom-btns">
            <button className="btn-golive">Go Live</button>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="hamburger"
              id="hamburger-btn"
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <span className="topbar-title" id="page-title">
              {active === 'dashboard' ? 'Dashboard' : active}
            </span>
          </div>

          <div className="topbar-right">
            <button className="desktop-golive">
              Go Live
            </button>

            <div className="link-badge" id="dual-link-badge">
              <span id="nav-profile-link">massed.io/username</span>
            </div>

            <button className="btn-logout" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>

        <div className="content">
          {active === 'dashboard' ? (
            <div id="screen-dashboard" className="screen active">
              <div id="dashboard-welcome" className="welcome-wrap">
                <div className="welcome-card">
                  <div className="welcome-icon" style={{ background: 'transparent' }}>
                    <img
                      src="/safe.png"
                      alt="Massed"
                      style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'contain',
                        borderRadius: '16px',
                      }}
                    />
                  </div>

                  <h1 className="welcome-title">Welcome to MASSED</h1>

                  <p className="welcome-sub">
                    Built for those who overstand presence is power. Set up your profile,
                    add your links, go live, and bring your public profile to life.
                  </p>

                  <button className="btn-start" onClick={() => nav('mediaprofile')}>
                    Start Here →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="screen active">
              <div className="welcome-wrap">
                <div className="welcome-card">
                  <h1 className="welcome-title">
                    {active.replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </h1>

                  <p className="welcome-sub">
                    No data yet. This section is ready to connect.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}