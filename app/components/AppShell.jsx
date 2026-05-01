'use client'

export default function AppShell() {
  return (
    <div id="screen-app" className="screen">
      <div
        className="app-shell"
        style={{
          minHeight: '100vh',
          background: '#f7f3ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <main
          style={{
            width: '100%',
            maxWidth: '720px',
            background: '#fff',
            border: '1px solid #e5ded5',
            borderRadius: '24px',
            padding: '42px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              fontFamily: 'serif',
              fontSize: '34px',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Masse<span style={{ color: 'var(--tc)' }}>d</span>
          </div>

          <h1
            style={{
              fontSize: '32px',
              lineHeight: '1.15',
              marginBottom: '14px',
              color: '#1f1b18',
            }}
          >
            Welcome to your Massed account
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6f6258',
              marginBottom: '28px',
            }}
          >
            Your account is active. The full dashboard is being prepared, and your profile tools will open here soon.
          </p>

          <div
            style={{
              background: '#f7f3ee',
              border: '1px solid #e5ded5',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '28px',
              textAlign: 'left',
            }}
          >
            <p style={{ margin: '0 0 10px', fontWeight: 600 }}>
              Coming next:
            </p>

            <p style={{ margin: '0', color: '#6f6258', lineHeight: '1.6' }}>
              Showcase setup, profile customization, booking tools, products, services, analytics, and account settings.
            </p>
          </div>

          <button
            onClick={() => window.signOut?.()}
            style={{
              border: 'none',
              background: '#1f1b18',
              color: '#fff',
              padding: '13px 22px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </main>
      </div>
    </div>
  )
}