'use client'

function resetForgotModal() {
  document.getElementById('forgot-step1').style.display = 'block'
  document.getElementById('forgot-step2').style.display = 'none'
  document.getElementById('forgot-step3').style.display = 'none'
  document.getElementById('forgot-step-success').style.display = 'none'
  document.getElementById('forgot-back-link').style.display = 'block'
  document.getElementById('forgot-email').value = ''
  document.getElementById('forgot-code').value = ''
  document.getElementById('forgot-new-password').value = ''
  document.getElementById('forgot-confirm-password').value = ''
  document.getElementById('forgot-email-err').style.display = 'none'
  document.getElementById('forgot-code-err').style.display = 'none'
  document.getElementById('forgot-password-err').style.display = 'none'
  document.getElementById('fp-d1').style.background = '#C49A6C'
  document.getElementById('fp-d2').style.background = '#d1c9be'
  document.getElementById('fp-d3').style.background = '#d1c9be'
}

function closeForgotModal() {
  resetForgotModal()
  document.getElementById('modal-forgot-password').style.display = 'none'
}

function closeForgotAndOpenLogin() {
  resetForgotModal()
  document.getElementById('modal-forgot-password').style.display = 'none'
  document.getElementById('modal-login').style.display = 'flex'
}

// Expose reset to LandingPage.jsx so openForgotPassword can call it
if (typeof window !== 'undefined') {
  window.resetForgotModal = resetForgotModal
}

export default function ForgotPasswordModal() {
  return (
    <div id="modal-forgot-password" className="modal-backdrop" style={{ display: 'none' }}
      onClick={e => { if (e.target === e.currentTarget) closeForgotModal() }}>
      <div className="modal" style={{ position: 'relative' }}>

        {/* Close button */}
        <button className="modal-close" onClick={() => closeForgotModal()}>✕</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src="/my_logo.png" alt="Massed" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
        </div>
        <div className="modal-logo-text" style={{ marginBottom: '4px' }}>Reset Password</div>

        {/* Step indicator dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '22px' }}>
          <div id="fp-d1" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C49A6C', transition: 'background 0.3s' }}></div>
          <div style={{ width: '28px', height: '1px', background: '#d1c9be' }}></div>
          <div id="fp-d2" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1c9be', transition: 'background 0.3s' }}></div>
          <div style={{ width: '28px', height: '1px', background: '#d1c9be' }}></div>
          <div id="fp-d3" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1c9be', transition: 'background 0.3s' }}></div>
        </div>

        {/* ── STEP 1 — Enter email ── */}
        <div id="forgot-step1">
          <div className="modal-sub" style={{ marginBottom: '16px' }}>
            Enter your email and we'll send a 6-digit reset code.
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" id="forgot-email" type="email" placeholder="you@email.com"
              onKeyDown={e => { if (e.key === 'Enter') window.sendForgotCode?.() }} />
            <div id="forgot-email-err" style={{ display: 'none', fontSize: '12px', color: '#ef4444', marginTop: '4px' }}></div>
          </div>
          <button id="forgot-send-btn" className="btn btn-dark"
            style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)' }}
            onClick={() => window.sendForgotCode?.()}>
            Send reset code →
          </button>
        </div>

        {/* ── STEP 2 — Enter 6-digit code ── */}
        <div id="forgot-step2" style={{ display: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '6px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📧</div>
            <div className="modal-sub" style={{ marginBottom: '4px' }}>Check your email</div>
            <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
              We sent a 6-digit code to<br />
              <strong id="forgot-email-display" style={{ color: '#2a2218' }}></strong>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">6-digit code</label>
            <input className="form-input" id="forgot-code" type="text" placeholder="000000" maxLength={6}
              style={{ letterSpacing: '0.3em', fontSize: '26px', textAlign: 'center', fontWeight: '700', padding: '14px' }}
              onInput={e => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
              onKeyDown={e => { if (e.key === 'Enter') window.verifyForgotCode?.() }} />
            <div id="forgot-code-err" style={{ display: 'none', fontSize: '12px', color: '#ef4444', marginTop: '6px', textAlign: 'center' }}></div>
          </div>
          <button id="forgot-verify-btn" className="btn btn-dark"
            style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)' }}
            onClick={() => window.verifyForgotCode?.()}>
            Verify code →
          </button>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <a onClick={() => window.sendForgotCode?.()}
              style={{ fontSize: '12px', color: '#C49A6C', cursor: 'pointer', textDecoration: 'underline' }}>
              Resend code
            </a>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}> · </span>
            <a onClick={() => {
              document.getElementById('forgot-step2').style.display = 'none'
              document.getElementById('forgot-step1').style.display = 'block'
              document.getElementById('fp-d2').style.background = '#d1c9be'
            }} style={{ fontSize: '12px', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline' }}>
              Go back
            </a>
          </div>
        </div>

        {/* ── STEP 3 — New password + confirm ── */}
        <div id="forgot-step3" style={{ display: 'none' }}>
          <div className="modal-sub" style={{ marginBottom: '16px' }}>
            Choose a new password for your account.
          </div>
          <div className="form-group">
            <label className="form-label">New password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" id="forgot-new-password" type="password"
                placeholder="Min. 8 characters" style={{ paddingRight: '44px' }} />
              <button type="button" id="fp-eye1"
                onClick={() => window.togglePassword?.('forgot-new-password', 'fp-eye1')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--g400)' }}>
                👁
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm new password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" id="forgot-confirm-password" type="password"
                placeholder="Repeat new password" style={{ paddingRight: '44px' }}
                onKeyDown={e => { if (e.key === 'Enter') window.resetPassword?.() }} />
              <button type="button" id="fp-eye2"
                onClick={() => window.togglePassword?.('forgot-confirm-password', 'fp-eye2')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--g400)' }}>
                👁
              </button>
            </div>
          </div>
          <div id="forgot-password-err" style={{ display: 'none', fontSize: '12px', color: '#ef4444', marginBottom: '8px', textAlign: 'center' }}></div>
          <button id="forgot-reset-btn" className="btn btn-dark"
            style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)' }}
            onClick={() => window.resetPassword?.()}>
            Reset password →
          </button>
        </div>

        {/* ── SUCCESS SCREEN ── */}
        <div id="forgot-step-success" style={{ display: 'none', textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2a2218', marginBottom: '8px' }}>
            Password Updated!
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
            Your password has been updated successfully. You can now sign in with your new password.
          </div>
          <button className="btn btn-dark"
            style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)' }}
            onClick={() => closeForgotAndOpenLogin()}>
            Sign in now →
          </button>
        </div>

        {/* ── BACK TO SIGN IN (hidden on success) ── */}
        <div id="forgot-back-link" style={{ textAlign: 'center', marginTop: '14px' }}>
          <a onClick={() => closeForgotAndOpenLogin()}
            style={{ fontSize: '12.5px', color: 'var(--g400)', cursor: 'pointer', textDecoration: 'underline' }}>
            Back to sign in
          </a>
        </div>

      </div>
    </div>
  )
}