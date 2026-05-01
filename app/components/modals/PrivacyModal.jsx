'use client'

export default function PrivacyModal() {
  return (
    <div id="modal-privacy"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '560px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>

        <button onClick={() => document.getElementById('modal-privacy').style.display = 'none'}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '28px', background: '#C49A6C', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Privacy Policy</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>Last updated: March 2026</p>

        {[
          { title: '1. Information We Collect', body: 'When you register, we collect your full name, email address, phone number, and your chosen username.' },
          { title: '2. How We Use Your Information', body: 'Your information is used solely to manage your account and communicate platform updates. We do not use your data for advertising or sell it to third parties — ever.' },
          { title: '3. Data Storage', body: 'Your data is stored securely and is only accessible to authorized Massed team members. We use industry-standard security practices to protect your information.' },
          { title: '4. Your Rights', body: null },
          { title: '5. Cookies', body: 'This platform does not use tracking cookies or third-party analytics tools.' },
          { title: '6. Third Parties', body: 'We do not share, sell, rent, or trade your personal information with any third parties for their promotional purposes.' },
          { title: '7. Unsubscribe', body: 'You may opt out of communications at any time by clicking the unsubscribe link in any email we send, or by contacting us directly.' },
          { title: '8. GDPR Compliance', body: 'If you are located in the European Economic Area, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with your local supervisory authority.' },
        ].map(({ title, body }) => (
          <div key={title}>
            <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{title}</p>
            {title === '4. Your Rights' ? (
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>
                You have the right to request access to, correction of, or deletion of your personal data at any time by contacting us at{' '}
                <a href="mailto:support@massed.io" style={{ color: '#C49A6C', textDecoration: 'none', borderBottom: '1px solid #C49A6C' }}>support@massed.io</a>.
              </p>
            ) : (
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>{body}</p>
            )}
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#C49A6C', textTransform: 'uppercase' }}>
          Your data. Your trust. Our responsibility and yours.
        </div>

      </div>
    </div>
  )
}