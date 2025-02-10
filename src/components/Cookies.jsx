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
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
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
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant='outlined'
            color='ternary'
            onClick={() => setOpen(false)}
          >
            Decline All
          </Button>
          <Button
            variant='outlined'
            color='ternary'
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
        </DialogActions>
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
          color: 'white',
          backgroundColor: 'ternary.main',
          '&:hover': {
            backgroundColor: 'white',
            color: '#063970',
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
            backgroundColor: 'ternary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'white',
              color: '#063970',
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
