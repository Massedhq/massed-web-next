export default function Sidebar() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!-- SIDEBAR -->
<aside class="sidebar" id="main-sidebar">
  <div class="sidebar-logo">
    <img src="/logo.png" style="width:36px;height:36px;object-fit:cover;border-radius:8px;" alt="Massed logo" />
    <span class="logo-name">Massed</span>
  </div>

  <nav class="sidebar-nav">

    <div class="nav-group-header" onclick="this.classList.toggle('closed')">
      <span>Main</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-main">
      <div class="nav-item active" data-screen="dashboard" onclick="window.dispatchEvent(new CustomEvent('changeScreen',{detail:'dashboard'}))">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </div>
      <div class="nav-item" data-screen="showcase" onclick="window.dispatchEvent(new CustomEvent('changeScreen',{detail:'showcase'}))">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
        Showcase
      </div>
      <div class="nav-item" data-screen="store" onclick="window.dispatchEvent(new CustomEvent('changeScreen',{detail:'store'}))">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        My Store
      </div>
<div class="nav-item" data-screen="digital" onclick="window.dispatchEvent(new CustomEvent('changeScreen',{detail:'digital'}))" style="padding-left:36px;font-size:0.82rem;">
  <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  Digital Products
</div>     
<div class="nav-item" style="padding-left:36px;font-size:0.82rem;">
  <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
  Physical Products
</div>
      <div class="nav-item" style="padding-left:36px;font-size:0.82rem;">
  <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
  Courses
</div>
    </div>

    <div class="nav-group-header closed" onclick="this.classList.toggle('closed')">
      <span>Build</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-build">
     <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
  Web Links
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
  Booking / Your Services
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M7 12h10"/>
    <path d="M12 7v10"/>
  </svg>
  Subscriptions / Memberships
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 010 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 010-4z"/>
    <path d="M9 12h6"/>
  </svg>
  Events / Tickets
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <line x1="7" y1="9" x2="17" y2="9"/>
    <line x1="7" y1="13" x2="17" y2="13"/>
    <line x1="7" y1="17" x2="13" y2="17"/>
  </svg>
  Listings
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="4" y="10" width="3" height="10"/>
    <rect x="10" y="6" width="3" height="14"/>
    <rect x="16" y="2" width="3" height="18"/>
  </svg>
  Create Poll
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <line x1="8" y1="11" x2="16" y2="11"/>
    <line x1="8" y1="15" x2="13" y2="15"/>
  </svg>
  Forms
</div>
    </div>

    <div class="nav-group-header closed" onclick="this.classList.toggle('closed')">
      <span>Profile</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-profile">
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
  Media Profile
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <path d="M8.6 10.6l6.8-4.2"/>
    <path d="M8.6 13.4l6.8 4.2"/>
  </svg>
  Social Links
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="3" y="5" width="15" height="14" rx="2"/>
    <polygon points="10,9 15,12 10,15"/>
  </svg>
  Video
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7"/>
    <path d="M12 3v12"/>
    <path d="M8 7l4-4 4 4"/>
  </svg>
  Promo / Referrals / Affiliates
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
  Branding / Browser Icon
</div>
    </div>

    <div class="nav-group-header closed" onclick="this.classList.toggle('closed')">
      <span>Finance</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-finance">
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="4" y="10" width="3" height="10"/>
    <rect x="10" y="6" width="3" height="14"/>
    <rect x="16" y="2" width="3" height="18"/>
  </svg>
  Analytics
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
  Sales & Payouts
</div>
      <div class="nav-item" style="padding-left:34px;font-size:0.82rem;">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 000-6l2.1-1.6-2-3.5-2.5 1a6 6 0 00-5.8 0l-2.5-1-2 3.5L4.6 9a1.65 1.65 0 000 6l-2.1 1.6 2 3.5 2.5-1a6 6 0 005.8 0l2.5 1 2-3.5z"/>
  </svg>
  Payout Settings
</div>
    </div>

    <div class="nav-group-header closed" onclick="this.classList.toggle('closed')">
  <span>Trust & Community</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-trust">
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
  Gateway Room
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/>
  </svg>
  Reviews
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M3 7V5a2 2 0 012-2h2"/>
    <path d="M21 7V5a2 2 0 00-2-2h-2"/>
    <path d="M3 17v2a2 2 0 002 2h2"/>
    <path d="M21 17v2a2 2 0 01-2 2h-2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
  Scanner
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
  My Messages
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"/>
    <line x1="5" y1="5" x2="19" y2="19"/>
  </svg>
  Banned / Blocked
</div>
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
  </svg>
  Spark Founder
</div>
    </div>

    <div class="nav-group-header closed" onclick="this.classList.toggle('closed')">
  <span>System</span>
      <svg class="arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="nav-group-body" id="group-system">
      <div class="nav-item">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 000-6l2.1-1.6-2-3.5-2.5 1a6 6 0 00-5.8 0l-2.5-1-2 3.5L4.6 9a1.65 1.65 0 000 6l-2.1 1.6 2 3.5 2.5-1a6 6 0 005.8 0l2.5 1 2-3.5z"/>
  </svg>
  Settings
</div>
    </div>

  </nav>

  <div class="sidebar-bottom">
    <div class="user-card">
      <div id="sidebar-avatar" class="user-avatar">N</div>
      <div>
        <div id="sidebar-name" class="user-name">nicky</div>
        <div id="sidebar-handle" class="user-handle">@nicky2u</div>
      </div>
    </div>

    <div class="bottom-btns">
      <button class="btn-golive">
        <span class="pulse-dot" style="width:9px;height:9px;background:#fff;"></span>
        Go Live
      </button>

      <button class="btn-more">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" fill="var(--text-mid)"/>
          <circle cx="12" cy="12" r="1.5" fill="var(--text-mid)"/>
          <circle cx="12" cy="19" r="1.5" fill="var(--text-mid)"/>
        </svg>
      </button>
    </div>
  </div>
</aside>
        `,
      }}
    />
  );
}