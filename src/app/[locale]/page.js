import { metadata } from '../shared-metadata'
import VisionGoalRenew from '../../components/VisionGoalRenew'

/* -------------------------------------------------------------------------- */
/*  SITE PAUSED — the full portfolio is temporarily hidden (not deleted).      */
/*  While the renewed Vision Goal platform is being built                      */
/*  (https://vision-goal-renew.vercel.app/), this route serves a single        */
/*  animated "coming soon" teaser via <VisionGoalRenew />.                     */
/*                                                                             */
/*  To restore the original site: uncomment the imports and the JSX below,     */
/*  and remove the <VisionGoalRenew /> render.                                 */
/* -------------------------------------------------------------------------- */

// import Banner from '../../components/Banner'
// import ServicesCard from '../../components/Services'
// import { Fragment } from 'react'
// import AboutUs from '../../components/About'
// import CertificateSection from '../../components/Achievement'
// import ExperienceTimeline from '../../components/Experience'
// import Publication from '../../components/Publication'
// import ContactMe from '../../components/Contact'
// import AnimatedQuote from '../../components/Quote'

export async function generateMetadata({ params }) {
  const { locale } = await params
  return {
    ...metadata(
      'Vision Goal | A New Vision Is Taking Shape — Coming Soon',
      `Vision Goal is being renewed. We're reimagining how we guide your wealth, your goals, and your future. A bolder, clearer Vision Goal experience is on its way — preview the work in progress.`,
      locale,
    ),
  }
}

export default async function Page() {
  return <VisionGoalRenew />

  /* --- Original portfolio (hidden while the new platform is in progress) ---
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
  ------------------------------------------------------------------------- */
}
