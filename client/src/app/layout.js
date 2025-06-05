import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AdaLove 2 - Plataforma de Autoestudos',
  description: 'Plataforma moderna para gerenciamento de autoestudos do Inteli',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
