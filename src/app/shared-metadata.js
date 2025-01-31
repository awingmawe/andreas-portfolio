export const metadata = (title, description) => ({
  metadataBase: new URL('https://visiongoal.ch/'),
  title: title,
  description: description,
  keywords: ['portfolio'],
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
