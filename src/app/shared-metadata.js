export const metadata = (title, description) => ({
  metadataBase: new URL(`https://visiongoal.ch/`),
  title: title,
  description: description,
  keywords: [
    'portfolio',
    ' vision_goal',
    'finance',
    'financial',
    'accounting',
    'trust management',
    'wealth protection',
    'fiduciary services',
  ],
  openGraph: {
    title: title,
    description: description,
    type: 'website',
    images: ['/thumbnail.gif'],
  },
  twitter: {
    title: title,
    description: description,
    card: 'summary_large_image',
    images: ['/thumbnail.gif'],
  },
})
