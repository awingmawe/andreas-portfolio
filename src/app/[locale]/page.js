import { Box } from '@mui/material'
import { metadata } from '../shared-metadata'
import Banner from '../../components/Banner'
import ServicesCard from '../../components/Services'
import { Fragment } from 'react'
import AboutUs from '../../components/About'

export async function generateMetadata() {
  return {
    ...metadata('Andreas Svoboda | Portfolio', `Portfolio`),
  }
}

export default async function Page() {
  return (
    <Fragment>
      <Banner />
      <AboutUs />
      <ServicesCard />
      <Box sx={{ height: 500 }}>Halo</Box>
      <Box sx={{ height: 500 }}>Halo</Box>
      <Box sx={{ height: 500 }}>Halo</Box>
    </Fragment>
  )
}
