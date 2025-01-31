'use client'

import React from 'react'
import { Box, Container, Typography, Grid, Button } from '@mui/material'
import { motion } from 'framer-motion'

const AboutUs = () => {
  const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 },
  }

  const slideUpAnimation = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8 },
  }

  const staggerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: index => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.2, duration: 0.8 },
    }),
  }

  const personalInfo = [
    { label: 'Name', value: 'James Smith' },
    { label: 'Phone', value: '+123 456 7890' },
    { label: 'Age', value: '29 Years' },
    { label: 'Email', value: 'hello@thames.com' },
    { label: 'Occupation', value: 'System Engineer' },
    { label: 'Nationality', value: 'Bangladeshi' },
  ]

  return (
    <Box
      component={motion.div}
      initial='initial'
      animate='animate'
      variants={fadeInAnimation}
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #f9f9f9, #e0e0e0)',
      }}
    >
      <Container maxWidth='lg'>
        {/* Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Typography
            component={motion.h1}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={slideUpAnimation}
            variant='h2'
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            ABOUT ME
          </Typography>
          <Typography
            component={motion.h2}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={slideUpAnimation}
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 4,
            }}
          >
            I Develop Systems That Work
          </Typography>
          <Typography
            variant='body1'
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary',
            }}
          >
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum doloremque laudantium,
            totaeaque ipsa quae ab illo inventore veritatis et quasi architecto
            beatae vitae.
          </Typography>
        </Box>

        {/* Personal Information Section */}
        <Box
          sx={{
            backgroundColor: 'common.white',
            borderRadius: 2,
            p: 4,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            mb: 6,
          }}
        >
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              mb: 4,
              color: 'primary.main',
            }}
          >
            Personal Information
          </Typography>
          <Grid container spacing={4}>
            {personalInfo.map((info, index) => (
              <Grid item xs={12} sm={6} key={info.label}>
                <Typography
                  component={motion.div}
                  initial='initial'
                  whileInView='animate'
                  viewport={{ once: true }}
                  variants={staggerAnimation}
                  custom={index}
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                  }}
                >
                  {info.label}
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {info.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Professional Experience Section */}
        <Box
          sx={{
            backgroundColor: 'common.white',
            borderRadius: 2,
            p: 4,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              mb: 4,
              color: 'primary.main',
            }}
          >
            Professional Experience
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            BRUCE WAYNE
          </Typography>
          <Typography
            variant='body1'
            sx={{
              mb: 2,
              color: 'text.secondary',
            }}
          >
            Software Architect, Google Inc.
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: 'text.secondary',
            }}
          >
            Oremque laudantium, totaeaque ipsa quae ab illo inventore veritatis
            et quasi architecto beatae vitae.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutUs
