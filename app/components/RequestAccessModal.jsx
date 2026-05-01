'use client'

export default function RequestAccessModal() {
  return (
    <div id="modal-request-access"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}
      onClick={e => { if (e.target === e.currentTarget) window.closeRequestAccess?.() }}>

      <div style={{ background: '#f5f0eb', borderRadius: '20px', maxWidth: '820px', width: '100%', position: 'relative', display: 'flex', overflow: 'hidden', maxHeight: '92vh' }}>

        <button onClick={() => window.closeRequestAccess?.()}
          style={{ position: 'absolute', top: '14px', right: '16px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', zIndex: 10 }}>×</button>

        {/* Left image panel */}
        <div style={{ width: '42%', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', flexShrink: 0 }}>
          <img src="/safe.png" alt="Massed" style={{ width: '100%', maxWidth: '280px', objectFit: 'contain', borderRadius: '8px' }} />
          <div style={{ marginTop: '16px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.18em', color: '#C49A6C', textTransform: 'uppercase' }}>Presence is Power</div>
        </div>

        {/* Right form panel */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', fontFamily: "'Georgia',serif" }}>
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            <img src="/my_logo.png" alt="Massed" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '18px' }}>Request access to the network</div>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '22px' }}>
            <div id="ra-d1" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C49A6C', transition: 'background 0.3s' }}></div>
            <div style={{ width: '28px', height: '1px', background: '#d1c9be' }}></div>
            <div id="ra-d2" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1c9be', transition: 'background 0.3s' }}></div>
            <div style={{ width: '28px', height: '1px', background: '#d1c9be' }}></div>
            <div id="ra-d3" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1c9be', transition: 'background 0.3s' }}></div>
          </div>

          {/* Step 1 — Your info */}
          <div id="ra-s1">
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#2a2218', marginBottom: '14px', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your Information</div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>First name <span style={{ color: '#C49A6C' }}>*</span></label>
                <input id="ra-fname" type="text" placeholder="First name"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '13px', color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'} />
                <div id="ra-fname-err" style={{ display: 'none', fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>Required.</div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Last name <span style={{ color: '#C49A6C' }}>*</span></label>
                <input id="ra-lname" type="text" placeholder="Last name"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '13px', color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'} />
                <div id="ra-lname-err" style={{ display: 'none', fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>Required.</div>
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Email address <span style={{ color: '#C49A6C' }}>*</span></label>
              <input id="ra-email" type="email" placeholder="you@email.com"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '13px', color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'} />
              <div id="ra-email-err" style={{ display: 'none', fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>A valid email is required.</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Phone number <span style={{ color: '#C49A6C' }}>*</span></label>
              <input id="ra-phone" type="tel" placeholder="+1 (000) 000-0000"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '13px', color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'} />
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>SMS verification coming soon.</div>
              <div id="ra-phone-err" style={{ display: 'none', fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>Required.</div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Username preference <span style={{ color: '#C49A6C' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9ca3af', pointerEvents: 'none' }}>@massed.io/</span>
                <input id="ra-username" type="text" placeholder="username"
                  style={{ width: '100%', padding: '9px 12px 9px 88px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '13px', color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'} />
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Subject to availability.</div>
              <div id="ra-username-err" style={{ display: 'none', fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>Required.</div>
            </div>

            <div id="ra-general-err" style={{ display: 'none', fontSize: '12px', color: '#ef4444', marginBottom: '8px', textAlign: 'center' }}>Please fill in all required fields.</div>
            <button id="ra-send-btn" onClick={() => window.raSendCode?.()}
              style={{ width: '100%', padding: '12px', background: '#B87333', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Request Access
            </button>
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>A 6-digit verification code will be sent to your email.</div>
          </div>

          {/* Step 2 — Verify code */}
          <div id="ra-s2" style={{ display: 'none' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📧</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2a2218', marginBottom: '6px' }}>Check your email</div>
              <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.7' }}>
                We sent a 6-digit code to<br />
                <strong id="ra-email-show" style={{ color: '#2a2218' }}></strong>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Verification code <span style={{ color: '#C49A6C' }}>*</span></label>
              <input id="ra-code" type="text" placeholder="000000" maxLength={6}
                style={{ width: '100%', padding: '13px', border: '1px solid #ddd5c8', borderRadius: '8px', fontSize: '22px', color: '#111', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700, background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#C49A6C'} onBlur={e => e.target.style.borderColor = '#ddd5c8'}
                onInput={e => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }} />
              <div id="ra-code-err" style={{ display: 'none', fontSize: '12px', color: '#ef4444', marginTop: '4px', textAlign: 'center' }}>Incorrect code. Please try again.</div>
              <div id="ra-code-ok" style={{ display: 'none', fontSize: '12px', color: '#10b981', marginTop: '4px', textAlign: 'center' }}>✔ Email verified.</div>
            </div>
            <button id="ra-verify-btn" onClick={() => window.raVerifyCode?.()}
              style={{ width: '100%', padding: '12px', background: '#C49A6C', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verify Code
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Didn't get it? </span>
              <a onClick={() => window.raSendCode?.()} style={{ fontSize: '12px', color: '#C49A6C', cursor: 'pointer', textDecoration: 'underline' }}>Resend</a>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}> · </span>
              <a onClick={() => window.raGoBack?.()} style={{ fontSize: '12px', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline' }}>Go back</a>
            </div>
          </div>

          {/* Step 3 — Success */}
          <div id="ra-s3" style={{ display: 'none', textAlign: 'center', padding: '16px 0' }}>
            <img src="/my_logo.png" alt="Massed" style={{ width: '52px', height: '52px', objectFit: 'contain', marginBottom: '14px' }} />
            <div style={{ fontSize: '19px', color: '#2a2218', marginBottom: '8px' }}>Request Submitted.</div>
            <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
              Your request has been received. Our team will review your submission and send your invite code to{' '}
              <strong id="ra-success-email" style={{ color: '#2a2218' }}></strong>.
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>This is an invitation-only network. We appreciate your patience.</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd5c8', marginBottom: '14px' }} />
            <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.22em', color: '#C49A6C', textTransform: 'uppercase' }}>Anchor it. Build on it. Keep it.</div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #modal-request-access > div { flex-direction: column; max-height: none; overflow-y: auto; }
          #modal-request-access > div > div:first-of-type { width: 100% !important; padding: 24px 20px !important; }
          #modal-request-access > div > div:first-of-type img { max-width: 180px !important; }
          #modal-request-access > div > div:last-of-type { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  )
}