'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid2,
  Button,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Image from 'next/image'
import Andreas from '../assets/andreas-2.jpeg'
import EducationTree from './Education'

const AboutUsSection = () => {
  const t = useTranslations('about-us')

  // Animation variants
  const containerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  // State to manage accordion expansion
  const [expanded, setExpanded] = useState('career')

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const downloadPDF = () => {
    const pdfUrl = '/2023-CV-Svoboda.pdf'
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = '2023-CV-Svoboda.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box
      component='section'
      id='about'
      sx={{
        backgroundColor: '#e2ecf6',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 5,
      }}
    >
      <Container maxWidth='lg'>
        {/* Title */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: false }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='h2'
            color='ternary'
            sx={{
              textAlign: 'left',
            }}
          >
            {t('title')}
          </Typography>
          <Box
            sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}
          >
            <Button
              color='ternary'
              variant='contained'
              sx={{
                width: 'fit-content',
                color: 'common.white',
              }}
              onClick={downloadPDF}
            >
              Download CV
            </Button>
          </Box>
        </motion.div>

        <Grid2
          container
          spacing={{ xs: 2, md: 4 }}
          alignItems='stretch'
          mt={{ xs: 2, md: 5 }}
        >
          <Grid2 size={{ xs: 12, md: 4 }}>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: false }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  width: {
                    xs: '100%',
                    sm: '50%',
                    md: '100%',
                  },
                }}
              >
                <Image
                  src={Andreas} // Replace with your image path
                  alt='About Us'
                  width={0}
                  height={0}
                  sizes='100vw'
                  style={{
                    height: 'auto',
                    width: '100%',
                    objectFit: 'contain',
                    margin: 'auto',
                  }}
                />
              </Box>
            </motion.div>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  mb: { xs: 2, md: 0 },
                }}
              >
                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: false }}
                >
                  {/* Header */}

                  <Typography
                    variant='h6'
                    color='text.secondary'
                    sx={{
                      mb: 2,
                    }}
                  >
                    {t('header')}
                  </Typography>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: false }}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      textAlign: 'left',
                    }}
                    color='text.secondary'
                  >
                    {t('intro')}
                  </Typography>
                </motion.div>
              </Box>
              <motion.div
                variants={containerVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: false }}
              >
                <Accordion
                  expanded={expanded === 'career'}
                  onChange={handleChange('career')}
                  sx={{
                    mb: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:before': {
                      display: 'none', // Remove the :before pseudo-element
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6' sx={{ color: '#063970' }}>
                      {t('career.title')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {t('career.text')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  expanded={expanded === 'education'}
                  onChange={handleChange('education')}
                  sx={{
                    mb: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:before': {
                      display: 'none', // Remove the :before pseudo-element
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6' sx={{ color: '#063970' }}>
                      {t('education.title')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {t('education.text')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === 'skills'}
                  onChange={handleChange('skills')}
                  sx={{
                    mb: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:before': {
                      display: 'none', // Remove the :before pseudo-element
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6' sx={{ color: '#063970' }}>
                      {t('skills.title')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {t('skills.text')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  expanded={expanded === 'passion'}
                  onChange={handleChange('passion')}
                  sx={{
                    mb: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:before': {
                      display: 'none', // Remove the :before pseudo-element
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6' sx={{ color: '#063970' }}>
                      {t('passion.title')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {t('passion.text')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
              <Box
                sx={{
                  textAlign: 'center',
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Button
                  color='ternary'
                  variant='contained'
                  sx={{
                    width: '100%',
                    color: 'common.white',
                    mt: 2,
                  }}
                  onClick={downloadPDF}
                >
                  Download CV
                </Button>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  )
}

export default AboutUsSection
