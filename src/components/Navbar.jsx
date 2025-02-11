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

  const drawerVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // Material Design easing
        when: 'afterChildren',
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        when: 'beforeChildren',
        staggerChildren: 0.05,
      },
    },
  }

  const listItemVariants = {
    hidden: {
      x: 20,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  const sections = [
    'home',
    'about',
    'services',
    'experience',
    'publications',
    'contact',
  ]

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
    <AnimatePresence>
      <motion.div
        initial='hidden'
        animate='visible'
        exit='hidden'
        variants={drawerVariants}
        style={{
          width: 250,
          height: '100%',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'rotate(90deg)',
            },
          }}
        >
          <CloseIcon sx={{ color: '#063970' }} />
        </IconButton>

        <List sx={{ mt: 3, overflow: 'hidden' }}>
          {sections.map((section, index) => (
            <motion.div
              key={section}
              variants={listItemVariants}
              style={{ overflow: 'hidden' }}
            >
              <ListItem
                onClick={() => handleScrollToSection(section)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#06397015',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemText
                  primary={t(`${section}`)}
                  sx={{
                    '& .MuiTypography-root': {
                      color:
                        activeSection === section ? '#063970' : 'text.primary',
                      fontWeight: activeSection === section ? 600 : 400,
                      transition: 'all 0.3s ease',
                    },
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </motion.div>
    </AnimatePresence>
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
                width: isMobile ? '50px' : '80px',
                height: 'auto',
                padding: '16px 0px',
                // opacity: isMobile && !(scrolled || isTop) ? 0 : 1,
                // transition: 'opacity 0.3s ease-in-out',
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
                {sections.map(section => (
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
      {drawerOpen && (
        <Drawer
          anchor='right'
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            overflow: 'hidden',
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </AppBar>
  )
}
