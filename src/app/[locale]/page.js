import { metadata } from '../shared-metadata'
import Banner from '../../components/Banner'
import ServicesCard from '../../components/Services'
import { Fragment } from 'react'
import AboutUs from '../../components/About'
import CertificateSection from '../../components/Achievement'
import ExperienceTimeline from '../../components/Experience'
import Publication from '../../components/Publication'
import ContactMe from '../../components/Contact'

export async function generateMetadata() {
  return {
    ...metadata('Andreas Svoboda | Portfolio', `Portfolio`),
  }
}

export default async function Page() {
  return (
    <Fragment>
      <Banner />
      <CertificateSection />
      <AboutUs />
      <ServicesCard />
      <ExperienceTimeline />
      <Publication />
      <ContactMe />
    </Fragment>
  )
}
