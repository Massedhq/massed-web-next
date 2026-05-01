'use client'

import { useRef, useState } from 'react'

function AvatarCropper({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const imgRef = useRef(null)

  const FRAME_W = 240
  const FRAME_H = 320 // 3:4 portrait

  const handleMouseDown = (e) => {
    setDragging(true)
    setStartPos({ x: e.clientX - offsetX, y: e.clientY - offsetY })
  }
  const handleMouseMove = (e) => {
    if (!dragging) return
    setOffsetX(e.clientX - startPos.x)
    setOffsetY(e.clientY - startPos.y)
  }
  const handleMouseUp = () => setDragging(false)

  const handleTouchStart = (e) => {
    const t = e.touches[0]
    setDragging(true)
    setStartPos({ x: t.clientX - offsetX, y: t.clientY - offsetY })
  }
  const handleTouchMove = (e) => {
    if (!dragging) return
    const t = e.touches[0]
    setOffsetX(t.clientX - startPos.x)
    setOffsetY(t.clientY - startPos.y)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    canvas.width = FRAME_W
    canvas.height = FRAME_H
    const scaledW = img.naturalWidth * scale
    const scaledH = img.naturalHeight * scale
    const drawX = (FRAME_W - scaledW) / 2 + offsetX
    const drawY = (FRAME_H - scaledH) / 2 + offsetY
    ctx.clearRect(0, 0, FRAME_W, FRAME_H)
    ctx.drawImage(img, drawX, drawY, scaledW, scaledH)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    onSave(dataUrl)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '340px', width: '100%' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#2a2218', marginBottom: '6px', textAlign: 'center' }}>
          Adjust your photo
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '16px' }}>
          Drag to reposition · Scroll or slide to zoom
        </div>

        {/* Crop frame */}
        <div style={{
          width: `${FRAME_W}px`, height: `${FRAME_H}px`,
          overflow: 'hidden', borderRadius: '10px',
          border: '2px solid #C49A6C', margin: '0 auto 16px',
          cursor: dragging ? 'grabbing' : 'grab', position: 'relative',
          background: '#f0ece6'
        }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="crop preview"
            style={{
              position: 'absolute',
              width: `${100 * scale}%`,
              height: 'auto',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
              userSelect: 'none',
              pointerEvents: 'none',
              draggable: false
            }}
          />
          {/* Corner guides */}
          {['0 0','0 auto','auto 0','auto auto'].map((m, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '18px', height: '18px',
              borderTop: i < 2 ? '2px solid #C49A6C' : 'none',
              borderBottom: i >= 2 ? '2px solid #C49A6C' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid #C49A6C' : 'none',
              borderRight: i % 2 === 1 ? '2px solid #C49A6C' : 'none',
              top: i < 2 ? '8px' : 'auto',
              bottom: i >= 2 ? '8px' : 'auto',
              left: i % 2 === 0 ? '8px' : 'auto',
              right: i % 2 === 1 ? '8px' : 'auto',
            }} />
          ))}
        </div>

        {/* Zoom slider */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', textAlign: 'center' }}>Zoom</div>
          <input type="range" min="0.5" max="3" step="0.01" value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#C49A6C' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '11px', borderRadius: '50px', border: '1px solid #ddd5c8', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
            Cancel
          </button>
          <button onClick={handleSave}
            style={{ flex: 1, padding: '11px', borderRadius: '50px', border: 'none', background: '#C49A6C', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
            Save photo
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
}

export default function SignupModal() {
  const [cropSrc, setCropSrc] = useState(null)
  const [savedPhoto, setSavedPhoto] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCropSrc(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropSave = (dataUrl) => {
    setSavedPhoto(dataUrl)
    setCropSrc(null)
    // Store on window so completeSignup can access it
    window._signupAvatarData = dataUrl
  }

  const handleCropCancel = () => setCropSrc(null)

  const handleRemovePhoto = () => {
    setSavedPhoto(null)
    window._signupAvatarData = null
  }

  return (
    <>
      {cropSrc && (
        <AvatarCropper
          imageSrc={cropSrc}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

      <div id="modal-signup" className="modal-backdrop"
        onClick={e => { if (e.target === e.currentTarget) window.closeModal?.('signup') }}>
        <div className="modal" style={{ position: 'relative' }}>

          <button className="modal-close" onClick={() => window.closeModal?.('signup')}>✕</button>

          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <img src="/my_logo.png" alt="Massed" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          </div>
          <div className="modal-logo-text">Masse<span>d</span></div>
          <div className="modal-sub" id="signup-sub">Enter your invitation code to continue</div>

          {/* Step 1 — Invite code */}
          <div id="signup-step1">
            <div className="invite-notice">
              <span style={{ fontSize: '16px', flexShrink: 0 }}>🔑</span>
              <div className="invite-notice-text">
                <strong>Invitation only.</strong> You need a code from an existing member or the Massed team to create an account.
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Invite code</label>
              <input className="form-input" id="invite-input" placeholder="e.g. MASSED-2026"
                onKeyDown={e => { if (e.key === 'Enter') window.checkInvite?.() }} />
              <div className="form-error" id="invite-error">That code doesn't look right. Check for typos and try again.</div>
              <div id="invite-success" className="invite-success">
                <span className="success-icon">✔</span>
                <span className="success-text">Invite code valid</span>
              </div>
              <div className="form-hint">Check your email or DMs for your invite code.</div>
            </div>
            <button className="btn btn-tc"
              style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)', marginTop: '4px' }}
              onClick={() => window.checkInvite?.()}>
              Verify invite →
            </button>
            <div className="form-switch">
              Already have an account?{' '}
              <a onClick={() => { window.closeModal?.('signup'); window.openModal?.('login') }}>Sign in</a>
            </div>
          </div>

          {/* Step 2 — Account details */}
          <div id="signup-step2" style={{ display: 'none' }}>

            {/* Portrait photo upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
              <div
                onClick={() => document.getElementById('signup-file').click()}
                style={{
                  width: '120px', height: '160px',
                  borderRadius: '10px',
                  border: savedPhoto ? 'none' : '2px dashed #C49A6C',
                  background: savedPhoto ? 'transparent' : '#faf7f4',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  marginBottom: '8px'
                }}>
                {savedPhoto ? (
                  <img src={savedPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
                    <div style={{ fontSize: '11px', color: '#C49A6C', fontWeight: 600, textAlign: 'center', padding: '0 8px' }}>
                      Add photo
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>3:4 portrait</div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button"
                  onClick={() => document.getElementById('signup-file').click()}
                  style={{ fontSize: '11px', color: '#C49A6C', background: 'none', border: '1px solid #C49A6C', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>
                  {savedPhoto ? 'Change' : 'Upload'}
                </button>
                {savedPhoto && (
                  <button type="button"
                    onClick={handleRemovePhoto}
                    style={{ fontSize: '11px', color: '#9ca3af', background: 'none', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer' }}>
                    Remove
                  </button>
                )}
              </div>

              <input type="file" id="signup-file" accept="image/*" style={{ display: 'none' }}
                onChange={handleFileChange} />
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Optional</div>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">First name</label>
                <input className="form-input" id="signup-firstname" placeholder="First name" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Last name</label>
                <input className="form-input" id="signup-lastname" placeholder="Last name" />
              </div>
            </div>

            {/* DOB */}
            <div className="form-group">
              <label className="form-label">Date of birth <span style={{ color: '#C49A6C' }}>*</span></label>
              <input className="form-input" id="signup-dob" type="date" style={{ color: '#374151' }} />
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" id="signup-username" placeholder="username"
                  onInput={e => window.checkUsername?.(e.target)} style={{ paddingRight: '36px' }} />
                <span id="username-status" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px' }}></span>
              </div>
              <div className="form-hint" id="username-hint">@massed.io/username</div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" id="signup-email" type="email" placeholder="you@email.com"
                onInput={e => window.checkEmail?.(e.target)} />
              <div id="email-status" style={{ fontSize: '12px', marginTop: '4px' }}></div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" id="signup-password" type="password"
                  placeholder="Min. 8 characters" style={{ paddingRight: '44px' }} />
                <button type="button" id="eye1"
                  onClick={() => window.togglePassword?.('signup-password', 'eye1')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--g400)' }}>
                  👁
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" id="signup-confirm" type="password"
                  placeholder="Repeat your password" style={{ paddingRight: '44px' }}
                  onInput={() => window.checkPasswordMatch?.()} />
                <button type="button" id="eye2"
                  onClick={() => window.togglePassword?.('signup-confirm', 'eye2')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--g400)' }}>
                  👁
                </button>
              </div>
              <div className="form-error" id="password-match-error">Passwords do not match.</div>
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '14px 0' }}>
              <input type="checkbox" id="terms-checkbox"
                style={{ marginTop: '3px', accentColor: '#C49A6C', cursor: 'pointer' }} />
              <label htmlFor="terms-checkbox" style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', cursor: 'pointer' }}>
                I confirm I am at least 18 years old and agree to the{' '}
                <a onClick={e => { e.stopPropagation(); document.getElementById('modal-terms-service').style.display = 'flex' }}
                  style={{ color: '#C49A6C', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</a>
                {' '}and{' '}
                <a onClick={e => { e.stopPropagation(); document.getElementById('modal-privacy').style.display = 'flex' }}
                  style={{ color: '#C49A6C', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</a>
              </label>
            </div>

            <button className="btn btn-tc" id="signup-submit-btn"
              style={{ width: '100%', padding: '13px', borderRadius: 'var(--rfull)', marginTop: '4px' }}
              onClick={() => { if (window.completeSignup) window.completeSignup() }}>
              Create account →
            </button>

          </div>
        </div>
      </div>
    </>
  )
}