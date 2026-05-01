'use client'

export default function ContactModal() {
  return (
    <div id="modal-contact"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '560px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>

        <button onClick={() => document.getElementById('modal-contact').style.display = 'none'}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '28px', background: '#C49A6C', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Contact</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />

        <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '24px' }}>
          For inquiries, please contact us at{' '}
          <a href="mailto:support@massed.io" style={{ color: '#C49A6C', textDecoration: 'none', borderBottom: '1px solid #C49A6C' }}>
            support@massed.io
          </a>.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#C49A6C', textTransform: 'uppercase' }}>
          Anchor it. Build on it. Keep it.
        </div>

      </div>
    </div>
  )
}