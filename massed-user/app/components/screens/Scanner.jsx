'use client'

import { useState, useRef, useEffect } from 'react'

export default function Scanner() {
  const [cameraOn, setCameraOn] = useState(false)
  const [status, setStatus] = useState('Click Start Camera to begin scanning')
  const [scanResult, setScanResult] = useState(null)
  const [manualInput, setManualInput] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 })
  const [checkedIn, setCheckedIn] = useState([])
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)
  const [toast, setToast] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const lastScannedRef = useRef({ id: null, time: 0 })

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  function loadJsQR(callback) {
    if (window.jsQR) { callback(); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js'
    script.onload = callback
    script.onerror = () => showToast('Failed to load QR scanner library')
    document.head.appendChild(script)
  }

  function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('⚠️ Camera not supported. Try Chrome or Safari.')
      return
    }
    setStatus('⏳ Requesting camera access…')
    loadJsQR(() => {
      const tryStart = (constraints) => {
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            streamRef.current = stream
            const video = videoRef.current
            if (!video) return
            video.srcObject = stream
            video.play().catch(() => {})
            // Check torch
            const track = stream.getVideoTracks()[0]
            if (track?.getCapabilities) {
              try { const caps = track.getCapabilities(); if (caps?.torch) setTorchSupported(true) } catch (e) {}
            }
            setCameraOn(true)
            setStatus('🟢 Scanning — point at a QR code')
            setScanResult(null)
            // Start scanning frames
            const onReady = () => startFrameScan(video)
            if (video.readyState >= 2) { onReady() }
            else { video.addEventListener('loadedmetadata', onReady, { once: true }) }
          })
          .catch(err => {
            if (constraints.video?.facingMode && err.name !== 'NotAllowedError' && err.name !== 'SecurityError') {
              tryStart({ video: true, audio: false }); return
            }
            const msgs = {
              NotFoundError: 'No camera found on this device.',
              NotAllowedError: 'Camera permission denied. Allow access in your browser settings.',
              NotReadableError: 'Camera is in use by another app.',
              SecurityError: 'Camera blocked — page must be served over HTTPS.',
            }
            const msg = msgs[err.name] || 'Could not access camera.'
            setStatus('⚠️ ' + msg)
          })
      }
      tryStart({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
    })
  }

  function startFrameScan(video) {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    scanIntervalRef.current = setInterval(() => {
      if (!video || video.paused || video.ended || video.readyState < 2) return
      if (video.videoWidth === 0 || !streamRef.current) { clearInterval(scanIntervalRef.current); return }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      try { ctx.drawImage(video, 0, 0, canvas.width, canvas.height) } catch (e) { return }
      let imageData
      try { imageData = ctx.getImageData(0, 0, canvas.width, canvas.height) } catch (e) { return }
      if (!window.jsQR) return
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
      if (code?.data) {
        const now = Date.now()
        const last = lastScannedRef.current
        if (code.data !== last.id || now - last.time > 3000) {
          lastScannedRef.current = { id: code.data, time: now }
          processTicket(code.data)
          if (navigator.vibrate) navigator.vibrate([100, 50, 100])
        }
      }
    }, 250)
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
    setTorchOn(false)
    setTorchSupported(false)
    setStatus('Click Start Camera to begin scanning')
    setScanResult(null)
  }

  function toggleTorch() {
    if (!streamRef.current) return
    const track = streamRef.current.getVideoTracks()[0]
    if (!track) return
    const next = !torchOn
    track.applyConstraints({ advanced: [{ torch: next }] })
      .then(() => setTorchOn(next))
      .catch(() => showToast('Torch not supported on this device'))
  }

  function processTicket(ticketId, isManual = false) {
    const isValid = ticketId.toUpperCase().startsWith('TKT-') && ticketId.length >= 10
    const ts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const entry = { id: ticketId, time: ts, valid: isValid }
    setStats(prev => ({ total: prev.total + 1, valid: prev.valid + (isValid ? 1 : 0), invalid: prev.invalid + (isValid ? 0 : 1) }))
    setCheckedIn(prev => [entry, ...prev].slice(0, 10))
    if (isManual) {
      setVerifyResult(isValid ? 'valid' : 'invalid')
    } else {
      setScanResult(isValid ? 'valid' : 'invalid')
      setStatus(isValid ? '✅ Valid — keep scanning' : '❌ Invalid — keep scanning')
      setTimeout(() => setScanResult(null), 4000)
    }
  }

  function verifyTicket() {
    const val = manualInput.trim()
    if (!val) { showToast('Please enter a ticket number'); return }
    setVerifyResult(null)
    processTicket(val, true)
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: 'var(--text)', margin: '0 0 6px' }}>Ticket Scanner</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', margin: 0 }}>Scan QR codes at the door or manually verify ticket numbers</p>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Camera Scanner */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(192,122,80,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--brown)" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Camera Scanner</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Real-time QR code scanning</div>
            </div>
          </div>

          {/* Camera area */}
          <div style={{ position: 'relative', background: '#111', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', aspectRatio: '16/9' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraOn ? 'block' : 'none' }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!cameraOn && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Camera not started</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.5 }}>
                  Tap <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Start Camera</strong> below.<br />Allow camera access when prompted.
                </div>
              </div>
            )}

            {/* Scan frame overlay */}
            {cameraOn && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ width: '160px', height: '160px', border: '2px solid rgba(192,122,80,0.8)', borderRadius: '12px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)' }} />
              </div>
            )}

            {/* Scan result flash */}
            {scanResult && (
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: scanResult === 'valid' ? 'rgba(22,163,74,0.9)' : 'rgba(220,38,38,0.9)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{scanResult === 'valid' ? '✅' : '❌'}</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{scanResult === 'valid' ? 'Valid Ticket' : 'Invalid Ticket'}</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '12px' }}>{status}</div>

          {/* Camera controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {!cameraOn ? (
              <button onClick={startCamera} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Start Camera
              </button>
            ) : (
              <>
                <button onClick={stopCamera} style={{ flex: 1, padding: '12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>
                  ⏹ Stop Camera
                </button>
                {torchSupported && (
                  <button onClick={toggleTorch} style={{ padding: '12px 16px', background: torchOn ? '#fef3c7' : 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem' }} title="Toggle torch">
                    🔦
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Manual Verify */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Manual Verify</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Type or paste ticket number</div>
            </div>
          </div>

          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>Ticket Number</div>
          <input
            type="text"
            value={manualInput}
            onChange={e => { setManualInput(e.target.value); setVerifyResult(null) }}
            onKeyDown={e => e.key === 'Enter' && verifyTicket()}
            placeholder="E.G. TKT-12345-VIP-001"
            style={{ width: '100%', padding: '12px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', letterSpacing: '0.02em' }}
          />

          <button onClick={verifyTicket} style={{ width: '100%', padding: '13px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', opacity: 0.8 }} />
            Verify Ticket
          </button>

          {verifyResult && (
            <div style={{ background: verifyResult === 'valid' ? 'rgba(22,163,74,0.08)' : '#fff1f2', border: `1px solid ${verifyResult === 'valid' ? 'rgba(22,163,74,0.3)' : '#fecaca'}`, borderRadius: '10px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{verifyResult === 'valid' ? '✅' : '❌'}</span>
              <div>
                <div style={{ fontWeight: 700, color: verifyResult === 'valid' ? '#16a34a' : '#dc2626', fontSize: '0.92rem' }}>{verifyResult === 'valid' ? 'Valid Ticket' : 'Invalid Ticket'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>{verifyResult === 'valid' ? 'Ticket verified — entry approved' : 'Not found in system. Check and try again.'}</div>
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>Recently Checked In</div>
          {checkedIn.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontSize: '0.82rem' }}>No check-ins yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {checkedIn.slice(0, 6).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--cream)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text)', fontWeight: 600 }}>{c.id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{c.time}</span>
                    <span>{c.valid ? '✅' : '❌'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        {[
          { label: 'Total Scanned', val: stats.total, color: 'var(--text)' },
          { label: 'Valid ✓', val: stats.valid, color: '#16a34a' },
          { label: 'Invalid ✗', val: stats.invalid, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: s.color, marginBottom: '4px' }}>{s.val}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}