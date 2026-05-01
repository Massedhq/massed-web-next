'use client'

import { useState } from 'react'

function renderTemplate(id) {
  if (typeof window !== 'undefined' && window.TEMPLATES && window.TEMPLATES[id]) {
    return window.TEMPLATES[id].render()
  }

  return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">Loading...</div>`
}

const templates = [
  { id: 'classic', name: 'Classic', desc: 'Clean layout · Full profile' },
  { id: 'dark', name: 'Dark Minimal', desc: 'Bold · Cinematic' }
]

export default function Showcase() {
  const [selected, setSelected] = useState('classic')

  return (
    <div className="screen active">

      <div className="section-header">
        <h2 className="section-title">Showcase</h2>
        <p className="section-sub">
          Choose a template for your public MASSED profile page.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        marginTop: '28px'
      }}>

        {/* LEFT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
        }}>

          {templates.map((t) => {
            const isActive = selected === t.id

            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--brown)' : '1px solid var(--border)',
                  boxShadow: isActive
                    ? '0 0 0 3px rgba(192,122,80,0.15)'
                    : '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  height: '160px',
                  borderRadius: '12px',
                  background: '#eee',
                  marginBottom: '12px'
                }} />

                <div style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '1rem'
                }}>
                  {t.name}
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-mid)'
                }}>
                  {t.desc}
                </div>
              </div>
            )
          })}

        </div>

        {/* RIGHT PREVIEW */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid var(--border)',
          height: '500px',
          overflow: 'hidden'
        }}>

          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '10px',
            color: 'var(--text-mid)'
          }}>
            Preview
          </div>

          <div
            style={{
              height: '100%',
              overflow: 'auto',
              borderRadius: '12px'
            }}
            dangerouslySetInnerHTML={{
              __html: renderTemplate(selected)
            }}
          />

        </div>

      </div>

    </div>
  )
}