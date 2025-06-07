import { Inter } from 'next/font/google'
import { ClientProviders } from './components/providers/ClientProviders'
import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "./components/ui/sonner"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AdaLove 2',
  description: 'AdaLove reimaginada para gerenciamento de autoestudos do Instituto de Tecnologia e Liderança (Inteli)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
