import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Can be imported from a shared config

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../locale/${locale}.json`)).default,
  }
})
