export default function Dashboard() {
  return (
    <div style={{ padding: '40px' }}>

      {/* WELCOME STATE */}
      <div id="dashboard-welcome" className="welcome-wrap">
        <div className="welcome-card">
          <div className="welcome-icon" style={{ background: 'transparent' }}>
<img 
  src="/logo.png" 
  style={{ 
    width: '200px', 
    height: '200px', 
    objectFit: 'contain', 
    borderRadius: '20px',
    background: '1a1a1a',
  }} 
  alt="Massed logo" 
/>       </div>
          <h1 className="welcome-title">Welcome to MASSED</h1>
          <p className="welcome-sub">Built for those who overstand presence is power. Set up your profile, add your links, go live, and bring your public profile to life.</p>
          <button className="btn-start">
            Start Here
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* ESTABLISHED DASHBOARD */}
      <div id="dashboard-main" style={{ display: 'none' }}>

        {/* Top profile row */}
        <div style={{
          background: '#fff', border: '1px solid var(--border)', borderRadius: '18px',
          padding: '20px 24px', marginBottom: '20px', display: 'flex',
          alignItems: 'center', gap: '18px', flexWrap: 'wrap'
        }}>
          <div id="db-avatar" style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--brown-light),var(--brown-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: '#fff', flexShrink: 0
          }}>M</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div id="db-name" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>Your Name</div>
            <div id="db-link" style={{ fontSize: '0.8rem', color: 'var(--brown)', fontWeight: 600, marginTop: '2px' }}>massed.io/username</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              background: 'var(--brown-bg)', color: 'var(--brown)', border: '1px solid var(--border)',
              borderRadius: '9px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: '0.8rem'
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              How to Navigate
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              background: 'var(--cream)', color: 'var(--text-mid)', border: '1px solid var(--border)',
              borderRadius: '9px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: '0.8rem'
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Support
            </button>
          </div>
        </div>

        {/* Analytics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { icon: '👁', value: '1,248', label: 'Profile Views', color: 'var(--text)' },
            { icon: '🛍️', value: '84', label: 'Orders Viewed', color: 'var(--text)' },
            { icon: '🛒', value: '12', label: 'Abandoned Carts', color: '#dc2626', border: '#fecdd3' },
            { icon: '💰', value: '$247', label: 'Today', color: '#16a34a' },
            { icon: '📈', value: '$1.8K', label: 'This Week', color: '#16a34a' },
            { icon: '📊', value: '$6.4K', label: 'This Month', color: 'var(--brown)' },
            { icon: '🏆', value: '$38K', label: 'This Year', color: 'var(--brown)' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff', border: `1px solid ${stat.border || 'var(--border)'}`,
              borderRadius: '14px', padding: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '14px', marginBottom: '20px' }}>

          {/* Graduation countdown */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>🎓 Graduation Countdown</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Month 3 of 12</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brown)' }}>25% Complete</span>
            </div>
            <div style={{ background: 'var(--cream2)', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg,var(--brown-light),var(--brown-dark))', borderRadius: '8px' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Balance: <strong style={{ color: 'var(--text)' }}>$270</strong> remaining · 9 months to free</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>$30/mo → FREE 24-month plan → $79.99/yr forever</div>
          </div>

          {/* Alerts */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>⚠️ Alerts</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#fef3c7', borderRadius: '9px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1rem' }}>📦</span>
              <div style={{ fontSize: '0.8rem' }}><strong>Low Stock:</strong> "Classic Tee - Black" has only 2 left</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#fee2e2', borderRadius: '9px' }}>
              <span style={{ fontSize: '1rem' }}>🛒</span>
              <div style={{ fontSize: '0.8rem' }}><strong>12 abandoned carts</strong> in the last 7 days — consider a follow-up offer</div>
            </div>
          </div>

          {/* Earner payouts */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>💸 Ready to Pay Earners</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>$384.00</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '12px' }}>Affiliate earnings pending payout to your earners</div>
            <button style={{ width: '100%', padding: '9px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>Pay Earners →</button>
          </div>

          {/* Withdrawal balance */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>🏦 Available to Withdraw</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>$1,243.17</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '12px' }}>Your earnings after earner amounts are deducted</div>
            <button style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg,var(--brown-light),var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}>Withdraw Funds →</button>
          </div>

          {/* Reviews */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>⭐ Reviews</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text)', fontFamily: 'Georgia, serif' }}>4.8</div>
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1rem', letterSpacing: '2px' }}>★★★★★</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>142 reviews</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--cream)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>🆕</span>
              <span style={{ fontSize: '0.78rem' }}><strong>3 new reviews</strong> since last week — <span style={{ color: 'var(--brown)', cursor: 'pointer', fontWeight: 700 }}>View →</span></span>
            </div>
          </div>

        </div>

        {/* Quick Start */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>⚡ Quick Start</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '10px' }}>
            {[
              { icon: '📦', label: 'Add Physical Product' },
              { icon: '💾', label: 'Add Digital Product' },
              { icon: '🎓', label: 'Add Course' },
              { icon: '📋', label: 'Add Listing' },
              { icon: '🔗', label: 'Add Web Link' },
              { icon: '💳', label: 'Billing' },
            ].map((action, i) => (
              <button key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
                padding: '14px 10px', background: 'var(--cream)', border: '1px solid var(--border)',
                borderRadius: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.75rem', color: 'var(--text)'
              }}>
                <span style={{ fontSize: '1.6rem' }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* What's New */}
        <div style={{ background: 'linear-gradient(135deg,#2C1A0E,#4a2d1a)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>🆕 What's New</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Classes category added to Booking — Single & Group class settings',
              'Listings tab — Real Estate, Cars, Spaces, Jobs, Experiences & more',
              'Product preview now shows full photo gallery, sizes, colors & composition',
              'Web Links updated — Edit, Share, Preview buttons now fully working',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C07A50', flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}