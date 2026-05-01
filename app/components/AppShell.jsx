'use client'

export default function AppShell() {
  return (
    <div id="screen-app" className="screen">
      <div className="app-shell">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">Masse<span>d</span></div>

          <button className="s-nav-item active" data-tab="feed" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">⚡</span>Feed</button>
          <button className="s-nav-item" data-tab="profile" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">👤</span>My Profile</button>
          <button className="s-nav-item" data-tab="vault" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">🔒</span>Vault</button>
          <button className="s-nav-item" data-tab="linkinbio" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">🔗</span>Link in Bio</button>
          <button className="s-nav-item" data-tab="explore" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">🔍</span>Explore</button>
          <button className="s-nav-item" data-tab="settings" onClick={e => window.switchTab?.(e.currentTarget)}><span className="s-icon">⚙️</span>Settings</button>

          <div className="s-divider"></div>

          {/* Profile switcher */}
          <div style={{ position: 'relative' }}>
            <div id="profile-switcher" className="profile-switcher">
              <div className="ps-header">Switch profile</div>
              <button className="ps-item ps-active" onClick={() => window.switchProfile?.('personal', this)}>
                <div className="s-av" style={{ width: '28px', height: '28px', fontSize: '10px' }}>JM</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--black)' }}>Jordan Mills</div>
                  <div className="ps-type">Personal</div>
                </div>
                <span className="ps-check">✓</span>
              </button>
              <button className="ps-item" onClick={() => window.switchProfile?.('biz', this)}>
                <div className="s-av" style={{ width: '28px', height: '28px', fontSize: '10px' }}>MS</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--black)' }}>Mills Studio</div>
                  <div className="ps-type">Business</div>
                </div>
              </button>
              <div className="ps-footer">
                <button className="ps-signout" onClick={() => window.signOut?.()}>Sign out</button>
              </div>
            </div>

            <button className="s-profile-btn" onClick={() => window.toggleSwitcher?.()}>
              <div className="s-av" id="sidebar-av">JM</div>
              <div>
                <div className="s-pname" id="sidebar-name">Jordan Mills</div>
                <div className="s-phandle" id="sidebar-handle">@jordanmills</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--g400)' }}>▼</span>
            </button>
          </div>
        </aside>

        {/* ── Feed Tab ── */}
        <div id="tab-feed" className="tab-content" style={{ display: 'flex', flex: 1, minWidth: 0 }}>
          <div className="main">
            <div className="page-head"><h1>Feed</h1><p>What's happening in your network</p></div>
            <div className="composer">
              <div className="type-pills">
                <button className="type-pill active" onClick={e => window.setPostType?.('signal', e.currentTarget)}>⚡ Signal</button>
                <button className="type-pill" onClick={e => window.setPostType?.('post', e.currentTarget)}>✍️ Post</button>
              </div>
              <div className="composer-row">
                <div className="c-av" id="composer-av">JM</div>
                <textarea className="c-textarea" id="compose-text"
                  placeholder="Share a signal — a thought, quote, or insight…"
                  onInput={e => window.updateCharCount?.(e.target)} maxLength={280}></textarea>
              </div>
              <div className="composer-footer">
                <div className="c-tools">
                  <button className="c-tool">🖼️</button>
                  <button className="c-tool">😊</button>
                  <button className="c-tool">📎</button>
                </div>
                <div className="c-right">
                  <span className="char-count" id="char-count">280</span>
                  <button className="post-btn" id="post-btn" onClick={() => window.submitPost?.()} disabled>Send signal</button>
                </div>
              </div>
            </div>
            <div id="feed-list"></div>
          </div>
          <div className="right-rail">
            <div className="suggested-card">
              <div className="suggested-title">People to follow</div>
              <div id="suggested-list"></div>
            </div>
          </div>
        </div>

        {/* ── Profile Tab ── */}
        <div id="tab-profile" className="tab-content" style={{ display: 'none' }}>
          <div className="main-wide" style={{ maxWidth: '660px' }} id="own-profile-content"></div>
        </div>

        {/* ── View Profile Tab ── */}
        <div id="tab-viewprofile" className="tab-content" style={{ display: 'none' }}>
          <div className="main-wide" style={{ maxWidth: '660px' }} id="view-profile-content"></div>
        </div>

        {/* ── Vault Tab ── */}
        <div id="tab-vault" className="tab-content" style={{ display: 'none' }}>
          <div className="main">
            <div className="page-head"><h1>Vault</h1><p>Your saved signals, posts, and drafts</p></div>
            <div className="type-pills" style={{ marginBottom: '18px' }} id="vault-filters">
              <button className="type-pill active" onClick={e => window.filterVault?.('All', e.currentTarget)}>All</button>
              <button className="type-pill" onClick={e => window.filterVault?.('Signal', e.currentTarget)}>Signal</button>
              <button className="type-pill" onClick={e => window.filterVault?.('Post', e.currentTarget)}>Post</button>
              <button className="type-pill" onClick={e => window.filterVault?.('Draft', e.currentTarget)}>Draft</button>
            </div>
            <div className="vault-grid" id="vault-grid"></div>
          </div>
        </div>

        {/* ── Link in Bio Tab ── */}
        <div id="tab-linkinbio" className="tab-content" style={{ display: 'none' }}>
          <div className="main">
            <div className="page-head"><h1>Link in Bio</h1><p>Your public link page · share it anywhere</p></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button className="s-btn s-btn-s" onClick={() => window.showToast?.('Copied: massed.io/@jordanmills')}>Copy link</button>
              <button className="s-btn s-btn-o" id="lib-edit-btn" onClick={() => window.toggleLibEdit?.()}>Edit links</button>
            </div>
            <div className="lib-wrap">
              <div className="lib-bar">
                <div className="lib-dot" style={{ background: '#FF5F57' }}></div>
                <div className="lib-dot" style={{ background: '#FEBC2E' }}></div>
                <div className="lib-dot" style={{ background: '#28C840' }}></div>
                <span className="lib-url">massed.io/@jordanmills</span>
              </div>
              <div className="lib-inner">
                <div className="lib-av" id="lib-av">JM</div>
                <div className="lib-name" id="lib-name">Jordan Mills</div>
                <div className="lib-bio-text" id="lib-bio">Creative director &amp; digital storyteller. Building in public.</div>
                <div className="lib-links-col" id="lib-links-list"></div>
                <div className="lib-powered">Powered by <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '13px', letterSpacing: '0.5px' }}>Masse<span style={{ color: 'var(--tc)' }}>d</span></span></div>
              </div>
            </div>
            <div id="lib-edit-panel" style={{ display: 'none', border: '1px solid var(--g200)', borderRadius: 'var(--rlg)', padding: '18px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '13px' }}>Manage links</div>
              <div id="lib-edit-links"></div>
              <div style={{ display: 'flex', gap: '7px', marginTop: '9px' }}>
                <input className="form-input" id="lib-new-label" placeholder="New link label" style={{ flex: 1 }}
                  onKeyDown={e => { if (e.key === 'Enter') window.addLibLink?.() }} />
                <button className="s-btn s-btn-s" onClick={() => window.addLibLink?.()}>Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Explore Tab ── */}
        <div id="tab-explore" className="tab-content" style={{ display: 'none' }}>
          <div className="main">
            <div className="page-head"><h1>Explore</h1><p>Discover people and accounts on Massed</p></div>
            <input className="form-input" placeholder="🔍  Search people, @handles…"
              onInput={e => window.filterExplore?.(e.target.value)} style={{ marginBottom: '18px' }} />
            <div id="explore-list"></div>
          </div>
        </div>

        {/* ── Settings Tab ── */}
        <div id="tab-settings" className="tab-content" style={{ display: 'none' }}>
          <div className="main" style={{ maxWidth: '560px' }}>
            <div className="page-head"><h1>Settings</h1><p>Manage your account and profile</p></div>

            {/* Profile photo */}
            <div className="settings-section">
              <div className="settings-title">Profile photo</div>
              <div className="settings-av-row">
                <div className="settings-av" id="settings-av" onClick={() => document.getElementById('settings-file').click()}>
                  <span id="settings-av-initials">JM</span>
                  <img id="settings-av-img" src={null} alt="" />
                  <div className="settings-av-overlay">📷</div>
                </div>
                <input type="file" id="settings-file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => window.handleSettingsAvatar?.(e.target)} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '3px' }}>Change profile photo</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--g400)', marginBottom: '2px' }}>JPG, PNG, or GIF · Max 5MB</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '9px' }}>
                    <button className="s-btn s-btn-s" onClick={() => document.getElementById('settings-file').click()}>Upload photo</button>
                    <button className="s-btn s-btn-o" id="remove-av-btn" style={{ display: 'none' }} onClick={() => window.removeAvatar?.()}>Remove</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile details */}
            <div className="settings-section">
              <div className="settings-title">Profile details</div>
              <div className="form-group"><label className="form-label">Full name</label><input className="form-input" id="settings-name" defaultValue="Jordan Mills" /></div>
              <div className="form-group"><label className="form-label">Username</label><input className="form-input" id="settings-username" defaultValue="jordanmills" /></div>
              <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" id="settings-bio" rows={3} defaultValue="Creative director & digital storyteller. Building in public." /></div>
              <div className="form-group"><label className="form-label">Website</label><input className="form-input" id="settings-website" placeholder="https://yoursite.com" /></div>
              <button className="btn btn-tc" onClick={() => window.saveSettings?.()}>Save changes</button>
            </div>

            {/* Account */}
            <div className="settings-section">
              <div className="settings-title">Account</div>
              <button className="settings-menu-item" onClick={() => window.showToast?.('Change password — coming soon')}>Change password <span style={{ color: 'var(--g400)' }}>›</span></button>
              <button className="settings-menu-item" onClick={() => window.showToast?.('Email preferences — coming soon')}>Email preferences <span style={{ color: 'var(--g400)' }}>›</span></button>
              <button className="settings-menu-item" onClick={() => window.showToast?.('Privacy & data — coming soon')}>Privacy &amp; data <span style={{ color: 'var(--g400)' }}>›</span></button>
              <button className="settings-menu-item" onClick={() => window.showToast?.('Connected accounts — coming soon')}>Connected accounts <span style={{ color: 'var(--g400)' }}>›</span></button>
              <button className="settings-menu-item danger" onClick={() => window.showToast?.('Delete account — coming soon')}>Delete account <span style={{ color: 'var(--g400)' }}>›</span></button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}