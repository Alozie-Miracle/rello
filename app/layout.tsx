import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Modal from '@/components/Modal'

const inter = Poppins({ weight: '700', preload:false })

export const metadata: Metadata = {
  title: 'Rello Build',
  description: 'From zypher-ix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + 'bg-[#F5F6F8]'}>
        {children}
        <Modal />
      </body>
    </html>
  )
}
