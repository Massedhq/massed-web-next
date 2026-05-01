'use client'

import { useState } from 'react'

const initialMembers = [
  { id:1, fname:'Ava', lname:'Thompson', email:'ava@email.com', engagement:'Active', subscription:'Premium — $39.99/mo', membership:'Platinum', billing:39.99, nextPayment:'Apr 15, 2026', balanceDue:0, fees:0, status:'active' },
  { id:2, fname:'Marcus', lname:'Lee', email:'marcus@email.com', engagement:'Active', subscription:'Standard — $19.99/mo', membership:'Gold', billing:19.99, nextPayment:'Apr 18, 2026', balanceDue:0, fees:0, status:'active' },
  { id:3, fname:'Jasmine', lname:'Rivera', email:'jasmine@email.com', engagement:'Inactive', subscription:'Basic — $9.99/mo', membership:'', billing:9.99, nextPayment:'Apr 10, 2026', balanceDue:9.99, fees:5, status:'late' },
  { id:4, fname:'Derek', lname:'Washington', email:'derek@email.com', engagement:'Active', subscription:'', membership:'Silver', billing:0, nextPayment:'—', balanceDue:0, fees:0, status:'subscriber' },
  { id:5, fname:'Priya', lname:'Patel', email:'priya@email.com', engagement:'Active', subscription:'Premium — $39.99/mo', membership:'Platinum', billing:39.99, nextPayment:'Apr 22, 2026', balanceDue:0, fees:0, status:'active' },
  { id:6, fname:'Tyrone', lname:'Brooks', email:'tyrone@email.com', engagement:'Paused', subscription:'Standard — $19.99/mo', membership:'Gold', billing:19.99, nextPayment:'May 1, 2026', balanceDue:39.98, fees:10, status:'late' },
  { id:7, fname:'Sofia', lname:'Martinez', email:'sofia@email.com', engagement:'Active', subscription:'Basic — $9.99/mo', membership:'', billing:9.99, nextPayment:'Apr 28, 2026', balanceDue:0, fees:0, status:'subscription' },
  { id:8, fname:'Jordan', lname:'Kim', email:'jordan@email.com', engagement:'Active', subscription:'', membership:'', billing:0, nextPayment:'—', balanceDue:0, fees:0, status:'subscriber' },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'late', label: 'Late / Overdue' },
  { id: 'subscription', label: 'Subscriptions' },
  { id: 'membership', label: 'Memberships' },
  { id: 'subscriber', label: 'Subscribers Only' },
]

const ENG_COLORS = {
  Active:   { color: '#16a34a', bg: '#dcfce7' },
  Paused:   { color: '#d97706', bg: '#fef3c7' },
  Inactive: { color: '#6b7280', bg: '#f3f4f6' },
}

