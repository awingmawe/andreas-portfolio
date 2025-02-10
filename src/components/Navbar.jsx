'use client'

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Logo from '../assets/thumbnail.png'
import { useEffect, useState } from 'react'
import { useRouter } from '../i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import enFlag from '../assets/united-kingdom.png'
import deFlag from '../assets/german.png'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isTop, setIsTop] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('navbar')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (window.scrollY > 50) {
      setIsTop(true)
    } else {
      setIsTop(false)
    }
  }, [scrolled])

  useEffect(() => {
    const sections = document.querySelectorAll('section')
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach(section => observer.observe(section))

    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [])

  const handleScrollToSection = id => {
    const section = document.getElementById(id)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth',
      })
      history.replaceState(null, '', window.location.pathname)
    }
    setDrawerOpen(false)
  }

  const handleLanguageChange = locale => {
    router.replace(`/`, { locale })
  }

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(open)
  }

  // Drawer content with Framer Motion animations
  const drawerContent = (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        width: 250,
        height: '100%',
        backgroundColor: 'common.white',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      <IconButton
        onClick={toggleDrawer(false)}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon sx={{ color: '#063970' }} />
      </IconButton>
      <List>
        {[
          'home',
          'about',
          'services',
          'experience',
          'education',
          'publications',
          'contact',
        ].map((section, index) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
          >
            <ListItem
              button
              onClick={() => handleScrollToSection(section)}
              sx={{
                '&:hover': {
                  backgroundColor: '#06397010',
                },
              }}
            >
              <ListItemText
                primary={t(`${section}`)}
                sx={{
                  color: activeSection === section ? '#063970' : 'text.primary',
                  fontWeight: activeSection === section ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </motion.div>
  )

  return (
    <AppBar
      position='fixed'
      sx={{
        backgroundColor: scrolled || isTop ? 'white' : 'transparent',
        boxShadow: scrolled || isTop ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 0,
        transition:
          'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      }}
    >
      <Toolbar>
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Image
              src={Logo}
              alt='logo-vision'
              width={0}
              height={0}
              sizes='100vw'
              style={{
                width: '80px',
                height: 'auto',
                padding: '16px 0px',
              }}
            />
            {isMobile ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    onClick={() =>
                      handleLanguageChange(locale === 'en' ? 'de' : 'en')
                    }
                    sx={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      backgroundColor: scrolled ? '#063970' : 'common.white',
                      position: 'relative',
                      transition: 'background-color 0.8s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      py: '2px',
                      px: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <motion.div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '13px',
                        backgroundColor: '#063970',
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                      initial={{
                        x: locale === 'en' ? 30 : 0,
                      }}
                      animate={{
                        x: locale === 'en' ? 0 : 30,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Image
                        src={locale === 'en' ? enFlag : deFlag}
                        alt={locale === 'en' ? 'US Flag' : 'German Flag'}
                        width={20}
                        height={20}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </motion.div>
                  </Box>
                </motion.div>
                <IconButton
                  edge='end'
                  color='inherit'
                  aria-label='menu'
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon sx={{ color: '#063970' }} />
                </IconButton>
              </Box>
            ) : (
              <Stack direction='row' spacing={3} alignItems='center'>
                {[
                  'home',
                  'about',
                  'services',
                  'experience',
                  'education',
                  'publications',
                  'contact',
                ].map(section => (
                  <Typography
                    key={section}
                    onClick={() => handleScrollToSection(section)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: '-4px',
                        width: '100%',
                        height: '2px',
                        backgroundColor:
                          activeSection === section ? '#063970' : 'transparent',
                        transform:
                          activeSection === section ? 'scaleX(1)' : 'scaleX(0)',
                        transition:
                          'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                        backgroundColor: '#063970',
                      },
                    }}
                  >
                    {t(`${section}`)}
                  </Typography>
                ))}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    onClick={() =>
                      handleLanguageChange(locale === 'en' ? 'de' : 'en')
                    }
                    sx={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      backgroundColor: scrolled ? '#063970' : 'common.white',
                      position: 'relative',
                      transition: 'background-color 0.8s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      py: '2px',
                      px: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <motion.div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '13px',
                        backgroundColor: '#063970',
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                      initial={{
                        x: locale === 'en' ? 30 : 0,
                      }}
                      animate={{
                        x: locale === 'en' ? 0 : 30,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Image
                        src={locale === 'en' ? enFlag : deFlag}
                        alt={locale === 'en' ? 'US Flag' : 'German Flag'}
                        width={20}
                        height={20}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </motion.div>
                  </Box>
                </motion.div>
              </Stack>
            )}
          </Box>
        </Container>
      </Toolbar>

      {/* Drawer with Framer Motion animations */}
      <AnimatePresence>
        {drawerOpen && (
          <Drawer
            anchor='right'
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: 'common.white',
              },
              overflow: 'hidden',
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </AnimatePresence>
    </AppBar>
  )
}
