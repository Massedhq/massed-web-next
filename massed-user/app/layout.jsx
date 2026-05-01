import './globals.css'

export const metadata = {
  title: 'MASSED Dashboard',
  description: 'Your MASSED creator dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <script src="/showcase.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}