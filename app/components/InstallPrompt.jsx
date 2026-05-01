'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('massed-install-dismissed')
    if (dismissed) return

    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua)
    setIsIOS(ios)
    setShowButton(true)

    const handlePrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }

    const handleInstalled = () => {
      localStorage.setItem('massed-install-dismissed', 'true')
      setShowButton(false)
      setShowInstructions(false)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice

      if (choice.outcome === 'accepted') {
        localStorage.setItem('massed-install-dismissed', 'true')
        setShowButton(false)
        setShowInstructions(false)
      }

      setDeferredPrompt(null)
      return
    }

    setShowInstructions(true)
  }

  const closeInstructions = () => {
    setShowInstructions(false)
  }

  const dismissEverything = () => {
    localStorage.setItem('massed-install-dismissed', 'true')
    setShowInstructions(false)
    setShowButton(false)
  }

  if (!showButton) return null

  return (
    <>
      <button
        onClick={handleInstall}
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
        Install Massed
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
            <h3 style={{ marginTop: 0 }}>Install Massed</h3>

            <p style={{ lineHeight: 1.5 }}>
              {isIOS
                ? 'On iPhone: open Massed in Safari, tap the Share icon, then tap “Add to Home Screen.”'
                : 'On Android: tap Install when prompted, or use Chrome menu → Install app.'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={closeInstructions}
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

              <button
                onClick={dismissEverything}
                style={{
                  border: '1px solid #e5ded5',
                  background: '#fff',
                  color: '#6f6258',
                  padding: '11px 16px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}