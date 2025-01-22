import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['en', 'de']

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  return {
    messages: (await import(`../locale/${locale}.json`)).default,
  }
})
