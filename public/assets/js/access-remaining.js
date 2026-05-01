// ================================
// ACCESS COUNTER (REALTIME)
// ================================

async function loadRemainingAccess() {
  try {
    const res = await fetch('https://massed-web.vercel.app/api/remaining-access');
    const data = await res.json();

    const el = document.getElementById("accessRemaining");

    if (!el) return;

    if (data.spots_remaining !== undefined) {
      el.textContent = Number(data.spots_remaining).toLocaleString();
    }

  } catch (err) {
    console.error("Failed to load access remaining:", err);
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadRemainingAccess);