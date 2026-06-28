import type { Metadata, Viewport } from 'next'
import './theme.css'

export const metadata: Metadata = {
  title: 'Omnifit',
  description: 'Your personal bulk workout tracker — train harder, bulk up.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Omnifit' },
}

export const viewport: Viewport = {
  themeColor: '#C6FF00',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
