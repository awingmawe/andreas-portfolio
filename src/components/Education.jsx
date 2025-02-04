import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useInView, motion } from 'framer-motion'
import HWZ from '../assets/hwz.png'
import Southern from '../assets/southern-queensland.png'
import Liverpool from '../assets/university-liverpool.png'
import London from '../assets/university-london.png'
import Zurich from '../assets/zurich.png'
import Image from 'next/image'

const educationData = [
  {
    university: HWZ,
    period: '08.1996 - 10.2000',
    degree: 'Betriebsökonom HWV',
  },
  {
    university: Southern,
    period: '09.2002 - 10.2004',
    degree: 'Master of Business Administration',
  },
  {
    university: Liverpool,
    period: '08.2010 - 10.2017',
    degree: 'Doctor of Business Administration',
  },
  {
    university: London,
    period: '03.2018 - 11.2019',
    degree: 'Master of Science Professional Accountancy',
  },
  {
    university: Zurich,
    period: '09.2018 - 09.2020',
    degree: 'LL.M. UZH International Business Law',
  },
]

const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineRef = useRef(null)

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  }

  useEffect(() => {
    const handleScroll = () => {
      const timelineElement = timelineRef.current
      if (!timelineElement) return

      // Get the bounding rectangle of the timeline component
      const timelineRect = timelineElement.getBoundingClientRect()
      const timelineTop = timelineRect.top - 450
      const timelineHeight = timelineRect.height - 450

      // Calculate the scroll progress within the timeline component
      const scrollProgress = Math.max(
        0,
        Math.min(1, -timelineTop / timelineHeight),
      )

      // Calculate the active index based on scroll progress
      const index = Math.floor(scrollProgress * (educationData.length - 1))
      setActiveIndex(index)
    }

    // Add scroll event listener to the window
    window.addEventListener('scroll', handleScroll)

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Box
      ref={timelineRef}
      sx={{
        position: 'relative',
        py: '20px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Timeline Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '3px',
          backgroundColor: 'grey.300',
          height: `${(activeIndex / educationData.length) * 50}%`,
          transition: 'height 0.8s ease-in-out',
        }}
      />

      {/* Education Entries */}
      {educationData.map((edu, index) => {
        const ref = useRef(null)
        const isInView = useInView(ref, {
          once: false, // Only trigger animation once
          margin: '-150px 0px', // Trigger when 50px above and below viewport
          amount: 0.5, // Trigger when 50% of the item is visible
        })
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              marginBottom: '40px',
            }}
          >
            <motion.div
              ref={ref}
              variants={itemVariants}
              initial='hidden'
              animate={isInView ? 'visible' : 'hidden'}
            >
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor:
                    isInView && activeIndex === index
                      ? '#063970'
                      : 'background.paper',
                  color:
                    isInView && activeIndex === index
                      ? 'common.white'
                      : 'text.primary',
                  transition: 'all 0.8s ease-in-out',
                }}
              >
                <Image
                  src={edu.university}
                  alt={edu.degree}
                  width={0}
                  height={0}
                  sizes='100vw'
                  style={{
                    width: '250px',
                    height: 'auto',
                    objectFit: 'contain',
                    aspectRatio: '16/9',
                  }}
                />
                <Typography variant='subtitle1'>{edu.degree}</Typography>
                <Typography variant='body2'>{edu.period}</Typography>
              </Paper>
            </motion.div>
          </Box>
        )
      })}
    </Box>
  )
}

export default Timeline
