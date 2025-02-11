'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Box, Container, Typography } from '@mui/material'
import { FormatQuote } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

const WordAnimatedQuote = () => {
  const t = useTranslations('others')
  const quote = t('quote')
  const words = quote.split(' ')

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.2, 0.65, 0.3, 0.9], // Custom easing
      },
    },
  }

  const quoteIconVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 0.1,
      transition: {
        duration: 1,
        delay: 0.5,
      },
    },
  }

  return (
    <Box
      sx={{
        backgroundColor: '#fefefe',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 4,
      }}
    >
      <Container maxWidth='lg'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariants}
        >
          <Box
            sx={{
              position: 'relative',
              py: { xs: 6, sm: 10 },
              px: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Opening Quote Icon */}
            <motion.div
              variants={quoteIconVariants}
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
              }}
            >
              <FormatQuote
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' },
                  color: 'ternary.main',
                  transform: 'rotate(180deg)',
                }}
              />
            </motion.div>

            {/* Closing Quote Icon */}
            <motion.div
              variants={quoteIconVariants}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
              }}
            >
              <FormatQuote
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem' },
                  color: 'ternary.main',
                }}
              />
            </motion.div>

            {/* Quote Text */}
            <Box
              sx={{
                maxWidth: '80%',
                textAlign: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.4em',
              }}
            >
              {words.map((word, i) => (
                <motion.div
                  key={i}
                  variants={wordVariants}
                  style={{
                    display: 'inline-block',
                    margin: '0 2px',
                    whiteSpace: 'pre',
                  }}
                >
                  <Typography
                    variant='h4'
                    component='span'
                    sx={{
                      color: 'ternary.main',
                      fontWeight: 400,
                      lineHeight: 1.4,
                      letterSpacing: '0.02em',
                      fontStyle: 'italic',
                    }}
                  >
                    {word}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default WordAnimatedQuote
