import '../globals.css'
import Navbar from '../../components/Navbar'
import ThemeProviderWrapper from '../../components/ThemeProvider'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

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
            <Navbar />
            {children}
          </NextIntlClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
