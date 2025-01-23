import Navbar from '@/components/Navbar'

export default async function RootLayout(props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  return (
    <html lang={locale} translate='no'>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
