export default function sitemap() {
  const websiteBaseUrl = 'https://visiongoal.ch/'

  // change these value if modify parkee content
  const route = [
    {
      pathname: '',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
  ]

  return route.map(r => {
    return {
      url: `${websiteBaseUrl}/${r.pathname}`,
      priority: r.priority,
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
    }
  })
}
