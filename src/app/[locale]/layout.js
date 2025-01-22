import Navbar from '@/components/Navbar'

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale} translate='no'>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
