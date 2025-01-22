import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'de']

export const localePrefix = 'as-needed'

export const pathnames = {
  '/': '/',
}

export const { Link, redirect, usePathname, useRouter } = createNavigation(
  defineRouting({
    locales,
    localePrefix,
    pathnames,
  }),
)
