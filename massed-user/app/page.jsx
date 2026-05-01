'use client'

import { useState, useEffect } from 'react'
import { useUser } from './hooks/useUser'
import Sidebar from './components/Sidebar'

import Dashboard from './components/screens/Dashboard'
import Showcase from './components/screens/Showcase'
import Booking from './components/screens/Booking'
import Collaboration from './components/screens/Collaboration'
import Forms from './components/screens/Forms'
import Listings from './components/screens/Listings'
import Messages from './components/screens/Messages'
import Poll from './components/screens/Poll'
import BioPoll from './components/screens/BioPoll'
import Gateway from './components/screens/Gateway'
import Billing from './components/screens/Billing'

import GoLiveModal from './components/modals/GoLiveModal'

export default function Page() {
  const { user, loading, logout } = useUser()

  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [showGoLive, setShowGoLive] = useState(false)

  // 🔥 CONNECT SIDEBAR (ALL ITEMS)
  useEffect(() => {
    const handler = (e) => {
      setActiveScreen(e.detail)
    }

    window.addEventListener('changeScreen', handler)

    return () => {
      window.removeEventListener('changeScreen', handler)
    }
  }, [])

  // 🔥 HANDLE ACTIVE HIGHLIGHT (ALL ITEMS)
  useEffect(() => {
    const allItems = document.querySelectorAll('.nav-item')

    allItems.forEach(el => el.classList.remove('active'))

    const activeEl = document.querySelector(`[data-screen="${activeScreen}"]`)
    if (activeEl) activeEl.classList.add('active')

  }, [activeScreen])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--cream)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.9rem',
        color: 'var(--brown)'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  const title = activeScreen
    ? activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)
    : 'Dashboard'

  const profileLink = user?.username
    ? `massed.io/${user.username}`
    : 'massed.io/username'

  function renderScreen() {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard user={user} />
      case 'showcase': return <Showcase user={user} />
      case 'booking': return <Booking />
      case 'collaboration': return <Collaboration />
      case 'forms': return <Forms />
      case 'listings': return <Listings />
      case 'messages': return <Messages />
      case 'createpoll': return <Poll />
      case 'biopoll': return <BioPoll />
      case 'gateway': return <Gateway />
      case 'billing': return <Billing />

      default:
        return (
          <div className="coming-wrap">
            <div className="coming-box">
              <h3>{title}</h3>
              <p>This screen is coming soon.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Sidebar
        user={user}
        logout={logout}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      <div className="main">

        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="hamburger" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <span className="topbar-title">{title}</span>
          </div>

          <div className="topbar-right">

            <button
              className="desktop-golive"
              onClick={() => setShowGoLive(true)}
            >
              <span style={{
                width: '9px',
                height: '9px',
                background: '#fff',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              Go Live
            </button>

            <div className="link-badge">
              <span>{profileLink}</span>
            </div>

            <button className="btn-logout" onClick={logout}>
              Log Out
            </button>

          </div>
        </div>

        <main className="content">
          {renderScreen()}
        </main>

      </div>

      {showGoLive && (
        <GoLiveModal
          onClose={() => setShowGoLive(false)}
          onGoLive={() => setShowGoLive(false)}
        />
      )}
    </>
  )
}