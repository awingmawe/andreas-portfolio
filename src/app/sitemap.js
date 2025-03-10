export default function sitemap() {
  const websiteBaseUrl = 'https://visiongoal.ch/'

  return [
    {
      pathname: `${websiteBaseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      pathname: `${websiteBaseUrl}/de`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
  ]
}
