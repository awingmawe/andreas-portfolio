'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '../constant/theme'

export default function ThemeProviderWrapper({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
