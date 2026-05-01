'use client'

export default function AboutModal() {
  return (
    <div id="modal-about"
      style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '560px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>

        <button onClick={() => document.getElementById('modal-about').style.display = 'none'}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '28px', background: '#C49A6C', borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>About Massed</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />

        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a', marginBottom: '16px' }}>
          Massed was created for those who understand that <strong>presence is power.</strong>
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', marginBottom: '16px' }}>
          In a digital world built on constant subscriptions and temporary solutions, we chose a different path. We believe your online presence should feel intentional, structured, and built to last.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', marginBottom: '16px' }}>
          Massed is not just a link platform. It is a refined digital foundation — designed for those who sell, lead, advise, build, and operate at a higher standard.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', marginBottom: '16px' }}>
          Whether you manage listings, services, products, or partnerships, your digital front door should reflect permanence, not pressure.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', marginBottom: '24px' }}>
          No noise. No clutter. No instability. Just a platform built for long-term positioning. Massed exists for those who take their presence seriously.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#C49A6C', textTransform: 'uppercase' }}>
          Anchor it. Build on it. Keep it.
        </div>

      </div>
    </div>
  )
}