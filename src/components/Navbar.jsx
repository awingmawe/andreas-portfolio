'use client'

import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import Logo from '../assets/thumbnail.png'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home') // Track active section

  // Handle scroll event for navbar background
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

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section') // Select all sections
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the section is visible
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id) // Set the active section ID
        }
      })
    }, observerOptions)

    sections.forEach(section => observer.observe(section))

    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [])

  // Custom scroll function to hide the hash in the URL
  const handleScrollToSection = id => {
    const section = document.getElementById(id)
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      })
      // Update the URL without adding the hash
      history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <AppBar
      position='fixed'
      sx={{
        backgroundColor: scrolled ? 'common.white' : 'transparent',
        boxShadow: scrolled ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 0,
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
            <Stack direction='row' spacing={3}>
              {['home', 'about', 'services', 'publications', 'contact'].map(
                section => (
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
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Typography>
                ),
              )}
            </Stack>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  )
}
