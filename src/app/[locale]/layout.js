import '../globals.css'
// SITE PAUSED — the site chrome (navbar, cookie banner, scroll-to-top) is
// hidden while the renewed Vision Goal platform is in progress. Uncomment the
// imports + JSX below to bring the full site back.
// import Navbar from '../../components/Navbar'
import ThemeProviderWrapper from '../../components/ThemeProvider'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
// import CookiesAndScroll from '../../components/Cookies'

export default async function RootLayout(props) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const messages = await getMessages()

  return (
    <html lang={locale} translate='no' suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
          <NextIntlClientProvider messages={messages}>
            {/* <CookiesAndScroll /> */}
            {/* <Navbar /> */}
            {children}
          </NextIntlClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
