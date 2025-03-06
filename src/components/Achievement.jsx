'use client'

import React, { useRef } from 'react'
import { Box, Typography, Container, Grid2, Stack } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import ACCA from '../assets/acca.png'
import CFP from '../assets/cfp.png'
import FINS from '../assets/FINS.png'
import SVEB from '../assets/SVEB.png'

const CertificateSection = () => {
  const t = useTranslations('certificate')

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  }

  const items = [
    {
      index: 1,
      image: ACCA,
    },
    {
      index: 3,
      image: FINS,
    },
    {
      index: 4,
      image: FINS,
    },
    {
      index: 5,
      image: SVEB,
    },
    {
      index: 2,
      image: CFP,
    },
  ]

  return (
    <Box
      component='section'
      id='about'
      sx={{
        backgroundColor: '#fefefe',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 5,
      }}
    >
      <Container maxWidth='lg'>
        <Typography
          variant='h2'
          color='ternary'
          sx={{
            textAlign: 'left',
            mb: 6,
          }}
        >
          {t('title')}
        </Typography>
        <Grid2 container spacing={4} justifyContent='center'>
          {items.map(item => {
            const ref = useRef(null)
            const isInView = useInView(ref, {
              once: false, // Only trigger animation once
              margin: '-75px -100px', // Trigger when 50px above and below viewport
              amount: 0.3, // Trigger when 50% of the item is visible
            })

            return (
              <Grid2 key={item.index} size={{ xs: 12 }}>
                <motion.div
                  ref={ref}
                  variants={itemVariants}
                  initial='hidden'
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <Box
                    sx={{
                      padding: '20px',
                      borderTop: '1px solid #063970',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Grid2
                      container
                      alignItems='center'
                      spacing={{ xs: 1, md: 5 }}
                    >
                      <Grid2
                        size={{ xs: 12, md: 3 }}
                        textAlign={{ xs: 'center', md: 'left' }}
                      >
                        <Box
                          sx={{
                            width: '200px',
                            position: 'relative',
                            overflow: 'hidden',
                            margin: { xs: 'auto', md: 'none' },
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={`Certificate ${item.index}`}
                            sizes='100vw'
                            height={0}
                            width={0}
                            style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      </Grid2>
                      <Grid2
                        size={{ xs: 12, md: 4 }}
                        textAlign={{ xs: 'center', md: 'left' }}
                      >
                        <Typography variant='h6' color='ternary'>
                          {t(`${item.index}.title`)}
                        </Typography>
                      </Grid2>
                      <Grid2
                        size={{ xs: 12, md: 5 }}
                        textAlign={{ xs: 'center', md: 'left' }}
                      >
                        <Typography variant='body1'>
                          {t(`${item.index}.description`)}
                        </Typography>
                      </Grid2>
                    </Grid2>
                  </Box>
                </motion.div>
              </Grid2>
            )
          })}
        </Grid2>
      </Container>
    </Box>
  )
}

export default CertificateSection
