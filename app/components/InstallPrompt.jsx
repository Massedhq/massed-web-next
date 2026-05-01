'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showButton, setShowButton] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true

    if (isStandalone) {
      setShowButton(false)
      return
    }

    if (localStorage.getItem('massed-install-dismissed')) {
      setShowButton(false)
      return
    }

    const ua = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))

    const handlePrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleInstalled = () => {
      localStorage.setItem('massed-install-dismissed', 'true')
      setShowButton(false)
      setShowPopup(false)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const openPopup = () => {
    setShowPopup(true)
  }

  const installNow = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice

      if (choice.outcome === 'accepted') {
        localStorage.setItem('massed-install-dismissed', 'true')
        setShowButton(false)
        setShowPopup(false)
      }

      setDeferredPrompt(null)
    }
  }

  const notNow = () => {
    localStorage.setItem('massed-install-dismissed', 'true')
    setShowButton(false)
    setShowPopup(false)
  }

  if (!showButton) return null

  return (
    <>
      <button
        onClick={openPopup}
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

      {showPopup && (
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
              width: '100%',
              maxWidth: '420px',
              background: '#fff',
              border: '1px solid #e5ded5',
              borderRadius: '22px',
              padding: '20px',
              boxShadow: '0 18px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Install Massed</h3>

            {isIOS ? (
              <p style={{ lineHeight: 1.5 }}>
                On iPhone: open Massed in Safari, tap the Share icon, then tap
                “Add to Home Screen.”
              </p>
            ) : deferredPrompt ? (
              <p style={{ lineHeight: 1.5 }}>
                Add Massed to your home screen for faster access.
              </p>
            ) : (
              <p style={{ lineHeight: 1.5 }}>
                Use Chrome menu → Install app or Add to Home screen.
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isIOS && deferredPrompt && (
                <button
                  onClick={installNow}
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
                  Install Now
                </button>
              )}

              <button
                onClick={notNow}
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
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}