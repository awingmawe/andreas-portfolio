'use client'

import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid2,
  Container,
  Box,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import SavingsIcon from '@mui/icons-material/Savings'
import SchoolIcon from '@mui/icons-material/School'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import PeopleIcon from '@mui/icons-material/People'
import { useState } from 'react'

export default function ServicesCard() {
  const t = useTranslations('services')
  const [buttonText, setButtonText] = useState('')

  const handleButtonClick = value => {
    setButtonText(value === buttonText ? '' : value) // Toggle active state
  }

  const services = [
    { key: 'wealth-planning', icon: <SavingsIcon fontSize='large' /> },
    { key: 'lectures', icon: <SchoolIcon fontSize='large' /> },
    { key: 'leadership', icon: <BusinessCenterIcon fontSize='large' /> },
    { key: 'mentoring', icon: <PeopleIcon fontSize='large' /> },
  ]

  const containerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  }

  return (
    <Box
      component='section'
      sx={{
        backgroundColor: '#fefefe',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 5,
      }}
      id='services'
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
        <Grid2 container spacing={3}>
          {services.map(({ key, icon }) => (
            <Grid2 size={{ xs: 12, sm: 6 }} key={key}>
              <motion.div
                variants={containerVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: false }}
              >
                <Card
                  sx={{
                    maxWidth: 600,
                    boxShadow: 3,
                    textAlign: 'center',
                    p: 2,
                    height: '250px',
                    margin: 'auto',
                    backgroundColor: 'white',
                    // backgroundImage:
                    //   'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={
                      buttonText === key
                        ? { x: '0%', left: 0 }
                        : { x: '-100%', transition: { duration: 0.8 } }
                    }
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 4,
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#063970',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant='body1'
                      color='common.white'
                      sx={{
                        px: { xs: 1, sm: 5 },
                        pt: { xs: 3, sm: 3 },
                        overflowY: 'auto',
                        height: { xs: '70%', sm: '50%' },
                        textAlign: 'center',
                        // Hide scrollbar for Chrome, Safari, and Opera
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        // Hide scrollbar for IE, Edge, and Firefox
                        msOverflowStyle: 'none', // IE and Edge
                        scrollbarWidth: 'none', // Firefox
                      }}
                    >
                      {t(`${key}.long-text`)}
                    </Typography>
                  </motion.div>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      padding: 0,
                      px: { xs: 0, sm: 2 },
                      height: '100%',
                    }}
                  >
                    <Box>
                      {icon}
                      <Typography
                        variant='h5'
                        gutterBottom
                        sx={{
                          height: '60px',
                        }}
                        fontWeight={400}
                      >
                        {t(`${key}.title`)}
                      </Typography>
                      <Typography variant='body1' color='text.secondary' mt={1}>
                        {t(`${key}.desc`)}
                      </Typography>
                    </Box>
                    <Button
                      variant='contained'
                      color='ternary'
                      sx={{
                        mb: { xs: 0, sm: 2 },
                        color:
                          buttonText === key ? 'ternary.main' : 'common.white',
                        backgroundColor:
                          buttonText === key ? 'common.white' : 'ternary.main',
                        borderColor: 'ternary.main',
                        transition:
                          'background-color 0.8s ease-in-out, color 0.8s ease-in-out',
                        zIndex: 2,
                        width: { xs: '100%', md: '40%' },
                      }}
                      onClick={() => handleButtonClick(key)}
                    >
                      <motion.span
                        key={buttonText === key ? 'read-less' : 'read-more'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      >
                        {buttonText === key ? t('read-less') : t('read-more')}
                      </motion.span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  )
}
