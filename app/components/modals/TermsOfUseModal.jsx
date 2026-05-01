'use client'

export default function TermsOfUseModal() {
  return (
    <div id="modal-terms-use"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none' }}>
      <div style={{ background: '#fff', width: '90%', maxWidth: '580px', maxHeight: '80vh', borderRadius: '4px', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Georgia',serif" }}>

        <button onClick={() => document.getElementById('modal-terms-use').style.display = 'none'}
          style={{ position: 'absolute', top: '14px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: '#888', cursor: 'pointer', zIndex: 10 }}>×</button>

        <div style={{ padding: '32px 38px 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '3px', height: '22px', background: '#C49A6C', borderRadius: '2px' }}></div>
            <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#2a2218', margin: 0 }}>Terms of Use</p>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />
        </div>

        <div style={{ overflowY: 'auto', padding: '0 38px 32px', flex: 1 }}>
          <p style={{ fontSize: '13px', color: '#9c7c4a', margin: '0 0 20px' }}>Effective Date: 2026 &nbsp;|&nbsp; Massed, Inc.</p>
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8, margin: '0 0 20px' }}>
            By accessing or using the Massed platform — including our website, mobile application, or any associated services — you agree to be bound by these Terms of Use.
          </p>

          {[
            { title: '1. Eligibility', body: 'You must be at least 18 years of age to create an account on Massed. By registering, you represent that all information you provide is accurate, current, and complete.' },
            { title: '2. Account Responsibility', body: 'You are solely responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.' },
            { title: '3. Acceptable Use', body: null },
            { title: '4. Content Ownership & License', body: 'You retain ownership of the original content you post on Massed. By posting content, you grant Massed a non-exclusive, royalty-free, worldwide license to display and distribute that content on the platform.' },
            { title: '5. Intellectual Property', body: 'All branding, design, code, logos, and proprietary features of the Massed platform are the exclusive intellectual property of Massed, Inc.' },
            { title: '6. Privacy', body: 'Your use of Massed is also governed by our Privacy Policy. We do not sell your personal data to third parties.' },
            { title: '7. Enforcement & Account Termination', body: 'Massed reserves the right to suspend, restrict, or permanently remove any account that violates these Terms, at our sole discretion and without prior notice.' },
            { title: '8. Disclaimer of Warranties', body: 'Massed is provided "as is" and "as available" without warranties of any kind, express or implied.' },
            { title: '9. Limitation of Liability', body: 'To the fullest extent permitted by law, Massed, Inc. and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.' },
            { title: '10. Governing Law', body: 'These Terms shall be governed by the laws of the United States. Any disputes shall be resolved through binding arbitration or in a court of competent jurisdiction.' },
            { title: '11. COPPA Compliance', body: 'Massed does not knowingly collect personal information from individuals under the age of 18. If we discover a user is under 18, we will immediately terminate their account.' },
            { title: '12. Modifications to Terms', body: 'Massed reserves the right to update or modify these Terms at any time. Continued use of the platform constitutes your acceptance of the revised Terms.' },
          ].map(({ title, body }) => (
            <div key={title}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2a2218', margin: '0 0 6px' }}>{title}</p>
              {title === '3. Acceptable Use' ? (
                <>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: '0 0 10px' }}>Massed is a professional, PG-rated network. You agree not to:</p>
                  <ul style={{ fontSize: '14px', color: '#374151', lineHeight: 1.9, margin: '0 0 20px', paddingLeft: '20px' }}>
                    <li>Post sexual, explicit, pornographic, or sexually suggestive content</li>
                    <li>Engage in harassment, bullying, stalking, or targeted abuse</li>
                    <li>Promote or incite violence, discrimination, or hate speech</li>
                    <li>Impersonate another person, brand, or entity</li>
                    <li>Spread false information, spam, or deceptive content</li>
                    <li>Attempt to access or disrupt the platform's infrastructure</li>
                    <li>Scrape or harvest user data without express written consent</li>
                  </ul>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: '0 0 20px' }}>{body}</p>
              )}
            </div>
          ))}

          <p style={{ fontSize: '14px', fontWeight: 700, color: '#2a2218', margin: '0 0 6px' }}>13. Contact</p>
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>All formal communications must be submitted in writing via email.</p>
          <a href="mailto:support@massed.io" style={{ fontSize: '14px', color: '#C49A6C', textDecoration: 'none', borderBottom: '1px solid #C49A6C' }}>support@massed.io</a>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '28px 0 18px' }} />
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#C49A6C', textTransform: 'uppercase', margin: 0 }}>
            Anchor it. Build on it. Keep it.
          </p>
        </div>

      </div>
    </div>
  )
}