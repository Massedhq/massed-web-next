export default function Topbar({ user, activeScreen, logout, onGoLive }) {
  const title = activeScreen
    ? activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)
    : 'Dashboard'

  const profileLink = user?.username
    ? `massed.io/${user.username}`
    : 'massed.io/username'

  return (
    <div className="topbar">
      {/* Left: hamburger + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="hamburger" id="hamburger-btn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="topbar-title" id="page-title">{title}</span>
      </div>

      {/* Right: Go Live + profile link + logout */}
      <div className="topbar-right">
        <button className="desktop-golive" onClick={onGoLive}>
          <span style={{
            width: '9px', height: '9px', background: '#fff',
            borderRadius: '50%', display: 'inline-block', flexShrink: 0
          }} />
          Go Live
        </button>

        <div className="link-badge" id="dual-link-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span id="nav-profile-link">{profileLink}</span>
        </div>

        <button className="btn-logout" onClick={logout}>Log Out</button>
      </div>
    </div>
  )
}