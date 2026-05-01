'use client'

import { useState, useRef, useEffect } from 'react'

const HELP_SECTIONS = [
  { id: 'help-sec-mediaprofile',  label: '👤 Media Profile' },
  { id: 'help-sec-mystore',       label: '🛍️ My Store' },
  { id: 'help-sec-weblinks',      label: '🔗 Web Links' },
  { id: 'help-sec-listings',      label: '📋 Listings' },
  { id: 'help-sec-forms',         label: '📝 Forms' },
  { id: 'help-sec-booking',       label: '📅 Booking / Your Services' },
  { id: 'help-sec-sociallinks',   label: '📱 Social Links' },
  { id: 'help-sec-video',         label: '🎬 Video' },
  { id: 'help-sec-events',        label: '🎟️ Events / Tickets' },
  { id: 'help-sec-golive',        label: '🔴 Go Live' },
  { id: 'help-sec-sales',         label: '💰 Sales & Payouts' },
  { id: 'help-sec-settings',      label: '⚙️ Settings' },
  { id: 'help-sec-support',       label: '❓ Support Tab (inside Settings)' },
  { id: 'help-sec-browsericon',   label: '🌐 Browser Icon' },
  { id: 'help-sec-subs',          label: '💳 Subscriptions / Memberships' },
  { id: 'help-sec-hearts',        label: '❤️ Hearts — Save Feature' },
  { id: 'help-sec-custom',        label: '🔤 Other / Custom Fields' },
  { id: 'help-sec-messages',      label: '💬 My Messages' },
  { id: 'help-sec-switchprofile', label: '👥 Switch Profile' },
  { id: 'help-sec-banned',        label: '⛔ Banned / Blocked' },
  { id: 'help-sec-gateway',       label: '🚪 Gateway Room' },
  { id: 'help-sec-reservations',  label: '🍽️ Reservations' },
  { id: 'help-sec-sparkfounder',  label: '⚡ Spark Founder' },
]

