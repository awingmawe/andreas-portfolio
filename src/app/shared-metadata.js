export const metadata = (title, description, locale) => ({
  metadataBase: new URL(`https://visiongoal.ch/${locale}`),
  title: title,
  description: description,
  keywords: ['portfolio, vision_goal, finance, financial, accounting'],
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
