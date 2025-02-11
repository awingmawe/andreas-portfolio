'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  styled,
  Grid2,
} from '@mui/material'
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  GitHub,
  Send,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'

// Custom styled TextField
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.ternary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.ternary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.ternary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.ternary.main,
    '&.Mui-focused': {
      color: theme.palette.ternary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.ternary.main,
  },
}))

const MotionBox = motion.create(Box)
const MotionPaper = motion.create(Paper)
const MotionButton = motion.create(Button)

const ContactMe = () => {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  // Refs for scroll animation
  const infoRef = useRef(null)
  const formRef = useRef(null)
  const isInfoInView = useInView(infoRef, { once: false, margin: '-100px' })
  const isFormInView = useInView(formRef, { once: false, margin: '-100px' })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
  }

  const slideInLeftVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  }

  const slideInRightVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const fadeInUpVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const contactInfo = [
    { icon: <Email />, text: 'email@example.com' },
    { icon: <Phone />, text: '+1 234 567 890' },
    { icon: <LocationOn />, text: 'City, Country' },
  ]

  const socialLinks = [
    { icon: <LinkedIn />, label: 'LinkedIn' },
    { icon: <GitHub />, label: 'GitHub' },
  ]

  return (
    <Box
      component='section'
      id='contact'
      sx={{
        backgroundColor: '#063970',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 4,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth='lg'>
        <Typography
          variant='h2'
          color='white'
          sx={{
            textAlign: 'left',
            mb: 4,
          }}
        >
          {t('title')}
        </Typography>
        <Grid2 container spacing={4}>
          {/* Contact Information */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <MotionBox
              ref={infoRef}
              initial='hidden'
              animate={isInfoInView ? 'visible' : 'hidden'}
              variants={slideInLeftVariants}
              sx={{
                backgroundColor: '#fefefe',
                backgroundImage:
                  'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
                borderRadius: 1,
                height: '100%',
                display: 'grid',
              }}
            >
              <MotionPaper
                sx={{
                  p: 4,
                  backgroundColor: 'transparent',
                  color: 'ternary.main',
                  boxShadow: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <motion.div variants={fadeInUpVariants}>
                  <Typography
                    variant='h4'
                    component='h2'
                    gutterBottom
                    color='ternary.main'
                  >
                    {t('section.title')}
                  </Typography>
                  <Typography variant='body1' color='ternary.main' paragraph>
                    {t('section.subtitle')}
                  </Typography>
                </motion.div>

                <Box sx={{ my: 4 }}>
                  {contactInfo.map((info, index) => (
                    <motion.div key={index} variants={fadeInUpVariants}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <IconButton sx={{ mr: 2, color: 'ternary.main' }}>
                          {info.icon}
                        </IconButton>
                        <Typography variant='body1' color='ternary.main'>
                          {info.text}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                <motion.div variants={fadeInUpVariants}>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant='h6' gutterBottom color='ternary.main'>
                      {t('section.followMe')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {socialLinks.map((social, index) => (
                        <MotionButton
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          startIcon={social.icon}
                          variant='outlined'
                          sx={{
                            borderColor: 'ternary.main',
                            color: 'ternary.main',
                            '&:hover': {
                              borderColor: 'ternary.main',
                              backgroundColor: 'rgba(6, 57, 112, 0.04)',
                            },
                          }}
                        >
                          {social.label}
                        </MotionButton>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </MotionPaper>
            </MotionBox>
          </Grid2>

          {/* Contact Form */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <MotionBox
              ref={formRef}
              initial='hidden'
              animate={isFormInView ? 'visible' : 'hidden'}
              variants={slideInRightVariants}
            >
              <MotionPaper
                component='form'
                onSubmit={handleSubmit}
                sx={{
                  p: 4,
                  backgroundColor: '#fefefe',
                  backgroundImage:
                    'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
                }}
              >
                <Grid2 container spacing={3}>
                  {[
                    { name: 'name', label: t('form.name.label'), type: 'text' },
                    {
                      name: 'email',
                      label: t('form.email.label'),
                      type: 'email',
                    },
                    {
                      name: 'subject',
                      label: t('form.subject.label'),
                      type: 'text',
                    },
                    {
                      name: 'message',
                      label: t('form.message.label'),
                      type: 'text',
                      multiline: true,
                      rows: 4,
                    },
                  ].map((field, index) => (
                    <Grid2 size={{ xs: 12 }} key={field.name}>
                      <motion.div variants={fadeInUpVariants} custom={index}>
                        <CustomTextField
                          fullWidth
                          label={field.label}
                          name={field.name}
                          type={field.type}
                          multiline={field.multiline}
                          rows={field.rows}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>
                    </Grid2>
                  ))}
                  <Grid2 size={{ xs: 12 }}>
                    <motion.div variants={fadeInUpVariants}>
                      <MotionButton
                        variant='contained'
                        size='large'
                        type='submit'
                        endIcon={<Send />}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        sx={{
                          mt: 1,
                          bgcolor: 'ternary.main',
                          color: 'common.white',
                          '&:hover': {
                            bgcolor: 'ternary.main',
                            opacity: 0.9,
                          },
                          width: { xs: '100%', sm: 'fit-content' },
                        }}
                      >
                        {t('form.submit')}
                      </MotionButton>
                    </motion.div>
                  </Grid2>
                </Grid2>
              </MotionPaper>
            </MotionBox>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  )
}

export default ContactMe