const HELP_CONTENT = [
  { id: 'help-sec-mediaprofile', label: '👤 Media Profile', body: 'Your Media Profile is your public-facing page on massed.io. Set your display name, username, bio, avatar, and social links here. This is what visitors see when they visit your link.' },
  { id: 'help-sec-mystore', label: '🛍️ My Store', body: 'Add physical products, digital downloads, and courses to your store. Each product can have a price, description, images, and visibility toggle. Products appear directly on your MASSED profile.' },
  { id: 'help-sec-weblinks', label: '🔗 Web Links', body: 'Add links to your website, social profiles, YouTube, or anywhere else. Drag to reorder, toggle visibility, and add thumbnails. These show up on your link-in-bio profile page.' },
  { id: 'help-sec-listings', label: '📋 Listings', body: 'Post listings for services, jobs, housing, or anything you want to offer. Choose a category, set a price, add photos, and publish. Listings are searchable across the MASSED platform.' },
  { id: 'help-sec-forms', label: '📝 Forms', body: 'Build custom forms with the drag-and-drop form builder. Add text fields, dropdowns, signatures, and more. Send forms to clients via email or message for intake, NDAs, contracts, and feedback.' },
  { id: 'help-sec-booking', label: '📅 Booking / Your Services', body: 'Create bookable services with pricing, duration, category, and optional deposit requirements. Clients can book directly from your MASSED page. Manage incoming bookings and reservations from this screen.' },
  { id: 'help-sec-sociallinks', label: '📱 Social Links', body: 'Link your Instagram, TikTok, YouTube, Twitter/X, Facebook, and more. Toggle each one on or off. Linked icons appear on your public profile.' },
  { id: 'help-sec-video', label: '🎬 Video', body: 'Upload or link a video to feature on your profile. Great for intros, brand reels, or product demos. Supports YouTube, Vimeo, and direct upload.' },
  { id: 'help-sec-events', label: '🎟️ Events / Tickets', body: 'Create events with multiple ticket tiers, pricing, and capacity. Share your event link, accept payments, and manage attendees. Integrates with the Booking Reservations tab.' },
  { id: 'help-sec-golive', label: '🔴 Go Live', body: 'Start a live stream directly from your dashboard. Choose to go live on your profile page, on MASSED, or via an external platform. Launch polls, display products, and interact with your audience in real time.' },
  { id: 'help-sec-sales', label: '💰 Sales & Payouts', body: 'View your revenue by day, week, month, and year. See a full transaction log, manage affiliate payouts, and request withdrawals. Connect your payout account in Payout Settings.' },
  { id: 'help-sec-settings', label: '⚙️ Settings', body: 'Update your account details, change your password, manage notification preferences, and connect your payout method. The Support tab inside Settings lets you contact the MASSED team directly.' },
  { id: 'help-sec-support', label: '❓ Support Tab (inside Settings)', body: 'Inside Settings → Support, you can submit a support ticket, report a bug, or contact the MASSED team. Response time is typically within 1 business day.' },
  { id: 'help-sec-browsericon', label: '🌐 Browser Icon', body: 'Upload a custom favicon (browser tab icon) for your MASSED profile page. Recommended size: 32×32px or 64×64px. PNG or ICO format.' },
  { id: 'help-sec-subs', label: '💳 Subscriptions / Memberships', body: 'Create subscription tiers for your audience. Set a name, price, billing frequency, and perks. Subscribers get access to exclusive content and member-only features.' },
  { id: 'help-sec-hearts', label: '❤️ Hearts — Save Feature', body: 'Visitors can heart/save your products, listings, and posts. Saved items appear in their MASSED wishlist. You can see heart counts on each item in your dashboard.' },
  { id: 'help-sec-custom', label: '🔤 Other / Custom Fields', body: 'Add custom fields to your profile for any info not covered by the standard fields. Useful for displaying certifications, specialties, or unique details about your brand.' },
  { id: 'help-sec-messages', label: '💬 My Messages', body: 'View and respond to all your direct messages from clients, collaborators, and fans. Messages are organized by thread. You can also send forms and links directly from the message composer.' },
  { id: 'help-sec-switchprofile', label: '👥 Switch Profile', body: 'Switch between your Business Profile and your Public Creator Profile. Your business dashboard is private — your public profile is what followers and clients see.' },
  { id: 'help-sec-banned', label: '⛔ Banned / Blocked', body: 'You can ban clients from booking you or block users from messaging you. Banned users see a restricted message when trying to interact with your profile or services.' },
  { id: 'help-sec-gateway', label: '🚪 Gateway Room', body: 'The Gateway Room is a live pitch environment where graduated MASSED users can present their brand to business attendees. Attendees can signal interest, commit, or request shelf/distribution access.' },
  { id: 'help-sec-reservations', label: '🍽️ Reservations', body: 'Create reservations for events, dinners, or group bookings. Split payment links are generated automatically. Track who has paid, send reminders, and issue tickets when all payments are collected.' },
  { id: 'help-sec-sparkfounder', label: '⚡ Spark Founder', body: 'Spark Founder is the MASSED investment and mentorship program. Graduated users can pitch to investors, apply for funding, and access founder-only resources and events.' },
]

export default function HelpModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlighted, setHighlighted] = useState(null)
  const scrollRef = useRef(null)
  const searchRef = useRef(null)

  function handleSearch(val) {
    setQuery(val)
    const q = val.trim().toLowerCase()
    if (!q) { setSuggestions([]); setShowSuggestions(false); return }
    const matches = HELP_SECTIONS.filter(s => s.label.toLowerCase().includes(q))
    setSuggestions(matches)
    setShowSuggestions(true)
  }

  function jumpTo(id) {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    const el = document.getElementById(id)
    if (!el || !scrollRef.current) return
    scrollRef.current.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' })
    setHighlighted(id)
    setTimeout(() => setHighlighted(null), 1400)
  }

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '90%', maxWidth: '620px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(44,26,14,0.25)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', margin: 0 }}>Help & Navigation</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-dim)' }}>✕</button>
          </div>

          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              id="help-search"
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search help sections…"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {showSuggestions && (
              <div id="help-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(44,26,14,0.12)', zIndex: 10, marginTop: '4px', overflow: 'hidden' }}>
                {suggestions.length === 0 ? (
                  <div style={{ padding: '10px 14px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>No sections found</div>
                ) : suggestions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => jumpTo(s.id)}
                    style={{ padding: '10px 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--brown-bg)'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} id="help-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '0 28px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {HELP_CONTENT.map(section => (
              <div
                key={section.id}
                id={section.id}
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  transition: 'box-shadow 0.3s',
                  boxShadow: highlighted === section.id ? '0 0 0 3px rgba(192,122,80,0.5)' : 'none'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '6px' }}>{section.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>{section.body}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}