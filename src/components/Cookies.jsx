'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Fade,
  FormControlLabel,
  FormGroup,
  Switch,
  Link,
  Typography,
  useScrollTrigger,
  Zoom,
  Collapse,
} from '@mui/material'
import { CookieSharp, KeyboardArrowUp, Settings } from '@mui/icons-material'

const COOKIE_PREFERENCES = {
  necessary: true, // Always true
  analytics: false,
  marketing: false,
  functional: false,
}

const ScrollTop = ({ children }) => {
  const trigger = useScrollTrigger({
    target: typeof window !== 'undefined' ? window : undefined,
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role='presentation'
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        {children}
      </Box>
    </Zoom>
  )
}

const CookiesAndScroll = () => {
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState(COOKIE_PREFERENCES)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = document.querySelectorAll('section')
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
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

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences')
    if (!savedPreferences) {
      setOpen(true)
    } else {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      ...preferences,
      analytics: true,
      marketing: true,
      functional: true,
    }
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
    setPreferences(allAccepted)
    setOpen(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setOpen(false)
  }

  const handlePreferenceChange = name => event => {
    setPreferences(prev => ({
      ...prev,
      [name]: event.target.checked,
    }))
  }

  const handleResetPreferences = () => {
    localStorage.removeItem('cookiePreferences')
    setOpen(true)
  }

  const cookieDescriptions = {
    necessary:
      'Essential cookies for website functionality. Cannot be disabled.',
    analytics: 'Help us understand how visitors interact with our website.',
    marketing: 'Used to deliver personalized advertisements.',
    functional: 'Enable advanced website features and personalization.',
  }

  return (
    <>
      <Dialog open={open} maxWidth='sm' fullWidth>
        <DialogTitle
          sx={{
            color: 'ternary.main',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Cookie Settings
          <Button
            startIcon={<Settings />}
            onClick={() => setShowDetails(!showDetails)}
            color='ternary'
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' paragraph>
            We use cookies to enhance your browsing experience and analyze
            website traffic.
          </Typography>

          <Collapse in={showDetails}>
            <FormGroup>
              {Object.entries(preferences).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={value}
                      onChange={handlePreferenceChange(key)}
                      disabled={key === 'necessary'}
                    />
                  }
                  label={
                    <Box>
                      <Typography
                        variant='subtitle1'
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {key}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {cookieDescriptions[key]}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Collapse>
        </DialogContent>
        <Box
          sx={{
            p: 3,
            pt: 0,
            display: 'flex',
            justifyContent: 'end',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
          }}
        >
          <Button
            variant='outlined'
            color='ternary'
            sx={{
              width: { xs: '100%', sm: 'fit-content' },
            }}
            onClick={() => setOpen(false)}
          >
            Decline All
          </Button>
          <Button
            variant='outlined'
            color='ternary'
            sx={{
              width: { xs: '100%', sm: 'fit-content' },
              margin: { xs: 0, sm: 'inherit' },
            }}
            onClick={handleSavePreferences}
          >
            Save Preferences
          </Button>
          <Button
            variant='contained'
            color='ternary'
            sx={{
              bgcolor: 'ternary.main',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'ternary.main',
                opacity: 0.9,
              },
            }}
            onClick={handleAcceptAll}
          >
            Accept All
          </Button>
        </Box>
      </Dialog>

      {/* Cookie Settings Trigger */}
      <Fab
        size='small'
        color='ternary'
        aria-label='cookie settings'
        onClick={handleResetPreferences}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 1000,
          borderRadius: 0,
          color: activeSection === 'contact' ? '#063970' : 'white',
          backgroundColor:
            activeSection === 'contact' ? 'white' : 'ternary.main',
          '&:hover': {
            backgroundColor:
              activeSection === 'contact' ? 'ternary.main' : 'white',
            color: activeSection === 'contact' ? 'white' : '#063970',
          },
        }}
      >
        <CookieSharp />
      </Fab>
      {/* Scroll to Top FAB */}
      <ScrollTop>
        <Fab
          color='#063970'
          size='large'
          aria-label='scroll back to top'
          sx={{
            boxShadow: 3,
            borderRadius: 0,
            width: '40px',
            height: '40px',
            backgroundColor:
              activeSection === 'contact' ? 'white' : 'ternary.main',
            color: activeSection === 'contact' ? '#063970' : 'white',
            '&:hover': {
              backgroundColor:
                activeSection === 'contact' ? 'ternary.main' : 'white',
              color: activeSection === 'contact' ? 'white' : '#063970',
            },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </>
  )
}

export default CookiesAndScroll
