'use client'

export default function TermsOfServiceModal() {
  return (
    <div id="modal-terms-service"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '560px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>

        <button onClick={() => document.getElementById('modal-terms-service').style.display = 'none'}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '28px', background: '#C49A6C', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Terms of Service</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>Last updated: April 2026</p>

        {[
          { title: '1. Acceptance', body: 'By registering for a Massed account, you agree to these Terms of Service. If you do not agree, please do not create an account.' },
          { title: '2. Eligibility', body: 'You must be at least 18 years old to create an account and use Massed. Massed does not knowingly allow individuals under 18 to register.' },
          { title: '3. User Information', body: 'You agree to provide accurate and truthful information, including your date of birth. Usernames are subject to availability and may be modified if necessary.' },
          { title: '4. Communications', body: 'By registering, you consent to receiving emails from Massed related to your account and platform updates. You may unsubscribe from non-essential communications at any time.' },
          { title: '5. Intellectual Property', body: 'All content, branding, and materials associated with Massed are the exclusive property of Massed and its affiliates. Unauthorized use is prohibited.' },
          { title: '6. Changes', body: 'We reserve the right to modify these Terms at any time. Continued use of Massed constitutes acceptance of any updated Terms.' },
          { title: '7. Community Standards', body: null },
          { title: '8. Account Suspension and Termination', body: 'Massed reserves the right to suspend or terminate accounts at any time for violations of these Terms or for any behavior deemed harmful to the platform or its users.' },
        ].map(({ title, body }) => (
          <div key={title}>
            <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{title}</p>
            {title === '7. Community Standards' ? (
              <>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>Massed is a PG-rated, professional network. The following are strictly prohibited:</p>
                <ul style={{ fontSize: '14px', color: '#374151', lineHeight: 1.9, margin: '0 0 16px', paddingLeft: '20px' }}>
                  <li>Sexual content, nudity, or sexually suggestive material</li>
                  <li>Explicit romantic or intimate depictions between any individuals</li>
                  <li>Content that exploits, endangers, or sexualizes any person</li>
                  <li>Graphic, violent, or otherwise adult-rated material</li>
                  <li>Harassment, hate speech, or targeted abuse</li>
                  <li>Spam, scams, or deceptive promotions</li>
                </ul>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>
                  Violations may result in immediate account suspension. If your account has been suspended, please{' '}
                  <a href="mailto:support@massed.io" style={{ color: '#C49A6C', textDecoration: 'none', borderBottom: '1px solid #C49A6C' }}>email us at support@massed.io</a>.
                </p>
              </>
            ) : (
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>{body}</p>
            )}
          </div>
        ))}

        <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>9. Contact</p>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '24px' }}>
          For questions regarding these Terms, please contact us at{' '}
          <a href="mailto:support@massed.io" style={{ color: '#C49A6C', textDecoration: 'none', borderBottom: '1px solid #C49A6C' }}>support@massed.io</a>.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#C49A6C', textTransform: 'uppercase' }}>
          Anchor it. Build on it. Keep it.
        </div>

      </div>
    </div>
  )
}