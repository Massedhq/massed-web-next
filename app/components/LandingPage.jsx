'use client'

import { useEffect } from 'react'
import ForgotPasswordModal from './ForgotPasswordModal'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import RequestAccessModal from './RequestAccessModal'
import AppShell from './AppShell'
import AboutModal from './modals/AboutModal'
import PrivacyModal from './modals/PrivacyModal'
import ContactModal from './modals/ContactModal'
import TermsOfUseModal from './modals/TermsOfUseModal'
import TermsOfServiceModal from './modals/TermsOfServiceModal'

export default function LandingPage() {
  useEffect(() => {

    // ── Open Forgot Password ──────────────────────────────────
    window.openForgotPassword = function () {
      const loginModal = document.getElementById('modal-login')
      if (loginModal) loginModal.style.display = 'none'
      if (window.resetForgotModal) window.resetForgotModal()
      document.getElementById('modal-forgot-password').style.display = 'flex'
    }

    // ── Send Code to Email ────────────────────────────────────
    window.sendForgotCode = function () {
      const email = document.getElementById('forgot-email').value.trim()
      const btn = document.getElementById('forgot-send-btn')
      const errEl = document.getElementById('forgot-email-err')
      errEl.style.display = 'none'
      if (!email || !email.includes('@')) {
        errEl.textContent = 'Please enter a valid email address.'
        errEl.style.display = 'block'
        return
      }
      btn.textContent = 'Sending...'
      btn.disabled = true
      fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then(r => r.ok ? r.json() : r.json().then(d => { throw new Error(d.error || 'Failed to send reset code') }))
        .then(() => {
          document.getElementById('forgot-step1').style.display = 'none'
          document.getElementById('forgot-step2').style.display = 'block'
          document.getElementById('forgot-email-display').textContent = email
          document.getElementById('fp-d2').style.background = '#C49A6C'
          btn.textContent = 'Send reset code →'
          btn.disabled = false
        })
        .catch(err => {
          errEl.textContent = err.message
          errEl.style.display = 'block'
          btn.textContent = 'Send reset code →'
          btn.disabled = false
        })
    }

    // ── Verify 6-digit Code ───────────────────────────────────
    window.verifyForgotCode = function () {
      const code = document.getElementById('forgot-code').value.trim()
      const btn = document.getElementById('forgot-verify-btn')
      const errEl = document.getElementById('forgot-code-err')
      errEl.style.display = 'none'
      if (!code || code.length < 6) {
        errEl.textContent = 'Please enter the full 6-digit code.'
        errEl.style.display = 'block'
        return
      }
      btn.textContent = 'Verifying...'
      btn.disabled = true
      fetch('/api/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: document.getElementById('forgot-email').value.trim(), code })
      })
        .then(r => r.ok ? r.json() : r.json().then(d => { throw new Error(d.error || 'Invalid or expired code') }))
        .then(() => {
          document.getElementById('forgot-step2').style.display = 'none'
          document.getElementById('forgot-step3').style.display = 'block'
          document.getElementById('fp-d3').style.background = '#C49A6C'
          btn.textContent = 'Verify code →'
          btn.disabled = false
        })
        .catch(err => {
          errEl.textContent = err.message
          errEl.style.display = 'block'
          btn.textContent = 'Verify code →'
          btn.disabled = false
        })
    }

    // ── Reset Password ────────────────────────────────────────
    window.resetPassword = function () {
      const newPassword = document.getElementById('forgot-new-password').value
      const confirmPassword = document.getElementById('forgot-confirm-password').value
      const btn = document.getElementById('forgot-reset-btn')
      const errEl = document.getElementById('forgot-password-err')
      errEl.style.display = 'none'
      if (!newPassword || newPassword.length < 8) {
        errEl.textContent = 'Password must be at least 8 characters.'
        errEl.style.display = 'block'
        return
      }
      if (newPassword !== confirmPassword) {
        errEl.textContent = 'Passwords do not match.'
        errEl.style.display = 'block'
        return
      }
      btn.textContent = 'Resetting...'
      btn.disabled = true
      fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('forgot-email').value.trim(),
          code: document.getElementById('forgot-code').value.trim(),
          password: newPassword
        })
      })
        .then(r => r.ok ? r.json() : r.json().then(d => { throw new Error(d.error || 'Reset failed') }))
        .then(() => {
          // Show success screen, hide step 3 and back link
          document.getElementById('forgot-step3').style.display = 'none'
          document.getElementById('forgot-back-link').style.display = 'none'
          document.getElementById('forgot-step-success').style.display = 'block'
          btn.textContent = 'Reset password →'
          btn.disabled = false
        })
        .catch(err => {
          errEl.textContent = err.message
          errEl.style.display = 'block'
          btn.textContent = 'Reset password →'
          btn.disabled = false
        })
    }

    // ── Load External Scripts ─────────────────────────────────
    const scripts = [
      '/assets/js/userAuth.js',
      '/assets/js/inviteValidation.js',
      '/assets/js/terms.js',
      '/assets/js/access-remaining.js',
      '/assets/js/script.js'
    ]
    scripts.forEach(src => {
      const script = document.createElement('script')
      script.src = src
      script.async = false
      document.body.appendChild(script)
    })

    // ── Inline Script: API Base + Request Access + Counter ────
    const inlineScript = document.createElement('script')
    inlineScript.textContent = `
      window.API_BASE = window.location.hostname === 'localhost'
        ? '/api'
        : 'https://www.massed.io/api';

      var raCurrentCode = null;

      function openRequestAccess() {
        document.getElementById('modal-request-access').style.display = 'flex';
        raReset();
      }
      function closeRequestAccess() {
        document.getElementById('modal-request-access').style.display = 'none';
      }
      function raReset() {
        document.getElementById('ra-s1').style.display = 'block';
        document.getElementById('ra-s2').style.display = 'none';
        document.getElementById('ra-s3').style.display = 'none';
        document.getElementById('ra-d1').style.background = '#C49A6C';
        document.getElementById('ra-d2').style.background = '#d1c9be';
        document.getElementById('ra-d3').style.background = '#d1c9be';
        ['ra-fname','ra-lname','ra-email','ra-phone','ra-username','ra-code'].forEach(function(id){
          document.getElementById(id).value = '';
        });
        ['ra-fname-err','ra-lname-err','ra-email-err','ra-phone-err','ra-username-err','ra-general-err','ra-code-err','ra-code-ok'].forEach(function(id){
          document.getElementById(id).style.display = 'none';
        });
        raCurrentCode = null;
      }
      function raGoBack() {
        document.getElementById('ra-s2').style.display = 'none';
        document.getElementById('ra-s1').style.display = 'block';
        document.getElementById('ra-d2').style.background = '#d1c9be';
      }
      async function raSendCode() {
        ['ra-fname-err','ra-lname-err','ra-email-err','ra-phone-err','ra-username-err','ra-general-err'].forEach(function(id){
          document.getElementById(id).style.display = 'none';
        });
        var fname = document.getElementById('ra-fname').value.trim();
        var lname = document.getElementById('ra-lname').value.trim();
        var email = document.getElementById('ra-email').value.trim();
        var phone = document.getElementById('ra-phone').value.trim();
        var username = document.getElementById('ra-username').value.trim();
        var valid = true;
        if (!fname) { document.getElementById('ra-fname-err').style.display='block'; valid=false; }
        if (!lname) { document.getElementById('ra-lname-err').style.display='block'; valid=false; }
        if (!email||!email.includes('@')) { document.getElementById('ra-email-err').style.display='block'; valid=false; }
        if (!phone) { document.getElementById('ra-phone-err').style.display='block'; valid=false; }
        if (!username) { document.getElementById('ra-username-err').style.display='block'; valid=false; }
        if (!valid) return;
        const emailCheck = await fetch('/api/check-email?email='+encodeURIComponent(email));
        const emailData = await emailCheck.json();
        if (emailData.exists===true) {
          document.getElementById('ra-email-err').textContent='Email already in use';
          document.getElementById('ra-email-err').style.display='block'; return;
        }
        const usernameCheck = await fetch('/api/check-username?username='+encodeURIComponent(username));
        const usernameData = await usernameCheck.json();
        if (usernameData.taken===true) {
          document.getElementById('ra-username-err').textContent='Username already taken';
          document.getElementById('ra-username-err').style.display='block'; return;
        }
        raCurrentCode = Math.floor(100000+Math.random()*900000).toString();
        var btn = document.getElementById('ra-send-btn');
        btn.textContent='Sending...'; btn.disabled=true;
        fetch('/api/send-verification',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:email,code:raCurrentCode,name:fname+' '+lname})
        }).then(function(r){return r.json();}).then(function(){
          btn.textContent='Request Access'; btn.disabled=false;
          document.getElementById('ra-email-show').textContent=email;
          document.getElementById('ra-s1').style.display='none';
          document.getElementById('ra-s2').style.display='block';
          document.getElementById('ra-d2').style.background='#C49A6C';
        }).catch(function(){
          btn.textContent='Request Access'; btn.disabled=false;
          alert('Could not send verification email. Please try again.');
        });
      }
      function raVerifyCode() {
        document.getElementById('ra-email-err').style.display='none';
        var entered = document.getElementById('ra-code').value.trim();
        document.getElementById('ra-code-err').style.display='none';
        document.getElementById('ra-code-ok').style.display='none';
        if (entered!==raCurrentCode) { document.getElementById('ra-code-err').style.display='block'; return; }
        document.getElementById('ra-code-ok').style.display='block';
        var btn=document.getElementById('ra-verify-btn');
        btn.textContent='Submitting...'; btn.disabled=true;
        var fname=document.getElementById('ra-fname').value.trim();
        var lname=document.getElementById('ra-lname').value.trim();
        var email=document.getElementById('ra-email').value.trim();
        var phone=document.getElementById('ra-phone').value.trim();
        var username=document.getElementById('ra-username').value.trim();
        fetch('/api/request-access',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:fname+' '+lname,email:email,phone:phone,username:username})
        }).then(function(r){
          if(!r.ok) return r.json().then(function(d){throw new Error(d.error||d.details||'Submission failed');});
          return r.json();
        }).then(function(){
          document.getElementById('ra-success-email').textContent=email;
          document.getElementById('ra-s2').style.display='none';
          document.getElementById('ra-s3').style.display='block';
          document.getElementById('ra-d3').style.background='#C49A6C';
        }).catch(function(err){
          var emailErr=document.getElementById('ra-email-err');
          emailErr.textContent=err.message; emailErr.style.display='block';
          btn.textContent='Verify Code'; btn.disabled=false;
        });
      }
      async function updateCounter() {
        try {
          const response = await fetch('/api/access-remaining');
          const data = await response.json();
          const el = document.getElementById('accessRemaining');
          if (data.success) el.innerText = data.spots_remaining.toLocaleString();
        } catch(e) { console.error('Could not update counter:', e); }
      }
      updateCounter();
    `
    document.body.appendChild(inlineScript)
  }, [])

  return (
    <>
      {/* ── Landing Screen ── */}
      <div id="screen-landing" className="screen active">
        <nav className="nav">
          <a className="nav-logo" onClick={e => e.preventDefault()}>
            <img src="/my_logo.png" alt="Massed logo" style={{ width: '32px', height: '32px', objectFit: 'contain', marginRight: '8px', verticalAlign: 'middle' }} />
            <span className="nav-logo-text">Masse<span>d</span></span>
          </a>
          <div className="nav-right">
            <button className="btn btn-ghost" onClick={() => window.openModal?.('login')}>Sign in</button>
            <button className="btn btn-dark" onClick={() => window.openRequestAccess?.()}>Request access</button>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            Invitation only
          </div>
          <h1 className="hero-h1">Share what <em>matters.</em><br />Build what lasts.</h1>
          <p className="hero-sub">Massed is a curated network for those who understand that presence is power.</p>
          <div className="hero-btns">
            <button className="btn btn-tc" onClick={() => window.openModal?.('signup')}>Join with invitation →</button>
            <button className="btn btn-outline" onClick={() => window.openModal?.('login')}>Sign in</button>
          </div>
          <div className="hero-access-counter">
            <div className="hero-stat-label">Access Remaining</div>
            <div className="hero-stat-num" id="accessRemaining">48,000</div>
          </div>
        </div>

        {/* Features */}
        <div className="section" style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}>
          <div className="section-inner">
            <div className="section-eyebrow">Everything you need</div>
            <div className="section-title">Built for those who understand presence is power and knowledge is leverage.</div>
            <div className="features-grid">
              {[
                { icon: '⚡', name: 'Post Signals', desc: 'Quick, punchy thoughts under 280 characters. Your signal to the world — distilled and direct.' },
                { icon: '✍️', name: 'Write Posts', desc: 'Long-form content for when your ideas need room to breathe. Rich, readable, and permanently yours.' },
                { icon: '🔒', name: 'Vault', desc: 'Save any signal or post from anyone. Your private archive — always searchable, always accessible.' },
                { icon: '🔗', name: 'Link in Bio', desc: 'A polished, customisable public page for all your links — portfolio, newsletter, shop, and more.' },
                { icon: '👤', name: 'Public Profiles', desc: 'A cohesive public presence showing your signals, posts, and links in one beautiful space.' },
                { icon: '🏢', name: 'Business Accounts', desc: 'Switch between personal and business profiles in one session. Same login, multiple voices.' },
              ].map(f => (
                <div key={f.name} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-name">{f.name}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Band */}
        <div className="cta-band">
          <h2>Massed is <em>invitation only.</em><br />Got an invite?</h2>
          <p>Create your account and join the network.</p>
          <button className="btn btn-tc" onClick={() => window.openModal?.('signup')}>Sign up with invite code →</button>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <img src="/my_logo.png" alt="Massed" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '16px', letterSpacing: '1px' }}>
              Masse<span style={{ color: 'var(--tc)' }}>d</span>
            </span>
            <span className="footer-copy">© 2026 Massed. All rights reserved.</span>
          </div>
          <div className="footer-links">
            <a className="footer-link" onClick={() => document.getElementById('modal-about').style.display = 'flex'}>About</a>
            <a className="footer-link" onClick={() => document.getElementById('modal-terms-use').style.display = 'flex'}>Terms Of Use</a>
            <a className="footer-link" onClick={() => document.getElementById('modal-privacy').style.display = 'flex'}>Privacy</a>
            <a className="footer-link" onClick={() => document.getElementById('modal-contact').style.display = 'flex'}>Contact</a>
          </div>
        </footer>
      </div>

      {/* ── App Screen ── */}
      <AppShell />

      {/* ── Modals ── */}
      <SignupModal />
      <LoginModal />
      <ForgotPasswordModal />
      <RequestAccessModal />
      <AboutModal />
      <TermsOfUseModal />
      <PrivacyModal />
      <ContactModal />
      <TermsOfServiceModal />

      {/* Toast */}
      <div id="toast" className="toast"></div>
    </>
  )
}