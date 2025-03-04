'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  Box,
  Button,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import {
  ExpandLess,
  ExpandMore,
  School,
  WorkHistory,
} from '@mui/icons-material'

// Import images once at the top
import HWZ from '../assets/hwz.png'
import Southern from '../assets/southern-queensland.png'
import Liverpool from '../assets/university-liverpool.png'
import London from '../assets/university-london.png'
import Zurich from '../assets/zurich.png'
import JuliusBaer from '../assets/juliusbaer.png'
import LVV from '../assets/lvv.png'
import AgInsurance from '../assets/ag-insurance.png'
import UBS from '../assets/ubs.png'
import CreditSuisse from '../assets/credit-suisse.png'
import ZK from '../assets/ZK.png'
import VisionGoal from '../assets/thumbnail.png'
import UIBS from '../assets/uibs.png'
import HSO from '../assets/hso.png'
import InsuranceAcademy from '../assets/the_insurance_academy_logo.png'
import FFHS from '../assets/ffhs.png'
import SSIB from '../assets/ssib.png'
import SBS from '../assets/SBS.png'
import QWealth from '../assets/qwealth.png'
import GMBH from '../assets/gmbh.png'

// Create memoized motion components
const MotionBox = motion.create(Box)

const ExperienceStepper = () => {
  const t = useTranslations('experience')
  const tt = useTranslations('others')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expandedItems, setExpandedItems] = useState({})
  const [alignment, setAlignment] = useState('professional')

  // Memoize static data
  const professional = useMemo(
    () => [
      {
        src: GMBH,
        date: '06.2024',
        key: 'gmbh',
      },
      {
        src: QWealth,
        date: '04.2024',
        key: 'qWealth',
      },
      {
        src: JuliusBaer,
        date: '02.2012 - 05.2024',
        key: 'bankJuliusBaer',
      },
      {
        src: LVV,
        date: '09.2009 – 03.2011',
        key: 'liechtensteinInsurance',
      },
      {
        src: AgInsurance,
        date: '04.2008 – 03.2011 ',
        key: 'wealthAssurance',
      },
      {
        src: UBS,
        date: '07.1999 – 03.2008',
        key: 'ubs',
      },
      {
        src: CreditSuisse,
        date: '10.1998 – 06.1999',
        key: 'creditSuisse',
      },
      {
        src: ZK,
        date: '04.1991 – 09.1998 ',
        key: 'zurcherKantonalbank',
      },
    ],
    [],
  )

  const lecturer = useMemo(
    () => [
      {
        src: SBS,
        date: '08.2024',
        key: 'sbs',
      },
      {
        src: SSIB,
        date: '01.2024',
        key: 'ssib',
      },
      {
        src: VisionGoal,
        date: '08.2022',
        key: 'visionGoal',
      },
      {
        src: UIBS,
        date: '08.2022',
        key: 'businessSchools',
      },
      {
        src: HSO,
        date: '06.2021',
        key: 'hso',
      },
      {
        src: InsuranceAcademy,
        date: '05.2021',
        key: 'insuranceAcademy',
      },
      {
        src: FFHS,
        date: '01.2021',
        key: 'ffhs',
      },
      {
        src: FFHS,
        date: '01.2021 ',
        key: 'ffhs-2',
      },
    ],
    [],
  )

  const education = useMemo(
    () => [
      {
        university: Zurich,
        date: '09.2018 - 09.2020',
        degree: 'LL.M. UZH International Business Law',
      },
      {
        university: London,
        date: '03.2018 - 11.2019',
        degree: 'Master of Science Professional Accountancy',
      },
      {
        university: Liverpool,
        date: '08.2010 - 10.2017',
        degree: 'Doctor of Business Administration',
      },
      {
        university: Southern,
        date: '09.2002 - 10.2004',
        degree: 'Master of Business Administration',
      },
      {
        university: HWZ,
        date: '08.1996 - 10.2000',
        degree: 'Betriebsökonom HWV',
      },
    ],
    [],
  )

  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeInOut' },
      },
    }),
    [],
  )

  // Memoize current items based on alignment using switch
  const items = useMemo(() => {
    switch (alignment) {
      case 'professional':
        return professional
      case 'lecture':
        return lecturer
      case 'education':
        return education
      default:
        return professional
    }
  }, [alignment, professional, lecturer, education])

  // Use callbacks for event handlers
  const toggleExpand = useCallback(index => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }, [])

  const handleChange = useCallback((event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
    }
  }, [])

  // Memoize the render of education timeline elements
  const renderEducationTimeline = useMemo(
    () =>
      education.map((item, index) => (
        <VerticalTimelineElement
          key={`education-${index}`}
          className='vertical-timeline-element--education'
          contentStyle={{
            background: 'white',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          }}
          contentArrowStyle={{
            borderRight: '7px solid white',
          }}
          date={item.date}
          dateClassName='timeline-date'
          iconStyle={{
            background: '#063970',
            color: '#fff',
            boxShadow: 'none',
          }}
          icon={<School />}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.2,
                  ease: 'easeOut',
                }}
              >
                <Box
                  component='img'
                  src={item.university.src}
                  alt='University Logo'
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'contain',
                    mb: 2,
                    filter: 'grayscale(0.2)',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'grayscale(0)',
                    },
                  }}
                />
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2 + 0.3,
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  color: theme.palette.ternary.main,
                  mb: 1,
                }}
              >
                {item.degree}
              </Typography>
            </motion.div>
          </motion.div>
        </VerticalTimelineElement>
      )),
    [education, theme.palette.ternary.main],
  )

  // Memoize the render of professional/lecturer timeline elements
  const renderWorkTimeline = useMemo(
    () =>
      alignment !== 'education' &&
      items.map((item, index) => (
        <VerticalTimelineElement
          key={`${alignment}-${item.key}`}
          className='vertical-timeline-element--work'
          contentStyle={{
            background: 'white',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          }}
          contentArrowStyle={{
            borderRight: '7px solid white',
          }}
          date={item.date}
          dateClassName='timeline-date'
          iconStyle={{
            background: '#063970',
            color: '#fff',
            boxShadow: 'none',
          }}
          icon={alignment === 'professional' ? <WorkHistory /> : <School />}
          intersectionObserverProps={{ triggerOnce: false }}
        >
          <motion.div
            initial={{ opacity: 0, x: index % 2 !== 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.2,
                  ease: 'easeOut',
                }}
              >
                <Box
                  component='img'
                  src={item.src.src}
                  alt='University Logo'
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'contain',
                    mb: 2,
                    filter: 'grayscale(0.2)',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'grayscale(0)',
                    },
                  }}
                />
              </motion.div>
            </Box>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {t(`${alignment}.${item.key}.company`)}
            </Typography>
            <Typography
              variant='subtitle1'
              sx={{ color: theme.palette.text.secondary }}
            >
              {t(`${alignment}.${item.key}.role`)}
            </Typography>
            {t.raw(`${alignment}.${item.key}.responsibilities`).length !==
              0 && (
              <Button
                onClick={() => toggleExpand(index)}
                color='ternary'
                sx={{ pl: 0, margin: 'auto' }}
              >
                {expandedItems[index] ? tt('hide-details') : tt('see-details')}
                {expandedItems[index] ? <ExpandLess /> : <ExpandMore />}
              </Button>
            )}
            <AnimatePresence>
              {expandedItems[index] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <motion.ul
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    style={{
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    {t
                      .raw(`${alignment}.${item.key}.responsibilities`)
                      .map((responsibility, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.1 }}
                          style={{ color: 'black' }}
                        >
                          {responsibility}
                        </motion.li>
                      ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </VerticalTimelineElement>
      )),
    [
      alignment,
      items,
      expandedItems,
      t,
      tt,
      toggleExpand,
      theme.palette.text.primary,
      theme.palette.text.secondary,
    ],
  )

  return (
    <Box
      component='section'
      id='experience'
      sx={{
        backgroundColor: '#fefefe',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/otis-redding.png")',
        py: 5,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth='lg'>
        <MotionBox
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'left', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            marginBottom: '16px',
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

          <ToggleButtonGroup
            color='ternary'
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label='Platform'
          >
            <ToggleButton value='professional'>
              {tt('professional')}
            </ToggleButton>
            <ToggleButton value='lecture'>{tt('lecture')}</ToggleButton>
            <ToggleButton value='education'>{tt('education')}</ToggleButton>
          </ToggleButtonGroup>
        </MotionBox>

        <VerticalTimeline
          animate={!isMobile}
          layout={isMobile ? '1-column-right' : '2-columns'}
          lineColor='#063970'
        >
          {alignment === 'education'
            ? renderEducationTimeline
            : renderWorkTimeline}
        </VerticalTimeline>
      </Container>
    </Box>
  )
}

export default React.memo(ExperienceStepper)
