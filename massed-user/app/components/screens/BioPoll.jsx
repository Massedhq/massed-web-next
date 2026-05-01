'use client'

import { useState } from 'react'

export default function BioPoll() {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([{ question: '', options: ['', ''] }])
  const [saved, setSaved] = useState(false)
  const [visible, setVisible] = useState(false)

  function addQuestion() {
    setQuestions(prev => [...prev, { question: '', options: ['', ''] }])
  }

  function removeQuestion(qi) {
    setQuestions(prev => prev.filter((_, i) => i !== qi))
  }

  function setQuestion(qi, val) {
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, question: val } : q))
  }

  function setOption(qi, oi, val) {
    setQuestions(prev => prev.map((q, i) => i === qi
      ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) }
      : q
    ))
  }

  function addOption(qi) {
    setQuestions(prev => prev.map((q, i) => i === qi
      ? { ...q, options: [...q.options, ''] }
      : q
    ))
  }

  function removeOption(qi, oi) {
    if (questions[qi].options.length <= 2) { alert('Minimum 2 options required'); return }
    setQuestions(prev => prev.map((q, i) => i === qi
      ? { ...q, options: q.options.filter((_, j) => j !== oi) }
      : q
    ))
  }

  function savePoll() {
    if (!title.trim()) { alert('⚠️ Please add a poll title'); return }
    const filled = questions.filter(q => q.question.trim() && q.options.filter(o => o.trim()).length >= 2)
    if (filled.length === 0) { alert('⚠️ Add at least one question with 2 options'); return }
    setSaved(true)
    setVisible(true)
  }

  function deletePoll() {
    if (!confirm('Delete this poll? This will remove it from your profile.')) return
    setSaved(false)
    setVisible(false)
    setTitle('')
    setQuestions([{ question: '', options: ['', ''] }])
  }

  function toggleVisibility() {
    setVisible(v => !v)
  }

  const filledQuestions = questions.filter(q => q.question.trim())

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">Link in Bio Poll</h2>
        <p className="section-sub">Pin a poll permanently to your public profile — visitors answer directly from your link in bio</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '860px', alignItems: 'start' }}>

        {/* LEFT: Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Poll title */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '14px' }}>Poll Title</div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Help me decide!"
              maxLength={60}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>Shown as the heading above your poll on your profile page</div>
          </div>

          {/* Questions */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)' }}>Questions</div>
              <button onClick={addQuestion} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--brown-bg)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brown)' }}>
                + Add Question
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions.map((q, qi) => (
                <div key={qi} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brown)' }}>Question {qi + 1}</div>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>✕ Remove</button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={e => setQuestion(qi, e.target.value)}
                    placeholder="Ask something…"
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box', background: '#fff', marginBottom: '10px' }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: oi < 2 ? 'var(--brown)' : 'var(--cream3)', color: oi < 2 ? '#fff' : 'var(--text-dim)', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{oi + 1}</div>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => setOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}${oi >= 2 ? ' (optional)' : ''}`}
                          style={{ flex: 1, padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
                        />
                        {oi >= 2 && (
                          <button onClick={() => removeOption(qi, oi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1rem', flexShrink: 0 }}>×</button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => addOption(qi)} style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'none', border: '1px dashed var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', width: '100%', justifyContent: 'center' }}>
                    + Add Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button onClick={savePoll} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 800 }}>
            Save Poll
          </button>

          {/* Show/Hide + Delete — only after saved */}
          {saved && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={toggleVisibility} style={{ flex: 1, padding: '11px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                👁 {visible ? 'Hide from Profile' : 'Show on Profile'}
              </button>
              <button onClick={deletePoll} style={{ padding: '11px 16px', background: '#fff', border: '1.5px solid #fecaca', borderRadius: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🗑 Delete
              </button>
            </div>
          )}

          {/* Status badge */}
          {saved && (
            <div style={{ borderRadius: '12px', padding: '12px 14px', background: visible ? '#eaf3de' : 'var(--cream2)', border: `1px solid ${visible ? '#c0dd97' : 'var(--border)'}` }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: visible ? '#3b6d11' : 'var(--text-mid)' }}>
                {visible ? '✓ Poll is visible on your profile' : '⏸ Poll is hidden from your profile'}
              </div>
              <div style={{ fontSize: '0.72rem', marginTop: '2px', color: visible ? '#639922' : 'var(--text-dim)' }}>
                {visible ? 'Shown at massed.io/username' : 'Save and show when ready'}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Two previews */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Preview 1 — on your profile (title + Vote button) */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px' }}>On Your Profile</div>
            <div style={{ background: '#f5f0ea', borderRadius: '36px', maxWidth: '260px', margin: '0 auto', padding: '16px 12px 24px', boxShadow: '0 24px 60px rgba(44,26,14,0.18)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4956E, #8B5E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>👤</div>
                <div style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text)' }}>Your Name</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>massed.io/username</div>
              </div>
              <div style={{ marginTop: '12px', background: '#fff', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '8px' }}>📊 Poll</div>
                <div style={{ fontWeight: 800, fontSize: '0.72rem', marginBottom: '12px', color: title ? 'var(--text)' : 'var(--text-dim)', fontStyle: title ? 'normal' : 'italic' }}>
                  {title || 'Poll title appears here…'}
                </div>
                <button style={{ width: '100%', padding: '7px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>Vote</button>
              </div>
            </div>
          </div>

          {/* Preview 2 — full poll detail after tapping Vote */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px' }}>Poll Detail (after tapping Vote)</div>
            <div style={{ background: '#f5f0ea', borderRadius: '36px', maxWidth: '260px', margin: '0 auto', padding: '16px 12px 24px', boxShadow: '0 24px 60px rgba(44,26,14,0.18)' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '6px' }}>📊 Poll</div>
                <div style={{ fontWeight: 800, fontSize: '0.72rem', marginBottom: '10px', color: title ? 'var(--text)' : 'var(--text-dim)', fontStyle: title ? 'normal' : 'italic' }}>
                  {title || 'Poll title appears here…'}
                </div>
                {filledQuestions.length === 0 ? (
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>Questions and options appear here…</div>
                ) : filledQuestions.map((q, i) => {
                  const opts = q.options.filter(o => o.trim())
                  return (
                    <div key={i} style={{ marginTop: i > 0 ? '10px' : 0, paddingTop: i > 0 ? '10px' : 0, borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.62rem', color: 'var(--text)', marginBottom: '6px', lineHeight: 1.35 }}>{q.question}</div>
                      {(opts.length >= 2 ? opts : ['Option 1', 'Option 2']).map((o, j) => (
                        <div key={j} style={{ padding: '4px 8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.58rem', color: 'var(--text)', marginBottom: '4px', cursor: 'pointer' }}>{o}</div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}