export default function Dashboard() {
  return (
    <main style={{ padding: '40px' }}>
      <h1>Massed Dashboard</h1>
      <p>No data yet.</p>

      <button onClick={() => window.signOut?.()}>
        Sign out
      </button>
    </main>
  )
}