export default function Subscriptions() {
  const [members, setMembers] = useState(initialMembers)
  const [filter, setFilter] = useState('all')
  const [manageMember, setManageMember] = useState(null)
  const [modal, setModal] = useState(null) // 'charge'|'refund'|'invoice'|'invoices'|'changeplan'|'changesub'|'applyfee'|'waivefee'|'addmember'
  const [modalAmount, setModalAmount] = useState('')
  const [modalDesc, setModalDesc] = useState('')
  const [modalReason, setModalReason] = useState('')
  const [newPlan, setNewPlan] = useState('')
  const [newPlanAmt, setNewPlanAmt] = useState('')
  const [addForm, setAddForm] = useState({ fname: '', lname: '', email: '', plan: '', tier: '' })
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = members.filter(m => {
    if (filter === 'all') return true
    if (filter === 'late') return m.status === 'late'
    if (filter === 'subscriber') return !m.subscription && !m.membership
    if (filter === 'subscription') return !!m.subscription
    if (filter === 'membership') return !!m.membership
    return true
  })

  function handleAction(action, m) {
    setManageMember(null)
    if (action === 'charge') { setModal('charge'); setModalAmount(m.billing ? m.billing.toFixed(2) : '') }
    else if (action === 'refund') { setModal('refund'); setModalAmount(m.billing ? m.billing.toFixed(2) : '') }
    else if (action === 'invoice') { setModal('invoice'); setModalAmount(m.billing ? m.billing.toFixed(2) : ''); setModalDesc(m.subscription || m.membership || '') }
    else if (action === 'viewinvoices') { setModal('invoices') }
    else if (action === 'changeplan') { setModal('changeplan'); setNewPlan(m.membership || ''); setNewPlanAmt('') }
    else if (action === 'changesubtype') { setModal('changesub'); setNewPlan(m.subscription || ''); setNewPlanAmt('') }
    else if (action === 'applyfee') { setModal('applyfee'); setModalAmount('') }
    else if (action === 'waivefee') { setModal('waivefee'); setModalAmount(m.fees > 0 ? m.fees.toFixed(2) : '') }
    else if (action === 'pause') {
      setMembers(prev => prev.map(x => x.id === m.id ? { ...x, engagement: x.engagement === 'Paused' ? 'Active' : 'Paused' } : x))
      showToast(m.engagement === 'Paused' ? `${m.fname}'s service resumed` : `${m.fname}'s service paused`)
    }
    else if (action === 'cancel') {
      setMembers(prev => prev.map(x => x.id === m.id ? { ...x, subscription: '', membership: '', engagement: 'Inactive', status: 'subscriber' } : x))
      showToast(`Service cancelled for ${m.fname}`)
    }
    else if (action === 'delete') {
      setMembers(prev => prev.filter(x => x.id !== m.id))
      showToast(`${m.fname} removed`)
    }
  }

  function confirmModal() {
    const m = manageMember
    const amt = parseFloat(modalAmount)
    if (modal === 'charge') {
      if (!amt || amt <= 0) { showToast('Enter a valid amount'); return }
      showToast(`✓ $${amt.toFixed(2)} charged to ${m?.fname}'s account`)
    } else if (modal === 'refund') {
      if (!amt || amt <= 0) { showToast('Enter a valid amount'); return }
      showToast(`✓ $${amt.toFixed(2)} refund issued to ${m?.fname} — 3-5 business days`)
    } else if (modal === 'invoice') {
      if (!amt) { showToast('Enter invoice amount'); return }
      showToast(`✓ Invoice for $${amt.toFixed(2)} sent to ${m?.email}`)
    } else if (modal === 'applyfee') {
      if (!amt || amt <= 0) { showToast('Enter a fee amount'); return }
      setMembers(prev => prev.map(x => x.id === m?.id ? { ...x, fees: x.fees + amt, balanceDue: x.balanceDue + amt } : x))
      showToast(`$${amt.toFixed(2)} fee applied to ${m?.fname}`)
    } else if (modal === 'waivefee') {
      if (!amt || amt <= 0) { showToast('Enter an amount to waive'); return }
      setMembers(prev => prev.map(x => x.id === m?.id ? { ...x, fees: Math.max(0, x.fees - amt), balanceDue: Math.max(0, x.balanceDue - amt) } : x))
      showToast(`$${amt.toFixed(2)} in fees waived for ${m?.fname}`)
    } else if (modal === 'changeplan') {
      setMembers(prev => prev.map(x => x.id === m?.id ? { ...x, membership: newPlan, ...(newPlanAmt ? { billing: parseFloat(newPlanAmt) } : {}) } : x))
      showToast(`✓ ${m?.fname} plan changed to ${newPlan}`)
    } else if (modal === 'changesub') {
      setMembers(prev => prev.map(x => x.id === m?.id ? { ...x, subscription: newPlan, ...(newPlanAmt ? { billing: parseFloat(newPlanAmt) } : {}) } : x))
      showToast(`✓ ${m?.fname} subscription updated`)
    }
    setModal(null)
    setModalAmount('')
  }

  function addMember() {
    if (!addForm.fname || !addForm.email) { showToast('Please enter a name and email'); return }
    const billing = addForm.plan ? parseFloat(addForm.plan.match(/\$([\d.]+)/)?.[1] || 0) : 0
    setMembers(prev => [...prev, {
      id: Date.now(), fname: addForm.fname, lname: addForm.lname, email: addForm.email,
      engagement: 'Active', subscription: addForm.plan || '', membership: addForm.tier || '',
      billing, nextPayment: addForm.plan ? 'Apr 30, 2026' : '—', balanceDue: 0, fees: 0,
      status: addForm.plan ? 'subscription' : (addForm.tier ? 'membership' : 'subscriber')
    }])
    showToast(`✓ ${addForm.fname} added!`)
    setAddForm({ fname: '', lname: '', email: '', plan: '', tier: '' })
    setModal(null)
  }

  const m = manageMember

  function ActionBtn({ action, bg, color, border, icon, label }) {
    return (
      <button onClick={() => handleAction(action, m)} style={{ padding: '10px 12px', background: bg, color, border: border || 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
        {icon && <span dangerouslySetInnerHTML={{ __html: icon }} />}{label}
      </button>
    )
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">Subscriptions / Memberships</h2>
          <p className="section-sub">Manage your subscribers, members, and subscription billing</p>
        </div>
        <button onClick={() => setModal('addmember')} style={{ padding: '11px 20px', background: 'linear-gradient(135deg, var(--brown-light), var(--brown-dark))', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 14px rgba(192,122,80,0.3)' }}>
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '7px 16px', background: filter === f.id ? (f.id === 'late' ? '#dc2626' : 'var(--brown)') : '#fff', color: filter === f.id ? '#fff' : 'var(--text-dim)', border: `1px solid ${filter === f.id ? (f.id === 'late' ? '#dc2626' : 'var(--brown)') : 'var(--border)'}`, borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
                {['Member', 'Engagement', 'Subscription', 'Membership', 'Billing', 'Next Payment', 'Balance Due', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: h === 'Billing' || h === 'Balance Due' ? 'right' : h === '' ? 'center' : 'left', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No members found</td></tr>
              ) : filtered.map(m => {
                const eng = ENG_COLORS[m.engagement] || ENG_COLORS.Inactive
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--cream)'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{m.fname} {m.lname}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{m.email}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '3px 10px', background: eng.bg, color: eng.color, borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>{m.engagement}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      {m.subscription ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a' }}>{m.subscription}</span> : <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px' }}>
                      {m.membership ? <span style={{ padding: '2px 8px', background: 'var(--brown-bg)', color: 'var(--brown)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>{m.membership}</span> : <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, fontSize: '0.88rem' }}>{m.billing > 0 ? `$${m.billing.toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '14px', fontSize: '0.82rem', color: 'var(--text-mid)' }}>{m.nextPayment}</td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, fontSize: '0.88rem', color: m.balanceDue > 0 ? '#dc2626' : 'var(--text-dim)' }}>
                      {m.balanceDue > 0 ? `$${m.balanceDue.toFixed(2)}` : '$0.00'}
                      {m.fees > 0 && <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '6px', fontWeight: 700, marginLeft: '4px' }}>+${m.fees} fee</span>}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <button onClick={() => setManageMember(m)} style={{ padding: '6px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text)' }}>Manage</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Member Modal */}
      {manageMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '20px 0' }} onClick={() => setManageMember(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', margin: 0 }}>{manageMember.fname} {manageMember.lname}</h2>
              <button onClick={() => setManageMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '18px' }}>{manageMember.email}{manageMember.subscription ? ` · ${manageMember.subscription}` : ''}{manageMember.membership ? ` · ${manageMember.membership} Membership` : ''}</p>

            {manageMember.membership ? (
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '10px' }}>Membership Management</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  {[
                    { action: 'addtoplan', bg: 'linear-gradient(135deg,var(--brown-light),var(--brown-dark))', color: '#fff', label: 'Add to Plan' },
                    { action: 'changeplan', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: 'Change Plan' },
                    { action: 'charge', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: 'Charge Now' },
                    { action: 'invoice', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: 'Send Invoice' },
                    { action: 'viewinvoices', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: 'View Invoices' },
                    { action: 'editinfo', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: 'Edit Info' },
                    { action: 'pause', bg: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', label: manageMember.engagement === 'Paused' ? 'Resume Service' : 'Pause Service' },
                    { action: 'applyfee', bg: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', label: 'Apply Fee' },
                    { action: 'waivefee', bg: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', label: 'Waive Fee' },
                  ].map(btn => (
                    <button key={btn.action} onClick={() => handleAction(btn.action, manageMember)} style={{ padding: '10px', background: btn.bg, color: btn.color, border: btn.border || 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>{btn.label}</button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                  <button onClick={() => handleAction('cancel', manageMember)} style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>Cancel</button>
                  <button onClick={() => handleAction('delete', manageMember)} style={{ padding: '10px', background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>Delete</button>
                </div>
              </div>
            ) : manageMember.subscription ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '2px' }}>Subscription Management</div>
                {[
                  { action: 'charge', label: 'Charge Now' },
                  { action: 'changesubtype', label: 'Change Subscription Amount / Type' },
                  { action: 'invoice', label: 'Send Invoice' },
                  { action: 'viewinvoices', label: 'View Invoices' },
                ].map(btn => (
                  <button key={btn.action} onClick={() => handleAction(btn.action, manageMember)} style={{ padding: '10px', background: 'var(--cream)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>{btn.label}</button>
                ))}
                <button onClick={() => handleAction('refund', manageMember)} style={{ padding: '10px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>Refund Subscription</button>
                <button onClick={() => handleAction('cancel', manageMember)} style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>Cancel Subscription</button>
                <button onClick={() => handleAction('delete', manageMember)} style={{ padding: '10px', background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>Delete</button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>Subscriber Actions</div>
                <button onClick={() => handleAction('delete', manageMember)} style={{ padding: '10px', background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem', width: '100%' }}>Remove Subscriber</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Modals */}
      {['charge','refund','invoice','applyfee','waivefee'].includes(modal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', margin: 0 }}>
                {modal === 'charge' ? 'Charge Now' : modal === 'refund' ? 'Issue Refund' : modal === 'invoice' ? 'Send Invoice' : modal === 'applyfee' ? 'Apply Fee' : 'Waive Fee'}
              </h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div className="form-field"><label>Amount ($)</label><input type="number" value={modalAmount} onChange={e => setModalAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" /></div>
            {modal === 'invoice' && <div className="form-field"><label>Description</label><input type="text" value={modalDesc} onChange={e => setModalDesc(e.target.value)} placeholder="e.g. Monthly subscription" /></div>}
            {modal === 'waivefee' && <div className="form-field"><label>Reason (optional)</label><input type="text" value={modalReason} onChange={e => setModalReason(e.target.value)} placeholder="Reason for waiving fee" /></div>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={confirmModal} className="btn-confirm">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {['changeplan','changesub'].includes(modal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', margin: 0 }}>{modal === 'changeplan' ? 'Change Plan' : 'Change Subscription'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>Current: {manageMember?.membership || manageMember?.subscription || 'None'}</div>
            <div className="form-field"><label>New {modal === 'changeplan' ? 'Plan' : 'Subscription Type'}</label><input type="text" value={newPlan} onChange={e => setNewPlan(e.target.value)} placeholder={modal === 'changeplan' ? 'e.g. Gold' : 'e.g. Standard — $19.99/mo'} /></div>
            <div className="form-field"><label>New Monthly Amount ($, optional)</label><input type="number" value={newPlanAmt} onChange={e => setNewPlanAmt(e.target.value)} placeholder="0.00" min="0" step="0.01" /></div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={confirmModal} className="btn-confirm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'invoices' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', margin: 0 }}>{manageMember?.fname} {manageMember?.lname}'s Invoices</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            {['Mar 15, 2026', 'Feb 15, 2026', 'Jan 15, 2026'].map(date => (
              <div key={date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{manageMember?.subscription || manageMember?.membership || 'Service'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800 }}>${(manageMember?.billing || 0).toFixed(2)}</span>
                  <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Paid</span>
                </div>
              </div>
            ))}
            <button onClick={() => setModal(null)} className="btn-save" style={{ width: '100%', marginTop: '16px' }}>Close</button>
          </div>
        </div>
      )}

      {modal === 'addmember' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '90%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(44,26,14,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', margin: 0 }}>Add Member</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-dim)' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-field" style={{ margin: 0 }}><label>First Name *</label><input type="text" value={addForm.fname} onChange={e => setAddForm(f => ({ ...f, fname: e.target.value }))} placeholder="First name" /></div>
              <div className="form-field" style={{ margin: 0 }}><label>Last Name</label><input type="text" value={addForm.lname} onChange={e => setAddForm(f => ({ ...f, lname: e.target.value }))} placeholder="Last name" /></div>
            </div>
            <div className="form-field"><label>Email *</label><input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
            <div className="form-field"><label>Subscription Plan</label>
              <select value={addForm.plan} onChange={e => setAddForm(f => ({ ...f, plan: e.target.value }))}>
                <option value="">None</option>
                <option>Basic — $9.99/mo</option>
                <option>Standard — $19.99/mo</option>
                <option>Premium — $39.99/mo</option>
              </select>
            </div>
            <div className="form-field"><label>Membership Tier</label>
              <select value={addForm.tier} onChange={e => setAddForm(f => ({ ...f, tier: e.target.value }))}>
                <option value="">None</option>
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={addMember} className="btn-confirm">Add Member</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--text)', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, zIndex: 9999 }}>{toast}</div>}
    </div>
  )
}