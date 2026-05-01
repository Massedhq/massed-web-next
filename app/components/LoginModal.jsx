'use client'

export default function LoginModal() {
  return (
    <div id="modal-login" className="modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) window.closeModal?.('login') }}>
      <div className="modal" style={{ position: 'relative' }}>

        <button className="modal-close" onClick={() => window.closeModal?.('login')}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src="/my_logo.png" alt="Massed" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
        </div>
        <div className="modal-logo-text">Masse<span>d</span></div>
        <div className="modal-sub">Welcome back</div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" id="login-email" type="email" placeholder="you@email.com" />
          <div id="login-email-error" className="input-error"></div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              id="login-password"
              type="password"
              placeholder="Your password"
              style={{ paddingRight: '44px' }}
              onKeyDown={e => { if (e.key === 'Enter') window.completeLogin?.() }}
            />
            <button type="button"
              onClick={() => window.togglePassword?.('login-password', 'login-eye')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--g400)' }}
              id="login-eye">👁</button>
          </div>
        </div>

        <button id="login-btn" className="btn btn-dark"
          style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)', marginTop: '4px' }}
          onClick={() => window.completeLogin?.()}>
          Sign in →
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a onClick={() => window.openForgotPassword?.()}
            style={{ fontSize: '12.5px', color: 'var(--g400)', cursor: 'pointer', textDecoration: 'underline' }}>
            Forgot your password?
          </a>
        </div>

      </div>
    </div>
  )
}