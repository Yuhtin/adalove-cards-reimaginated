'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '../../../contexts/AuthContext'
import { ThemeProvider as CustomThemeProvider } from '../../../contexts/ThemeContext'

export function ClientProviders({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
