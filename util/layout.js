import BaseLayout from '@/components/layouts/base-layout'

const LAYOUTS = {
  'BaseLayout': BaseLayout
}

export function buildLayout(layouts, Component, pageProps) {
  const Layout = LAYOUTS[layouts[0]]

  if (layouts.length > 0) {
    return (
      <Layout {...pageProps}>
        {buildLayout(layouts.slice(1), Component, pageProps)}
      </Layout>
    )
  }

  return <Component {...pageProps} /> 
}
