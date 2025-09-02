import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { buildLayout } from '@/util/layout'
import { init, trackPage } from '@/util/analytics'
import Script from 'next/script'

import '@/styles/index.scss'

function App({ Component, pageProps }) {
  const router = useRouter()
  // initiate google analytics and track page
  useEffect(() => {
    init()
    trackPage(router.asPath)
  }, [])
  
  // Default to a blank component until we figure out what we're rendering based on auth
  let ValidComponent = () => <></>

  // just do default behavior
  ValidComponent = Component

  return (
    <>
      {buildLayout(ValidComponent.Layouts || [], ValidComponent, {...pageProps})}
      <Script
        strategy="afterInteractive"
        data-domain="nerdburn.com"
        src="https://plausible.io/js/script.pageview-props.tagged-events.js"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  )
}

export default App