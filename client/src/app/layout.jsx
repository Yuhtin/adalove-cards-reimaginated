import { Inter } from 'next/font/google'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AdaLove 2: Reimaginated',
  description: 'Estude com clareza - Gestão inteligente de autoestudos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <Toaster />
          <Sonner />
        </ClientProviders>
      </body>
    </html>
  )
}