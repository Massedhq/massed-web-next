'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))

    const handlePrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
    }
  }, [])

  const handleAdd = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
      return
    }

    setShowInstructions(true)
  }

  return (
    <>
      <button
        onClick={handleAdd}
        style={{
          position: 'fixed',
          bottom: '18px',
          right: '18px',
          zIndex: 9999,
          border: 'none',
          background: '#1f1b18',
          color: '#fff',
          padding: '13px 18px',
          borderRadius: '999px',
          fontWeight: 700,
          boxShadow: '0 12px 35px rgba(0,0,0,0.22)',
          cursor: 'pointer',
        }}
      >
        Add Massed to Home Screen
      </button>

      {showInstructions && (
        <div
          style={{
            position: 'fixed',
            left: '16px',
            right: '16px',
            bottom: '78px',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '420px',
              background: '#fff',
              border: '1px solid #e5ded5',
              borderRadius: '22px',
              padding: '20px',
              boxShadow: '0 18px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Add Massed to your phone</h3>

            <p style={{ lineHeight: 1.5 }}>
              {isIOS
                ? 'On iPhone: open Massed in Safari, tap the Share icon, then tap “Add to Home Screen.”'
                : 'On Android: tap the 3 dots in Chrome, then tap “Install app” or “Add to Home screen.”'}
            </p>

            <button
              onClick={() => setShowInstructions(false)}
              style={{
                border: 'none',
                background: '#1f1b18',
                color: '#fff',
                padding: '11px 16px',
                borderRadius: '999px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}