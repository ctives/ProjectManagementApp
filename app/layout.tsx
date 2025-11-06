import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kanban Board',
  description: 'A beautiful project management kanban board',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  )
}
