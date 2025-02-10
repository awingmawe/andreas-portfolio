'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Pagination, Navigation } from 'swiper/modules'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Link,
} from '@mui/material'
import { CalendarToday, MenuBook, OpenInNew } from '@mui/icons-material'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useTranslations } from 'next-intl'

const MotionCard = motion(Card)
const MotionTypography = motion(Typography)
const MotionBox = motion(Box)

const PublicationCard = ({ title, published, keywords, link, index }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2 + index * 0.1,
        duration: 0.5,
      },
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.05,
      x: 5,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <MotionCard
      initial='hidden'
      animate='visible'
      whileHover='hover'
      variants={cardVariants}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        boxShadow: 2,
        backgroundColor: '#fefefe',
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <MotionBox
          variants={contentVariants}
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <CalendarToday
            sx={{ fontSize: 'small', mr: 1, color: 'text.secondary' }}
          />
          <Typography variant='body2' color='text.secondary'>
            {published}
          </Typography>
        </MotionBox>

        <MotionTypography
          variants={contentVariants}
          variant='h6'
          color='black'
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {title}
        </MotionTypography>

        <MotionBox
          variants={contentVariants}
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <MenuBook
            sx={{ fontSize: 'small', mr: 1, color: 'text.secondary' }}
          />
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {keywords}
          </Typography>
        </MotionBox>

        <MotionBox
          variants={contentVariants}
          sx={{ mt: 'auto' }}
          whileHover='hover'
        >
          <Link
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            <MotionBox
              component='span'
              variants={linkVariants}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <OpenInNew sx={{ fontSize: 'small', mr: 1 }} color='ternary' />
              <Typography variant='button' color='ternary'>
                Read More
              </Typography>
            </MotionBox>
          </Link>
        </MotionBox>
      </CardContent>
    </MotionCard>
  )
}

const Publications = () => {
  const t = useTranslations('navbar')
  const publications = [
    {
      title:
        'THE DEMOCRATIZATION OF DIVERSIFICATION: HOW EXCHANGE-TRADED FUNDS (ETFs) ARE TRANSFORMING INVESTMENT STRATEGIES',
      published: '2025',
      keywords: 'Economics and Finance',
      link: 'https://www.academia.edu/126873401/THE_DEMOCRATIZATION_OF_DIVERSIFICATION_HOW_EXCHANGE_TRADED_FUNDS_ETFs_ARE_TRANSFORMING_INVESTMENT_STRATEGIES',
    },
    {
      title:
        'Gig Economy and Remote Work Challenge Traditional Retirement Planning',
      published: '2024',
      keywords:
        'International Journal of Management Studies and Social Science Research',
      link: 'https://www.academia.edu/124022194/Gig_Economy_and_Remote_Work_Challenge_Traditional_Retirement_Planning',
    },
    {
      title:
        'Investing in the Islamic World: Opportunities, Challenges, and Implications',
      published: '2023',
      keywords: 'Economics and Finance',
      link: 'https://www.academia.edu/124022192/Investing_in_the_Islamic_World_Opportunities_Challenges_and_Implications',
    },
    {
      title:
        'The Role of Financial Services in the Transition to a Sustainable Economy',
      published: '2023',
      keywords: 'Journal of strategic innovation and sustainability',
      link: 'https://www.academia.edu/124022191/The_Role_of_Financial_Services_in_the_Transition_to_a_Sustainable_Economy',
    },
    {
      title: 'The Impact of COVID-19 on the Financial System',
      published: '2022',
      keywords:
        'International Journal of Management Studies and Social Science Research',
      link: 'https://www.academia.edu/124022190/The_Impact_of_COVID_19_on_the_Financial_System',
    },
    {
      title: 'The Impact of Artificial Intelligence on the Banking Industry',
      published: '2022',
      keywords: 'Journal of Banking and Finance Management',
      link: 'https://www.academia.edu/124022189/The_Impact_of_Artificial_Intelligence_on_the_Banking_Industry',
    },
    {
      title:
        'Beyond the Bottom Line: Balancing Profits and Ethical Conduct in the Financial Sector',
      published: '2024',
      keywords:
        'International Journal of Management Studies and Social Science Research',
      link: 'https://www.academia.edu/124022171/Beyond_the_Bottom_Line_Balancing_Profits_and_Ethical_Conduct_in_the_Financial_Sector',
    },
    {
      title: 'The Impact of Artificial Intelligence on the Banking Industry',
      published: '2023',
      keywords: 'Journal of Banking and Finance Management',
      link: 'https://www.academia.edu/108288521/The_Impact_of_Artificial_Intelligence_on_the_Banking_Industry',
    },
    {
      title: 'Sustainable Finance: The Role of Banks',
      published: '2023',
      keywords: 'Journal of Insurance and Financial Management',
      link: 'https://www.academia.edu/108113497/Sustainable_Finance_The_Role_of_Banks',
    },
    {
      title: 'Building and ESG Investment Portfolio',
      published: '2021',
      keywords: 'Journal of Insurance and Financial Management',
      link: 'https://www.academia.edu/62617632/Building_and_ESG_Investment_Portfolio',
    },
    {
      title: 'Future Distribution of Life Insurance',
      published: '2021',
      keywords: 'Journal of Insurance and Financial Management',
      link: 'https://www.academia.edu/59116608/Future_Distribution_of_Life_Insurance',
    },
    {
      title: 'Crypto Assets in Unit-Linked Life Insurance',
      published: '2023',
      keywords: 'Journal of Insurance and Financial Management',
      link: 'https://www.academia.edu/98785514/Crypto_Assets_in_Unit_Linked_Life_Insurance',
    },
  ]

  return (
    <Box
      component='section'
      id='publications'
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
            mb: 4,
          }}
        >
          {t('publications')}
        </Typography>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <Swiper
            slidesPerView={3}
            grid={{
              rows: 2,
              fill: 'row',
            }}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Grid, Pagination, Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 1,
                grid: {
                  rows: 2,
                },
              },
              768: {
                slidesPerView: 2,
                grid: {
                  rows: 2,
                },
              },
              1024: {
                slidesPerView: 3,
                grid: {
                  rows: 2,
                },
              },
            }}
            className='publicationsSwiper'
            style={{ padding: '20px 0 40px 0' }}
          >
            {publications.map((pub, index) => (
              <SwiperSlide key={index}>
                <PublicationCard {...pub} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  )
}

export default Publications
