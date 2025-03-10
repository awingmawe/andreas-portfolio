import { metadata } from '../shared-metadata'
import Banner from '../../components/Banner'
import ServicesCard from '../../components/Services'
import { Fragment } from 'react'
import AboutUs from '../../components/About'
import CertificateSection from '../../components/Achievement'
import ExperienceTimeline from '../../components/Experience'
import Publication from '../../components/Publication'
import ContactMe from '../../components/Contact'
import AnimatedQuote from '../../components/Quote'

export async function generateMetadata({ params: { locale } }) {
  return {
    ...metadata(
      'Vision Goal LLC',
      `Financial training and education - Mentorship and coaching`,
      locale,
    ),
  }
}

export default async function Page() {
  return (
    <Fragment>
      <Banner />
      <AnimatedQuote />
      <AboutUs />
      <CertificateSection />
      <ServicesCard />
      <ExperienceTimeline />
      <Publication />
      <ContactMe />
    </Fragment>
  )
}
