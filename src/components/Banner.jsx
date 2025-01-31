'use client'

import {
  Box,
  Button,
  Container,
  Grid2,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import Andreas from '../assets/andreas-removebg-preview.png'
import { motion } from 'framer-motion'

function Banner() {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box
      component='section'
      sx={{
        backgroundColor: '#e2ecf6',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        paddingTop: '100px',
        overflow: 'hidden',
      }}
      id='home'
    >
      <Container maxWidth='lg'>
        <Grid2 container>
          <Grid2
            size={{ xs: 12, md: 5 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography variant='h2' color='ternary.main'>
                Andreas Svoboda
              </Typography>
              <Typography variant='h5' color='ternary.main'>
                <motion.span
                  initial={{ color: '#FFFFFF' }} // Initial color for "Founder of"
                  animate={{ color: ['#FFFFFF', '#063970', '#FFFFFF'] }} // White to yellow and back
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Founder of
                </motion.span>{' '}
                <motion.span
                  initial={{ color: '#063970' }} // Initial color for "Vision Goal LLC"
                  animate={{ color: ['#063970', '#FFFFFF', '#063970'] }} // Yellow to white and back
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Vision Goal LLC
                </motion.span>
              </Typography>
              <Button
                color='ternary'
                variant='contained'
                sx={{
                  width: 'fit-content',
                  color: 'common.white',
                  px: 4,
                  mt: 4,
                }}
              >
                Say Hello
              </Button>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '30%',
                  width: '500px',
                  height: '500px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                }}
              />

              {/* Flipped Image */}
              <Image
                src={Andreas}
                alt='andreas'
                width={0}
                height={0}
                style={{
                  transform: 'scaleX(-1)',
                  position: 'relative',
                  zIndex: 1,
                  float: 'right',
                  marginRight: isSmallScreen ? '-5vw' : 0,
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  )
}

export default Banner
